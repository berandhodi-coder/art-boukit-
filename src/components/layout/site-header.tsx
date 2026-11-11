"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

const navItems = [
  { href: "/#collections", label: "Collections" },
  { href: "/bouquets", label: "Bouquets" },
  { href: "/#livraison", label: "Livraison" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const { totalItems, isLoaded, openCart } = useCart();
  const displayCount = isLoaded ? totalItems : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-burgundy/10 bg-ivory/85 backdrop-blur-md">
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
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-[0.12em] text-ink/80 uppercase transition-colors hover:text-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs tracking-[0.16em] text-ink/60 uppercase sm:inline">
            Paiement à la livraison
          </span>
          <button
            type="button"
            onClick={openCart}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-burgundy/25 bg-white/60 px-4 text-xs tracking-[0.14em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-white"
            aria-label={`Ouvrir le panier, ${displayCount} articles`}
          >
            <span>Panier</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1.5 text-[0.65rem] font-bold text-ivory">
              {displayCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
