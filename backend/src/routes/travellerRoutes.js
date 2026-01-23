import express from "express";
import upload from "../middleware/travellerUpload.js";

// ✅ AUTH CONTROLLER
import {
  signupTraveller,
  loginTraveller,
  verifySignupOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/travellerAuthController.js";

// ✅ PROFILE CONTROLLER
import {
  uploadProfilePicByEmail,
  changePasswordByEmail,
} from "../controllers/travellerController.js";

const router = express.Router();

/* ======================
   AUTH ROUTES
====================== */

// signup
router.post("/signup", signupTraveller);

// login
router.post("/login", loginTraveller);

// verify OTP
router.post("/verify-otp", verifySignupOTP);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

/* ======================
   PROFILE ROUTES
====================== */

// upload profile pic using email
router.put(
  "/profile-pic/:email",
  upload.single("profilePic"),
  uploadProfilePicByEmail
);

// change password using email
router.put("/change-password/:email", changePasswordByEmail);

export default router;
