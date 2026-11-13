import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const occasions = [
  {
    title: "Naissance",
    copy: "Douceur ivoire et rose poudrée pour accueillir un enfant.",
    imageSrc: "/images/occasion-naissance.jpg",
    imageAlt: "Bouquet tendre de roses ivoire et rose poudré posé sur un lin crème",
  },
  {
    title: "Mariage",
    copy: "Compositions architecturales pour cérémonies et tables.",
    imageSrc: "/images/occasion-mariage.jpg",
    imageAlt:
      "Grande composition florale blanche et ivoire sur une table de cérémonie",
  },
  {
    title: "Anniversaire",
    copy: "Un geste floral précieux, livré à la date choisie.",
    imageSrc: "/images/occasion-anniversaire.jpg",
    imageAlt:
      "Bouquet de roses bordeaux noué d’un ruban doré, posé près d’une carte ivoire",
  },
];

const numerals = ["I", "II", "III"];

export function Occasions() {
  return (
    <section id="collections" className="bg-sage/25">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-36">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-burgundy">Occasions</p>
          <h2 className="mt-6 text-5xl leading-[0.98] font-light tracking-[-0.01em] text-balance text-ink sm:text-6xl lg:text-7xl">
            Offrir des fleurs, <em className="text-burgundy">comme un rituel.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-24 lg:gap-14">
          {occasions.map((occasion, index) => (
            <Reveal
              key={occasion.title}
              delay={index * 130}
              className={index === 1 ? "md:mt-20" : ""}
            >
              <article className="group mx-auto max-w-sm text-center">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-champagne">
                  <Image
                    src={occasion.imageSrc}
                    alt={occasion.imageAlt}
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-cover transition-transform duration-[1800ms] ease-luxe group-hover:scale-105"
                  />
                </div>
                <span className="mt-8 block font-serif text-lg text-burgundy/70 italic">
                  {numerals[index]}.
                </span>
                <h3 className="mt-2 text-4xl font-light text-ink">
                  {occasion.title}
                </h3>
                <p className="mx-auto mt-4 max-w-[17rem] text-sm leading-7 text-ink/70">
                  {occasion.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
