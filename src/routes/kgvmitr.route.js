import express from "express";
import { checkout,  kgvpaymentVerification} from "../controllers/kgvmitra.controller.js";

const router = express.Router();

// Route for initiating the Razorpay checkout process
router.post("/kgvcheckout", checkout);

// Route for verifying the Razorpay payment
router.post("/kgvpayment-verification", kgvpaymentVerification);

export default router;
