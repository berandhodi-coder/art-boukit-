import type { Metadata } from "next";
import { Suspense } from "react";
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
import { ArrowRightIcon, SparkIcon } from "@/components/ui/icons";

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

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
          className: "border-sage/55 bg-ivory/95 text-ink",
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

  const badge = getAvailabilityBadge(product.availability);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-20">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-12 text-[0.6875rem] tracking-[0.22em] text-ink/55 uppercase"
        >
          <ol className="flex flex-wrap items-center gap-2.5">
            <li>
              <Link href="/" className="transition-colors hover:text-burgundy">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true" className="text-gold">
              /
            </li>
            <li>
              <Link href="/bouquets" className="transition-colors hover:text-burgundy">
                Bouquets
              </Link>
            </li>
            <li aria-hidden="true" className="text-gold">
              /
            </li>
            <li className="max-w-[220px] truncate text-burgundy sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Visual Presentation */}
          <div className="space-y-8">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/60 sm:translate-x-4 sm:translate-y-4"
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                  <span className="bg-ivory/95 px-3.5 py-1.5 text-[0.625rem] tracking-[0.22em] text-burgundy uppercase">
                    {product.category}
                  </span>
                  <span
                    className={`border px-3.5 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-burgundy/15 bg-champagne/30 p-5">
                <p className="text-[0.625rem] tracking-[0.22em] text-ink/55 uppercase">
                  Tiges florales
                </p>
                <p className="mt-2 font-serif text-2xl font-light text-ink">
                  {product.stemsCount} tiges fraîches
                </p>
              </div>
              <div className="border border-burgundy/15 bg-champagne/30 p-5">
                <p className="text-[0.625rem] tracking-[0.22em] text-ink/55 uppercase">
                  Envergure
                </p>
                <p className="mt-2 font-serif text-2xl font-light text-ink">
                  {product.dimensions || "Format Standard"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Order Action */}
          <div className="space-y-8">
            <div>
              <p className="eyebrow flex items-center gap-4 text-burgundy">
                <span aria-hidden="true" className="h-px w-10 bg-gold" />
                Création florale · {product.category}
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.98] font-light text-ink sm:text-6xl">
                {product.name}
              </h1>
              <p className="mt-3 font-serif text-xl text-burgundy/90 italic sm:text-2xl">
                {product.subtitle}
              </p>
              <p className="mt-6 text-base leading-8 text-ink/75">
                {product.description}
              </p>
            </div>

            {/* Composition Details */}
            <div className="border border-burgundy/15 bg-champagne/25 p-6 sm:p-7">
              <h2 className="font-serif text-2xl font-light text-ink">
                Composition de la création
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-ink/75">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <SparkIcon className="mt-1.5 h-2.5 w-2.5 shrink-0 text-gold" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ProductOrderBox product={product} />
          </div>
        </div>

        {/* Care Tips Section */}
        <section className="mt-24 border-y border-burgundy/15 bg-champagne/30 px-7 py-12 sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-4 text-burgundy">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              Entretien
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light text-ink sm:text-4xl">
              Prolonger l’éclat de <em className="text-burgundy">vos fleurs</em>
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              Nos fleuristes vous conseillent pour faire durer la beauté de votre création chez vous.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {product.careTips.map((tip, index) => (
              <div
                key={index}
                className="border border-burgundy/15 bg-ivory/85 p-6"
              >
                <span className="font-serif text-2xl text-gold italic">
                  0{index + 1}.
                </span>
                <p className="mt-4 text-sm leading-7 text-ink/75">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow flex items-center gap-4 text-burgundy">
                  <span aria-hidden="true" className="h-px w-10 bg-gold" />
                  Suggestions
                </p>
                <h2 className="mt-5 font-serif text-4xl font-light text-ink sm:text-5xl">
                  Vous aimerez <em className="text-burgundy">aussi</em>
                </h2>
              </div>
              <Link
                href="/bouquets"
                className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] text-burgundy uppercase"
              >
                <span className="link-underline-static">Voir tout le catalogue</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {relatedProducts.map((rel, index) => (
                <Link
                  key={rel.id}
                  href={`/bouquets/${rel.slug}`}
                  className="group block"
                >
                  <div className="flex items-baseline justify-between pb-3">
                    <span className="font-serif text-base text-gold italic">
                      N° {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.625rem] tracking-[0.24em] text-ink/55 uppercase">
                      {rel.category}
                    </span>
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
                    <Image
                      src={rel.imageSrc}
                      alt={rel.imageAlt}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/75"
                    />
                  </div>
                  <div className="pt-5">
                    <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-burgundy">
                      {rel.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between border-t border-burgundy/15 pt-3.5">
                      <span className="text-sm tracking-[0.12em] text-burgundy">
                        {formatMad(rel.priceMad)}
                      </span>
                      <span className="inline-flex items-center gap-2 text-[0.625rem] tracking-[0.2em] text-ink/55 uppercase transition-colors group-hover:text-burgundy">
                        Découvrir
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage(props: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory px-6 py-24 text-center sm:px-10">
          <SparkIcon className="mx-auto h-5 w-5 text-gold" />
          <p className="mt-4 font-serif text-2xl font-light text-ink">
            Chargement de la création florale...
          </p>
        </div>
      }
    >
      <ProductDetailContent params={props.params} />
    </Suspense>
  );
}
