const Product = require('../../../models/Product');

//Untuk Create product
async function createProduct(productData) {
  return await Product.create(productData);
}

//Untuk Mengambil data semua products
async function getAllProducts() {
  return await Product.find();
}

//untuk mengambil product by ID
async function getProductById(productId) {
  return await Product.findById(productId);
}

//untuk Update product by ID
async function updateProduct(productId, updateData) {
  return await Product.findByIdAndUpdate(productId, updateData, { new: true });
}

//untuk Delete product by ID
async function deleteProduct(productId) {
  return await Product.findByIdAndDelete(productId);
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
