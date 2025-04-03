const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { initSockets } = require("./sockets/io");
const walletRoutes = require("./routes/wallet/walletRoutes");
const { consumeKafkaMessages } = require("./config/kafka");

const app = express();
const server = http.createServer(app);

const userRoutes = require("./routes/users/userRoutes");
const connectDB = require("./config/db");
app.use(cors());
app.use(express.json());
initSockets(server);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
  connectDB();
  consumeKafkaMessages();
});
app.get("/", (req, res) => {
  res.send("hello node js backend");
});
app.use("/wallet", walletRoutes);
app.use("/users", userRoutes);
