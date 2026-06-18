const express = require("express");

const router = express.Router();

const {
  calculateCartBill
} = require(
  "../controllers/billingController"
);

router.post(
  "/calculate",
  calculateCartBill
);

module.exports = router;