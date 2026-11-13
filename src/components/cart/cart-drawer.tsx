"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BanknoteIcon,
  CloseIcon,
  SparkIcon,
} from "@/components/ui/icons";
import { useCart } from "@/context/cart-context";
import { formatMad } from "@/lib/format-price";

export function CartDrawer() {
  const {
    items,
    totalItems,
    subtotalMad,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press and manage focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-ink/55 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-over panel container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col border-l border-burgundy/15 bg-ivory shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-burgundy/15 bg-ivory px-6 py-5">
            <div className="flex items-baseline gap-3">
              <h2
                id="cart-drawer-heading"
                className="font-serif text-3xl font-light text-ink"
              >
                Mon Panier
              </h2>
              {totalItems > 0 && (
                <span className="border border-burgundy/25 px-2.5 py-0.5 text-[0.625rem] tracking-[0.18em] text-burgundy uppercase">
                  {totalItems} {totalItems > 1 ? "articles" : "article"}
                </span>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              aria-label="Fermer le panier"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/20 text-burgundy transition-colors hover:border-burgundy hover:bg-burgundy hover:text-ivory"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <SparkIcon className="h-4 w-4 text-gold" />
                <h3 className="mt-5 font-serif text-3xl font-light text-ink">
                  Votre panier est vide
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-7 text-ink/70">
                  Découvrez nos créations florales d’exception composées avec soin et livrées au Maroc.
                </p>
                <Link
                  href="/bouquets"
                  onClick={closeCart}
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-burgundy px-7 py-3.5 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
                >
                  Explorer les bouquets
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-burgundy/10 pb-3">
                  <p className="text-[0.625rem] tracking-[0.22em] text-ink/60 uppercase">
                    Articles sélectionnés
                  </p>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="link-underline text-[0.6875rem] tracking-[0.12em] text-burgundy/80 uppercase hover:text-burgundy"
                  >
                    Vider le panier
                  </button>
                </div>

                <ul className="divide-y divide-burgundy/15">
                  {items.map(({ product, quantity, lineTotalMad }) => (
                    <li key={product.id} className="flex gap-4 py-5">
                      <Link
                        href={`/bouquets/${product.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden border border-burgundy/10 bg-champagne"
                      >
                        <Image
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          fill
                          referrerPolicy="no-referrer"
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/bouquets/${product.slug}`}
                              onClick={closeCart}
                              className="font-serif text-xl text-ink transition-colors hover:text-burgundy"
                            >
                              {product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              aria-label={`Supprimer ${product.name} du panier`}
                              className="p-1 text-ink/45 transition-colors hover:text-burgundy"
                            >
                              <CloseIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-ink/55">
                            {formatMad(product.priceMad)} / unité
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-burgundy/20 bg-white/80 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label={`Diminuer la quantité de ${product.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-ink transition-colors hover:bg-burgundy hover:text-ivory"
                            >
                              –
                            </button>
                            <span className="w-8 text-center font-serif text-sm text-ink">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= 10}
                              aria-label={`Augmenter la quantité de ${product.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs text-ink transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-serif text-lg text-burgundy">
                            {formatMad(lineTotalMad)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-burgundy/15 bg-champagne/35 p-6">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.6875rem] tracking-[0.2em] text-ink/70 uppercase">
                    Sous-total ({totalItems} {totalItems > 1 ? "articles" : "article"})
                  </span>
                  <span className="font-serif text-2xl text-burgundy">
                    {formatMad(subtotalMad)}
                  </span>
                </div>
                <p className="text-xs leading-5 text-ink/60">
                  Frais de livraison confirmés à l’étape suivante selon la ville (Casablanca, Rabat, Marrakech, Tanger...).
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-burgundy py-3.5 text-center text-xs tracking-[0.2em] text-ivory uppercase transition-colors duration-500 hover:bg-burgundy-deep"
                >
                  Passer la commande
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <p className="flex items-center justify-center gap-2 text-[0.6875rem] tracking-[0.14em] text-burgundy uppercase">
                  <BanknoteIcon className="h-3.5 w-3.5" />
                  Règlement en espèces à la livraison
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
