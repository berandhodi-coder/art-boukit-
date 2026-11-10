export type FeaturedBouquet = {
  id: string;
  name: string;
  description: string;
  priceMad: number;
  imageSrc: string;
  imageAlt: string;
};

export const featuredBouquets: FeaturedBouquet[] = [
  {
    id: "rose-marrakech",
    name: "Rose de Marrakech",
    description: "Roses garden profondes, eucalyptus et ruban ivoire.",
    priceMad: 450,
    imageSrc:
      "https://images.unsplash.com/photo-1519378058459-4c91b5d0b0a4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet de roses rouges attaché d’un ruban",
  },
  {
    id: "pivoine-ivoire",
    name: "Pivoine Ivoire",
    description: "Pivoines pâles, ranunculus et feuillage velours.",
    priceMad: 620,
    imageSrc:
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet de pivoines claires dans un vase",
  },
  {
    id: "jardin-casablanca",
    name: "Jardin de Casablanca",
    description: "Composition saisonnière, rose poudrée et vert tendre.",
    priceMad: 390,
    imageSrc:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet pastel tenu à la main",
  },
  {
    id: "ecrin-bordeaux",
    name: "Écrin Bordeaux",
    description: "Fleurs d’exception dans une palette bordeaux et champagne.",
    priceMad: 780,
    imageSrc:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet luxueux de roses et de fleurs mixtes",
  },
];
