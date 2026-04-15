import ShareRide from "../models/ShareRide.js";
import Traveller from "../models/Traveller.js";


/* CREATE SHARE RIDE */

export const createShareRide = async (req, res) => {

  try {

    const {
      driver,
      vehicleType,
      vehicleNumber,
      pickup,
      drop,
      route = [],
      totalPrice,
      seats,
      date,
      time
    } = req.body;

    const locations = [
      pickup.city,
      ...route.map(r => r.city),
      drop.city
    ];

    const totalDistance = 200;

    const totalPriceNum = Number(totalPrice);
    const seatsNum = Number(seats);

    const pricePerKm = totalPriceNum / totalDistance;

    const segments = [];

    for (let i = 0; i < locations.length - 1; i++) {

      segments.push({
        from: locations[i],
        to: locations[i + 1],
        seatsUsed: 0
      });

    }

    const ride = new ShareRide({

      driver,
      vehicleType,
      vehicleNumber,

      pickup,
      drop,
      route,

      totalPrice: totalPriceNum,
      totalDistance,
      pricePerKm,

      seats: seatsNum,
      availableSeats: seatsNum,

      segments,
      date,
      time

    });

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

      const rideTime = new Date(`${ride.date}T${ride.time}`);

      if (rideTime <= now) return false;

      const cities = [
        ride.pickup.city,
        ...ride.route.map(r => r.city),
        ride.drop.city
      ].map(c => c.toLowerCase());

      const pickupIndex = cities.findIndex(c =>
        c.includes(pickup.toLowerCase())
      );

      const dropIndex = cities.findIndex(c =>
        c.includes(drop.toLowerCase())
      );

      if (
        pickupIndex !== -1 &&
        dropIndex !== -1 &&
        pickupIndex < dropIndex
      ) {

        let maxSeatsUsed = 0;

        for (let i = pickupIndex; i < dropIndex; i++) {
          if (ride.segments[i].seatsUsed > maxSeatsUsed) {
            maxSeatsUsed = ride.segments[i].seatsUsed;
          }
        }

        ride.availableSeats = ride.seats - maxSeatsUsed;

        return ride.availableSeats > 0;

      }

      return false;

    });

    res.json(validRides);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* JOIN RIDE (MULTI SEAT BOOKING) */

export const joinRide = async (req, res) => {

  try {

    const { rideId, travellerEmail, pickup, drop, seats, passengerNames } = req.body;

    const ride = await ShareRide.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    if (ride.status !== "active")
      return res.json({ message: "Ride not active" });

    const traveller = await Traveller.findOne({
      email: travellerEmail
    });

    if (!traveller)
      return res.json({ message: "Traveller not found" });


    const cities = [
      ride.pickup.city,
      ...ride.route.map(r => r.city),
      ride.drop.city
    ];


    const pickupIndex = cities.findIndex(c =>
      c.toLowerCase().includes(pickup.toLowerCase())
    );

    const dropIndex = cities.findIndex(c =>
      c.toLowerCase().includes(drop.toLowerCase())
    );

    if (pickupIndex === -1 || dropIndex === -1)
      return res.json({ message: "Invalid pickup/drop location" });

    if (pickupIndex >= dropIndex)
      return res.json({ message: "Invalid route direction" });


    const seatCount = Number(seats);

    if (!passengerNames || passengerNames.length !== seatCount) {
      return res.json({
        message: "Please enter all passenger names"
      });
    }


    /* CHECK SEGMENT SEAT AVAILABILITY */

    for (let i = pickupIndex; i < dropIndex; i++) {

      if (ride.segments[i].seatsUsed + seatCount > ride.seats) {

        return res.json({
          message: "Not enough seats available for this segment"
        });

      }

    }


    /* RESERVE SEGMENTS */

    for (let i = pickupIndex; i < dropIndex; i++) {

      ride.segments[i].seatsUsed += seatCount;

    }


    /* ADD PASSENGERS */

    for (let i = 0; i < seatCount; i++) {
      ride.passengers.push(traveller._id);
    }


    /* STORE BOOKING DETAILS */

    ride.bookings.push({
      traveller: traveller._id,
      phone: traveller.phone,
      seats: seatCount,
      passengerNames,
      pickupCity: cities[pickupIndex],
      dropCity: cities[dropIndex]
    });


    const maxSeatsUsed = Math.max(...ride.segments.map(s => s.seatsUsed));

    ride.availableSeats = ride.seats - maxSeatsUsed;


    const segmentCount = dropIndex - pickupIndex;

    const segmentDistance =
      ride.totalDistance / ride.segments.length;

    const passengerDistance =
      segmentDistance * segmentCount;

    const price =
      passengerDistance * ride.pricePerKm * seatCount;


    await ride.save();


    res.json({

      message: "Seats booked successfully",

      price: Math.round(price),

      seatsBooked: seatCount,

      passengers: passengerNames

    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* DRIVER CANCEL */

export const driverCancelRide = async (req, res) => {

  try {

    const { rideId } = req.params;

    const ride = await ShareRide.findById(rideId);

    if (!ride)
      return res.json({ message: "Ride not found" });

    ride.status = "cancelled";

    await ride.save();

    res.json({
      message: "Ride cancelled successfully"
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



/* TRAVELLER CANCEL */

export const travellerCancelRide = async (req, res) => {

  try {

    const { rideId } = req.params;
    const { travellerEmail } = req.body;

    const ride = await ShareRide.findById(rideId);

    const traveller = await Traveller.findOne({
      email: travellerEmail
    });

    ride.passengers = ride.passengers.filter(
      p => p.toString() !== traveller._id.toString()
    );

    ride.availableSeats += 1;

    await ride.save();

    res.json({
      message: "Booking cancelled"
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};



export const getTravellerShareRideHistory = async (req, res) => {

  try {

    const { email } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const rides = await ShareRide.find({
      date: { $lt: today }
    })
      .populate("driver", "name vehicleNumber")
      .sort({ date: -1 });

    res.json(rides);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



export const getDriverUpcomingShareRides = async (req, res) => {

  try {

    const { email } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const rides = await ShareRide.find({
      date: { $gte: today }
    })
      .populate("driver", "name email vehicleNumber")
      .sort({ date: 1 });

    res.json(rides);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};