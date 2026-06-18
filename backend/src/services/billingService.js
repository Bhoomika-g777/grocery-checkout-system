// src/services/billingService.js
const products = require("../data/products.json");
const { applyDiscount } = require("./promotionService");
const { calculateTax } = require("./taxService");

const calculateBill = (cart) => {
  let subtotal = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  // Pass both subtotal AND cart array to apply compound offers
  const discount = applyDiscount(subtotal, cart);

  const taxableAmount = subtotal - discount;
  const tax = calculateTax(taxableAmount);
  const total = taxableAmount + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

module.exports = {
  calculateBill
 };