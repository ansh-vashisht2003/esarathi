import express from "express";

import {
  searchSharedRides,
  joinRide
} from "../controllers/shareRideController.js";

const router = express.Router();

router.get("/search", searchSharedRides);
router.post("/join", joinRide);

export default router;