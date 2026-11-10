import Link from "next/link";

const navItems = [
  { href: "#collections", label: "Collections" },
  { href: "#bouquets", label: "Bouquets" },
  { href: "#livraison", label: "Livraison" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-burgundy/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-xl tracking-[0.22em] text-burgundy uppercase">
            Art Bouquet
          </span>
          <span className="mt-1 text-[0.65rem] tracking-[0.28em] text-ink/55 uppercase">
            Maroc
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-[0.12em] text-ink/80 uppercase transition-colors hover:text-burgundy"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs tracking-[0.16em] text-ink/60 uppercase sm:inline">
            Paiement à la livraison
          </span>
          <span
            className="inline-flex h-10 items-center rounded-full border border-burgundy/20 px-4 text-xs tracking-[0.14em] text-burgundy uppercase"
            aria-label="Panier vide — bientôt disponible"
          >
            Panier · 0
          </span>
        </div>
      </div>
    </header>
  );
}
