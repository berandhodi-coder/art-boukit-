import { BouquetStage } from "@/components/home/bouquet-stage";
import { ArrowRightIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-y-16 px-6 pt-14 pb-20 sm:px-10 lg:min-h-[calc(100svh-7.25rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-14 lg:py-14">
        <div className="relative z-10">
          <p className="eyebrow flex animate-rise items-center gap-4 text-burgundy">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Maison florale · Maroc
          </p>

          <h1 className="mt-8 animate-rise text-[clamp(3.6rem,8.2vw,7.5rem)] leading-[0.9] font-light tracking-[-0.02em] text-ink [animation-delay:120ms]">
            <span className="block">Des fleurs</span>
            <span className="block pl-[0.85em]">comme un</span>
            <em className="block text-burgundy">écrin.</em>
          </h1>

          <p className="mt-9 max-w-md animate-rise text-base leading-8 text-ink/70 [animation-delay:260ms]">
            Art Bouquet compose des bouquets raffinés, photographiés avec soin et
            livrés dans les principales villes du Maroc. Prix en dirhams, paiement
            uniquement à la livraison.
          </p>

          <div className="mt-11 flex animate-rise flex-wrap items-center gap-x-9 gap-y-6 [animation-delay:380ms]">
            <a
              href="#bouquets"
              className="group inline-flex items-center gap-4 rounded-full bg-burgundy py-4 pr-6 pl-8 text-xs tracking-[0.2em] text-ivory uppercase transition-colors duration-500 hover:bg-burgundy-deep"
            >
              Découvrir les bouquets
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
            </a>
            <a
              href="#livraison"
              className="link-underline-static text-xs tracking-[0.2em] text-burgundy uppercase"
            >
              Livraison au Maroc
            </a>
          </div>
        </div>

        <BouquetStage />
      </div>

      <p
        aria-hidden="true"
        className="absolute top-1/2 right-5 hidden origin-right -translate-y-1/2 -rotate-90 text-[0.625rem] tracking-[0.4em] whitespace-nowrap text-ink/40 uppercase 2xl:block"
      >
        Art Bouquet — Maison florale
      </p>
    </section>
  );
}
