import Image from "next/image";
import Link from "next/link";
import { featuredBouquets } from "@/lib/featured-bouquets";
import { formatMad } from "@/lib/format-price";

export function FeaturedCollection() {
  return (
    <section id="bouquets" className="bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.32em] text-burgundy uppercase">Sélection</p>
            <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
              Bouquets du moment
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/70">
              Quatre compositions emblématiques photographiées avec soin. Explorez
              leurs détails ou découvrez le catalogue complet.
            </p>
          </div>
          <div>
            <Link
              href="/bouquets"
              className="inline-flex items-center gap-2 rounded-full border border-burgundy/25 bg-white/60 px-6 py-3 text-xs tracking-[0.16em] text-burgundy uppercase transition-colors hover:border-burgundy hover:bg-white"
            >
              Voir tout le catalogue →
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2">
          {featuredBouquets.map((bouquet) => (
            <li
              key={bouquet.id}
              className="group overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-[0_24px_60px_-40px_rgba(75,18,36,0.55)] transition-transform duration-500 hover:-translate-y-1"
            >
              <Link href={`/bouquets/${bouquet.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={bouquet.imageSrc}
                    alt={bouquet.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-ivory/90 px-3.5 py-1 text-[0.65rem] tracking-[0.18em] text-burgundy uppercase backdrop-blur-sm">
                    {bouquet.category}
                  </div>
                </div>
                <div className="space-y-3 px-7 py-7">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-burgundy">
                      {bouquet.name}
                    </h3>
                    <span className="text-xs text-burgundy opacity-0 transition-opacity group-hover:opacity-100">
                      Découvrir →
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ink/65">{bouquet.description}</p>
                  <div className="flex items-end justify-between pt-2">
                    <p className="text-lg tracking-wide text-burgundy">
                      {formatMad(bouquet.priceMad)}
                    </p>
                    <p className="text-[0.65rem] tracking-[0.16em] text-ink/45 uppercase">
                      Paiement à la livraison
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/bouquets"
            className="inline-block rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.18em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
          >
            Découvrir tout le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
