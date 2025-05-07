const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error", err.message);
    process.exit(1);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
 