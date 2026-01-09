import express from "express";
import upload from "../middleware/upload.js";
import { driverSignup, driverLogin } from "../controllers/driverController.js";

const router = express.Router();

router.post(
  "/signup",
  upload.single("carImage"),  // 🔥 MUST BE HERE
  driverSignup
);

router.post("/login", driverLogin);

export default router;
