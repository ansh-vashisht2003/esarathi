import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   TRAVELLER SIGNUP → SEND OTP
   ========================= */
export const signupTraveller = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // 🔍 debug

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Traveller.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Traveller.create({
      name,
      email,
      password: hashedPassword,
      signupOTP: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await sendEmail(
      email,
      "E-Sarathi – Verify your email",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =========================
   VERIFY SIGNUP OTP
   ========================= */
export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await Traveller.findOne({ email });

    if (
      !user ||
      user.signupOTP !== Number(otp) ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.signupOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

/* =========================
   FORGOT PASSWORD → SEND OTP
   ========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Traveller.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "E-Sarathi Password Reset OTP",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* =========================
   RESET PASSWORD
   ========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await Traveller.findOne({ email });

    if (
      !user ||
      user.resetOTP !== Number(otp) ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
