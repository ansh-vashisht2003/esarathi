import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

/* ======================
   DRIVER SIGNUP (ALWAYS PENDING)
====================== */
export const driverSignup = async (req, res) => {
  try {
    const { name, dob, email, phone, aadhaar, numberPlate, vehicleType } = req.body;

    if (!req.files?.carImage) {
      return res.status(400).json({ message: "Vehicle image is required" });
    }

    const existing = await Driver.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    // ✅ Age validation (>=18)
    const age = Math.floor(
      (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25)
    );

    if (age < 18) {
      return res.status(400).json({ message: "Driver must be at least 18 years old" });
    }

    const driver = await Driver.create({
      name,
      dob,
      email,
      phone,
      aadhaar,
      numberPlate,
      vehicleType,
      profilePic: req.files.profilePic?.[0]?.filename,
      carImage: req.files.carImage[0].filename,
      status: "PENDING",
      isApproved: false,
    });

    res.json({
      success: true,
      message: "Driver registered successfully. Waiting for admin approval 🚗",
      driver,
    });

  } catch (err) {
    console.error("Driver signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   DRIVER LOGIN
====================== */
export const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (driver.status !== "APPROVED") {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const match = await bcrypt.compare(password, driver.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.json({
      success: true,
      driver,
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ======================
   CHANGE DRIVER PASSWORD
====================== */
export const changeDriverPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const match = await bcrypt.compare(oldPassword, driver.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    driver.password = await bcrypt.hash(newPassword, 10);
    await driver.save();

    res.json({ message: "Password updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};

/* ======================
   DRIVER SELFIE (CAMERA BASE64)
====================== */
export const uploadDriverSelfie = async (req, res) => {
  try {
    const { email } = req.params;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Selfie image required" });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const fileName = `selfie_${driver._id}_${Date.now()}.png`;

    const uploadPath = path.join("driver_pic", fileName);
    fs.writeFileSync(uploadPath, base64Data, "base64");

    driver.selfieImage = fileName;
    driver.lastSelfieDate = new Date();
    driver.missedSelfieCount = 0;

    await driver.save();

    res.json({ message: "Selfie uploaded successfully 📸" });
  } catch (err) {
    console.error("Selfie upload error:", err);
    res.status(500).json({ message: "Selfie upload failed" });
  }
};


export const uploadDriverProfilePic = async (req, res) => {
  try {
    const { email } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture required" });
    }

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.profilePic = req.file.filename;
    await driver.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully ✅",
      profilePic: driver.profilePic,
    });
  } catch (err) {
    console.error("Profile pic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
