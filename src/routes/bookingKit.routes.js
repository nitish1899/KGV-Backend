import express from "express";
import { checkout, bookingVerification } from "../controllers/bookingKit.controller.js";

const router = express.Router();

// Route for initiating the Razorpay checkout process
router.post("/checkout", checkout);

// Route for verifying the Razorpay payment
router.post("/booking-verification", bookingVerification);

export default router;
