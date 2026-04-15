import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

import "./utils/selfieChecker.js";

import rideRoutes from "./routes/rideRoutes.js";
import shareRideRoutes from "./routes/shareRideRoutes.js";

dotenv.config();

/* ===============================
   CONNECT DATABASE
================================ */

const connectDB = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

  } catch (err) {

    console.error("❌ MongoDB connection failed:", err.message);

    process.exit(1);

  }

};

await connectDB();



/* ===============================
   ROUTES
================================ */

app.use("/api/ride", rideRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/share-rides", shareRideRoutes);



/* ===============================
   CREATE HTTP SERVER
================================ */

const server = http.createServer(app);



/* ===============================
   SOCKET.IO SETUP
================================ */

const io = new Server(server, {

  cors: {

    origin: ["http://localhost:5173", "http://localhost:3000"],

    methods: ["GET", "POST"],

  },

});

/* MAKE IO AVAILABLE IN CONTROLLERS */

app.set("io", io);



/* ===============================
   STORE ONLINE DRIVERS
================================ */

let drivers = {}; // { email : socketId }

let driverLocations = {}; // { email : {lat,lng} }



/* ===============================
   SOCKET CONNECTION
================================ */

io.on("connection", (socket) => {

  console.log("🟢 Socket connected:", socket.id);



  /* ======================
     TRAVELLER JOINS ROOM
  ====================== */

  socket.on("joinTraveller", (email) => {

    socket.join(email);

    console.log("👤 Traveller joined room:", email);

  });



  /* ======================
     DRIVER JOINS ROOM
  ====================== */

  socket.on("joinDriver", (email) => {

    socket.join(email);

    drivers[email] = socket.id;

    console.log("🚗 Driver joined room:", email);

  });



  /* ======================
     DRIVER LOCATION UPDATE
  ====================== */

  socket.on("driverOnline", ({ email, lat, lng }) => {

    drivers[email] = socket.id;

    driverLocations[email] = { lat, lng };



    const driverList = Object.entries(driverLocations).map(

      ([email, loc]) => ({

        email,

        lat: loc.lat,

        lng: loc.lng

      })

    );



    io.emit("nearbyDrivers", driverList);

  });



  /* ======================
     DISCONNECT
  ====================== */

  socket.on("disconnect", () => {

    console.log("🔴 Socket disconnected:", socket.id);



    const entry = Object.entries(drivers)

      .find(([email, id]) => id === socket.id);



    if (entry) {

      const [email] = entry;

      delete drivers[email];

      delete driverLocations[email];

    }

  });

});



/* ===============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);

});