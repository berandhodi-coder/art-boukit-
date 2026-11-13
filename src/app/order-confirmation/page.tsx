import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  MapPinIcon,
  SparkIcon,
} from "@/components/ui/icons";
import { formatMad } from "@/lib/format-price";

export const metadata: Metadata = {
  title: "Confirmation de Commande | Art Bouquet Maroc",
  description: "Votre commande de fleurs Art Bouquet a été enregistrée avec succès.",
};

interface OrderConfirmationProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function OrderConfirmationContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const orderReference =
    typeof resolvedParams.ref === "string" ? resolvedParams.ref : null;
  const subtotalStr =
    typeof resolvedParams.subtotal === "string" ? resolvedParams.subtotal : null;
  const city = typeof resolvedParams.city === "string" ? resolvedParams.city : "Maroc";
  const customerName =
    typeof resolvedParams.name === "string" ? resolvedParams.name : "Cher client";

  const subtotalMad = subtotalStr ? parseFloat(subtotalStr) : null;

  if (!orderReference) {
    return (
      <div className="min-h-screen bg-ivory px-6 py-20">
        <div className="mx-auto max-w-xl border border-gold/65 p-2">
          <div className="border border-burgundy/15 bg-champagne/25 px-8 py-14 text-center">
            <SparkIcon className="mx-auto h-4 w-4 text-gold" />
            <h1 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">
              Aucune commande spécifiée
            </h1>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Cette page affiche les détails d’une commande enregistrée. Pour passer une nouvelle commande, explorez notre collection florale.
            </p>
            <div className="mt-8">
              <Link
                href="/bouquets"
                className="inline-flex items-center gap-3 rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
              >
                Explorer les bouquets
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/70 bg-champagne/40 text-burgundy">
            <CheckIcon className="h-7 w-7" />
          </div>
          <p className="eyebrow text-burgundy">Maison florale · Confirmation</p>
          <h1 className="font-serif text-4xl font-light text-ink sm:text-5xl">
            Commande enregistrée <em className="text-burgundy">avec succès</em>
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-7 text-ink/75">
            Merci pour votre confiance, {customerName}. Votre commande a bien été enregistrée
            dans notre système et sera prise en charge par nos artisans fleuristes.
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="border border-gold/70 p-2">
          <div className="border border-burgundy/15 bg-white/90 p-7 sm:p-10">
            <div className="flex flex-col justify-between gap-4 border-b border-burgundy/15 pb-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[0.625rem] tracking-[0.22em] text-ink/55 uppercase">
                  Référence de commande
                </p>
                <p className="mt-1 font-serif text-3xl tracking-wide text-burgundy sm:text-4xl">
                  {orderReference}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 border border-burgundy/20 bg-ivory px-4 py-2 text-xs text-ink/75">
                <MapPinIcon className="h-4 w-4 text-burgundy" />
                <span>
                  Livraison à <span className="font-medium text-burgundy">{city}</span>
                </span>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-4 border-b border-burgundy/15 py-6 text-sm">
              {subtotalMad !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-ink/70">Sous-total des créations florales :</span>
                  <span className="font-serif text-xl text-ink">
                    {formatMad(subtotalMad)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 border border-burgundy/15 bg-champagne/30 p-4">
                <div>
                  <p className="text-[0.6875rem] font-medium tracking-[0.16em] text-burgundy uppercase">
                    Frais de livraison
                  </p>
                  <p className="mt-1 text-xs leading-5 text-ink/70">
                    Les frais de livraison pour {city} n’ont pas été prélevés et vous seront confirmés par téléphone par notre service client.
                  </p>
                </div>
                <span className="shrink-0 font-serif text-sm text-burgundy italic">
                  À confirmer par appel
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <span className="text-xs font-medium tracking-[0.18em] text-ink uppercase">
                    Règlement à la livraison
                  </span>
                  <p className="mt-0.5 text-xs text-ink/55">
                    Paiement uniquement en espèces (MAD)
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-3xl text-burgundy">
                    {subtotalMad !== null ? formatMad(subtotalMad) : "Montant"}
                  </span>
                  <span className="block font-serif text-xs text-burgundy/85 italic">
                    + frais de livraison
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="space-y-5 pt-6">
              <h2 className="font-serif text-2xl font-light text-ink">
                Prochaines étapes de votre livraison
              </h2>
              <div className="grid gap-4 text-xs leading-6 text-ink/75 sm:grid-cols-3">
                <div className="border border-burgundy/15 bg-ivory/60 p-4">
                  <span className="font-serif text-xl text-gold italic">01.</span>
                  <p className="mt-2 font-medium text-ink">Confirmation d’appel</p>
                  <p className="mt-1 text-ink/65">
                    Notre équipe vous appellera pour valider l’adresse et le créneau de livraison.
                  </p>
                </div>
                <div className="border border-burgundy/15 bg-ivory/60 p-4">
                  <span className="font-serif text-xl text-gold italic">02.</span>
                  <p className="mt-2 font-medium text-ink">Confection artisanale</p>
                  <p className="mt-1 text-ink/65">
                    Vos fleurs sont préparées et protégées par réserve d’eau le jour convenu.
                  </p>
                </div>
                <div className="border border-burgundy/15 bg-ivory/60 p-4">
                  <span className="font-serif text-xl text-gold italic">03.</span>
                  <p className="mt-2 font-medium text-ink">Paiement en espèces</p>
                  <p className="mt-1 text-ink/65">
                    Vous réglez en espèces (MAD) directement au livreur à votre porte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            href="/bouquets"
            className="inline-flex items-center gap-3 rounded-full bg-burgundy px-10 py-4 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
          >
            Retourner au catalogue de bouquets
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage(props: OrderConfirmationProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory px-6 py-24 text-center">
          <SparkIcon className="mx-auto h-5 w-5 text-gold" />
          <p className="mt-4 font-serif text-2xl font-light text-ink">
            Chargement de la confirmation de commande...
          </p>
        </div>
      }
    >
      <OrderConfirmationContent searchParams={props.searchParams} />
    </Suspense>
  );
}
