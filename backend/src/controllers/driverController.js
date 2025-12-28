import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import { checkPlateAI } from "../utils/plateCheck.js";

/* ======================
   DRIVER SIGNUP (WITH AI PLATE CHECK)
   ====================== */
export const driverSignup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Car image is required" });
    }

    const { name, dob, email, aadhaar, numberPlate } = req.body;

    const exists = await Driver.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    // 🔍 AI Plate Verification
    const result = await checkPlateAI(req.file.path);

    if (
      !result.isGreen ||
      !result.detectedPlate.includes(numberPlate)
    ) {
      await Driver.create({
        name,
        dob,
        email,
        aadhaar,
        numberPlate,
        carImage: req.file.path,
        status: "REJECTED",
        isApproved: false,
      });

      return res.status(400).json({
        success: false,
        message: "Plate verification failed. Registration rejected.",
      });
    }

    // ✅ Plate verified → wait for admin
    await Driver.create({
      name,
      dob,
      email,
      aadhaar,
      numberPlate,
      carImage: req.file.path,
      status: "PLATE_VERIFIED",
      isApproved: false,
    });

    res.json({
      success: true,
      message: "Plate verified. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("DRIVER SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ======================
   DRIVER LOGIN
   ====================== */
export const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (!driver.isApproved || driver.status !== "APPROVED") {
      return res
        .status(403)
        .json({ message: "Admin approval pending" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
      },
    });
  } catch (error) {
    console.error("DRIVER LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
