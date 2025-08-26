export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  sizes?: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  theme?: string; // Theme assignment for featured products
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

// Theme configuration for featured products organization
export interface FeaturedTheme {
  id: string;
  name: string;
  description: string;
  order: number; // Display order (lower numbers appear first)
}

// THEME CONFIGURATION
// Add new themes here by adding entries to this array
// Products are assigned to themes using the 'theme' property
export const featuredThemes: FeaturedTheme[] = [
  {
    id: "ceremonial",
    name: "Ceremonial",
    description: "Traditional ceremonial items and sacred artifacts",
    order: 1
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Modern designs with traditional craftsmanship",
    order: 2
  }
  // TO ADD NEW THEMES:
  // 1. Add a new theme object here with unique id, name, description, and order
  // 2. Assign products to the theme by setting their 'theme' property to the theme id
  // Example:
  // {
  //   id: "seasonal",
  //   name: "Seasonal",
  //   description: "Special seasonal collections",
  //   order: 3
  // }
];

// Product Categories Data
export const productCategories: ProductCategory[] = [
  {
    id: "hand-woven-home-decor",
    name: "Hand Woven Home Decor",
    description: "Authentic handwoven textiles and decorative items for your home",
    image: "/images/categories/home-decor.jpg",
    products: [
      {
        id: 101,
        name: "Tribal Wall Hanging",
        price: "₹1,800",
        image: "/images/products/wall-hanging.jpg",
        description: "Traditional Jharkhand tribal wall hanging featuring authentic motifs and patterns. Handwoven with natural fibers.",
        sizes: ["Small (2x3 ft)", "Medium (3x4 ft)", "Large (4x5 ft)"],
        category: "Hand Woven Home Decor",
        inStock: true,
        featured: true,
        theme: "ceremonial" // THEME ASSIGNMENT: Assign products to themes here
      },
      {
        id: 102,
        name: "Woven Table Runner",
        price: "₹950",
        image: "/images/products/table-runner.jpg",
        description: "Handcrafted table runner with intricate tribal patterns. Perfect for dining room decor.",
        sizes: ["6 ft", "8 ft", "10 ft"],
        category: "Hand Woven Home Decor",
        inStock: true
      },
      {
        id: 103,
        name: "Decorative Cushion Cover",
        price: "₹650",
        image: "/images/products/cushion-cover.jpg",
        description: "Beautiful handwoven cushion covers with traditional tribal embroidery.",
        sizes: ["16x16 inch", "18x18 inch", "20x20 inch"],
        category: "Hand Woven Home Decor",
        inStock: true
      }
    ]
  },
  {
    id: "handloom",
    name: "Handloom",
    description: "Traditional handloom fabrics and garments crafted by skilled artisans",
    image: "/images/categories/handloom.jpg",
    products: [
      {
        id: 201,
        name: "Handloom Saree",
        price: "₹3,200",
        image: "/images/products/handloom-saree.jpg",
        description: "Exquisite handloom saree with traditional Jharkhand patterns. Woven on traditional pit looms.",
        sizes: ["One Size"],
        category: "Handloom",
        inStock: true,
        featured: true,
        theme: "ceremonial" // THEME ASSIGNMENT: Traditional ceremonial wear
      },
      {
        id: 202,
        name: "Handloom Kurta",
        price: "₹1,800",
        image: "/images/products/handloom-kurta.jpg",
        description: "Comfortable handloom cotton kurta with ethnic design elements.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        category: "Handloom",
        inStock: true
      },
      {
        id: 203,
        name: "Handloom Dupatta",
        price: "₹1,200",
        image: "/images/products/handloom-dupatta.jpg",
        description: "Elegant handloom dupatta with traditional border designs.",
        sizes: ["2.5 meters", "3 meters"],
        category: "Handloom",
        inStock: true
      }
    ]
  },
  {
    id: "souvenir",
    name: "Souvenir",
    description: "Unique tribal souvenirs and collectibles representing Jharkhand's heritage",
    image: "/images/categories/souvenir.jpg",
    products: [
      {
        id: 301,
        name: "Tribal Figurine Set",
        price: "₹850",
        image: "/images/products/tribal-figurines.jpg",
        description: "Hand-carved wooden figurines depicting traditional tribal dancers and musicians.",
        category: "Souvenir",
        inStock: true,
        featured: true,
        theme: "contemporary" // THEME ASSIGNMENT: Modern collectible interpretation
      },
      {
        id: 302,
        name: "Miniature Tribal Hut",
        price: "₹450",
        image: "/images/products/miniature-hut.jpg",
        description: "Detailed miniature replica of a traditional Jharkhand tribal hut made from natural materials.",
        category: "Souvenir",
        inStock: true
      },
      {
        id: 303,
        name: "Tribal Art Postcard Set",
        price: "₹250",
        image: "/images/products/postcard-set.jpg",
        description: "Beautiful set of 12 postcards featuring authentic tribal art and motifs.",
        category: "Souvenir",
        inStock: true
      }
    ]
  },
  {
    id: "silverware",
    name: "Silverware",
    description: "Handcrafted silver jewelry and accessories by traditional artisans",
    image: "/images/categories/silverware.jpg",
    products: [
      {
        id: 401,
        name: "Silver Tribal Necklace",
        price: "₹4,500",
        image: "/images/products/silver-necklace.jpg",
        description: "Handcrafted silver necklace with traditional tribal motifs. Made with 925 sterling silver.",
        category: "Silverware",
        inStock: true,
        featured: true,
        theme: "contemporary" // THEME ASSIGNMENT: Modern jewelry with traditional elements
      },
      {
        id: 402,
        name: "Silver Bangles Set",
        price: "₹2,800",
        image: "/images/products/silver-bangles.jpg",
        description: "Set of 4 handcrafted silver bangles with intricate tribal engravings.",
        sizes: ["Small", "Medium", "Large"],
        category: "Silverware",
        inStock: true
      },
      {
        id: 403,
        name: "Silver Tribal Earrings",
        price: "₹1,900",
        image: "/images/products/silver-earrings.jpg",
        description: "Elegant silver earrings featuring traditional Jharkhand tribal designs.",
        category: "Silverware",
        inStock: true
      }
    ]
  }
];

