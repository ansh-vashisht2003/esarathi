import ShareRide from "../models/ShareRide.js";
import Traveller from "../models/Traveller.js";


/* CREATE SHARE RIDE */

export const createShareRide = async (req, res) => {

  try {

    const ride = new ShareRide(req.body);

    await ride.save();

    res.json({
      message: "Ride created successfully",
      ride
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* SEARCH RIDES */

export const searchSharedRides = async (req, res) => {

  try {

    const { pickup, drop } = req.query;

    const now = new Date();

    const rides = await ShareRide.find({
      status: "active"
    })
      .populate("driver")
      .populate("passengers");

    const validRides = rides.filter((ride) => {

      const rideTime = new Date(
        `${ride.createdAt.toDateString()} ${ride.time}`
      );

      if (rideTime <= now) return false;

      const cities = ride.route.map(r => r.city.toLowerCase());

      const pickupIndex = cities.findIndex(c =>
        c.includes(pickup.toLowerCase())
      );

      const dropIndex = cities.findIndex(c =>
        c.includes(drop.toLowerCase())
      );

      return pickupIndex !== -1 &&
             dropIndex !== -1 &&
             pickupIndex < dropIndex;

    });

    res.json(validRides);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* JOIN RIDE */

export const joinRide = async (req, res) => {

  try {

    const { rideId, travellerEmail } = req.body;

    const ride = await ShareRide.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    if (ride.status !== "active")
      return res.json({ message: "Ride not available" });

    if (ride.availableSeats <= 0)
      return res.json({ message: "No seats left" });

    const traveller = await Traveller.findOne({
      email: travellerEmail
    });

    if (!traveller)
      return res.json({ message: "Traveller not found" });

    if (ride.passengers.includes(traveller._id))
      return res.json({ message: "Already joined ride" });

    ride.passengers.push(traveller._id);

    ride.availableSeats -= 1;

    await ride.save();

    res.json({
      message: "Seat booked successfully",
      ride
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* DRIVER CANCEL RIDE */

export const driverCancelRide = async (req, res) => {

  try {

    const { rideId } = req.params;

    const ride = await ShareRide.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    const rideTime = new Date(
      `${ride.createdAt.toDateString()} ${ride.time}`
    );

    const now = new Date();

    const diffHours = (rideTime - now) / (1000 * 60 * 60);

    if (diffHours < 5)
      return res.json({
        message: "Cannot cancel ride within 5 hours of departure"
      });

    ride.status = "cancelled";

    await ride.save();

    res.json({
      message: "Ride cancelled successfully"
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* TRAVELLER CANCEL BOOKING */

export const travellerCancelRide = async (req, res) => {

  try {

    const { rideId } = req.params;

    const { travellerEmail } = req.body;

    const ride = await ShareRide.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    const traveller = await Traveller.findOne({
      email: travellerEmail
    });

    if (!traveller)
      return res.json({ message: "Traveller not found" });

    const rideTime = new Date(
      `${ride.createdAt.toDateString()} ${ride.time}`
    );

    const now = new Date();

    const diffHours = (rideTime - now) / (1000 * 60 * 60);

    if (diffHours < 10)
      return res.json({
        message: "Cannot cancel within 10 hours of ride"
      });

    ride.passengers = ride.passengers.filter(
      p => p.toString() !== traveller._id.toString()
    );

    ride.availableSeats += 1;

    await ride.save();

    res.json({
      message: "Booking cancelled successfully"
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};