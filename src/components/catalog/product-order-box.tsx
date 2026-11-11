"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatMad } from "@/lib/format-price";
import { useCart } from "@/context/cart-context";

interface ProductOrderBoxProps {
  product: Product;
}

export function ProductOrderBox({ product }: ProductOrderBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const { addItem, openCart } = useCart();

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    setAddedNotice(null);
  };

  const increase = () => {
    setQuantity((prev) => Math.min(10, prev + 1));
    setAddedNotice(null);
  };

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    const total = product.priceMad * quantity;
    setAddedNotice(
      `${quantity} × "${product.name}" (${formatMad(total)}) ajouté${quantity > 1 ? "s" : ""} au panier.`
    );
  };

  const totalPrice = product.priceMad * quantity;

  return (
    <div className="rounded-3xl border border-burgundy/15 bg-white p-6 shadow-md sm:p-8">
      {/* Price & Summary */}
      <div className="flex items-baseline justify-between border-b border-burgundy/10 pb-6">
        <div>
          <p className="text-xs tracking-[0.18em] text-ink/50 uppercase">Prix unitaire</p>
          <p className="font-serif text-3xl font-semibold text-burgundy sm:text-4xl">
            {formatMad(product.priceMad)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-[0.16em] text-ink/50 uppercase">Total calculé</p>
          <p className="font-serif text-2xl text-ink sm:text-3xl">
            {formatMad(totalPrice)}
          </p>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <label htmlFor="quantity-selector" className="text-xs tracking-[0.18em] text-ink/70 uppercase">
            Quantité
          </label>
          <p className="text-[0.7rem] text-ink/45">Maximum 10 bouquets par commande</p>
        </div>

        <div className="flex items-center rounded-full border border-burgundy/20 bg-ivory/50 p-1">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base font-semibold text-ink shadow-xs transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
          >
            –
          </button>
          <span
            id="quantity-selector"
            className="w-12 text-center font-serif text-lg font-semibold text-ink"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            disabled={quantity >= 10}
            aria-label="Augmenter la quantité"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base font-semibold text-ink shadow-xs transition-colors hover:bg-burgundy hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-full bg-burgundy py-4 text-xs tracking-[0.2em] text-ivory uppercase shadow-md transition-all hover:bg-burgundy-deep hover:shadow-lg active:scale-[0.99]"
        >
          Ajouter au panier · {formatMad(totalPrice)}
        </button>

        <p className="text-center text-[0.7rem] tracking-[0.12em] text-ink/55 uppercase">
          💵 Règlement uniquement à la livraison (Cash on Delivery)
        </p>
      </div>

      {/* Feedback Toast Box */}
      {addedNotice && (
        <div
          role="status"
          className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-900/20 bg-emerald-950/5 p-4 text-xs leading-5 text-emerald-950 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base text-emerald-800">✓</span>
            <span className="font-medium">{addedNotice}</span>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="shrink-0 rounded-full bg-burgundy px-4 py-1.5 text-[0.7rem] tracking-[0.14em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
          >
            Voir le panier →
          </button>
        </div>
      )}

      {/* Moroccan Delivery Guarantees */}
      <div className="mt-8 space-y-3 border-t border-burgundy/10 pt-6 text-xs text-ink/75">
        <div className="flex items-center gap-3">
          <span className="text-base text-burgundy">📍</span>
          <span>Livraison disponible à Casablanca, Rabat, Marrakech et Tanger.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-burgundy">📦</span>
          <span>Tiges protégées par réserve d’eau lors du transport.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-burgundy">💌</span>
          <span>Carte avec message manuscrit offerte sur demande.</span>
        </div>
      </div>
    </div>
  );
}
