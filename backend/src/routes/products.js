const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct
} = require('../controllers/productController');

// GET /api/products - Get all products with optional filtering
router.get('/', getProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', getFeaturedProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProduct);

// POST /api/products - Create new product (admin only)
router.post('/', createProduct);

module.exports = router;