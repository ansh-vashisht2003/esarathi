import express from "express";

import {
  createRide,
  getSearchingRides,
  acceptRide,
  startRide,
  cancelRide,
  completeRide,
  getTravellerRides
} from "../controllers/rideController.js";
import { getDriverStats } from "../controllers/rideController.js";
const router = express.Router();

/* TRAVELLER CREATE RIDE */
router.post("/create", createRide);

/* DRIVER GET SEARCHING RIDES */
router.get("/searching", getSearchingRides);

/* DRIVER ACCEPT RIDE */
router.post("/accept", acceptRide);

/* DRIVER START RIDE */
router.post("/start", startRide);

/* COMPLETE RIDE */
router.post("/complete", completeRide);

/* GET TRAVELLER RIDE HISTORY */
router.get("/traveller/:email", getTravellerRides);

/* CANCEL RIDE */
router.post("/cancel/:rideId", cancelRide);
router.get("/driver/:email", getDriverStats);
export default router;