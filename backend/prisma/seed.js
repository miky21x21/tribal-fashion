const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = [
    {
      name: "Traditional Santal Saree",
      description: "Handwoven saree with traditional Santal tribal patterns and motifs",
      price: 2500.00,
      image: "/images/products/santal-saree.jpg",
      category: "Sarees",
      featured: true,
      inventory: 15
    },
    {
      name: "Munda Tribal Jewelry Set",
      description: "Authentic Munda tribal jewelry set with traditional beadwork",
      price: 1800.00,
      image: "/images/products/munda-jewelry.jpg",
      category: "Jewelry",
      featured: true,
      inventory: 8
    },
    {
      name: "Ho Tribe Handwoven Shawl",
      description: "Beautiful handwoven shawl with Ho tribal designs",
      price: 1200.00,
      image: "/images/products/ho-shawl.jpg",
      category: "Shawls",
      featured: true,
      inventory: 12
    },
    {
      name: "Oraon Traditional Kurta",
      description: "Men's traditional kurta with Oraon tribal embroidery",
      price: 1500.00,
      image: "/images/products/oraon-kurta.jpg",
      category: "Kurtas",
      featured: false,
      inventory: 20
    },
    {
      name: "Kharia Tribal Bag",
      description: "Handcrafted bag with traditional Kharia tribal patterns",
      price: 800.00,
      image: "/images/products/kharia-bag.jpg",
      category: "Bags",
      featured: true,
      inventory: 25
    },
    {
      name: "Birhor Bamboo Crafts",
      description: "Traditional bamboo crafts made by Birhor artisans",
      price: 600.00,
      image: "/images/products/birhor-bamboo.jpg",
      category: "Crafts",
      featured: false,
      inventory: 30
    }
  ];

  console.log('Seeding products...');
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
    console.log(`Created product: ${product.name}`);
  }

  // Create sample hero content
  await prisma.heroContent.create({
    data: {
      content: "Discover the Rich Heritage of Jharkhand's Tribal Fashion",
      image: "/images/hero-bg.jpg"
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });