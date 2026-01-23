import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

dotenv.config(); // ✅ load env first

/* ===== CONNECT DB ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

/* ===== CREATE HTTP SERVER ===== */
const server = http.createServer(app);

/* ===== SOCKET.IO SETUP ===== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join-ride", (rideId) => {
    socket.join(rideId);
    console.log(`🚗 Socket ${socket.id} joined ride ${rideId}`);
  });

  socket.on("send-message", ({ rideId, message }) => {
    socket.to(rideId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
