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

  /* PRICE SYSTEM */

  totalPrice: {
    type: Number,
    required: true
  },

  totalDistance: {
    type: Number
  },

  pricePerKm: {
    type: Number
  },

  seats: {
    type: Number,
    required: true
  },

  availableSeats: {
    type: Number
  },

  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traveller"
    }
  ],
bookings: [
{
  traveller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Traveller"
  },
  phone: String,
  seats: Number,
  passengerNames: [String],

  pickupCity: String,
  dropCity: String
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
  }, 
  segments: [
  {
    from: String,
    to: String,
    seatsUsed: Number
  }
]

});

export default mongoose.model("ShareRide", shareRideSchema);