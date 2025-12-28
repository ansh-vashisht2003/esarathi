import express from "express";
import { approveDriver } from "../controllers/adminController.js";

const router = express.Router();

// ADMIN APPROVES DRIVER (MANUAL APPROVAL)
router.put("/approve-driver/:driverId", approveDriver);

export default router;
