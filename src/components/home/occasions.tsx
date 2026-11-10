const occasions = [
  {
    title: "Naissance",
    copy: "Douceur ivoire et rose poudrée pour accueillir un enfant.",
  },
  {
    title: "Mariage",
    copy: "Compositions architecturales pour cérémonies et tables.",
  },
  {
    title: "Anniversaire",
    copy: "Un geste floral précieux, livré à la date choisie.",
  },
];

export function Occasions() {
  return (
    <section id="collections" className="bg-champagne/50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-xs tracking-[0.32em] text-burgundy uppercase">Occasions</p>
        <h2 className="mt-4 max-w-xl font-serif text-4xl text-ink sm:text-5xl">
          Offrir des fleurs, comme un rituel.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {occasions.map((occasion) => (
            <article
              key={occasion.title}
              className="rounded-[1.5rem] border border-burgundy/10 bg-ivory/70 px-8 py-10 transition-colors hover:border-blush"
            >
              <h3 className="font-serif text-2xl text-burgundy">{occasion.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/70">{occasion.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
