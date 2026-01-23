import Driver from "../models/Driver.js";
import sendEmail from "../utils/sendEmail.js";

// ======================
// GET PENDING DRIVERS
// ======================
export const getPendingDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: "PENDING" }).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

// ======================
// APPROVE / REJECT DRIVER
// ======================
export const verifyDriver = async (req, res) => {
  try {
    const { driverId, action } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // ✅ APPROVE
    if (action === "APPROVE") {
      driver.status = "APPROVED";
      driver.isApproved = true;
      await driver.save();

      await sendEmail(
        driver.email,
        "Driver Approved 🚗",
        `Hello ${driver.name}, your driver account has been approved. You can now login.`
      );

      return res.json({ message: "Driver approved ✅" });
    }

    // ❌ REJECT → DELETE DRIVER
    if (action === "REJECT") {
      await Driver.findByIdAndDelete(driverId);

      await sendEmail(
        driver.email,
        "Driver Registration Rejected ❌",
        `Hello ${driver.name},

Your driver registration has been rejected ❌
Reason: Uploaded details were not correct.

Please register again with valid details.

– Team E-Sarathi`
      );

      return res.json({ message: "Driver rejected and deleted ❌" });
    }

  } catch (err) {
    console.error("Admin verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
