import express from "express";
import { approveDriver } from "../controllers/adminController.js";

const router = express.Router();

/*
  ADMIN APPROVE DRIVER

  Endpoint:
  POST /api/admin/approve-driver

  Body:
  {
    "driverId": "DRIVER_ID_HERE",
    "adminPassword": "Admin@123"
  }
*/
router.post("/approve-driver", approveDriver);

export default router;
