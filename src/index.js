// const environment = process.env.NODE_ENV || 'local';
require('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");

app.use(express.json());

app.use("/api/payments", require("./routes/paymentRoutes"));

const start = async () => {
  await connectDB();
  await connectRabbitMQ();

  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
