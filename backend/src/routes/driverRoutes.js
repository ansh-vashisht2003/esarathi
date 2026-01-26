import express from "express";
import upload from "../middleware/driverUpload.js";
import {
  driverSignup,
  driverLogin,
  uploadDriverSelfie,
  changeDriverPassword,
  uploadDriverProfilePic,
} from "../controllers/driverController.js";

const router = express.Router();

/* ======================
   DRIVER SIGNUP (profilePic + carImage)
====================== */
router.post(
  "/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "carImage", maxCount: 1 },
  ]),
  driverSignup
);

/* ======================
   DRIVER LOGIN
====================== */
router.post("/login", driverLogin);

/* ======================
   DRIVER SELFIE (BASE64 IMAGE - NO MULTER)
====================== */
router.post("/selfie/:email", uploadDriverSelfie);

/* ======================
   CHANGE PASSWORD
====================== */
router.put("/change-password/:email", changeDriverPassword);

/* ======================
   UPDATE PROFILE PIC (MULTER FILE UPLOAD)
====================== */
router.put(
  "/profile-pic/:email",
  upload.single("profilePic"),
  uploadDriverProfilePic
);

export default router;
