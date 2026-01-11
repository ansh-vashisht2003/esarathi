import express from "express";
import {
  getPendingDrivers,
  verifyDriver,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/drivers/pending", getPendingDrivers);
router.post("/drivers/verify", verifyDriver);

export default router;
