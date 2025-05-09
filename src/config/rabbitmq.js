const amqp = require("amqplib");
require('dotenv').config();
let channel;

const connectRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue("payments", { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error", err.message);
    process.exit(1);
  }
};

const getChannel = () => channel;

const publishToQueue = (data) => {
  if (!channel) {
    console.error("Cannot publish, RabbitMQ channel is not ready");
    return;
  }
  
  channel.sendToQueue(
    "payments",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
};

module.exports = { 
  connectRabbitMQ, 
  getChannel, 
  publishToQueue 
};