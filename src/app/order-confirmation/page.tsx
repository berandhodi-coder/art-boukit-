import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
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

  const orderReference = typeof resolvedParams.ref === "string" ? resolvedParams.ref : null;
  const subtotalStr = typeof resolvedParams.subtotal === "string" ? resolvedParams.subtotal : null;
  const city = typeof resolvedParams.city === "string" ? resolvedParams.city : "Maroc";
  const customerName = typeof resolvedParams.name === "string" ? resolvedParams.name : "Cher client";

  const subtotalMad = subtotalStr ? parseFloat(subtotalStr) : null;

  if (!orderReference) {
    return (
      <div className="bg-ivory min-h-screen py-20 px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-burgundy/15 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/10 text-2xl">
            🌸
          </div>
          <h1 className="mt-5 font-serif text-3xl text-ink">Aucune commande spécifiée</h1>
          <p className="mt-3 text-sm text-ink/70">
            Cette page affiche les détails d’une commande enregistrée. Pour passer une nouvelle commande, explorez notre collection florale.
          </p>
          <div className="mt-8">
            <Link
              href="/bouquets"
              className="inline-block rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
            >
              Explorer les bouquets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-16 sm:py-24 px-6">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950/10 text-3xl text-emerald-800">
            ✓
          </div>
          <p className="text-xs tracking-[0.32em] text-burgundy uppercase">
            Maison florale · Confirmation
          </p>
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">
            Commande enregistrée avec succès
          </h1>
          <p className="text-sm leading-6 text-ink/75 max-w-lg mx-auto">
            Merci pour votre confiance, {customerName}. Votre commande a bien été enregistrée
            dans notre système et sera prise en charge par nos artisans fleuristes.
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="rounded-3xl border border-burgundy/20 bg-white p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-burgundy/10 pb-6">
            <div>
              <p className="text-xs tracking-[0.16em] text-ink/50 uppercase">
                Référence de commande
              </p>
              <p className="font-serif text-3xl font-bold tracking-wide text-burgundy sm:text-4xl mt-1">
                {orderReference}
              </p>
            </div>
            <div className="rounded-full bg-ivory/80 border border-burgundy/15 px-4 py-2 text-xs text-ink/70">
              📍 Livraison à <span className="font-semibold text-burgundy">{city}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="py-6 space-y-4 border-b border-burgundy/10 text-sm">
            {subtotalMad !== null && (
              <div className="flex items-center justify-between">
                <span className="text-ink/70">Sous-total des créations florales :</span>
                <span className="font-serif text-lg font-semibold text-ink">
                  {formatMad(subtotalMad)}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 rounded-2xl bg-ivory/60 p-4">
              <div>
                <p className="font-medium text-xs text-burgundy uppercase tracking-wider">
                  Frais de livraison
                </p>
                <p className="text-xs text-ink/70 mt-1">
                  Les frais de livraison pour {city} n’ont pas été prélevés et vous seront confirmés par téléphone par notre service client.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold italic text-burgundy">
                À confirmer par appel
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <div>
                <span className="text-sm font-semibold text-ink uppercase tracking-wider">
                  Règlement à la livraison
                </span>
                <p className="text-[0.7rem] text-ink/50">Paiement uniquement en espèces (MAD)</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl font-bold text-burgundy">
                  {subtotalMad !== null ? formatMad(subtotalMad) : "Montant"}
                </span>
                <span className="block text-[0.7rem] text-burgundy/80 italic">
                  + frais de livraison
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps Guide */}
          <div className="pt-6 space-y-4">
            <h2 className="font-serif text-xl text-ink">Prochaines étapes de votre livraison</h2>
            <div className="grid gap-4 sm:grid-cols-3 text-xs leading-5 text-ink/75">
              <div className="rounded-2xl border border-burgundy/10 bg-ivory/40 p-4">
                <span className="font-serif text-lg text-burgundy">01</span>
                <p className="font-semibold text-ink mt-1">Confirmation d’appel</p>
                <p className="mt-1 text-ink/65">
                  Notre équipe vous appellera pour valider l’adresse et le créneau de livraison.
                </p>
              </div>
              <div className="rounded-2xl border border-burgundy/10 bg-ivory/40 p-4">
                <span className="font-serif text-lg text-burgundy">02</span>
                <p className="font-semibold text-ink mt-1">Confection artisanale</p>
                <p className="mt-1 text-ink/65">
                  Vos fleurs sont préparées et protégées par réserve d’eau le jour convenu.
                </p>
              </div>
              <div className="rounded-2xl border border-burgundy/10 bg-ivory/40 p-4">
                <span className="font-serif text-lg text-burgundy">03</span>
                <p className="font-semibold text-ink mt-1">Paiement en espèces</p>
                <p className="mt-1 text-ink/65">
                  Vous réglez en espèces (MAD) directement au livreur à votre porte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            href="/bouquets"
            className="inline-block rounded-full bg-burgundy px-10 py-4 text-xs tracking-[0.18em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
          >
            Retourner au catalogue de bouquets
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
        <div className="bg-ivory min-h-screen py-24 px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/10 text-2xl animate-pulse">
            🌸
          </div>
          <p className="mt-4 font-serif text-2xl text-ink">
            Chargement de la confirmation de commande...
          </p>
        </div>
      }
    >
      <OrderConfirmationContent searchParams={props.searchParams} />
    </Suspense>
  );
}
