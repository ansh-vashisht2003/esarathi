import Traveller from "../models/Traveller.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   TRAVELLER SIGNUP → SEND OTP + LOGIN DETAILS
   ========================= */
export const signupTraveller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Traveller.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Traveller.create({
      name,
      email,
      password: hashedPassword,
      signupOTP: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    // 📧 SEND OTP + LOGIN DETAILS IN ONE EMAIL
    await sendEmail(
      email,
      "Welcome to E-Sarathi 🚖 | Verify Your Email",
      `Hello ${name},

Welcome to E-Sarathi 🎉

Your account has been created successfully.

🔐 Login Details:
Email: ${email}
Password: ${password}

🔑 OTP for Email Verification:
${otp}

⏳ OTP is valid for 10 minutes.

⚠ Please do not share your password or OTP with anyone.

– Team E-Sarathi`
    );

    res.status(200).json({
      success: true,
      message: "Signup successful. OTP and login details sent to email.",
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

/* =========================
   TRAVELLER LOGIN
   ========================= */
export const loginTraveller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Traveller.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      traveller: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

