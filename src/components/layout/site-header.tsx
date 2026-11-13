"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";

const navItems = [
  { href: "/#collections", label: "Collections" },
  { href: "/bouquets", label: "Bouquets" },
  { href: "/#livraison", label: "Livraison" },
  { href: "/#contact", label: "Contact" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex flex-col items-center leading-none"
    >
      <span className="font-serif text-[1.35rem] tracking-[0.3em] text-burgundy uppercase sm:text-2xl">
        Art Bouquet
      </span>
      <span className="mt-1.5 flex items-center gap-2.5 text-[0.5625rem] tracking-[0.42em] text-ink/55 uppercase">
        <span aria-hidden="true" className="h-px w-5 bg-gold" />
        Maroc
        <span aria-hidden="true" className="h-px w-5 bg-gold" />
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { totalItems, isLoaded, openCart } = useCart();
  const displayCount = isLoaded ? totalItems : 0;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <p className="bg-burgundy px-4 py-2.5 text-center text-[0.625rem] tracking-[0.28em] text-ivory uppercase">
        Paiement à la livraison
        <span aria-hidden="true" className="mx-3 text-gold">
          ·
        </span>
        Prix en dirhams
        <span className="hidden sm:inline">
          <span aria-hidden="true" className="mx-3 text-gold">
            ·
          </span>
          Livraison dans les principales villes du Maroc
        </span>
      </p>

      <header className="sticky top-0 z-40 border-b border-burgundy/10 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-10">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="-ml-2 flex h-10 w-10 items-center justify-center text-burgundy lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <nav
              aria-label="Navigation principale"
              className="hidden items-center gap-9 lg:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-underline text-[0.6875rem] tracking-[0.22em] text-ink/80 uppercase transition-colors duration-500 hover:text-burgundy"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Wordmark />

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={openCart}
              className="group inline-flex h-10 items-center gap-3 text-[0.6875rem] tracking-[0.22em] text-burgundy uppercase"
              aria-label={`Ouvrir le panier, ${displayCount} articles`}
            >
              <span className="link-underline hidden sm:inline">Panier</span>
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-burgundy/30 px-1.5 text-[0.6875rem] tracking-normal transition-colors duration-500 group-hover:border-burgundy group-hover:bg-burgundy group-hover:text-ivory">
                {displayCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex animate-fade flex-col bg-ivory [animation-duration:400ms] lg:hidden"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-burgundy/10 px-5 py-4 sm:px-10">
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fermer le menu"
              autoFocus
              className="-ml-2 flex h-10 w-10 items-center justify-center text-burgundy"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            <Wordmark onClick={closeMenu} />
            <span />
          </div>

          <nav
            aria-label="Navigation mobile"
            className="flex flex-1 flex-col justify-center px-8"
          >
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-rise border-b border-burgundy/10"
                  style={{ animationDelay: `${80 + index * 70}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-baseline gap-5 py-5"
                  >
                    <span className="font-serif text-base text-gold italic">
                      0{index + 1}
                    </span>
                    <span className="font-serif text-5xl font-light text-ink">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="px-8 pb-10 text-[0.625rem] tracking-[0.28em] text-ink/55 uppercase">
            Paiement à la livraison · Prix en dirhams
          </p>
        </div>
      )}
    </>
  );
}
