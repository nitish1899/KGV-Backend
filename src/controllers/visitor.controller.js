import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Visitor } from "../models/visitor.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import axios from "axios";
import otpGenerator from 'otp-generator';
import Razorpay from "razorpay";
import { Payment } from "../models/payment.model.js";
import crypto from "crypto";

// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_APT_SECRET,
// });

// const checkout = async (req, res) => {
//     const options = {
//         amount: Number(req.body.amount * 100),
//         currency: "INR",
//         // note_key: "email sent succefully to TWCPL"

//     };
//     const order = await instance.orders.create(options);

//     res.status(200).json({
//         success: true,
//         order,
//     });
// };

// // async function bookVehicle(req, res) {
// //     const { dlno, uploadphoto, selectkit, addons, waveamount } = req.body;

// // }

// const paymentVerification = async (req, res) => {

//     // try {

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//         .update(body.toString())
//         .digest("hex");


//     console.log("sig received ", razorpay_signature);
//     console.log("sig generated ", expectedSignature);
//     const isAuthentic = razorpay_signature === expectedSignature;
//     //  const isAuthentic = razorpay_order_id === razorpay_payment_id;

//     console.log("payment done now checking");


//     var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_APT_SECRET })
//     var response = await instance.payments.fetch(razorpay_payment_id);

//     console.log(response);

//     console.log(response.notes.firstname);

//     if (isAuthentic) {
//         const firstname = response.notes.firstname;
//         const lastname = response.notes.lastname;
//         const email = response.notes.email;
//         const address = response.notes.address;
//         const phonenumber = response.notes.phonenumber;

//         // Database comes here
//         await Payment.create({
//             firstname,
//             lastname,
//             email,
//             address,
//             phonenumber,
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature
//         });

//         res.redirect(
//             `https://benevolent-queijadas-f11d8c.netlify.app/paymentsuccess?reference=${razorpay_payment_id}`);



//     } else {


//         res.status(400).json({ success: false, });
//     }


// };

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

        // console.log('instance',instance)

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

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET) // Fix the environment variable name
            .update(body.toString())
            .digest("hex");

        console.log("Signature received:", razorpay_signature);
        console.log("Signature generated:", expectedSignature);

        const isAuthentic = razorpay_signature === expectedSignature;

        console.log("Payment verification:", isAuthentic);

        if (isAuthentic) {
            const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

            console.log("paymentDetails : ", paymentDetails)

            const { address } = paymentDetails.notes;

            // Save to database
            await Payment.create({
                name: paymentDetails.card.name || "ASWAL",
                email: paymentDetails.email,
                address,
                phonenumber: paymentDetails.contact,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            return res.status(200).json({ success: true, razorpay_payment_id, message: "Payment Successful" });;

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

const verifyKYC = asyncHandler(async (req, res) => {
    // uid, name, dob, gender, mobile
    const { fullName, phoneNumber, address, aadhar, dlno, dob, gender } = req.body;

    // Check if any required field is missing
    if ([fullName, phoneNumber, address, aadhar, dlno, dob, gender].some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if a Visitor with the same phone number, aadhar, or dlno already exists
    const existedUser = await Visitor.findOne({ phoneNumber });

    if (existedUser) {
        let errorMsg = '';
        if (existedUser.phoneNumber === phoneNumber) {
            errorMsg = "User with this phone number already exists";
        } else if (existedUser.aadhar === aadhar) {
            errorMsg = "User with this Aadhar number already exists";
        } else if (existedUser.dlno === dlno) {
            errorMsg = "User with this DL number already exists";
        }

        throw new ApiError(400, errorMsg);
    }

    await aadharVerification(aadhar, fullName, dob, gender, phoneNumber);
    await drivingLicenceVerification(dlno, dob);
    // Create the new Visitor
    const visitor = await Visitor.findByIdAndUpdate({ phoneNumber }, {
        address, aadhar, dlno, dob, gender
    });

    // Fetch the created Visitor to avoid returning the refresh token
    // const createdVisitor = await Visitor.findById(visitor._id).select("-refreshToken");

    // if (!createdVisitor) {
    //   throw new ApiError(500, "Something went wrong while registering the user");
    // }

    // Return the created Visitor
    return res.status(201).json(
        new ApiResponse(201, visitor, "User registered successfully")
    );
});



export {
    checkout, paymentVerification, verifyKYC
}