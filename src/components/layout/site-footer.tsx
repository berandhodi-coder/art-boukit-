import Link from "next/link";

const houseLinks = [
  { href: "/#collections", label: "Collections" },
  { href: "/bouquets", label: "Bouquets" },
  { href: "/#livraison", label: "Livraison au Maroc" },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="overflow-hidden bg-burgundy-deep text-ivory">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-10 lg:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <p className="eyebrow flex items-center gap-4 text-gold">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              Maison florale · Maroc
            </p>
            <p className="mt-7 max-w-sm font-serif text-2xl leading-snug font-light text-ivory/90 sm:text-3xl">
              Maison florale marocaine. Compositions d’exception livrées à
              domicile, règlement à la livraison en dirhams.
            </p>
          </div>

          <div>
            <p className="eyebrow text-rose">Maison</p>
            <ul className="mt-6 space-y-4 text-sm text-ivory/80">
              {houseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline transition-colors duration-500 hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-rose">Informations</p>
            <ul className="mt-6 space-y-4 text-sm text-ivory/80">
              <li>Politique de confidentialité — bientôt</li>
              <li>Politique de livraison — bientôt</li>
              <li>Conditions générales — bientôt</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 text-center font-serif text-[17.5vw] leading-[0.8] font-light tracking-[-0.02em] whitespace-nowrap text-ivory/95 lg:mt-28 xl:text-[14.5rem]"
        >
          Art <em className="text-rose">Bouquet</em>
        </p>
      </div>

      <div className="relative border-t border-ivory/15 bg-burgundy-deep">
        <p className="mx-auto max-w-7xl px-6 py-6 text-[0.6875rem] tracking-[0.16em] text-ivory/60 sm:px-10">
          © 2026 Art Bouquet · Tous les prix sont en MAD · Pas de paiement en ligne
        </p>
      </div>
    </footer>
  );
}
