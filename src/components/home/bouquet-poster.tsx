import Image from "next/image";

export function BouquetPoster() {
  return (
    <div className="absolute inset-[8%]">
      <Image
        src="/images/hero-bouquet.jpg"
        alt="Bouquet rond de roses bordeaux, rose poudré et ivoire, noué d’un ruban champagne"
        fill
        sizes="(max-width: 1024px) 80vw, 34rem"
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
}
