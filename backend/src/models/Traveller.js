import mongoose from "mongoose";

const travellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profilePic: { type: String }, // filename
phone: {
  type: String,
  required: false
},
  isVerified: { type: Boolean, default: false },
  signupOTP: Number,
  otpExpiry: Date,
});

export default mongoose.model("Traveller", travellerSchema);
