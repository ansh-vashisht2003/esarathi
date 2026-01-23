import Driver from "../models/Driver.js";

// ======================
// DRIVER SIGNUP (ALWAYS PENDING)
// ======================
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
      status: "PENDING",     // ✅ ALWAYS PENDING
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

// ======================
// DRIVER LOGIN
// ======================
export const driverLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (driver.status !== "APPROVED") {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    res.json({
      success: true,
      driver,
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
