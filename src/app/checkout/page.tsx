import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Validation de Commande | Art Bouquet Maroc",
  description:
    "Finalisez votre commande de fleurs luxueuses au Maroc. Paiement exclusivement en espèces à la livraison (Cash on Delivery).",
};

export default function CheckoutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-xs tracking-[0.32em] text-burgundy uppercase">
            Maison florale · Commande
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
            Finaliser votre commande
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Renseignez vos coordonnées de livraison. Votre commande sera préparée à la main
            et réglée en espèces directement au livreur à votre porte.
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
