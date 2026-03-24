import ShareRide from "../models/ShareRide.js";
import Traveller from "../models/Traveller.js";


/* CREATE SHARE RIDE (Driver posts ride) */

export const createShareRide = async (req, res) => {

  try {

    const ride = new ShareRide(req.body);

    await ride.save();

    res.json({
      message: "Ride created",
      ride
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


/* SEARCH RIDES (Route Matching like BlaBlaCar) */

export const searchSharedRides = async (req, res) => {

  try {

    const { pickup, drop } = req.query;

    const rides = await ShareRide.find()
      .populate("driver")
      .populate("passengers");

    const matched = rides.filter((ride) => {

      const cities = ride.route.map(r => r.city.toLowerCase());

      const pickupIndex = cities.indexOf(pickup.toLowerCase());
      const dropIndex = cities.indexOf(drop.toLowerCase());

      return pickupIndex !== -1 &&
             dropIndex !== -1 &&
             pickupIndex < dropIndex;

    });

    res.json(matched);

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

    if (ride.availableSeats <= 0)
      return res.json({ message: "No seats left" });

    const traveller = await Traveller.findOne({
      email: travellerEmail
    });

    if (!traveller)
      return res.json({ message: "Traveller not found" });

    ride.passengers.push(traveller._id);

    ride.availableSeats -= 1;

    await ride.save();

    res.json({
      message: "Seat booked successfully"
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};