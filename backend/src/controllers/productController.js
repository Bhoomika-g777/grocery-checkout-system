const products = require("../data/products.json");

const getProducts = (req, res) => {
  res.status(200).json(products);
};

module.exports = {
  getProducts
};