export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-burgundy/10 bg-burgundy text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.18em] uppercase">Art Bouquet</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-ivory/75">
            Maison florale marocaine. Compositions d’exception livrées à domicile,
            règlement à la livraison en dirhams.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-blush uppercase">Maison</p>
          <ul className="mt-4 space-y-3 text-sm text-ivory/80">
            <li>
              <a href="#collections" className="transition-colors hover:text-ivory">
                Collections
              </a>
            </li>
            <li>
              <a href="#bouquets" className="transition-colors hover:text-ivory">
                Bouquets
              </a>
            </li>
            <li>
              <a href="#livraison" className="transition-colors hover:text-ivory">
                Livraison au Maroc
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.22em] text-blush uppercase">Informations</p>
          <ul className="mt-4 space-y-3 text-sm text-ivory/80">
            <li>Politique de confidentialité — bientôt</li>
            <li>Politique de livraison — bientôt</li>
            <li>Conditions générales — bientôt</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs tracking-[0.12em] text-ivory/55">
          © 2026 Art Bouquet · Tous les prix sont en MAD · Pas de paiement en ligne
        </p>
      </div>
    </footer>
  );
}
