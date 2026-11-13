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
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-24">
        <div className="mb-14 grid gap-8 border-b border-burgundy/15 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-4 text-burgundy">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              Maison florale · Catalogue
            </p>
            <h1 className="mt-6 text-5xl leading-[0.95] font-light tracking-[-0.015em] text-ink sm:text-6xl lg:text-7xl">
              Notre Collection <em className="text-burgundy">Florale</em>
            </h1>
          </div>
          <p className="max-w-md text-base leading-8 text-ink/70 lg:justify-self-end">
            Chaque bouquet est une composition singulière, confectionnée avec des
            tiges fraîches sélectionnées à maturité. Explorez nos créations et
            commandez pour une livraison soignée au Maroc.
          </p>
        </div>

        <CatalogBrowser products={products} categories={categories} />
      </div>
    </div>
  );
}
