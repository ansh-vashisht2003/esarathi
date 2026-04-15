import Driver from "../models/Driver.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { verifyCarPlate } from "../utils/aiPlateCheck.js";

/* ======================
   GET PENDING DRIVERS
====================== */
export const getPendingDrivers = async (req, res) => {
  try {

    const drivers = await Driver.find({ status: "PENDING" }).sort({ createdAt: -1 });

    const results = await Promise.all(

      drivers.map(async (driver) => {

        let aiCheck = null;

        try {

          const imagePath = `./driver_pic/${driver.carImage}`;

          aiCheck = await verifyCarPlate(
            imagePath,
            driver.numberPlate
          );

        } catch (err) {

          console.log("AI check failed:", err);

        }

        return {
          ...driver.toObject(),
          aiCheck
        };

      })

    );

    res.json(results);

  } catch (err) {
    console.error("Fetch drivers error:", err);
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

    if (!driver)
      return res.status(404).json({ message: "Driver not found" });


    /* ❌ REJECT DRIVER */

    if (action === "REJECT") {

      await Driver.findByIdAndDelete(driverId);

      await sendEmail(
        driver.email,
        "❌ Driver Registration Rejected - E-Sarathi",
        `Hello ${driver.name},

Your driver registration has been rejected ❌.

Reason: Uploaded details were not correct or clear.

Please register again with valid details.

– Team E-Sarathi 🚖`
      );

      return res.json({ message: "Driver rejected and deleted ❌" });

    }


    /* ✅ APPROVE DRIVER */

    if (action === "APPROVE") {

      const plainPassword = "Admin@1234";

      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      driver.password = hashedPassword;
      driver.status = "APPROVED";
      driver.isApproved = true;

      await driver.save();

      await sendEmail(
        driver.email,
        "✅ Driver Approved - E-Sarathi",
        `Hello ${driver.name},

🎉 Congratulations! Your driver account has been approved.

🔐 Login Credentials:
Email: ${driver.email}
Password: Admin@1234

⚠️ Please change your password after login for security.

– Team E-Sarathi 🚖`
      );

      return res.json({ message: "Driver approved and email sent ✅" });

    }

    return res.status(400).json({ message: "Invalid action" });

  } catch (err) {

    console.error("Verify driver error:", err);

    res.status(500).json({ message: "Server error" });

  }
};