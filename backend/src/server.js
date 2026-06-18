const express = require("express");
const cors = require("cors");

const productRoutes = require(
  "./routes/productRoutes"
);

const billingRoutes = require(
  "./routes/billingRoutes"
);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/billing",
  billingRoutes
);

const PORT = process.env.PORT || 5000; // 1. Updated to allow dynamic cloud ports

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;