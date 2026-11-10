import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1457083328127-435ca63e0b0f?auto=format&fit=crop&w=2000&q=80"
        alt="Composition florale luxueuse sur fond clair"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ivory/92 via-ivory/70 to-burgundy/25" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-24">
        <p className="text-xs tracking-[0.38em] text-burgundy uppercase">
          Maison florale · Maroc
        </p>
        <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
          Des fleurs comme un écrin.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-8 text-ink/75 sm:text-lg">
          Art Bouquet compose des bouquets raffinés, photographiés avec soin et
          livrés dans les principales villes du Maroc. Prix en dirhams, paiement
          uniquement à la livraison.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#bouquets"
            className="rounded-full bg-burgundy px-8 py-3.5 text-sm tracking-[0.16em] text-ivory uppercase transition-all hover:bg-burgundy-deep"
          >
            Découvrir les bouquets
          </a>
          <a
            href="#livraison"
            className="rounded-full border border-burgundy/30 px-8 py-3.5 text-sm tracking-[0.16em] text-burgundy uppercase transition-colors hover:border-burgundy hover:bg-ivory/60"
          >
            Livraison au Maroc
          </a>
        </div>
      </div>
    </section>
  );
}
