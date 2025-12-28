import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/* ======================
   ADMIN APPROVE DRIVER
   ====================== */
export const approveDriver = async (req, res) => {
  try {
    console.log("🔥 ADMIN APPROVE API HIT");

    const { driverId } = req.params;
    const { adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin password" });
    }

    const driver = await Driver.findById(driverId);

    // ✅ ONLY plate-verified drivers can be approved
    if (!driver || driver.status !== "PLATE_VERIFIED") {
      return res
        .status(400)
        .json({ message: "Driver not ready for approval" });
    }

    const plainPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    driver.password = hashedPassword;
    driver.isApproved = true;
    driver.status = "APPROVED";

    await driver.save();

    console.log("📧 SENDING EMAIL");
    await sendEmail(
      driver.email,
      "E-Sarathi Driver Account Approved",
      `
Hello ${driver.name},

Your driver account has been approved by admin 🎉

Login Details:
Email: ${driver.email}
Password: ${plainPassword}

Please change your password after login.

– Team E-Sarathi
      `
    );

    res.json({
      success: true,
      message: "Driver approved and email sent",
    });
  } catch (error) {
    console.error("ADMIN APPROVAL ERROR:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};
