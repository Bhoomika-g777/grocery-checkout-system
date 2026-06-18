// src/services/promotionService.js
const products = require("../data/products.json");

const applyDiscount = (subtotal, cart) => {
  let discountAmount = 0;

  // Rule 1: BOGO (Buy One Get One Free) on specific items
  // Example Target: Coffee (ID: 4) and Bread (ID: 3) are Buy 1 Get 1 Free
  const bogoProductIds = [3, 4]; 

  cart.forEach((item) => {
    if (bogoProductIds.includes(item.id)) {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        // For every 2 items, 1 is free (e.g., buying 3 items means 1 is free, buying 4 means 2 are free)
        const freeQuantities = Math.floor(item.quantity / 2);
        discountAmount += freeQuantities * product.price;
      }
    }
  });

  // Calculate subtotal after BOGO values are taken off
  const remainingSubtotal = subtotal - discountAmount;

  // Rule 2: Tiered Target Totals
  // If remaining subtotal is over $150 -> apply a flat 15% discount
  // If remaining subtotal is over $50 -> apply a flat 10% discount
  if (remainingSubtotal > 150) {
    discountAmount += remainingSubtotal * 0.15;
  } else if (remainingSubtotal > 50) {
    discountAmount += remainingSubtotal * 0.10;
  }

  return discountAmount;
};

module.exports = {
  applyDiscount
};