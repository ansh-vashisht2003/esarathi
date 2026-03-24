import Ride from "../models/Ride.js";
import Driver from "../models/Driver.js";

/* =========================
   GENERATE UNIQUE RIDE CODE
========================= */
const generateRideCode = () => {
  return "ESR-" + Math.floor(100000 + Math.random() * 900000);
};

/* =========================
   CREATE RIDE (Traveller)
========================= */
export const createRide = async (req, res) => {
  try {
    const rideCode = generateRideCode();

    const ride = await Ride.create({
      ...req.body,
      rideCode,
      status: "SEARCHING",
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SEARCHING RIDES (Driver)
========================= */
export const getSearchingRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "SEARCHING" });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DRIVER ACCEPT RIDE ✅ FIXED
========================= */
export const acceptRide = async (req, res) => {
  try {
    const { rideId, driverEmail } = req.body;

    console.log("🔥 Accept Ride Request:", rideId, driverEmail);

    // ✅ find driver from DB
    const fullDriver = await Driver.findOne({ email: driverEmail });

    if (!fullDriver) {
      console.log("❌ Driver not found in DB");
      return res.status(404).json({ message: "Driver not found" });
    }

    // ✅ update ride with driver info
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      {
        status: "ACCEPTED",
        driver: {
          name: fullDriver.name,
          email: fullDriver.email,
          phone: fullDriver.phone,
          profilePic: fullDriver.profilePic,
          numberPlate: fullDriver.numberPlate,
          vehicleType: fullDriver.vehicleType,
        },
        acceptedAt: new Date(),
      },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    console.log("✅ Driver added to ride:", ride.driver);

    // ✅ send driver details to traveller
    const io = req.app.get("io");

    io.to(ride.traveller.email).emit("rideAccepted", {
      rideId: ride._id,
      rideCode: ride.rideCode,
      driver: ride.driver,
    });

    console.log("📡 Sent driver to traveller:", ride.traveller.email);

    res.json(ride);
  } catch (err) {
    console.error("❌ acceptRide error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   START RIDE (Driver enters code)
========================= */
export const startRide = async (req, res) => {
  try {
    const { rideCode } = req.body;

    const ride = await Ride.findOne({ rideCode });

    if (!ride) {
      return res.status(404).json({ message: "Invalid Ride Code" });
    }

    ride.status = "STARTED";
    ride.startedAt = new Date();
    await ride.save();

    const io = req.app.get("io");

    io.to(ride.traveller.email).emit("rideStarted", {
      rideId: ride._id,
      rideCode: ride.rideCode,
    });

    res.json({ message: "Ride started successfully", ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CANCEL RIDE
========================= */
export const cancelRide = async (req, res) => {
  try {
    const { rideCode } = req.body;

    const ride = await Ride.findOne({ rideCode });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "CANCELLED";
    ride.cancelledAt = new Date();
    await ride.save();

    const io = req.app.get("io");
    io.emit("rideCancelled", { rideCode });

    res.json({ message: "Ride cancelled successfully", ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
