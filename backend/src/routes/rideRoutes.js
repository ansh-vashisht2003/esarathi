import express from "express";

import {
  createRide,
  getSearchingRides,
  acceptRide,
  startRide,
  cancelRide,
  completeRide
} from "../controllers/rideController.js";

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

/* CANCEL RIDE */
router.post("/cancel/:rideId", cancelRide);

export default router;