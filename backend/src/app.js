import express from "express";
import cors from "cors";

import travellerRoutes from "./routes/travellerRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/traveller", travellerRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

export default app;
