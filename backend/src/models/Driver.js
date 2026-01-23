import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, required: true },
  numberPlate: { type: String, required: true },

  vehicleType: {
    type: String,
    enum: ["Bike", "Car", "Auto", "SUV", "Truck"],
    required: true,
  },

  profilePic: { type: String },
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

const Driver = mongoose.model("Driver", driverSchema);

export default Driver; // ✅ IMPORTANT
