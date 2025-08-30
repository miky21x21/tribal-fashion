const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

class TestSeeder {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async seedTestData() {
    try {
      console.log('Starting test data seeding...');

      // Seed test users
      const users = await this.seedUsers();
      console.log(`Created ${users.length} test users`);

      // Seed test products
      const products = await this.seedProducts();
      console.log(`Created ${products.length} test products`);

      // Seed test orders
      const orders = await this.seedOrders(users, products);
      console.log(`Created ${orders.length} test orders`);

      // Seed hero content
      await this.seedHeroContent();

      console.log('Test data seeding completed successfully!');
      return {
        users: users.length,
        products: products.length,
        orders: orders.length
      };

    } catch (error) {
      console.error('Error seeding test data:', error);
      throw error;
    }
  }

  async seedUsers() {
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const testUsers = [
      {
        email: 'admin@tribalfashion.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        avatar: '/images/avatars/admin.jpg'
      },
      {
        email: 'customer1@example.com',
        password: hashedPassword,
        firstName: 'Ravi',
        lastName: 'Kumar',
        role: 'CUSTOMER',
        avatar: '/images/avatars/customer1.jpg'
      },
      {
        email: 'customer2@example.com',
        password: hashedPassword,
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'CUSTOMER'
      },
      {
        email: 'customer3@example.com',
        password: hashedPassword,
        firstName: 'Amit',
        lastName: 'Patel',
        role: 'CUSTOMER'
      },
      {
        email: 'manager@tribalfashion.com',
        password: hashedPassword,
        firstName: 'Manager',
        lastName: 'Admin',
        role: 'ADMIN'
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await this.prisma.user.create({
        data: userData
      });
      createdUsers.push(user);
    }

    return createdUsers;
  }

  async seedProducts() {
    const testProducts = [
      {
        name: "Traditional Santal Saree",
        description: "Handwoven saree with traditional Santal tribal patterns and motifs, made from premium cotton",
        price: 2500.00,
        image: "/images/products/santal-saree.jpg",
        category: "Sarees",
        featured: true,
        inventory: 15
      },
      {
        name: "Munda Tribal Jewelry Set",
        description: "Authentic Munda tribal jewelry set with traditional beadwork and silver accents",
        price: 1800.00,
        image: "/images/products/munda-jewelry.jpg",
        category: "Jewelry",
        featured: true,
        inventory: 8
      },
      {
        name: "Ho Tribe Handwoven Shawl",
        description: "Beautiful handwoven shawl with Ho tribal designs in vibrant colors",
        price: 1200.00,
        image: "/images/products/ho-shawl.jpg",
        category: "Shawls",
        featured: true,
        inventory: 12
      },
      {
        name: "Oraon Traditional Kurta",
        description: "Men's traditional kurta with Oraon tribal embroidery in cotton fabric",
        price: 1500.00,
        image: "/images/products/oraon-kurta.jpg",
        category: "Kurtas",
        featured: false,
        inventory: 20
      },
      {
        name: "Kharia Tribal Bag",
        description: "Handcrafted bag with traditional Kharia tribal patterns and leather straps",
        price: 800.00,
        image: "/images/products/kharia-bag.jpg",
        category: "Bags",
        featured: true,
        inventory: 25
      },
      {
        name: "Birhor Bamboo Crafts",
        description: "Traditional bamboo crafts made by Birhor artisans including baskets and decorative items",
        price: 600.00,
        image: "/images/products/birhor-bamboo.jpg",
        category: "Crafts",
        featured: false,
        inventory: 30
      },
      {
        name: "Santali Traditional Dupatta",
        description: "Elegant dupatta with Santali tribal motifs and hand-block prints",
        price: 900.00,
        image: "/images/products/santali-dupatta.jpg",
        category: "Dupatta",
        featured: false,
        inventory: 18
      },
      {
        name: "Tribal Wooden Figurines",
        description: "Hand-carved wooden figurines representing various tribal deities and symbols",
        price: 750.00,
        image: "/images/products/wooden-figurines.jpg",
        category: "Crafts",
        featured: true,
        inventory: 22
      },
      {
        name: "Traditional Tribal Drums",
        description: "Authentic tribal drums used in ceremonial events, handmade with goat skin",
        price: 3500.00,
        image: "/images/products/tribal-drums.jpg",
        category: "Instruments",
        featured: false,
        inventory: 5
      },
      {
        name: "Handloom Cotton Bedsheet Set",
        description: "Premium handloom cotton bedsheet set with traditional tribal border designs",
        price: 2200.00,
        image: "/images/products/bedsheet-set.jpg",
        category: "Home Textiles",
        featured: true,
        inventory: 14
      }
    ];

    const createdProducts = [];
    for (const productData of testProducts) {
      const product = await this.prisma.product.create({
        data: productData
      });
      createdProducts.push(product);
    }

    return createdProducts;
  }

  async seedOrders(users, products) {
    const customerUsers = users.filter(user => user.role === 'CUSTOMER');
    const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const createdOrders = [];
    
    // Create orders with different scenarios
    for (let i = 0; i < 15; i++) {
      const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];
      const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      
      // Create order
      const order = await this.prisma.order.create({
        data: {
          userId: randomUser.id,
          total: 0, // Will be calculated after adding items
          status: randomStatus
        }
      });

      // Add 1-4 random products to each order
      const numItems = Math.floor(Math.random() * 4) + 1;
      let orderTotal = 0;
      
      const selectedProducts = this.getRandomProducts(products, numItems);
      
      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemPrice = product.price;
        
        await this.prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: quantity,
            price: itemPrice
          }
        });

        orderTotal += itemPrice * quantity;
      }

      // Update order total
      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: { total: orderTotal }
      });

      createdOrders.push(updatedOrder);
    }

    return createdOrders;
  }

  async seedHeroContent() {
    await this.prisma.heroContent.upsert({
      where: { id: 'hero-main' },
      update: {
        content: "Discover the Rich Heritage of Jharkhand's Tribal Fashion",
        image: "/images/hero-bg.jpg"
      },
      create: {
        id: 'hero-main',
        content: "Discover the Rich Heritage of Jharkhand's Tribal Fashion",
        image: "/images/hero-bg.jpg"
      }
    });
  }

  getRandomProducts(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async clearTestData() {
    console.log('Clearing existing test data...');
    
    // Delete in order to respect foreign key constraints
    await this.prisma.orderItem.deleteMany({});
    await this.prisma.order.deleteMany({});
    await this.prisma.product.deleteMany({});
    await this.prisma.user.deleteMany({});
    await this.prisma.heroContent.deleteMany({});
    
    console.log('Test data cleared successfully!');
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

module.exports = TestSeeder;