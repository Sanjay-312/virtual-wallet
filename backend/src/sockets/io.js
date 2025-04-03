const { Server } = require("socket.io");

let io;

function initSockets(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("New WebSocket connection:", socket.id);
        // Listen for client requests
        socket.on("getBalance", (userId) => {
            io.emit("balanceUpdated", { userId, balance: "Fetching..." });
        });
        
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}
function emitBalanceUpdate(userId, balance) {
    if (io) {
        io.emit("balanceUpdated", { userId, balance });
    }
}

module.exports = { initSockets, io, emitBalanceUpdate };
