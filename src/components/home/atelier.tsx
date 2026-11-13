import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const signatures = [
  { numeral: "I", title: "Tiges fraîches", copy: "Sélectionnées à maturité." },
  {
    numeral: "II",
    title: "Prix en dirhams",
    copy: "Paiement uniquement à la livraison.",
  },
  {
    numeral: "III",
    title: "Livraison soignée",
    copy: "Dans les principales villes du Maroc.",
  },
];

export function Atelier() {
  return (
    <section className="bg-burgundy text-ivory">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24 lg:py-36">
        <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -translate-x-4 translate-y-4 border border-gold/50"
          />
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/atelier-hands.jpg"
              alt="Mains d’une fleuriste nouant un ruban champagne autour d’un bouquet de roses bordeaux et rose poudré"
              fill
              sizes="(max-width: 1024px) 90vw, 28rem"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-10 w-2/5 border-[6px] border-burgundy sm:-right-12">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/atelier-still-life.jpg"
                alt="Ciseaux en laiton, bobine de ruban doré, pétales et tiges d’eucalyptus posés sur un lin ivoire"
                fill
                sizes="(max-width: 1024px) 36vw, 12rem"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div className="pt-6 lg:pt-0">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-gold">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              La maison
            </p>
            <p className="mt-8 font-serif text-4xl leading-[1.12] font-light text-ivory sm:text-5xl lg:text-[3.5rem]">
              Chaque bouquet est une{" "}
              <em className="text-rose">composition singulière</em>, confectionnée
              avec des tiges fraîches sélectionnées à maturité.
            </p>
          </Reveal>

          <ul className="mt-14 grid gap-10 border-t border-ivory/15 pt-10 sm:grid-cols-3 sm:gap-8">
            {signatures.map((signature, index) => (
              <li key={signature.numeral}>
                <Reveal delay={index * 120}>
                  <span className="font-serif text-xl text-gold italic">
                    {signature.numeral}.
                  </span>
                  <h3 className="mt-3 text-2xl text-ivory">{signature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ivory/70">
                    {signature.copy}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
