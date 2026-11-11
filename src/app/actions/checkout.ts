"use server";

import crypto from "crypto";
import { getProductBySlug } from "@/lib/products";
import { isValidMoroccanPhone, normalizeMoroccanPhone } from "@/lib/phone-validation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  city: string;
  deliveryAddress: string;
  customerNotes?: string;
  termsAccepted: boolean;
  items: CheckoutItemInput[];
}

export type CheckoutResult =
  | {
      success: true;
      orderReference: string;
      customerName: string;
      customerPhone: string;
      city: string;
      subtotalMad: number;
      itemCount: number;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
      missingConfig?: boolean;
    };

export async function submitOrder(formData: CheckoutFormData): Promise<CheckoutResult> {
  const fieldErrors: Record<string, string> = {};

  // 1. Validate Customer Name
  const normalizedName = formData.customerName?.trim();
  if (!normalizedName || normalizedName.length < 2) {
    fieldErrors.customerName = "Veuillez renseigner votre nom complet (au moins 2 caractères).";
  } else if (normalizedName.length > 100) {
    fieldErrors.customerName = "Le nom ne doit pas dépasser 100 caractères.";
  }

  // 2. Validate Moroccan Phone Number
  const rawPhone = formData.customerPhone?.trim();
  if (!rawPhone) {
    fieldErrors.customerPhone = "Le numéro de téléphone marocain est obligatoire.";
  } else if (!isValidMoroccanPhone(rawPhone)) {
    fieldErrors.customerPhone =
      "Numéro de téléphone marocain invalide (ex: 06 12 34 56 78 ou +212 612 345 678).";
  }
  const normalizedPhone = rawPhone ? normalizeMoroccanPhone(rawPhone) : "";

  // 3. Validate City
  const normalizedCity = formData.city?.trim();
  if (!normalizedCity || normalizedCity.length < 2) {
    fieldErrors.city = "Veuillez sélectionner ou renseigner votre ville de livraison.";
  }

  // 4. Validate Delivery Address
  const normalizedAddress = formData.deliveryAddress?.trim();
  if (!normalizedAddress || normalizedAddress.length < 5) {
    fieldErrors.deliveryAddress = "Veuillez préciser votre adresse de livraison complète.";
  } else if (normalizedAddress.length > 300) {
    fieldErrors.deliveryAddress = "L'adresse ne doit pas dépasser 300 caractères.";
  }

  // 5. Validate Terms Acceptance
  if (!formData.termsAccepted) {
    fieldErrors.termsAccepted = "Vous devez accepter les conditions générales de vente.";
  }

  // 6. Validate Cart Items from trusted catalogue
  if (!formData.items || !Array.isArray(formData.items) || formData.items.length === 0) {
    return {
      success: false,
      error: "Votre panier est vide. Veuillez sélectionner au moins une création florale.",
    };
  }

  interface VerifiedItem {
    product_id: string;
    product_name: string;
    unit_price_mad: number;
    quantity: number;
    line_total_mad: number;
  }

  const verifiedItems: VerifiedItem[] = [];
  let calculatedSubtotal = 0;
  let totalItemCount = 0;

  for (const item of formData.items) {
    if (!item.productId || typeof item.productId !== "string") {
      return {
        success: false,
        error: "Identifiant de produit manquant ou invalide.",
      };
    }

    const qty = Math.round(item.quantity);
    if (!qty || qty <= 0 || qty > 10) {
      return {
        success: false,
        error: "La quantité pour chaque produit doit être comprise entre 1 et 10.",
      };
    }

    // Resolve authoritative product data from catalog
    const product = getProductBySlug(item.productId);
    if (!product) {
      return {
        success: false,
        error: `Le produit sélectionné (${item.productId}) n'existe plus dans notre catalogue.`,
      };
    }

    const unitPrice = product.priceMad;
    const lineTotal = unitPrice * qty;

    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price_mad: unitPrice,
      quantity: qty,
      line_total_mad: lineTotal,
    });

    calculatedSubtotal += lineTotal;
    totalItemCount += qty;
  }

  if (calculatedSubtotal <= 0) {
    return {
      success: false,
      error: "Le sous-total de la commande est invalide.",
    };
  }

  // Return validation errors if any field failed
  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Veuillez corriger les erreurs dans le formulaire ci-dessous.",
      fieldErrors,
    };
  }

  const normalizedNotes = formData.customerNotes?.trim() || null;

  // 7. Check Supabase server connection
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      error:
        "La configuration de la base de données Supabase est requise pour enregistrer votre commande (NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY). Votre panier a été conservé.",
      missingConfig: true,
    };
  }

  // 8. Generate Cryptographically Non-guessable Order Reference
  // Format: AB-XXXX-XXXXXX (e.g., AB-M5X8Q-A19F0C)
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  const orderReference = `AB-${timestampPart}-${randomPart}`;

  // 9. Persist Order in Supabase
  try {
    // Try atomic RPC function first
    const { error: rpcError } = await supabase.rpc("create_order_with_items", {
      p_order_reference: orderReference,
      p_customer_name: normalizedName,
      p_customer_phone: normalizedPhone,
      p_city: normalizedCity,
      p_delivery_address: normalizedAddress,
      p_customer_notes: normalizedNotes,
      p_subtotal_mad: calculatedSubtotal,
      p_items: verifiedItems,
    });

    if (rpcError) {
      // Fallback: Direct table insertion
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_reference: orderReference,
          customer_name: normalizedName,
          customer_phone: normalizedPhone,
          city: normalizedCity,
          delivery_address: normalizedAddress,
          customer_notes: normalizedNotes,
          payment_method: "cod",
          payment_status: "pending",
          order_status: "pending",
          subtotal_mad: calculatedSubtotal,
          delivery_fee_mad: null,
          total_amount_mad: null,
        })
        .select("id")
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Échec de création de la commande.");
      }

      const { error: itemsError } = await supabase.from("order_items").insert(
        verifiedItems.map((item) => ({
          order_id: orderData.id,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price_mad: item.unit_price_mad,
          quantity: item.quantity,
          line_total_mad: item.line_total_mad,
        }))
      );

      if (itemsError) {
        // Attempt cleanup on failure to maintain integrity
        await supabase.from("orders").delete().eq("id", orderData.id);
        throw new Error(itemsError.message);
      }
    }

    // Success! Return confirmed reference and sanitized details
    return {
      success: true,
      orderReference,
      customerName: normalizedName,
      customerPhone: normalizedPhone,
      city: normalizedCity,
      subtotalMad: calculatedSubtotal,
      itemCount: totalItemCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
    // Avoid leaking database internal structure to client while logging safely
    console.error("Order persistence failed:", errorMsg);

    return {
      success: false,
      error:
        "Une erreur technique est survenue lors de l'enregistrement de votre commande. Votre panier est conservé. Veuillez réessayer dans un instant ou nous contacter par téléphone.",
    };
  }
}
