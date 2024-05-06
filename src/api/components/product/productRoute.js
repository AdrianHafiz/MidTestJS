// api/components/product/productRoute.js

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const productService = require('./productService');
const purchaseService = require('./purchaseService'); // Import purchase service

router.use(bodyParser.json());

// Create a product
router.post('/', async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase a product
router.post('/:productId/purchase', async (req, res) => {
  try {
    const { productId } = req.params;
    const purchase = await purchaseService.purchaseProduct(productId);
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get purchase history of a product by ID
router.get('/:productId/purchase', async (req, res) => {
  try {
    const { productId } = req.params;
    // Query purchase records based on productId
    const purchases = await Purchase.find({ productId });
    if (!purchases || purchases.length === 0) {
      // Jika tidak ada pembelian, kirim respons bahwa produk belum dibeli
      return res
        .status(404)
        .json({ message: 'No purchase history found for this product' });
    }
    // Jika ada pembelian, kirim respons dengan daftar pembelian
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
