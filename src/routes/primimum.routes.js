import express from "express";
import { checkout, contestPaymentVerification ,premiumUserPaymentVerification} from "../controllers/premimum.cotroller.js";

const router = express.Router();

// Route for initiating the Razorpay checkout process
router.post("/newcheckout", checkout);

// Route for verifying the Razorpay payment
router.post("/contest/payment-verification", contestPaymentVerification);
router.post("/premium/payment-verification", premiumUserPaymentVerification);

export default router;
