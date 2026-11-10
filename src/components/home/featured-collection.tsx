import Image from "next/image";
import { featuredBouquets } from "@/lib/featured-bouquets";
import { formatMad } from "@/lib/format-price";

export function FeaturedCollection() {
  return (
    <section id="bouquets" className="bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.32em] text-burgundy uppercase">Sélection</p>
          <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            Bouquets du moment
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/70">
            Quatre compositions emblématiques. Le catalogue complet, le panier et
            la commande arriveront à l’étape suivante.
          </p>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2">
          {featuredBouquets.map((bouquet) => (
            <li
              key={bouquet.id}
              className="group overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-[0_24px_60px_-40px_rgba(75,18,36,0.55)] transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={bouquet.imageSrc}
                  alt={bouquet.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-3 px-7 py-7">
                <h3 className="font-serif text-2xl text-ink">{bouquet.name}</h3>
                <p className="text-sm leading-6 text-ink/65">{bouquet.description}</p>
                <div className="flex items-end justify-between pt-2">
                  <p className="text-lg tracking-wide text-burgundy">{formatMad(bouquet.priceMad)}</p>
                  <p className="text-[0.65rem] tracking-[0.16em] text-ink/45 uppercase">
                    Paiement à la livraison
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
