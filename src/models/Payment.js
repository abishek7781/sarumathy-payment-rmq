const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  username: String,
  amount: Number,
  status: { type: String, default: "Success" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
