"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  BanknoteIcon,
  CheckIcon,
  DropletsIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/ui/icons";
import type { Product } from "@/lib/products";
import { formatMad } from "@/lib/format-price";
import { useCart } from "@/context/cart-context";

interface ProductOrderBoxProps {
  product: Product;
}

export function ProductOrderBox({ product }: ProductOrderBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const { addItem, openCart } = useCart();

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    setAddedNotice(null);
  };

  const increase = () => {
    setQuantity((prev) => Math.min(10, prev + 1));
    setAddedNotice(null);
  };

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    const total = product.priceMad * quantity;
    setAddedNotice(
      `${quantity} × "${product.name}" (${formatMad(total)}) ajouté${quantity > 1 ? "s" : ""} au panier.`,
    );
  };

  const totalPrice = product.priceMad * quantity;

  return (
    <div className="border border-gold/65 p-2">
      <div className="border border-burgundy/15 bg-white/85 p-6 sm:p-8">
        {/* Price & Summary */}
        <div className="flex items-baseline justify-between border-b border-burgundy/15 pb-6">
          <div>
            <p className="text-[0.625rem] tracking-[0.22em] text-ink/55 uppercase">
              Prix unitaire
            </p>
            <p className="mt-1 font-serif text-3xl font-light text-burgundy sm:text-4xl">
              {formatMad(product.priceMad)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.625rem] tracking-[0.22em] text-ink/55 uppercase">
              Total calculé
            </p>
            <p className="mt-1 font-serif text-2xl font-light text-ink sm:text-3xl">
              {formatMad(totalPrice)}
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <label
              htmlFor="quantity-selector"
              className="text-[0.6875rem] tracking-[0.2em] text-ink/75 uppercase"
            >
              Quantité
            </label>
            <p className="mt-0.5 text-xs text-ink/50">
              Maximum 10 bouquets par commande
            </p>
          </div>

          <div className="flex items-center rounded-full border border-burgundy/25 bg-ivory p-1">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base text-ink transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              –
            </button>
            <span
              id="quantity-selector"
              className="w-12 text-center font-serif text-lg text-ink"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={quantity >= 10}
              aria-label="Augmenter la quantité"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base text-ink transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 space-y-3.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-burgundy py-4 text-xs tracking-[0.2em] text-ivory uppercase transition-colors duration-500 hover:bg-burgundy-deep active:scale-[0.99]"
          >
            Ajouter au panier · {formatMad(totalPrice)}
          </button>

          <p className="flex items-center justify-center gap-2 text-[0.6875rem] tracking-[0.14em] text-ink/60 uppercase">
            <BanknoteIcon className="h-3.5 w-3.5 text-burgundy" />
            Règlement uniquement à la livraison
          </p>
        </div>

        {/* Feedback Banner */}
        {addedNotice && (
          <div
            role="status"
            className="mt-6 flex flex-col items-start justify-between gap-3 border border-sage/60 bg-sage/15 p-4 text-xs leading-5 text-ink sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-2.5">
              <CheckIcon className="h-4 w-4 shrink-0 text-burgundy" />
              <span className="font-medium">{addedNotice}</span>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-[0.625rem] tracking-[0.18em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
            >
              Voir le panier
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Moroccan Delivery Guarantees */}
        <div className="mt-8 space-y-3 border-t border-burgundy/15 pt-6 text-xs leading-6 text-ink/75">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-4 w-4 shrink-0 text-burgundy" />
            <span>Livraison disponible à Casablanca, Rabat, Marrakech et Tanger.</span>
          </div>
          <div className="flex items-center gap-3">
            <DropletsIcon className="h-4 w-4 shrink-0 text-burgundy" />
            <span>Tiges protégées par réserve d’eau lors du transport.</span>
          </div>
          <div className="flex items-center gap-3">
            <MailIcon className="h-4 w-4 shrink-0 text-burgundy" />
            <span>Carte avec message manuscrit offerte sur demande.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
