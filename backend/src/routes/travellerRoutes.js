import express from "express";
import {
  signupTraveller,
  verifySignupOTP,
  forgotPassword,
  resetPassword,
  loginTraveller,   // ✅ ADD THIS
} from "../controllers/travellerAuthController.js";

const router = express.Router();

router.post("/signup", signupTraveller);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginTraveller); // ✅ ADD THIS

export default router;
