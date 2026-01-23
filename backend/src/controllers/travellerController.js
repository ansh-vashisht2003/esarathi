import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";

// ✅ Upload Profile Pic using EMAIL
export const uploadProfilePicByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const traveller = await Traveller.findOne({ email });
    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    traveller.profilePic = req.file.filename;
    await traveller.save();

    res.json({
      message: "Profile picture updated",
      profilePic: traveller.profilePic,
    });
  } catch (err) {
    console.error("Profile pic error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Change Password using EMAIL
export const changePasswordByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const traveller = await Traveller.findOne({ email });
    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, traveller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    traveller.password = hashedPassword;
    await traveller.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
