"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CloseIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/ui/icons";
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
          className: "border-sage/50 bg-ivory/95 text-ink",
        };
      case "limited":
        return {
          label: "Édition limitée",
          className: "border-gold/70 bg-ivory/95 text-burgundy",
        };
      case "seasonal":
        return {
          label: "De saison",
          className: "border-burgundy/25 bg-ivory/95 text-burgundy",
        };
    }
  };

  return (
    <div className="space-y-12">
      {/* Editorial Service Note */}
      <div className="border border-gold/55 bg-champagne/30 px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-4">
          <SparkIcon className="mt-1 h-3 w-3 shrink-0 text-gold" />
          <div>
            <p className="text-[0.6875rem] tracking-[0.24em] text-burgundy uppercase">
              Maison Art Bouquet · Prix en MAD
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/75">
              Tarifs en dirhams marocains. Règlement exclusivement en espèces à la livraison.
            </p>
          </div>
        </div>
        <p className="mt-3 shrink-0 border-t border-burgundy/10 pt-3 text-[0.625rem] tracking-[0.24em] text-burgundy uppercase sm:mt-0 sm:border-t-0 sm:pt-0">
          Casablanca · Rabat · Marrakech · Tanger
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Rechercher un bouquet
            </label>
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une création, rose, pivoine..."
              className="w-full rounded-full border border-burgundy/20 bg-white/75 py-3 pr-11 pl-5 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-burgundy focus:bg-white focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Effacer la recherche"
                className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-full p-1 text-ink/50 transition-colors hover:text-burgundy"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-burgundy/55"
              >
                <SearchIcon className="h-4 w-4" />
              </span>
            )}
          </div>

          <p className="text-[0.6875rem] tracking-[0.22em] text-ink/60 uppercase">
            {filteredProducts.length}{" "}
            {filteredProducts.length > 1 ? "créations disponibles" : "création disponible"}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtrer par catégorie">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`rounded-full px-5 py-2 text-[0.6875rem] tracking-[0.18em] uppercase transition-colors duration-300 ${
                  isActive
                    ? "bg-burgundy text-ivory"
                    : "border border-burgundy/20 bg-transparent text-ink/75 hover:border-burgundy hover:text-burgundy"
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
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const badge = getAvailabilityBadge(product.availability);
            return (
              <li key={product.id}>
                <Link href={`/bouquets/${product.slug}`} className="group block">
                  <div className="flex items-baseline justify-between pb-3.5">
                    <span className="font-serif text-lg text-gold italic">
                      N° {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.625rem] tracking-[0.26em] text-ink/55 uppercase">
                      {product.category}
                    </span>
                  </div>

                  <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/75"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`border px-3 py-1 text-[0.6rem] tracking-[0.18em] uppercase ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-burgundy px-5 py-4 text-[0.625rem] tracking-[0.24em] text-ivory uppercase transition-transform duration-700 ease-luxe group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      Découvrir le bouquet
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[1.75rem] leading-tight text-ink transition-colors duration-500 group-hover:text-burgundy">
                        {product.name}
                      </h3>
                      <span className="shrink-0 text-[0.625rem] tracking-[0.18em] text-ink/50 uppercase">
                        {product.stemsCount} tiges
                      </span>
                    </div>
                    <p className="mt-1.5 font-serif text-lg leading-snug text-ink/60 italic">
                      {product.subtitle}
                    </p>
                    <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-ink/65">
                      {product.description}
                    </p>
                    <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-burgundy/15 pt-4">
                      <p className="text-sm tracking-[0.12em] text-burgundy">
                        {formatMad(product.priceMad)}
                      </p>
                      <p className="text-[0.625rem] tracking-[0.18em] text-ink/50 uppercase">
                        Paiement à la livraison
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border border-gold/60 p-2">
          <div className="border border-burgundy/15 bg-champagne/25 px-6 py-16 text-center">
            <SparkIcon className="mx-auto h-4 w-4 text-gold" />
            <h3 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">
              Aucun bouquet ne correspond à votre recherche
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink/70">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}" dans la catégorie "${selectedCategory}". Essayez un autre terme ou réinitialisez les filtres.`
                : `Aucun bouquet trouvé dans la catégorie "${selectedCategory}".`}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-burgundy px-8 py-3.5 text-xs tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-burgundy-deep"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
