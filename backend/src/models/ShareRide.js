import mongoose from "mongoose";

const shareRideSchema = new mongoose.Schema({

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },

  vehicleType: String,

  pickup: {
    city: String,
    lat: Number,
    lng: Number
  },

  drop: {
    city: String,
    lat: Number,
    lng: Number
  },

  route: [
    {
      city: String,
      lat: Number,
      lng: Number
    }
  ],

  price: Number,

  seats: Number,

  availableSeats: Number,

  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traveller"
    }
  ],

  time: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("ShareRide", shareRideSchema);