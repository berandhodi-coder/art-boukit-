import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";

export const metadata: Metadata = {
  title: "Catalogue de Bouquets | Art Bouquet Maroc",
  description:
    "Découvrez l'ensemble de notre collection florale au Maroc. Roses de jardin, pivoines d'exception et compositions saisonnières. Livraison soignée et paiement à la livraison.",
};

export default function BouquetsPage() {
  const products = getAllProducts();
  const categories = getCategories();

  return (
    <div className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs tracking-[0.34em] text-burgundy uppercase">
            Maison florale · Catalogue
          </p>
          <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">
            Notre Collection Florale
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/70">
            Chaque bouquet est une composition singulière, confectionnée avec des
            tiges fraîches sélectionnées à maturité. Explorez nos créations et
            commandez pour une livraison soignée dans les grandes villes du Maroc.
          </p>
        </div>

        {/* Catalog Browser (Filter, Search, Grid) */}
        <CatalogBrowser products={products} categories={categories} />
      </div>
    </div>
  );
}
