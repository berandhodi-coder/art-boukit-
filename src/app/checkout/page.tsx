import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Validation de Commande | Art Bouquet Maroc",
  description:
    "Finalisez votre commande de fleurs luxueuses au Maroc. Paiement exclusivement en espèces à la livraison (Cash on Delivery).",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
        <div className="mb-14 border-b border-burgundy/15 pb-10">
          <p className="eyebrow flex items-center gap-4 text-burgundy">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Maison florale · Commande
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-[0.95] font-light text-ink sm:text-6xl">
            Finaliser votre <em className="text-burgundy">commande</em>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-ink/70">
            Renseignez vos coordonnées de livraison. Votre commande sera préparée à la main
            et réglée en espèces directement au livreur à votre porte.
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
