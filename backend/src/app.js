import express from "express";
import cors from "cors";
import travellerRoutes from "./routes/travellerRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/traveller", travellerRoutes);

export default app;
