"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertIcon,
  ArrowRightIcon,
  BanknoteIcon,
  LockIcon,
  PhoneIcon,
  SparkIcon,
} from "@/components/ui/icons";
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

  if (isLoaded && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl border border-gold/65 p-2">
        <div className="border border-burgundy/15 bg-champagne/25 px-8 py-14 text-center">
          <SparkIcon className="mx-auto h-4 w-4 text-gold" />
          <h2 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">
            Votre panier est vide
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            Veuillez sélectionner au moins une composition florale avant de procéder à la commande.
          </p>
          <div className="mt-8">
            <Link
              href="/bouquets"
              className="inline-flex items-center gap-3 rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
            >
              Découvrir nos bouquets
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = "Veuillez indiquer votre nom complet (au moins 2 caractères).";
    }

    if (!customerPhone.trim()) {
      errors.customerPhone = "Le numéro de téléphone est obligatoire.";
    } else if (!isValidMoroccanPhone(customerPhone)) {
      errors.customerPhone =
        "Numéro marocain invalide (ex: 06 12 34 56 78 ou +212 612 345 678).";
    }

    const finalCity =
      selectedCity === "Autre ville au Maroc" ? otherCity.trim() : selectedCity;
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
        clearCart();

        const params = new URLSearchParams({
          ref: result.orderReference,
          subtotal: result.subtotalMad.toString(),
          city: result.city,
          name: result.customerName,
        });

        router.push(`/order-confirmation?${params.toString()}`);
      } else {
        setGeneralError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setIsSubmitting(false);
      }
    } catch {
      setGeneralError(
        "Une erreur inattendue est survenue lors de la communication avec le serveur. Votre panier est conservé. Veuillez réessayer.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12" noValidate>
      {generalError && (
        <div
          role="alert"
          className="border border-burgundy/40 bg-rose/15 p-5 text-sm leading-6 text-burgundy"
        >
          <div className="flex items-start gap-3.5">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" />
            <div>
              <p className="text-xs font-medium tracking-[0.18em] uppercase">
                Information commande
              </p>
              <p className="mt-1">{generalError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid items-start gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-16">
        {/* Left Column: Customer and Delivery Form */}
        <div className="space-y-8">
          {/* Section: Coordonnées */}
          <section className="border border-burgundy/15 bg-white/80 p-6 sm:p-8">
            <div className="border-b border-burgundy/10 pb-4">
              <span className="font-serif text-base text-gold italic">I.</span>
              <h2 className="mt-1 font-serif text-2xl font-light text-ink sm:text-3xl">
                Coordonnées du destinataire
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-ink/65">
                Ces informations permettront à notre service client de vous joindre pour confirmer l’adresse.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor={nameInputId}
                  className="block text-[0.6875rem] font-medium tracking-[0.18em] text-ink/80 uppercase"
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
                  className={`mt-2 w-full border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none ${
                    fieldErrors.customerName
                      ? "border-burgundy bg-rose/10"
                      : "border-burgundy/20 bg-ivory/40 focus:border-burgundy focus:bg-white"
                  }`}
                />
                {fieldErrors.customerName && (
                  <p id="name-error" className="mt-1.5 text-xs text-burgundy">
                    {fieldErrors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={phoneInputId}
                  className="block text-[0.6875rem] font-medium tracking-[0.18em] text-ink/80 uppercase"
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
                  className={`mt-2 w-full border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none ${
                    fieldErrors.customerPhone
                      ? "border-burgundy bg-rose/10"
                      : "border-burgundy/20 bg-ivory/40 focus:border-burgundy focus:bg-white"
                  }`}
                />
                <p id="phone-hint" className="mt-1.5 text-xs text-ink/55">
                  Format accepté : 06XXXXXXXX, 07XXXXXXXX ou format international (+212).
                </p>
                {fieldErrors.customerPhone && (
                  <p className="mt-1 text-xs text-burgundy">
                    {fieldErrors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section: Adresse de livraison */}
          <section className="border border-burgundy/15 bg-white/80 p-6 sm:p-8">
            <div className="border-b border-burgundy/10 pb-4">
              <span className="font-serif text-base text-gold italic">II.</span>
              <h2 className="mt-1 font-serif text-2xl font-light text-ink sm:text-3xl">
                Adresse de livraison au Maroc
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-ink/65">
                Livraison soignée en main propre par notre transporteur partenaire.
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor={citySelectId}
                  className="block text-[0.6875rem] font-medium tracking-[0.18em] text-ink/80 uppercase"
                >
                  Ville de livraison *
                </label>
                <select
                  id={citySelectId}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="mt-2 w-full border border-burgundy/20 bg-ivory/40 px-4 py-3 text-sm text-ink focus:border-burgundy focus:bg-white focus:outline-none"
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
                      className="w-full border border-burgundy/20 bg-ivory/40 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-burgundy focus:bg-white focus:outline-none"
                    />
                  </div>
                )}
                {fieldErrors.city && (
                  <p className="mt-1.5 text-xs text-burgundy">{fieldErrors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor={addressInputId}
                  className="block text-[0.6875rem] font-medium tracking-[0.18em] text-ink/80 uppercase"
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
                  className={`mt-2 w-full border px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none ${
                    fieldErrors.deliveryAddress
                      ? "border-burgundy bg-rose/10"
                      : "border-burgundy/20 bg-ivory/40 focus:border-burgundy focus:bg-white"
                  }`}
                />
                {fieldErrors.deliveryAddress && (
                  <p className="mt-1.5 text-xs text-burgundy">
                    {fieldErrors.deliveryAddress}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={notesInputId}
                  className="block text-[0.6875rem] font-medium tracking-[0.18em] text-ink/80 uppercase"
                >
                  Instructions spéciales ou mot pour la carte (optionnel)
                </label>
                <textarea
                  id={notesInputId}
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Message à joindre sur la carte calligraphiée, créneau horaire souhaité..."
                  className="mt-2 w-full border border-burgundy/20 bg-ivory/40 px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-burgundy focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section: Mode de paiement */}
          <section className="border border-burgundy/15 bg-white/80 p-6 sm:p-8">
            <div className="border-b border-burgundy/10 pb-4">
              <span className="font-serif text-base text-gold italic">III.</span>
              <h2 className="mt-1 font-serif text-2xl font-light text-ink sm:text-3xl">
                Mode de règlement
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-ink/65">
                Art Bouquet privilégie la confiance et la simplicité pour ses clients au Maroc.
              </p>
            </div>

            <div className="mt-5 border border-gold/55 bg-champagne/30 p-5">
              <div className="flex items-start gap-3.5">
                <BanknoteIcon className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" />
                <div>
                  <p className="text-sm font-medium text-burgundy">
                    Paiement en espèces à la livraison (Cash on Delivery)
                  </p>
                  <p className="mt-1.5 text-xs leading-6 text-ink/75">
                    Aucun paiement en ligne requis. Vous réglez directement le livreur en espèces (MAD) à la réception de votre commande.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Terms and Submission */}
          <div className="space-y-5">
            <label className="flex cursor-pointer items-start gap-3.5">
              <input
                id={termsCheckboxId}
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 accent-burgundy"
              />
              <span className="text-xs leading-6 text-ink/75">
                J’accepte que ma commande soit confirmée par téléphone et réglée en espèces à la livraison. Les frais de livraison seront confirmés par la boutique lors de l’appel de validation. *
              </span>
            </label>
            {fieldErrors.termsAccepted && (
              <p className="text-xs text-burgundy">{fieldErrors.termsAccepted}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-burgundy py-4 text-xs tracking-[0.2em] text-ivory uppercase transition-colors duration-500 hover:bg-burgundy-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement de votre commande en cours..."
                : `Confirmer ma commande (${formatMad(subtotalMad)})`}
            </button>

            <p className="flex items-center justify-center gap-2 text-[0.6875rem] tracking-[0.16em] text-ink/55 uppercase">
              <LockIcon className="h-3.5 w-3.5 text-burgundy/70" />
              Vos coordonnées restent strictement confidentielles
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="border border-gold/65 p-2">
            <div className="border border-burgundy/15 bg-white/85 p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-burgundy/15 pb-5">
                <h2 className="font-serif text-2xl font-light text-ink sm:text-3xl">
                  Votre sélection
                </h2>
                <span className="border border-burgundy/25 px-2.5 py-0.5 text-[0.625rem] tracking-[0.16em] text-burgundy uppercase">
                  {totalItems} {totalItems > 1 ? "articles" : "article"}
                </span>
              </div>

              <ul className="my-4 max-h-[320px] divide-y divide-burgundy/10 overflow-y-auto pr-1">
                {items.map(({ product, quantity, lineTotalMad }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-burgundy/10 bg-champagne">
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="line-clamp-1 font-serif text-lg text-ink">
                          {product.name}
                        </p>
                        <p className="text-xs text-ink/55">
                          {quantity} × {formatMad(product.priceMad)}
                        </p>
                      </div>
                      <p className="font-serif text-base text-burgundy">
                        {formatMad(lineTotalMad)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 border-t border-burgundy/15 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] tracking-[0.18em] text-ink/65 uppercase">
                    Sous-total articles
                  </span>
                  <span className="font-serif text-xl text-ink">
                    {formatMad(subtotalMad)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border border-burgundy/15 bg-champagne/30 p-3.5 text-xs">
                  <div>
                    <span className="font-medium text-burgundy">Frais de livraison</span>
                    <p className="mt-1 text-[0.7rem] leading-4 text-ink/65">
                      Calculés selon l’adresse exacte (
                      {selectedCity === "Autre ville au Maroc"
                        ? otherCity || "Maroc"
                        : selectedCity}
                      ) et annoncés lors de la confirmation téléphonique.
                    </p>
                  </div>
                  <span className="shrink-0 font-serif text-sm text-burgundy italic">
                    À confirmer
                  </span>
                </div>

                <div className="border-t border-burgundy/15 pt-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[0.6875rem] font-medium tracking-[0.18em] text-ink uppercase">
                        Total prévisionnel
                      </span>
                      <p className="mt-0.5 text-[0.6875rem] text-ink/55">
                        Hors frais de livraison à confirmer
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl text-burgundy">
                        {formatMad(subtotalMad)}
                      </span>
                      <span className="block font-serif text-xs text-burgundy/85 italic">
                        + livraison à confirmer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 border border-burgundy/15 bg-champagne/25 p-5 text-xs leading-5 text-ink/75">
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 shrink-0 text-burgundy" />
              <span>Notre équipe vous contacte par téléphone avant chaque livraison.</span>
            </div>
            <div className="flex items-center gap-3">
              <SparkIcon className="h-3 w-3 shrink-0 text-gold" />
              <span>Fleurs d’exception préparées à la commande le matin même.</span>
            </div>
            <div className="flex items-center gap-3">
              <BanknoteIcon className="h-4 w-4 shrink-0 text-burgundy" />
              <span>Paiement en dirhams (MAD) au livreur lors de la remise en main propre.</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
