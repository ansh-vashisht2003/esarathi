import express from "express";
import cors from "cors";
import path from "path";

import travellerRoutes from "./routes/travellerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ROOT = process.cwd();

/* ==============================
   STATIC FILES (IMAGES)
================================ */

// General uploads (if any)
app.use("/uploads", express.static(path.join(ROOT, "uploads")));

// Traveller profile pictures
app.use("/traveller_pic", express.static(path.join(ROOT, "traveller_pic")));

// Driver images (profile pic + car image)
app.use("/driver_pic", express.static(path.join(ROOT, "driver_pic")));

/* ==============================
   API ROUTES
================================ */

app.use("/api/traveller", travellerRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

export default app;
