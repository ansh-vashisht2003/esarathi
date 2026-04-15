import Ride from "../models/Ride.js";
import Driver from "../models/Driver.js";

/* CREATE RIDE */

export const createRide = async (req, res) => {

  try {

    const {
      traveller,
      pickup,
      drop,
      vehicleType,
      distance,
      eta,
      fare
    } = req.body;

    const rideCode = "ESR-" + Math.floor(100000 + Math.random() * 900000);

    const ride = new Ride({
      rideCode,
      traveller,
      pickup,
      drop,
      vehicleType,
      distance,
      eta,
      fare,
      status: "SEARCHING"
    });

    await ride.save();

    const io = req.app.get("io");

    io.emit("newRideRequest", ride);

    res.json(ride);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



/* GET SEARCHING RIDES */

export const getSearchingRides = async (req, res) => {

  try {

    const rides = await Ride.find({
      status: "SEARCHING"
    }).sort({ createdAt: -1 });

    res.json(rides);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



/* DRIVER ACCEPT */

export const acceptRide = async (req, res) => {

  try {

    const { rideId, driverEmail } = req.body;

    const driver = await Driver.findOne({ email: driverEmail });

    if (!driver)
      return res.json({ message: "Driver not found" });

    const ride = await Ride.findOneAndUpdate(

      {
        _id: rideId,
        status: "SEARCHING"
      },

      {
        status: "ACCEPTED",

        driver: {
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          profilePic: driver.profilePic,
          numberPlate: driver.numberPlate,
          vehicleType: driver.vehicleType
        },

        acceptedAt: new Date()
      },

      { new: true }

    );

    if (!ride)
      return res.json({
        message: "Ride already accepted by another driver"
      });

    const io = req.app.get("io");

    io.emit("rideAccepted", ride._id);

    io.to(ride.traveller.email).emit("rideDriverAssigned", {
      rideId: ride._id,
      rideCode: ride.rideCode,
      driver: ride.driver
    });

    res.json(ride);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



/* START RIDE */

export const startRide = async (req, res) => {

  try {

    const { rideCode } = req.body;

    const ride = await Ride.findOne({
      rideCode,
      status: "ACCEPTED"
    });

    if (!ride)
      return res.json({ message: "Invalid OTP" });

    ride.status = "STARTED";
    ride.startedAt = new Date();

    await ride.save();

    const io = req.app.get("io");

    io.to(ride.traveller.email).emit("rideStarted", ride);

    res.json({ message: "Ride started", ride });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



/* COMPLETE RIDE */

export const completeRide = async (req, res) => {

  try {

    const { rideId } = req.body;

    const ride = await Ride.findOne({
      _id: rideId,
      status: "STARTED"
    });

    if (!ride)
      return res.json({ message: "Ride not started yet" });

    ride.status = "COMPLETED";
    ride.completedAt = new Date();

    await ride.save();

    res.json({ message: "Ride completed", ride });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



/* CANCEL RIDE */

export const cancelRide = async (req, res) => {

  try {

    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    if (ride.status === "COMPLETED")
      return res.json({ message: "Ride already completed" });

    ride.status = "CANCELLED";
    ride.cancelledAt = new Date();

    await ride.save();

    const io = req.app.get("io");

    io.emit("rideCancelled", ride._id);

    res.json({ message: "Ride cancelled", ride });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};