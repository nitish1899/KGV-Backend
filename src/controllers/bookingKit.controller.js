import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Visitorbikedetails } from "../models/visitorbikedetails.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Razorpay from "razorpay";
import { BookingKit } from "../models/BookingKit.model.js";
import crypto from "crypto";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const bookingVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, visitorBikeDetails } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        console.log("Signature received:", razorpay_signature);
        console.log("Signature generated:", expectedSignature);

        const isAuthentic = razorpay_signature === expectedSignature;

        if (isAuthentic) {
            const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

            console.log("paymentDetails:", paymentDetails);

            // Save payment details to BookingKit collection
            const bookingKit = new BookingKit({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                visitorBikeDetails, // Associate the Visitorbikedetails reference
            });

            await bookingKit.save();

            return res.status(200).json({ success: true, razorpay_payment_id, message: "Payment Successful" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export {
    checkout,
    bookingVerification
};
