import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { formatMad } from "@/lib/format-price";
import { ProductOrderBox } from "@/components/catalog/product-order-box";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Bouquet non trouvé | Art Bouquet Maroc",
    };
  }

  return {
    title: `${product.name} | Art Bouquet Maroc`,
    description: `${product.name} - ${product.subtitle}. ${product.description} Prix: ${formatMad(product.priceMad)}. Livraison soignée au Maroc, paiement à la livraison.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.slug, 3);

  const getAvailabilityBadge = (availability: typeof product.availability) => {
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

  const badge = getAvailabilityBadge(product.availability);

  return (
    <div className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Fil d'Ariane" className="mb-10 text-xs tracking-[0.14em] uppercase text-ink/60">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-burgundy transition-colors">
                Accueil
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/bouquets" className="hover:text-burgundy transition-colors">
                Bouquets
              </Link>
            </li>
            <li>/</li>
            <li className="text-burgundy font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column: Visual Presentation */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-burgundy/15 bg-white shadow-xl">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="rounded-full bg-ivory/95 px-4 py-1.5 text-[0.7rem] tracking-[0.2em] text-burgundy uppercase backdrop-blur-md shadow-sm">
                  {product.category}
                </span>
                <span
                  className={`rounded-full border px-4 py-1.5 text-[0.7rem] tracking-[0.16em] uppercase backdrop-blur-md ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-burgundy/10 bg-white/70 p-4">
                <p className="text-[0.65rem] tracking-[0.18em] text-ink/50 uppercase">Tiges florales</p>
                <p className="mt-1 font-serif text-xl font-medium text-ink">
                  {product.stemsCount} tiges fraîches
                </p>
              </div>
              <div className="rounded-2xl border border-burgundy/10 bg-white/70 p-4">
                <p className="text-[0.65rem] tracking-[0.18em] text-ink/50 uppercase">Envergure</p>
                <p className="mt-1 font-serif text-xl font-medium text-ink">
                  {product.dimensions || "Format Standard"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Order Action */}
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-[0.32em] text-burgundy uppercase">
                Création florale · {product.category}
              </p>
              <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
              <p className="mt-2 text-base font-serif italic text-burgundy/90 sm:text-lg">
                {product.subtitle}
              </p>
              <p className="mt-5 text-base leading-7 text-ink/75">
                {product.description}
              </p>
            </div>

            {/* Composition Details */}
            <div className="rounded-3xl border border-burgundy/10 bg-white/60 p-6 sm:p-7">
              <h2 className="font-serif text-xl text-ink">
                Composition de la création
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-xs text-burgundy">✦</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Box Component with Quantity & Demo Add-to-cart */}
            <ProductOrderBox product={product} />
          </div>
        </div>

        {/* Care Tips Section */}
        <div className="mt-20 rounded-[2rem] border border-burgundy/10 bg-champagne/30 p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-burgundy uppercase">Entretien</p>
            <h2 className="mt-2 font-serif text-3xl text-ink">
              Prolonger l’éclat de vos fleurs
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Nos fleuristes vous conseillent pour faire durer la beauté de votre création chez vous.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {product.careTips.map((tip, index) => (
              <div
                key={index}
                className="rounded-2xl border border-burgundy/10 bg-ivory/80 p-6"
              >
                <span className="font-serif text-2xl text-burgundy">0{index + 1}</span>
                <p className="mt-3 text-sm leading-6 text-ink/75">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.32em] text-burgundy uppercase">Suggestions</p>
                <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                  Vous aimerez aussi
                </h2>
              </div>
              <Link
                href="/bouquets"
                className="text-xs tracking-[0.16em] text-burgundy uppercase hover:underline"
              >
                Voir tout →
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/bouquets/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-burgundy/10 bg-white transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-champagne/30">
                    <Image
                      src={rel.imageSrc}
                      alt={rel.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-ivory/95 px-3 py-1 text-[0.65rem] tracking-[0.16em] text-burgundy uppercase shadow-xs">
                        {rel.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-ink transition-colors group-hover:text-burgundy">
                      {rel.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between border-t border-burgundy/10 pt-3">
                      <span className="font-serif text-lg text-burgundy">
                        {formatMad(rel.priceMad)}
                      </span>
                      <span className="text-[0.65rem] tracking-[0.12em] text-ink/40 uppercase">
                        Détails →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
