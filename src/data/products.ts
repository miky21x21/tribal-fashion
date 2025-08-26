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
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

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
        featured: true
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
        featured: true
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
        featured: true
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
        featured: true
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

// Theme definitions for the featured products section
// ==================================================================
// TO ADD NEW THEMES:
// 1. Add a new theme object to the productThemes array below
// 2. Define theme name, color (must match CSS color classes), and description
// 3. Add products array with product IDs that belong to this theme
// 4. Ensure CSS color classes are defined in globals.css
// ==================================================================

export interface ProductTheme {
  id: string;
  name: string;
  color: string; // CSS class name (e.g., 'tribal-red', 'royal-blue')
  description: string;
  productIds: number[]; // Array of product IDs that belong to this theme
}

export const productThemes: ProductTheme[] = [
  // CEREMONIAL THEME - Features traditional ceremonial items
  // Color: tribal-red (deep red for ceremonial significance)
  // TO ADD PRODUCTS: Add product IDs to the productIds array below
  {
    id: 'ceremonial',
    name: 'Ceremonial',
    color: 'tribal-red',
    description: 'Traditional ceremonial pieces for special occasions and cultural celebrations',
    productIds: [101, 401] // Wall Hanging, Silver Necklace - ceremonial significance
  },

  // CONTEMPORARY THEME - Features modern interpretations of traditional crafts
  // Color: royal-blue (represents modernity while respecting tradition)
  // TO ADD PRODUCTS: Add product IDs to the productIds array below
  {
    id: 'contemporary',
    name: 'Contemporary',
    color: 'royal-blue',
    description: 'Modern interpretations of traditional tribal crafts for contemporary living',
    productIds: [201, 102] // Handloom Saree, Table Runner - contemporary applications
  },

  // PEACE THEME - Features items symbolizing harmony and tranquility
  // Color: royal-green (represents nature, peace, and harmony)
  // TO ADD PRODUCTS: Add product IDs to the productIds array below
  {
    id: 'peace',
    name: 'Peace',
    color: 'royal-green',
    description: 'Peaceful and harmonious pieces that bring tranquility to your space',
    productIds: [301, 103] // Tribal Figurines, Cushion Covers - peaceful home items
  }

  // TO ADD A NEW THEME:
  // Uncomment and modify the template below:
  /*
  {
    id: 'your-theme-id',
    name: 'Your Theme Name',
    color: 'your-css-color-class', // Must exist in globals.css
    description: 'Description of your theme and what it represents',
    productIds: [product-id-1, product-id-2] // Add relevant product IDs
  }
  */
];

// Helper function to get products for a specific theme
// This function automatically fetches the actual product objects based on theme configuration
export const getThemeProducts = (themeId: string): Product[] => {
  const theme = productThemes.find(t => t.id === themeId);
  if (!theme) return [];
  
  const allProducts = getAllProducts();
  return theme.productIds
    .map(id => allProducts.find(product => product.id === id))
    .filter((product): product is Product => product !== undefined);
};

// Helper function to get all themes with their associated products
// This is used by the carousel component to display themed tiles
export const getThemesWithProducts = (): (ProductTheme & { products: Product[] })[] => {
  return productThemes.map(theme => ({
    ...theme,
    products: getThemeProducts(theme.id)
  }));
};

// Legacy export for backward compatibility
export const products = getAllProducts();