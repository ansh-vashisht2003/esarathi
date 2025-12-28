import express from "express";
import {
  driverSignup,
  driverLogin,
} from "../controllers/driverController.js";
import upload from "../middleware/upload.js";

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

export default router;
