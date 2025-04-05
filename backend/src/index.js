
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { initSockets } = require("./sockets/io");
const walletRoutes = require("./routes/wallet/walletRoutes");
const { consumeKafkaMessages,initKafka } = require("./config/kafka");
const userRoutes = require("./routes/users/userRoutes");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("hello node js backend");
});
app.use("/wallet", walletRoutes);
app.use("/users", userRoutes);

// Initialize sockets
initSockets(server);

const PORT = process.env.PORT || 3000; 

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await connectDB(); // Initialize DB
    await initKafka(); // Initialize Kafka producer
    await consumeKafkaMessages(); // Consume kafka messages
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1); 
  }
});
