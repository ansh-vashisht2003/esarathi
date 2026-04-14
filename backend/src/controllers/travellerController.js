import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";


/* =========================
   UPLOAD PROFILE PIC
========================= */

export const uploadProfilePicByEmail = async (req, res) => {

  try {

    const { email } = req.params;

    const traveller = await Traveller.findOne({ email });

    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    traveller.profilePic = req.file.filename;

    await traveller.save();

    res.json({
      success: true,
      message: "Profile picture updated",
      profilePic: traveller.profilePic
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};


/* =========================
   CHANGE PASSWORD
========================= */

export const changePasswordByEmail = async (req, res) => {

  try {

    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;

    const traveller = await Traveller.findOne({ email });

    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    const match = await bcrypt.compare(oldPassword, traveller.password);

    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    traveller.password = hashed;

    await traveller.save();

    res.json({
      success: true,
      message: "Password updated"
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};


/* =========================
   CONTACT FORM
========================= */

export const contactTraveller = async (req, res) => {

  try {

    const { name, email, subject, message } = req.body;

    await sendEmail(
      process.env.ADMIN_EMAIL || "admin@gmail.com",
      `Message from ${name}`,
      `
Name: ${name}
Email: ${email}
Subject: ${subject}

${message}
      `
    );

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};