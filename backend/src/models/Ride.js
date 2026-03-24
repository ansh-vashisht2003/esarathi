import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    rideCode: {
      type: String,
      unique: true,
    },

    traveller: {
      name: String,
      email: String,
    },

    driver: {
      name: String,
      email: String,
      phone: String,
      profilePic: String,
      numberPlate: String,
      vehicleType: String,
    },

    pickup: {
      address: String,
      lat: Number,
      lng: Number,
    },

    drop: {
      address: String,
      lat: Number,
      lng: Number,
    },

    vehicleType: String,
    distance: Number,
    eta: Number,
    fare: Number,

    status: {
      type: String,
      enum: ["SEARCHING", "ACCEPTED", "STARTED", "COMPLETED", "CANCELLED"],
      default: "SEARCHING",
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
