import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const approveDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin password" });
    }

    const driver = await Driver.findById(driverId);

    if (!driver || driver.status !== "PENDING") {
      return res.status(400).json({ message: "Invalid driver state" });
    }

    const plainPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    driver.password = hashedPassword;
    driver.status = "APPROVED";
    driver.isApproved = true;

    await driver.save();

    await sendEmail(
      driver.email,
      "E-Sarathi Driver Account Approved",
      `
Hello ${driver.name},

Your driver account has been approved 🎉

Login credentials:
Email: ${driver.email}
Password: ${plainPassword}

Please log in and change your password immediately.

– Team E-Sarathi
      `
    );

    res.json({
      success: true,
      message: "Driver approved & credentials sent via email",
    });
  } catch (error) {
    console.error("APPROVE DRIVER ERROR:", error);
    res.status(500).json({ message: "Driver approval failed" });
  }
};
