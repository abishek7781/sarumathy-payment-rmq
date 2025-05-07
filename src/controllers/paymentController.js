const Payment = require("../models/Payment");
const { getChannel } = require("../config/rabbitmq");

exports.initiatePayment = async (req, res) => {
  try {
    const { username, amount } = req.body;
    const payment = await Payment.create({ username, amount });

    // const channel = getChannel();
    // channel.sendToQueue("payment_logs", Buffer.from(JSON.stringify(payment)));
    const channel = getChannel();
  
    const messageBuffer = Buffer.from(JSON.stringify(payment));

    // ✅ Existing queue
    channel.sendToQueue("payment_logs", messageBuffer);

    // ✅ Additional queue for debug/monitoring
    channel.assertQueue("payments", { durable: false });
    channel.sendToQueue("payments", messageBuffer);
    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    res.status(500).json({ error: "Payment failed", detail: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Not found" });

    payment.status = "Refunded";
    await payment.save();
    res.json({ message: "Refund processed", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

