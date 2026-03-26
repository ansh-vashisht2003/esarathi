import mongoose from "mongoose";

const shareRideSchema = new mongoose.Schema({

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },

  vehicleType: {
    type: String,
    required: true
  },

  vehicleNumber: {
    type: String,
    required: true
  },
  date: {
  type: String,
  required: true
},

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

  status: {
    type: String,
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("ShareRide", shareRideSchema);