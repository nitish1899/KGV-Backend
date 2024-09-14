import express from "express";
import { checkout, paymentVerification } from "../controllers/premimum.cotroller.js";

const router = express.Router();

// Route for initiating the Razorpay checkout process
router.post("/newcheckout", checkout);

// Route for verifying the Razorpay payment
router.post("/payment-verification", paymentVerification);

export default router;
