import express from "express";
import {
  forgotPassword,
  resetPassword,
  signupTraveller,
  verifySignupOTP,
} from "../controllers/travellerAuthController.js";

const router = express.Router();

router.post("/signup", signupTraveller);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
