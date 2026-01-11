import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

/* ======================
   GET PENDING DRIVERS
   ====================== */
export const getPendingDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: "PENDING",
      isApproved: { $ne: true },
    }).sort({ createdAt: -1 });

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching pending drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

/* ======================
   APPROVE / REJECT DRIVER
   ====================== */
export const verifyDriver = async (req, res) => {
  try {
    const { driverId, action } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // ❌ REJECT
    if (action === "REJECT") {
      driver.status = "REJECTED";
      driver.isApproved = false;
      await driver.save();

      return res.status(200).json({ message: "Driver rejected successfully" });
    }

    // ✅ APPROVE (FIXED PASSWORD)
    const plainPassword = "Admin@1234";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    driver.password = hashedPassword;
    driver.status = "APPROVED";
    driver.isApproved = true;

    await driver.save();

    await sendEmail(
      driver.email,
      "E-Sarathi Driver Approved",
      `Hello ${driver.name},

Your driver account has been approved 🎉

Login Credentials:
Email: ${driver.email}
Password: Admin@1234

⚠ Please change your password after first login.

– Team E-Sarathi`
    );

    res.status(200).json({ message: "Driver approved successfully" });
  } catch (error) {
    console.error("Driver verification error:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};
