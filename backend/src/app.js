import express from "express";
import cors from "cors";
import path from "path";

import travellerRoutes from "./routes/travellerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const ROOT = process.cwd();

/* ==============================
   STATIC FILES (IMAGES)
================================ */

// Traveller profile pictures
app.use("/traveller_pic", express.static(path.join(ROOT, "traveller_pic")));

// Driver images (profile pic + car image)
app.use("/driver_pic", express.static(path.join(ROOT, "driver_pic")));

// Optional uploads folder
app.use("/uploads", express.static(path.join(ROOT, "uploads")));

/* ==============================
   API ROUTES
================================ */

app.use("/api/traveller", travellerRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

// ✅ BOTH ride routes supported
app.use("/api/ride", rideRoutes);   // your existing route
app.use("/api/rides", rideRoutes);  // added from 2nd code

export default app;
