import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { featuredBouquets } from "@/lib/featured-bouquets";
import { formatMad } from "@/lib/format-price";

export function FeaturedCollection() {
  return (
    <section id="bouquets" className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-36">
        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-4 text-burgundy">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              Sélection
            </p>
            <h2 className="mt-6 text-5xl leading-[0.95] font-light tracking-[-0.01em] text-ink sm:text-6xl lg:text-7xl">
              Bouquets <em className="text-burgundy">du moment</em>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-sm text-base leading-8 text-ink/70">
              Quatre compositions emblématiques photographiées avec soin. Explorez
              leurs détails ou découvrez le catalogue complet.
            </p>
            <Link
              href="/bouquets"
              className="group mt-7 inline-flex items-center gap-3 text-xs tracking-[0.2em] text-burgundy uppercase"
            >
              <span className="link-underline-static">Voir tout le catalogue</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <ul className="no-scrollbar -mx-6 mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:overflow-visible sm:px-0 lg:mt-24 lg:grid-cols-4 lg:gap-x-7">
          {featuredBouquets.map((bouquet, index) => (
            <li
              key={bouquet.id}
              className={`w-[76vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none ${
                index % 2 === 1 ? "lg:mt-20" : ""
              }`}
            >
              <Reveal delay={index * 110}>
                <Link href={`/bouquets/${bouquet.slug}`} className="group block">
                  <div className="flex items-baseline justify-between pb-4">
                    <span className="font-serif text-lg text-gold italic">
                      N° {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.625rem] tracking-[0.26em] text-ink/55 uppercase">
                      {bouquet.category}
                    </span>
                  </div>

                  <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
                    <Image
                      src={bouquet.imageSrc}
                      alt={bouquet.imageAlt}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 76vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/70"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-burgundy px-5 py-4 text-[0.625rem] tracking-[0.24em] text-ivory uppercase transition-transform duration-700 ease-luxe group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      Découvrir le bouquet
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-[1.75rem] leading-tight text-ink transition-colors duration-500 group-hover:text-burgundy">
                      {bouquet.name}
                    </h3>
                    <p className="mt-1.5 font-serif text-lg leading-snug text-ink/60 italic">
                      {bouquet.subtitle}
                    </p>
                    <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-burgundy/15 pt-4">
                      <p className="text-sm tracking-[0.12em] text-burgundy">
                        {formatMad(bouquet.priceMad)}
                      </p>
                      <p className="text-[0.625rem] tracking-[0.18em] text-ink/50 uppercase">
                        Paiement à la livraison
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
