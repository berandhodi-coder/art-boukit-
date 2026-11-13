import { SparkIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";

const deliveryFees = [
  ["Casablanca", "40 MAD"],
  ["Rabat", "45 MAD"],
  ["Marrakech", "50 MAD"],
  ["Tanger", "55 MAD"],
];

export function DeliveryPromise() {
  return (
    <section id="livraison" className="bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24 lg:py-36">
        <Reveal>
          <p className="eyebrow flex items-center gap-4 text-burgundy">
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            Livraison
          </p>
          <h2 className="mt-6 text-5xl leading-[1] font-light tracking-[-0.01em] text-balance text-ink sm:text-6xl">
            Dans les villes du Maroc,{" "}
            <em className="text-burgundy">à la date que vous choisissez.</em>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-8 text-ink/70">
            Les frais de livraison seront configurables par ville. Pour cette
            première version, seuls Casablanca, Rabat, Marrakech et Tanger sont
            indiqués à titre d’exemple. Le règlement se fait exclusivement en
            espèces à la livraison.
          </p>
        </Reveal>

        <Reveal delay={150} className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="border border-gold/70 p-2">
            <div className="border border-gold/40 bg-champagne/40 px-7 py-12 sm:px-11">
              <div className="text-center">
                <SparkIcon className="mx-auto h-3 w-3 text-gold" />
                <p className="mt-5 font-serif text-3xl text-burgundy italic">
                  Frais de livraison
                </p>
                <p className="eyebrow mt-3 text-ink/55">À titre d’exemple</p>
              </div>

              <dl className="mt-10 space-y-6">
                {deliveryFees.map(([city, fee]) => (
                  <div key={city} className="flex items-baseline gap-4">
                    <dt className="font-serif text-2xl text-ink">{city}</dt>
                    <span
                      aria-hidden="true"
                      className="flex-1 -translate-y-1 border-b border-dotted border-burgundy/40"
                    />
                    <dd className="text-sm tracking-[0.14em] text-burgundy">
                      {fee}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-10 border-t border-gold/40 pt-6 text-center text-[0.625rem] tracking-[0.24em] text-ink/60 uppercase">
                Règlement en espèces à la livraison
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
