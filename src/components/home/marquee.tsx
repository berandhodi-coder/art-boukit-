import { SparkIcon } from "@/components/ui/icons";

const phrases = [
  "Paiement à la livraison",
  "Casablanca",
  "Prix en dirhams",
  "Rabat",
  "Tiges fraîches sélectionnées à maturité",
  "Marrakech",
  "Maison florale",
  "Tanger",
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-burgundy/15 py-6">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {phrases.map((phrase) => (
              <li key={phrase} className="flex items-center">
                <span className="px-9 font-serif text-2xl text-burgundy italic sm:text-3xl">
                  {phrase}
                </span>
                <SparkIcon className="h-2.5 w-2.5 text-gold" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
