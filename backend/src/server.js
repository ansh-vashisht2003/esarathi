import dotenv from "dotenv";
import travellerRoutes from "./routes/travellerRoutes.js";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

app.use("/api/traveller", travellerRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
