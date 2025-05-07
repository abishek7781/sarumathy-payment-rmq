const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  getPayment,
  refundPayment,
} = require("../controllers/paymentController");

router.post("/", initiatePayment);
router.get("/:id", getPayment);
router.post("/refund/:id", refundPayment);

module.exports = router;
