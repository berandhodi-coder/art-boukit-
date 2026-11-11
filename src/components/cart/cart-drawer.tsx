"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
    // Focus the close button when opened
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // Prevent background scrolling while drawer is open
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
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Slide-over panel container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-ivory shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-burgundy/15 bg-white/80 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <h2
                id="cart-drawer-heading"
                className="font-serif text-2xl font-medium text-ink"
              >
                Mon Panier
              </h2>
              {totalItems > 0 && (
                <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-xs font-semibold text-burgundy">
                  {totalItems} {totalItems > 1 ? "articles" : "article"}
                </span>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              aria-label="Fermer le panier"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/20 text-ink/70 transition-colors hover:border-burgundy hover:bg-burgundy/10 hover:text-burgundy"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              /* Empty Cart State */
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-burgundy/10 text-3xl">
                  🌸
                </div>
                <h3 className="mt-5 font-serif text-2xl text-ink">
                  Votre panier est vide
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-ink/70">
                  Découvrez nos créations florales d’exception composées avec soin et livrées partout au Maroc.
                </p>
                <Link
                  href="/bouquets"
                  onClick={closeCart}
                  className="mt-6 inline-block rounded-full bg-burgundy px-7 py-3 text-xs tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
                >
                  Explorer les bouquets
                </Link>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs tracking-[0.18em] text-ink/60 uppercase">
                    Articles sélectionnés
                  </p>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-burgundy/80 hover:text-burgundy hover:underline"
                  >
                    Vider le panier
                  </button>
                </div>

                <ul className="divide-y divide-burgundy/10">
                  {items.map(({ product, quantity, lineTotalMad }) => (
                    <li key={product.id} className="flex gap-4 py-4">
                      {/* Thumbnail */}
                      <Link
                        href={`/bouquets/${product.slug}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-burgundy/10 bg-champagne/30"
                      >
                        <Image
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      {/* Product Details & Actions */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/bouquets/${product.slug}`}
                              onClick={closeCart}
                              className="font-serif text-lg text-ink transition-colors hover:text-burgundy"
                            >
                              {product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              aria-label={`Supprimer ${product.name} du panier`}
                              className="text-xs text-ink/40 transition-colors hover:text-burgundy"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-xs text-ink/55">
                            {formatMad(product.priceMad)} / unité
                          </p>
                        </div>

                        {/* Quantity Stepper & Line Total */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-burgundy/20 bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label={`Diminuer la quantité de ${product.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-ink transition-colors hover:bg-burgundy hover:text-ivory"
                            >
                              –
                            </button>
                            <span className="w-8 text-center font-serif text-sm font-semibold text-ink">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= 10}
                              aria-label={`Augmenter la quantité de ${product.name}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-ink transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-serif text-lg font-medium text-burgundy">
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

          {/* Footer with Subtotal & Informational Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-burgundy/15 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs tracking-[0.18em] text-ink/70 uppercase">
                    Sous-total ({totalItems} {totalItems > 1 ? "articles" : "article"})
                  </span>
                  <span className="font-serif text-2xl font-semibold text-burgundy">
                    {formatMad(subtotalMad)}
                  </span>
                </div>
                <p className="text-[0.7rem] text-ink/55">
                  Frais de livraison calculés à l’étape suivante selon la ville (Casablanca, Rabat, Marrakech, Tanger...).
                </p>
              </div>

              {/* Active Checkout Action */}
              <div className="mt-5 space-y-2.5">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-burgundy py-3.5 text-center text-xs tracking-[0.2em] text-ivory uppercase shadow-md transition-all hover:bg-burgundy-deep hover:shadow-lg active:scale-[0.99]"
                >
                  Passer la commande · Paiement à la livraison
                </Link>
                <div className="rounded-xl border border-burgundy/15 bg-ivory/80 px-3.5 py-2 text-center text-[0.7rem] text-burgundy">
                  💵 Règlement en espèces à la livraison (Casablanca, Rabat, Marrakech, Tanger...).
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
