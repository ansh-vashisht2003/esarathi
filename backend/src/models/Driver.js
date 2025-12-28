import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  aadhaar: { type: String, required: true },
  numberPlate: { type: String, required: true },

  carImage: { type: String, required: true },

  password: { type: String },
  isApproved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Driver", driverSchema);
