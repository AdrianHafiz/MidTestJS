const Purchase = require('../../../models/Purchase');
const Product = require('../../../models/Product');

async function purchaseProduct(productId, quantity) {
  // Retrieve product details
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  // Check if there is sufficient stock
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  // Create purchase record
  const purchase = new Purchase({
    productId,
    quantity, // Include quantity in the purchase record
    // You can add more fields here if needed
  });
  await purchase.save();

  // Update product stock
  product.stock -= quantity;
  await product.save();

  return purchase;
}

module.exports = {
  purchaseProduct,
};
