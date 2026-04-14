import express from "express";

import {
  createShareRide,
  searchSharedRides,
  joinRide,
  driverCancelRide,
  travellerCancelRide
} from "../controllers/shareRideController.js";

const router = express.Router();

router.post("/create", createShareRide);

router.get("/search", searchSharedRides);

router.post("/join", joinRide);

router.post("/driver-cancel/:rideId", driverCancelRide);

router.post("/traveller-cancel/:rideId", travellerCancelRide);

export default router;