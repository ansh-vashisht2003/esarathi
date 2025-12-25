import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

/* =================================================
   FORGOT PASSWORD → SEND OTP
   ================================================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Traveller.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Number(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    await sendEmail(
      email,
      "E-Sarathi Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* =================================================
   VERIFY OTP + RESET PASSWORD
   ================================================= */
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

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* =================================================
   TRAVELLER SIGNUP → SEND OTP
   ================================================= */
export const signupTraveller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      `Your verification OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to email for verification" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =================================================
   VERIFY SIGNUP OTP
   ================================================= */
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

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};
