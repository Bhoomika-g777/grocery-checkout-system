const TAX_RATE = 0.18;

const calculateTax = (amount) => {
  return amount * TAX_RATE;
};

module.exports = {
  calculateTax
};