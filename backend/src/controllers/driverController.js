import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { checkPlateAI } from "../utils/plateCheck.js";
import sendEmail from "../utils/sendEmail.js";

/* ======================
   DRIVER SIGNUP
   ====================== */
export const driverSignup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Car image is required" });
    }

    const exists = await Driver.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    await Driver.create({
      name: req.body.name,
      dob: req.body.dob,
      email: req.body.email,
      aadhaar: req.body.aadhaar,
      numberPlate: req.body.numberPlate,
      carImage: req.file.path,
      status: "PENDING",
      isApproved: false,
    });

    res.json({
      success: true,
      message: "Registration submitted. Upload plate image for verification.",
    });
  } catch (error) {
    console.error("DRIVER SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ======================
   VERIFY PLATE (AUTO APPROVE + EMAIL)
   ====================== */
export const verifyPlate = async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Plate image is required" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Run AI verification
    const result = await checkPlateAI(req.file.path);

    // ✅ If AI passes
    if (
      result.isGreen &&
      result.detectedPlate.includes(driver.numberPlate)
    ) {
      // Generate random password
      const plainPassword = crypto.randomBytes(6).toString("hex");
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Update driver
      driver.password = hashedPassword;
      driver.isApproved = true;
      driver.status = "APPROVED";

      await driver.save();

      // Send email automatically
      await sendEmail(
        driver.email,
        "E-Sarathi Driver Account Approved",
        `
Hello ${driver.name},

🎉 Your driver account has been approved automatically!

Login Details:
Email: ${driver.email}
Password: ${plainPassword}

⚠ Please change your password after login.

– Team E-Sarathi
        `
      );

      return res.json({
        success: true,
        message:
          "Plate verified. Account approved and email sent automatically.",
      });
    }

    // ❌ If AI fails
    driver.status = "REJECTED";
    await driver.save();

    res.status(400).json({
      success: false,
      message: "Plate verification failed",
    });
  } catch (error) {
    console.error("VERIFY PLATE ERROR:", error);
    res.status(500).json({ message: "Plate verification error" });
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
        .json({ message: "Account not approved yet" });
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
        status: driver.status,
      },
    });
  } catch (error) {
    console.error("DRIVER LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
