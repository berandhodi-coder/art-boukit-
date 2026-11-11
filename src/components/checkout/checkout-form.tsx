"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatMad } from "@/lib/format-price";
import { isValidMoroccanPhone } from "@/lib/phone-validation";
import { submitOrder, type CheckoutResult } from "@/app/actions/checkout";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Kénitra",
  "Autre ville au Maroc",
];

export function CheckoutForm() {
  const router = useRouter();
  const nameInputId = useId();
  const phoneInputId = useId();
  const citySelectId = useId();
  const otherCityInputId = useId();
  const addressInputId = useId();
  const notesInputId = useId();
  const termsCheckboxId = useId();

  const { items, rawItems, subtotalMad, totalItems, clearCart, isLoaded } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("Casablanca");
  const [otherCity, setOtherCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Show empty cart view if hydrated and no items
  if (isLoaded && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-burgundy/15 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-burgundy/10 text-3xl">
          🌸
        </div>
        <h2 className="mt-5 font-serif text-3xl text-ink">Votre panier est vide</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Veuillez sélectionner au moins une composition florale avant de procéder à la commande.
        </p>
        <div className="mt-8">
          <Link
            href="/bouquets"
            className="inline-block rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
          >
            Découvrir nos bouquets
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Client-side quick validation checks
    const errors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = "Veuillez indiquer votre nom complet (au moins 2 caractères).";
    }

    if (!customerPhone.trim()) {
      errors.customerPhone = "Le numéro de téléphone est obligatoire.";
    } else if (!isValidMoroccanPhone(customerPhone)) {
      errors.customerPhone = "Numéro marocain invalide (ex: 06 12 34 56 78 ou +212 612 345 678).";
    }

    const finalCity = selectedCity === "Autre ville au Maroc" ? otherCity.trim() : selectedCity;
    if (!finalCity) {
      errors.city = "Veuillez préciser votre ville de livraison.";
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = "Veuillez préciser votre adresse de livraison complète.";
    }

    if (!termsAccepted) {
      errors.termsAccepted = "Vous devez accepter les conditions pour continuer.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      const result: CheckoutResult = await submitOrder({
        customerName,
        customerPhone,
        city: finalCity,
        deliveryAddress,
        customerNotes,
        termsAccepted,
        items: rawItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      if (result.success) {
        // Clear cart ONLY after successful database persistence
        clearCart();

        // Redirect to order confirmation page with non-sensitive identifiers
        const params = new URLSearchParams({
          ref: result.orderReference,
          subtotal: result.subtotalMad.toString(),
          city: result.city,
          name: result.customerName,
        });

        router.push(`/order-confirmation?${params.toString()}`);
      } else {
        // Order creation failed: preserve the cart and display server error
        setGeneralError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setIsSubmitting(false);
      }
    } catch {
      setGeneralError(
        "Une erreur inattendue est survenue lors de la communication avec le serveur. Votre panier est conservé. Veuillez réessayer."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12" noValidate>
      {/* General Error Banner */}
      {generalError && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-900/20 bg-rose-950/10 p-5 text-sm leading-6 text-burgundy"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold tracking-wide uppercase">Information commande</p>
              <p className="mt-1">{generalError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start">
        {/* Left Column: Customer and Delivery Form */}
        <div className="space-y-10">
          {/* Section: Coordonnées */}
          <section className="rounded-3xl border border-burgundy/15 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-ink">Coordonnées du destinataire</h2>
            <p className="mt-1 text-xs text-ink/60">
              Ces informations permettront à notre service client de vous joindre pour confirmer l’adresse.
            </p>

            <div className="mt-6 space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor={nameInputId}
                  className="block text-xs font-medium tracking-[0.12em] text-ink/80 uppercase"
                >
                  Nom complet *
                </label>
                <input
                  id={nameInputId}
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Yasmine Alami"
                  aria-invalid={!!fieldErrors.customerName}
                  aria-describedby={fieldErrors.customerName ? "name-error" : undefined}
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:ring-1 focus:outline-none ${
                    fieldErrors.customerName
                      ? "border-rose-600 focus:border-rose-600 focus:ring-rose-600 bg-rose-50/30"
                      : "border-burgundy/20 focus:border-burgundy focus:ring-burgundy bg-ivory/20"
                  }`}
                />
                {fieldErrors.customerName && (
                  <p id="name-error" className="mt-1.5 text-xs text-rose-700">
                    {fieldErrors.customerName}
                  </p>
                )}
              </div>

              {/* Moroccan Phone */}
              <div>
                <label
                  htmlFor={phoneInputId}
                  className="block text-xs font-medium tracking-[0.12em] text-ink/80 uppercase"
                >
                  Numéro de téléphone marocain *
                </label>
                <input
                  id={phoneInputId}
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="06 12 34 56 78 ou +212 612 345 678"
                  aria-invalid={!!fieldErrors.customerPhone}
                  aria-describedby="phone-hint"
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:ring-1 focus:outline-none ${
                    fieldErrors.customerPhone
                      ? "border-rose-600 focus:border-rose-600 focus:ring-rose-600 bg-rose-50/30"
                      : "border-burgundy/20 focus:border-burgundy focus:ring-burgundy bg-ivory/20"
                  }`}
                />
                <p id="phone-hint" className="mt-1.5 text-[0.7rem] text-ink/55">
                  Format accepté : 06XXXXXXXX, 07XXXXXXXX ou format international (+212).
                </p>
                {fieldErrors.customerPhone && (
                  <p className="mt-1 text-xs text-rose-700">{fieldErrors.customerPhone}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section: Adresse de livraison */}
          <section className="rounded-3xl border border-burgundy/15 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-ink">Adresse de livraison au Maroc</h2>
            <p className="mt-1 text-xs text-ink/60">
              Livraison soignée en main propre par notre transporteur partenaire.
            </p>

            <div className="mt-6 space-y-6">
              {/* City Selection */}
              <div>
                <label
                  htmlFor={citySelectId}
                  className="block text-xs font-medium tracking-[0.12em] text-ink/80 uppercase"
                >
                  Ville de livraison *
                </label>
                <select
                  id={citySelectId}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-burgundy/20 bg-ivory/20 px-4 py-3 text-sm text-ink focus:border-burgundy focus:ring-1 focus:ring-burgundy focus:outline-none"
                >
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                {selectedCity === "Autre ville au Maroc" && (
                  <div className="mt-3">
                    <label htmlFor={otherCityInputId} className="sr-only">
                      Nom de la ville
                    </label>
                    <input
                      id={otherCityInputId}
                      type="text"
                      value={otherCity}
                      onChange={(e) => setOtherCity(e.target.value)}
                      placeholder="Précisez votre ville au Maroc..."
                      className="w-full rounded-xl border border-burgundy/20 bg-ivory/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy focus:outline-none"
                    />
                  </div>
                )}
                {fieldErrors.city && (
                  <p className="mt-1.5 text-xs text-rose-700">{fieldErrors.city}</p>
                )}
              </div>

              {/* Full Address */}
              <div>
                <label
                  htmlFor={addressInputId}
                  className="block text-xs font-medium tracking-[0.12em] text-ink/80 uppercase"
                >
                  Adresse complète *
                </label>
                <textarea
                  id={addressInputId}
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Quartier, rue, numéro, nom de résidence, étage ou repère utile..."
                  aria-invalid={!!fieldErrors.deliveryAddress}
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:ring-1 focus:outline-none ${
                    fieldErrors.deliveryAddress
                      ? "border-rose-600 focus:border-rose-600 focus:ring-rose-600 bg-rose-50/30"
                      : "border-burgundy/20 focus:border-burgundy focus:ring-burgundy bg-ivory/20"
                  }`}
                />
                {fieldErrors.deliveryAddress && (
                  <p className="mt-1.5 text-xs text-rose-700">{fieldErrors.deliveryAddress}</p>
                )}
              </div>

              {/* Customer Notes */}
              <div>
                <label
                  htmlFor={notesInputId}
                  className="block text-xs font-medium tracking-[0.12em] text-ink/80 uppercase"
                >
                  Instructions spéciales ou mot pour la carte (optionnel)
                </label>
                <textarea
                  id={notesInputId}
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Message d'amour à joindre sur la carte calligraphiée, créneau horaire souhaité..."
                  className="mt-2 w-full rounded-xl border border-burgundy/20 bg-ivory/20 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section: Mode de paiement */}
          <section className="rounded-3xl border border-burgundy/15 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-ink">Mode de règlement</h2>
            <p className="mt-1 text-xs text-ink/60">
              Art Bouquet privilégie la confiance et la simplicité pour ses clients au Maroc.
            </p>

            <div className="mt-5 rounded-2xl border border-burgundy/25 bg-ivory/60 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-semibold text-sm text-burgundy">
                    Paiement en espèces à la livraison (Cash on Delivery)
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-ink/75">
                    Aucun paiement en ligne requis. Vous réglez directement le livreur en espèces (MAD) à la réception de votre commande.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Terms and Submission */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id={termsCheckboxId}
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-burgundy/30 text-burgundy focus:ring-burgundy"
              />
              <span className="text-xs text-ink/75 leading-5">
                J’accepte que ma commande soit confirmée par téléphone et réglée en espèces à la livraison. Les frais de livraison seront confirmés par la boutique lors de l’appel de validation. *
              </span>
            </label>
            {fieldErrors.termsAccepted && (
              <p className="text-xs text-rose-700">{fieldErrors.termsAccepted}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-burgundy py-4 text-xs tracking-[0.2em] text-ivory uppercase shadow-lg transition-all hover:bg-burgundy-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement de votre commande en cours..."
                : `Confirmer ma commande (${formatMad(subtotalMad)})`}
            </button>
            <p className="text-center text-[0.7rem] text-ink/50 uppercase tracking-wider">
              🔒 Vos coordonnées restent strictement confidentielles.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-burgundy/15 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-burgundy/10 pb-5">
              <h2 className="font-serif text-2xl text-ink">Votre sélection</h2>
              <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-xs font-semibold text-burgundy">
                {totalItems} {totalItems > 1 ? "articles" : "article"}
              </span>
            </div>

            {/* Items List */}
            <ul className="divide-y divide-burgundy/10 my-4 max-h-[320px] overflow-y-auto pr-1">
              {items.map(({ product, quantity, lineTotalMad }) => (
                <li key={product.id} className="flex gap-4 py-3.5">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-burgundy/10 bg-champagne/30">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-serif text-base text-ink line-clamp-1">{product.name}</p>
                      <p className="text-xs text-ink/55">
                        {quantity} × {formatMad(product.priceMad)}
                      </p>
                    </div>
                    <p className="font-serif text-sm font-semibold text-burgundy">
                      {formatMad(lineTotalMad)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Calculations Breakdown */}
            <div className="border-t border-burgundy/10 pt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink/65 uppercase tracking-wider">Sous-total articles</span>
                <span className="font-serif text-lg font-semibold text-ink">
                  {formatMad(subtotalMad)}
                </span>
              </div>

              {/* Delivery Fee Status - Explaining Unknown status transparently */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-ivory/80 p-3 text-xs">
                <div>
                  <span className="font-medium text-burgundy">Frais de livraison</span>
                  <p className="mt-0.5 text-[0.7rem] text-ink/65 leading-4">
                    Calculés selon l’adresse exacte ({selectedCity === "Autre ville au Maroc" ? otherCity || "Maroc" : selectedCity}) et annoncés lors de la confirmation téléphonique.
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold italic text-burgundy">
                  À confirmer
                </span>
              </div>

              {/* Total Calculation Note */}
              <div className="border-t border-burgundy/10 pt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-ink">
                      Total prévisionnel
                    </span>
                    <p className="text-[0.65rem] text-ink/50">Hors frais de livraison à confirmer</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-burgundy">
                      {formatMad(subtotalMad)}
                    </span>
                    <span className="block text-[0.65rem] text-burgundy/80 italic">
                      + livraison à confirmer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="rounded-2xl border border-burgundy/10 bg-ivory/60 p-5 space-y-2.5 text-xs text-ink/75">
            <div className="flex items-center gap-2.5">
              <span className="text-base text-burgundy">📞</span>
              <span>Notre équipe vous contacte par téléphone avant chaque livraison.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base text-burgundy">🌹</span>
              <span>Fleurs d’exception préparées à la commande le matin même.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base text-burgundy">💵</span>
              <span>Paiement en dirhams (MAD) au livreur lors de la remise en main propre.</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
