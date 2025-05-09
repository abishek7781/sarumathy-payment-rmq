const Payment = require("../models/Payment");
const { getChannel } = require("../config/rabbitmq");

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const channel = getChannel();

    const messageBuffer = Buffer.from(JSON.stringify({
      username: payment.username,
      amount: payment.amount,
      status: payment.status
    }));

    channel.sendToQueue("payments", messageBuffer, { persistent: true });
    channel.assertQueue("payment_logs", { durable: false });
    channel.sendToQueue("payment_logs", messageBuffer);

    res.status(201).json({ 
      message: "Payment created successfully", 
      payment 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Payment creation failed", 
      detail: err.message 
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "Refunded";
    await payment.save();

    const channel = getChannel();
    channel.sendToQueue("refunds", 
      Buffer.from(JSON.stringify({
        username: payment.username,
        amount: payment.amount,
        timestamp: new Date()
      }))
    );

    res.json({ 
      message: "Refund processed successfully", 
      payment 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPayment,
  getPayment,
  refundPayment
};