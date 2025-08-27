const express = require('express');
const prisma = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (featured) where.featured = featured === 'true';
    
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 10,
    });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create product (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, description, price, image, category, featured, inventory } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        featured: featured === 'true',
        inventory: parseInt(inventory)
      }
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;