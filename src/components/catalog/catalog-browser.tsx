"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductCategory } from "@/lib/products";
import { formatMad } from "@/lib/format-price";

interface CatalogBrowserProps {
  products: Product[];
  categories: ProductCategory[];
}

export function CatalogBrowser({ products, categories }: CatalogBrowserProps) {
  const searchInputId = useId();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Tous" || product.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory("Tous");
    setSearchQuery("");
  };

  const getAvailabilityBadge = (availability: Product["availability"]) => {
    switch (availability) {
      case "in_stock":
        return {
          label: "En stock",
          className: "bg-emerald-950/10 text-emerald-900 border-emerald-900/20",
        };
      case "limited":
        return {
          label: "Édition limitée",
          className: "bg-amber-950/10 text-amber-900 border-amber-900/20",
        };
      case "seasonal":
        return {
          label: "De saison",
          className: "bg-rose-950/10 text-burgundy border-burgundy/20",
        };
    }
  };

  return (
    <div className="space-y-12">
      {/* Demo Notice Banner */}
      <div className="rounded-2xl border border-burgundy/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:flex sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-xs font-semibold text-burgundy">
            i
          </span>
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-burgundy uppercase">
              Catalogue de démonstration
            </p>
            <p className="mt-1 text-xs leading-5 text-ink/75 sm:text-sm">
              Présentation du catalogue Art Bouquet. Prix en MAD (Dirham marocain). Règlement exclusivement en espèces à la livraison.
            </p>
          </div>
        </div>
        <div className="mt-3 shrink-0 sm:mt-0">
          <span className="inline-block rounded-full bg-burgundy/10 px-3.5 py-1 text-[0.65rem] tracking-[0.16em] text-burgundy uppercase">
            Maroc · Casablanca, Rabat, Marrakech, Tanger
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor={searchInputId} className="sr-only">
              Rechercher un bouquet
            </label>
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une création, rose, pivoine..."
              className="w-full rounded-full border border-burgundy/20 bg-white px-5 py-3 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Effacer la recherche"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-xs text-ink/40 hover:text-ink"
              >
                ✕
              </button>
            ) : (
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-ink/40">
                🔍
              </span>
            )}
          </div>

          {/* Result Count */}
          <p className="text-xs tracking-[0.16em] text-ink/60 uppercase">
            {filteredProducts.length}{" "}
            {filteredProducts.length > 1 ? "créations disponibles" : "création disponible"}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-xs tracking-[0.14em] uppercase transition-all ${
                  isActive
                    ? "bg-burgundy text-ivory shadow-sm"
                    : "border border-burgundy/15 bg-white/60 text-ink/70 hover:border-burgundy/40 hover:bg-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const badge = getAvailabilityBadge(product.availability);
            return (
              <li
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-[0_24px_60px_-40px_rgba(75,18,36,0.55)] transition-transform duration-500 hover:-translate-y-1"
              >
                <Link href={`/bouquets/${product.slug}`} className="flex h-full flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-champagne/30">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="rounded-full bg-ivory/95 px-3 py-1 text-[0.65rem] tracking-[0.18em] text-burgundy uppercase backdrop-blur-sm shadow-xs">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-[0.65rem] tracking-[0.14em] uppercase backdrop-blur-sm ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-burgundy">
                        {product.name}
                      </h3>
                      <p className="text-xs font-medium tracking-wide text-burgundy/90">
                        {product.subtitle}
                      </p>
                      <p className="line-clamp-2 text-xs leading-5 text-ink/65">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-burgundy/10 pt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-2xl font-semibold text-burgundy">
                          {formatMad(product.priceMad)}
                        </span>
                        <span className="text-[0.65rem] tracking-[0.14em] text-ink/45 uppercase">
                          {product.stemsCount} tiges
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[0.65rem] tracking-[0.14em] text-ink/50 uppercase">
                        <span>Paiement à la livraison</span>
                        <span className="text-burgundy group-hover:underline">Voir détails →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-burgundy/15 bg-white/80 px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/10 text-2xl">
            🌸
          </div>
          <h3 className="mt-4 font-serif text-2xl text-ink sm:text-3xl">
            Aucun bouquet ne correspond à votre recherche
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/70">
            {searchQuery
              ? `Aucun résultat pour "${searchQuery}" dans la catégorie "${selectedCategory}". Essayez un autre terme ou réinitialisez les filtres.`
              : `Aucun bouquet trouvé dans la catégorie "${selectedCategory}".`}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-burgundy px-7 py-3 text-xs tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
