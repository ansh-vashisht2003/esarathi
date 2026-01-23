import express from "express";
import upload from "../middleware/travellerUpload.js";
import {
  uploadProfilePicByEmail,
  changePasswordByEmail,
} from "../controllers/travellerController.js";

const router = express.Router();

// ✅ Upload profile pic using email
router.put("/profile-pic/:email", upload.single("profilePic"), uploadProfilePicByEmail);

// ✅ Change password using email
router.put("/change-password/:email", changePasswordByEmail);

export default router;
