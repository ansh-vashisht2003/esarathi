import express from "express";
import upload from "../middleware/driverUpload.js";
import { driverSignup, driverLogin } from "../controllers/driverController.js";

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "carImage", maxCount: 1 },
  ]),
  driverSignup
);

router.post("/login", driverLogin);

export default router;
