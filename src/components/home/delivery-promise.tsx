export function DeliveryPromise() {
  return (
    <section id="livraison" className="bg-ivory">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.32em] text-burgundy uppercase">
            Livraison
          </p>
          <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">
            Dans les villes du Maroc, à la date que vous choisissez.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-ink/70">
            Les frais de livraison seront configurables par ville. Pour cette
            première version, seuls Casablanca, Rabat, Marrakech et Tanger sont
            indiqués à titre d’exemple. Le règlement se fait exclusivement en
            espèces à la livraison.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Casablanca", "40 MAD"],
            ["Rabat", "45 MAD"],
            ["Marrakech", "50 MAD"],
            ["Tanger", "55 MAD"],
          ].map(([city, fee]) => (
            <div
              key={city}
              className="rounded-2xl border border-burgundy/10 bg-white px-6 py-5"
            >
              <dt className="text-sm tracking-[0.08em] text-ink/55 uppercase">{city}</dt>
              <dd className="mt-2 font-serif text-2xl text-burgundy">{fee}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
