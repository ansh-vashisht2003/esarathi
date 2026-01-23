import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import { checkPlateAI } from "../utils/plateCheck.js";

// ======================
// DRIVER SIGNUP (PROFILE PIC + CAR IMAGE + VEHICLE TYPE + AI)
// ======================
export const driverSignup = async (req, res) => {
  try {
    const { name, dob, email, aadhaar, numberPlate, vehicleType } = req.body;

    // ✅ Validate files
    if (!req.files?.profilePic || !req.files?.carImage) {
      return res.status(400).json({
        message: "Profile picture and car image are required",
      });
    }

    // ✅ Check existing driver
    const exists = await Driver.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    // ✅ Save driver first (fast response)
    const driver = await Driver.create({
      name,
      dob,
      email,
      aadhaar,
      numberPlate,
      vehicleType,

      profilePic: req.files.profilePic[0].filename,
      carImage: req.files.carImage[0].filename,

      status: "PENDING",
      isApproved: false,
    });

    // ✅ Respond immediately (no waiting for AI)
    res.json({
      success: true,
      message: "Signup successful. Plate verification in progress 🚗",
    });

    // ======================
    // AI NUMBER PLATE CHECK (BACKGROUND)
    // ======================
    checkPlateAI(req.files.carImage[0].path)
      .then(async (result) => {
        if (
          result?.isGreen &&
          result?.detectedPlate?.includes(numberPlate)
        ) {
          driver.status = "PLATE_VERIFIED";
        } else {
          driver.status = "REJECTED";
        }
        await driver.save();
      })
      .catch((err) => {
        console.error("AI error:", err.message);
      });

  } catch (err) {
    console.error("Driver signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ======================
// DRIVER LOGIN
// ======================
export const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // ✅ Check approval + AI status
    if (!driver.isApproved || driver.status !== "APPROVED") {
      return res.status(403).json({
        message: "Account not approved by admin yet",
      });
    }

    const ok = await bcrypt.compare(password, driver.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful ✅",
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        vehicleType: driver.vehicleType,
        profilePic: driver.profilePic,
        status: driver.status,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