// Helper functions for easy data management
export const getAllProducts = (): Product[] => {
  return productCategories.flatMap(category => category.products);
};

export const getFeaturedProducts = (): Product[] => {
  return getAllProducts().filter(product => product.featured);
};

// THEME-BASED HELPER FUNCTIONS
// Get products by theme for featured products organization
export const getProductsByTheme = (themeId: string): Product[] => {
  return getFeaturedProducts().filter(product => product.theme === themeId);
};

// Get featured products organized by themes
export const getFeaturedProductsByThemes = (): { theme: FeaturedTheme; products: Product[] }[] => {
  // Sort themes by order
  const sortedThemes = [...featuredThemes].sort((a, b) => a.order - b.order);
  
  return sortedThemes.map(theme => ({
    theme,
    products: getProductsByTheme(theme.id)
  })).filter(themeGroup => themeGroup.products.length > 0); // Only include themes with products
};

// Get products without theme assignment (for backwards compatibility)
export const getFeaturedProductsWithoutTheme = (): Product[] => {
  return getFeaturedProducts().filter(product => !product.theme);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  const category = productCategories.find(cat => cat.id === categoryId);
  return category ? category.products : [];
};

export const getCategoryByProducts = (categoryName: string): Product[] => {
  const category = productCategories.find(cat => cat.name === categoryName);
  return category ? category.products : [];
};

export const getProductById = (id: number): Product | undefined => {
  return getAllProducts().find(product => product.id === id);
};

// Legacy export for backward compatibility
export const products = getAllProducts();