import express from "express";
import ShareRide from "../models/ShareRide.js";

const router = express.Router();


/* CREATE RIDE */

router.post("/create", async (req, res) => {

  try {

    const ride = new ShareRide(req.body);

    await ride.save();

    res.json({
      message: "Ride created successfully",
      ride
    });

  }
  catch (err) {

    res.status(500).json({
      message: "Error creating ride"
    });

  }

});


/* GET ALL ACTIVE RIDES */

router.get("/all", async (req, res) => {

  try {

    const now = new Date();

    const rides = await ShareRide.find({
      status: "active"
    }).populate("driver");

    const validRides = rides.filter(ride => {

      const rideTime = new Date(`${ride.date}T${ride.time}`);

      return rideTime > now;

    });

    res.json(validRides);

  }
  catch (err) {

    res.status(500).json({
      message: "Error fetching rides"
    });

  }

});


/* BOOK RIDE */

router.post("/book", async (req, res) => {

  try {

    const { rideId, travellerId } = req.body;

    const ride = await ShareRide.findById(rideId);

    if (!ride) {
      return res.json({ message: "Ride not found" });
    }

    if (ride.availableSeats <= 0) {
      return res.json({ message: "No seats available" });
    }

    if (ride.passengers.includes(travellerId)) {
      return res.json({ message: "Already booked" });
    }

    ride.passengers.push(travellerId);

    ride.availableSeats -= 1;

    await ride.save();

    res.json({
      message: "Ride booked successfully"
    });

  }
  catch (err) {

    res.status(500).json({
      message: "Booking failed"
    });

  }

});


/* DRIVER CANCEL RIDE */

router.post("/driver-cancel/:rideId", async (req, res) => {

  try {

    const ride = await ShareRide.findById(req.params.rideId);

    if (!ride) {
      return res.json({ message: "Ride not found" });
    }

    const rideTime = new Date(`${ride.date}T${ride.time}`);

    const now = new Date();

    const diffHours = (rideTime - now) / (1000 * 60 * 60);

    if (diffHours < 5) {

      return res.json({
        message: "Driver cannot cancel within 5 hours of departure"
      });

    }

    ride.status = "cancelled";

    await ride.save();

    res.json({
      message: "Ride cancelled successfully"
    });

  }
  catch (err) {

    res.status(500).json({
      message: "Error cancelling ride"
    });

  }

});


/* TRAVELLER CANCEL BOOKING */

router.post("/traveller-cancel/:rideId", async (req, res) => {

  try {

    const { travellerId } = req.body;

    const ride = await ShareRide.findById(req.params.rideId);

    if (!ride) {
      return res.json({ message: "Ride not found" });
    }

    const rideTime = new Date(`${ride.date}T${ride.time}`);

    const now = new Date();

    const diffHours = (rideTime - now) / (1000 * 60 * 60);

    if (diffHours < 10) {

      return res.json({
        message: "Traveller cannot cancel within 10 hours of departure"
      });

    }

    ride.passengers = ride.passengers.filter(
      p => p.toString() !== travellerId
    );

    ride.availableSeats += 1;

    await ride.save();

    res.json({
      message: "Booking cancelled successfully"
    });

  }
  catch (err) {

    res.status(500).json({
      message: "Error cancelling booking"
    });

  }

});


export default router;