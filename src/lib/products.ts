export type ProductCategory = "Tous" | "Roses" | "Pivoines" | "Saisonnier" | "Prestige" | "Romance";

export type ProductAvailability = "in_stock" | "limited" | "seasonal";

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  details: string[];
  priceMad: number;
  category: "Roses" | "Pivoines" | "Saisonnier" | "Prestige" | "Romance";
  imageSrc: string;
  imageAlt: string;
  availability: ProductAvailability;
  featured: boolean;
  stemsCount: number;
  dimensions?: string;
  careTips: string[];
};

export const sampleProducts: Product[] = [
  {
    id: "rose-marrakech",
    slug: "rose-marrakech",
    name: "Rose de Marrakech",
    subtitle: "Roses de jardin rubis & eucalyptus frais",
    description: "Roses garden profondes, eucalyptus argenté et ruban de satin ivoire. Une création passionnée inspirée des cours intérieures de la ville ocre.",
    details: [
      "18 à 20 roses rouges de jardin sélectionnées à maturité",
      "Feuillage d'eucalyptus cinerea et olivier délicat",
      "Ruban de satin ivoire cousu main",
      "Livré dans un papier de soie protecteur et sac de transport signature",
    ],
    priceMad: 450,
    category: "Roses",
    imageSrc: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet de roses rouges attaché d’un ruban",
    availability: "in_stock",
    featured: true,
    stemsCount: 24,
    dimensions: "Hauteur ~50cm · Diamètre ~40cm",
    careTips: [
      "Recouper les tiges en biseau de 2 cm tous les deux jours",
      "Remplir le vase d'eau fraîche à température ambiante",
      "Éviter les courants d'air et l'exposition directe au soleil",
    ],
  },
  {
    id: "pivoine-ivoire",
    slug: "pivoine-ivoire",
    name: "Pivoine Ivoire",
    subtitle: "Pivoines immaculées & renoncules blanches",
    description: "Pivoines pâles veloutées, renoncules et feuillage velours. Une symphonie de textures douces pour les moments de pure élégance.",
    details: [
      "12 pivoines blanches d'exception",
      "Renoncules blanches et touches d'astilbe",
      "Feuillage d'eucalyptus populus et branches de coton",
      "Présentation raffinée avec sceau de cire Art Bouquet",
    ],
    priceMad: 620,
    category: "Pivoines",
    imageSrc: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet de pivoines claires dans un vase",
    availability: "limited",
    featured: true,
    stemsCount: 20,
    dimensions: "Hauteur ~45cm · Diamètre ~38cm",
    careTips: [
      "Changer l'eau tous les jours pour préserver la fraîcheur des pétales",
      "Maintenir dans une pièce tempérée",
      "Retirer les feuilles immergées dans l'eau",
    ],
  },
  {
    id: "jardin-casablanca",
    slug: "jardin-casablanca",
    name: "Jardin de Casablanca",
    subtitle: "Pastels romantiques & fleurs champêtres",
    description: "Composition saisonnière aérienne, rose poudrée et vert tendre. Évoque la douceur des jardins côtiers et la lumière de l'Atlantique.",
    details: [
      "Roses spray rose poudré et lisianthus pastel",
      "Fleurs d'hortensia et gypsophile délicat",
      "Tiges de lentisque et graminées sauvages",
      "Emballage biodégradable éco-responsable",
    ],
    priceMad: 390,
    category: "Saisonnier",
    imageSrc: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet pastel tenu à la main",
    availability: "in_stock",
    featured: true,
    stemsCount: 22,
    dimensions: "Hauteur ~48cm · Diamètre ~36cm",
    careTips: [
      "Pulvériser légèrement les fleurs d'une fine brume d'eau le matin",
      "Garder loin des corbeilles de fruits (éthylène)",
    ],
  },
  {
    id: "ecrin-bordeaux",
    slug: "ecrin-bordeaux",
    name: "Écrin Bordeaux",
    subtitle: "Nuances pourpres & roses impériales",
    description: "Fleurs d’exception dans une palette bordeaux et champagne. Une opulence théâtrale taillée pour les célébrations inoubliables.",
    details: [
      "Roses bordeaux velvet et callas pourpres sombres",
      "Orchidées cymbidium bordeaux et touches de champagne",
      "Feuilles de monstera délicatement dorées au pinceau",
      "Livré avec vase céramique artisanal optionnel",
    ],
    priceMad: 780,
    category: "Prestige",
    imageSrc: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet luxueux de roses et de fleurs mixtes",
    availability: "in_stock",
    featured: true,
    stemsCount: 28,
    dimensions: "Hauteur ~55cm · Diamètre ~45cm",
    careTips: [
      "Ajouter le sachet de conservateur floral fourni avec la commande",
      "Vérifier le niveau d'eau quotidiennement",
    ],
  },
  {
    id: "lys-royal",
    slug: "lys-royal",
    name: "Lys Royal de Rabat",
    subtitle: "Majesté florale & senteurs envoûtantes",
    description: "Lys orientaux blancs immaculés aux parfums envoûtants, accompagnés d'œillets champagne et de feuillage architectural.",
    details: [
      "10 hampes de lys orientaux parfumés",
      "Œillets couleur champagne et delphiniums blancs",
      "Tiges de ruscus d'Italie et laurier noble",
      "Finition ruban gros-grain bordeaux",
    ],
    priceMad: 850,
    category: "Prestige",
    imageSrc: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet majestueux de lys blancs et de verdure",
    availability: "in_stock",
    featured: false,
    stemsCount: 26,
    dimensions: "Hauteur ~65cm · Diamètre ~50cm",
    careTips: [
      "Retirer les étamines au fur et à mesure de l'ouverture pour éviter les taches de pollen",
      "Couper régulièrement la base des tiges",
    ],
  },
  {
    id: "douceur-agadir",
    slug: "douceur-agadir",
    name: "Douceur d’Agadir",
    subtitle: "Chaleur solaire & teintes ambrées",
    description: "Bouquet baigné de lumière mêlant roses pêche, germinis dorés et feuillage d'arganier. Un rayon de soleil doux pour illuminer chaque pièce.",
    details: [
      "Roses anglaises couleur pêche et abricot",
      "Germinis pastel et mini-œillets abricotés",
      "Feuilles de mimosa et brindilles d'arganier",
      "Emballage naturel en papier kraft texturé et cordelette en chanvre",
    ],
    priceMad: 420,
    category: "Saisonnier",
    imageSrc: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet aux tons pêche, or et verdure",
    availability: "seasonal",
    featured: false,
    stemsCount: 20,
    dimensions: "Hauteur ~45cm · Diamètre ~35cm",
    careTips: [
      "Renouveler l'eau toutes les 48 heures",
      "Tailler les tiges sous l'eau pour éviter les bulles d'air",
    ],
  },
  {
    id: "majorelle-poetique",
    slug: "majorelle-poetique",
    name: "Majorelle Poétique",
    subtitle: "Bleu profond & touches rosées délicates",
    description: "Hortensias aux reflets azur et lavande mariés à des roses poudrées. Une composition artistique rendant hommage à l'art des jardins marocains.",
    details: [
      "Hortensias bleus d'altitude et chardons ornementaux",
      "Roses anciennes blush et anémones",
      "Feuillage d'eucalyptus baby blue",
      "Papier de soie bleu nuit et ruban blush poudré",
    ],
    priceMad: 540,
    category: "Romance",
    imageSrc: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Composition florale artistique aux tons azur et doux",
    availability: "in_stock",
    featured: false,
    stemsCount: 22,
    dimensions: "Hauteur ~48cm · Diamètre ~42cm",
    careTips: [
      "Les hortensias apprécient une eau abondante et fraîche",
      "Brumiser légèrement les têtes d'hortensias si la température est élevée",
    ],
  },
  {
    id: "velours-imperial",
    slug: "velours-imperial",
    name: "Velours Impérial",
    subtitle: "Roses de prestige & calices somptueux",
    description: "L'expression suprême du luxe floral. Un bouquet dense et somptueux alliant roses premium à longues tiges et feuillage d'anthurium velouté.",
    details: [
      "30 roses rouges grand calibre tige longue (70cm)",
      "Feuillage de philodendron et eucalyptus parvifolia",
      "Finition signature cousue d'or et carte calligraphiée personnalisée",
      "Poche d'hydratation de transport pour une fraîcheur garantie 48h",
    ],
    priceMad: 920,
    category: "Prestige",
    imageSrc: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bouquet majestueux de roses sombres de grande taille",
    availability: "limited",
    featured: false,
    stemsCount: 35,
    dimensions: "Hauteur ~70cm · Diamètre ~55cm",
    careTips: [
      "Utiliser un grand vase lourd pour assurer la stabilité du bouquet",
      "Couper 3 cm de tige à chaque changement d'eau tous les deux jours",
    ],
  },
];

export function getAllProducts(): Product[] {
  return sampleProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((p) => p.slug === slug || p.id === slug);
}

export function getFeaturedProducts(): Product[] {
  return sampleProducts.filter((p) => p.featured);
}

export function getRelatedProducts(currentSlug: string, limit = 3): Product[] {
  const current = getProductBySlug(currentSlug);
  return sampleProducts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.category === current.category && b.category !== current.category) return -1;
      if (current && b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

export function getCategories(): ProductCategory[] {
  return ["Tous", "Roses", "Pivoines", "Saisonnier", "Prestige", "Romance"];
}
