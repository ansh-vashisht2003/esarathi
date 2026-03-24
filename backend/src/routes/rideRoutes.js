import express from "express";
import {
  createRide,
  getSearchingRides,
  acceptRide,
  startRide,
  cancelRide,
} from "../controllers/rideController.js";

const router = express.Router();

/* ======================
   TRAVELLER CREATE RIDE
====================== */
router.post("/create", createRide);

/* ======================
   DRIVER GET SEARCHING RIDES
====================== */
router.get("/searching", getSearchingRides);

/* ======================
   DRIVER ACCEPT RIDE
====================== */
router.post("/accept", acceptRide);

/* ======================
   DRIVER START RIDE (WITH CODE)
====================== */
router.post("/start", startRide);

/* ======================
   TRAVELLER CANCEL RIDE
====================== */
router.post("/cancel", cancelRide);

export default router;
