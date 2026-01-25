import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   UPLOAD PROFILE PIC BY EMAIL
========================= */
export const uploadProfilePicByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const traveller = await Traveller.findOne({ email });
    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    traveller.profilePic = req.file.filename;
    await traveller.save();

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      profilePic: traveller.profilePic,
    });
  } catch (err) {
    console.error("Profile pic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CHANGE PASSWORD BY EMAIL
========================= */
export const changePasswordByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const traveller = await Traveller.findOne({ email });
    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, traveller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    traveller.password = hashedPassword;
    await traveller.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CONTACT FORM MESSAGE
========================= */
export const contactTraveller = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Send email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || "youradminemail@gmail.com",
      `📩 Contact Message from ${name}`,
      `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully ✅",
    });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
