const {
  calculateBill
} = require("../services/billingService");

const calculateCartBill = (
  req,
  res
) => {
  const { cart } = req.body;

  if (
    !cart ||
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
    return res.status(400).json({
      message: "Cart cannot be empty"
    });
  }

  const bill =
    calculateBill(cart);

  res.status(200).json(bill);
};

module.exports = {
  calculateCartBill
};