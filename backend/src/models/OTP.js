import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otpHash: String,
  expiresAt: Date
});

export default mongoose.model("OTP", otpSchema);
