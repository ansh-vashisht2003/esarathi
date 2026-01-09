import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import { checkPlateAI } from "../utils/plateCheck.js";

// ======================
// DRIVER SIGNUP
// ======================
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

    // ✅ Save driver first
    const driver = await Driver.create({
      name,
      dob,
      email,
      aadhaar,
      numberPlate,
      carImage: req.file.path,
      status: "PENDING",
      isApproved: false,
    });

    // ✅ Send response immediately
    res.json({
      success: true,
      message: "Signup successful. Verification in progress.",
    });

    // ✅ Run AI in background (NO await)
    checkPlateAI(req.file.path)
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
        console.error("AI error (ignored):", err.message);
      });

  } catch (err) {
    console.error(err);
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

    // ✅ Check admin approval + status
    if (!driver.isApproved || driver.status !== "APPROVED") {
      return res
        .status(403)
        .json({ message: "Account not approved by admin yet" });
    }

    const ok = await bcrypt.compare(password, driver.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Return useful data
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
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
