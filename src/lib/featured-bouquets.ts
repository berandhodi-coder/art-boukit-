import { getFeaturedProducts, type Product } from "./products";

export type FeaturedBouquet = Product;

export const featuredBouquets: FeaturedBouquet[] = getFeaturedProducts();
