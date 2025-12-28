import express from "express";
import upload from "../middleware/upload.js";
import {
  driverSignup,
  driverLogin,
  verifyPlate,
} from "../controllers/driverController.js";

const router = express.Router();

/*
  DRIVER SIGNUP
  POST /api/driver/signup
  FormData:
  - name
  - dob
  - email
  - aadhaar
  - numberPlate
  - carImage (file)
*/
router.post("/signup", upload.single("carImage"), driverSignup);

/*
  DRIVER LOGIN
  POST /api/driver/login
  Body (JSON):
  {
    "email": "",
    "password": ""
  }
*/
router.post("/login", driverLogin);

/*
  VERIFY NUMBER PLATE (AI)
  POST /api/driver/verify-plate
  FormData:
  - driverId
  - carImage (plate image)
*/
router.post("/verify-plate", upload.single("carImage"), verifyPlate);

export default router;
