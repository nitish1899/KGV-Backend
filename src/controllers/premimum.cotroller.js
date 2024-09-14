

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import crypto from "crypto";
import { NewPayment } from "../models/newpayment.model.js";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const options = {
        amount: Number(amount * 100), // Amount in paise
        currency: "INR",
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
});

const paymentVerification = asyncHandler(async (req, res) => {
    const { data: { razorpay_order_id, razorpay_payment_id, razorpay_signature } } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Missing required fields");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body)
        .digest("hex");

    const isAuthentic = razorpay_signature === expectedSignature;
    console.log('GODADDY_PASSWORD', process.env.GODADDY_PASSWORD);
    const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        secure: true,
        port: 465,
        auth: {
            user: process.env.GODADDY_EMAIL,
            pass: process.env.GODADDY_PASSWORD,
        },
    });

    if (isAuthentic) {
        const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
        console.log('paymentDetails', paymentDetails);

        await NewPayment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            name: paymentDetails.notes.name || "N/A",
            phone: paymentDetails.notes.phone || "N/A",
            dlno: paymentDetails.notes.dlno || "N/A",
            adhaarno: paymentDetails.notes.adhaarno || "N/A",
            email: paymentDetails.notes.email || "N/A",
            dailyrunning: paymentDetails.notes.dailyrunning || "N/A",
            amount: Number(paymentDetails.amount) / 100 || "N/A",
        });


        // Send email notification
        // const mailOptionsCustomer = {
        //     from: "team@kgvl.co.in",
        //     to: paymentDetails.notes.email,
        //     subject: "Now You Become a part of cotext - Payment Successful",
        //     html: `
        //         <div>
        //             <h2>cotext Confirmation</h2>
        //             <p>Dear ${paymentDetails.notes.name},</p>
        //             <p>Thank you for becoming part of cotext. Your payment has been processed successfully. Details:</p>
        //             <p><strong>Full Name:</strong> ${paymentDetails.notes.name}</p>
        //             <p><strong>Email:</strong> ${paymentDetails.notes.email}</p>
        //             <p><strong>Adhaar:</strong> ${paymentDetails.notes.adhaarno}</p>
        //             <p><strong>Phone No.:</strong> ${paymentDetails.notes.phone}</p>
        //             <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
        //             <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
        //             <p>If you have any questions, contact support@kgvl.co.in.</p>
        //         </div>
        //     `,
        // };

        // const mailOptionsAdmin = {
        //     from: "team@kgvl.co.in",
        //     to: "sales@kgvl.co.in",
        //     subject: "New Customer Booking Detail",
        //     html: `
        //         <div>
        //             <h2>New Customer Booking</h2>
        //             <p>Details of the new booking:</p>
        //             <p><strong>Full Name:</strong> ${paymentDetails.notes.name}</p>
        //             <p><strong>Email:</strong> ${paymentDetails.notes.email}</p>
        //             <p><strong>Phone No.:</strong> ${paymentDetails.notes.phone}</p>
        //             <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
        //             <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
        //         </div>
        //     `,
        // };

        // Send emails
        // await transporter.sendMail(mailOptionsCustomer);
        // await transporter.sendMail(mailOptionsAdmin);

        return res.status(200).json({ success: true, razorpay_payment_id, message: "Payment Successful" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid signature" });
    }
});

export {
    checkout,
    paymentVerification,
};

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import nodemailer from "nodemailer";
// import Razorpay from "razorpay";
// import { NewPayment } from "../models/newpayment.model.js";
// import crypto from "crypto";

// const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_API_SECRET,
// });

// const checkout = asyncHandler(async (req, res) => {
//     try {
//         const { amount } = req.body;

//         if (!amount || isNaN(amount) || Number(amount) <= 0) {
//             throw new ApiError(400, "Invalid amount");
//         }

//         const options = {
//             amount: Number(amount * 1),
//             currency: "INR",
//         };

//         const order = await instance.orders.create(options);

//         res.status(200).json({
//             success: true,
//             order,
//         });
//     } catch (error) {
//         console.log("Error during checkout:", error);
//         res.status(error.statusCode || 500).json({
//             success: false,
//             message: error.message || "Internal server error",
//         });
//     }
// });

// const paymentVerification = asyncHandler(async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             throw new ApiError(400, "Missing required fields");
//         }

//         const body = razorpay_order_id + "|" + razorpay_payment_id;
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//             .update(body)
//             .digest("hex");

//         // console.log("Signature received:", razorpay_signature);
//         // console.log("Signature generated:", expectedSignature);

//         const isAuthentic = razorpay_signature === expectedSignature;

//         const transporter = nodemailer.createTransport({
//             host: "smtpout.secureserver.net",
//             secure: true,
//             port: 465,
//             // service: " GoDaddy",
//             auth: {
//                 user: process.env.GODADDY_EMAIL,
//                 pass: process.env.GODADDY_PASSWORD,
//             },
//         });

//         if (isAuthentic) {
//             const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

//             console.log("paymentDetails:", paymentDetails);

//             // Save payment details to BookingKit collection
//             const bookingKit = new Payment({
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature,
//                 name: paymentDetails.notes.name || 'N/A',
//                 phone: paymentDetails.notes.phone || 'N/A',
//                 dlno: paymentDetails.notes.dlno || 'N/A',
//                 adhaarno: paymentDetails.notes.adhaarno || 'N/A',
//                 email: paymentDetails.notes.email || 'N/A',
//                 dailyrunning: paymentDetails.notes.dailyrunning || 'N/A',
//                 amount: paymentDetails.notes.amount || 'N/A',
//             });

//             await bookingKit.save();

//             function sendEmailNotification() {
//                 const mailOptions = {
//                     from: "team@kgvl.co.in",
//                     to: `${paymentDetails.notes.email}`,
//                     subject: "Now You Become a part of cotext - Payment Successful",
//                     html: `
//                         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//                             <h2 style="color: #4CAF50;">cotext Confirmation</h2>
//                             <p>Dear ${paymentDetails.notes.name},</p>

//                             <p>Thank you for Become a part of cotext. We are pleased to confirm that your payment has been successfully processed. Below are the details of your transaction:</p>

//                             <h3 style="color: #333;">Booking Details</h3>
//                             <p><strong>Full Name:</strong> ${paymentDetails.notes.name}</p>
//                             <p><strong>Email:</strong> ${paymentDetails.notes.email}</p>
//                             <p><strong>Adhaar:</strong> ${paymentDetails.notes.adhaarno}</p>
//                             <p><strong>Phone No.:</strong> ${paymentDetails.notes.phone}</p>

//                             <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

//                             <h3 style="color: #333;">Payment Information</h3>
//                             <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
//                             <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>

//                             <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

//                             <p>Your Payment is now confirmed, and we will be in touch with further details soon. If you have any questions or need assistance, please don't hesitate to reach out to our support team at <a href="mailto:support@kgvl.co.in" style="color: #4CAF50;">support@kgvl.co.in</a>.</p>

//                             <p>Thank you for choosing KGVL. We look forward to serving you!</p>

//                             <p style="color: #999; font-size: 12px;">&copy; 2024 KGVL. All rights reserved.</p>
//                         </div>
//                     `,

//                 };


//                 const mailOptions1 = {
//                     from: "team@kgvl.co.in",
//                     to: "sales@kgvl.co.in",
//                     subject: "New Customer Booking Detail",
//                     html: `
//                         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//                             <h2 style="color: #FF5722;">New Customer Booking</h2>
//                             <p>A new customer has just completed a booking. Below are the details:</p>

//                             <h3 style="color: #333;">Customer Information</h3>
//                             <p><strong>Full Name:</strong> ${paymentDetails.notes.name}</p>
//                             <p><strong>Email:</strong> ${paymentDetails.notes.email}</p>
//                             <p><strong>Adhaar:</strong> ${paymentDetails.notes.adhaarno}</p>
//                             <p><strong>Phone No.:</strong> ${paymentDetails.notes.phone}</p>

//                             <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

//                             <h3 style="color: #333;">Transaction Details</h3>
//                             <p><strong>Razorpay Order ID:</strong> ${razorpay_order_id}</p>
//                             <p><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>

//                             <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

//                             <p style="color: #555;">Please process this order as soon as possible and update the relevant records.</p>

//                             <p style="color: #999; font-size: 12px;">&copy; 2024 KGVL. All rights reserved.</p>
//                         </div>
//                     `,
//                 };


//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log("Email error: " + error);
//                     } else {
//                         console.log("Email sent: " + info.response);
//                     }
//                 });

//                 transporter.sendMail(mailOptions1, function (error, info) {
//                     if (error) {
//                         console.log("Email error: " + error);
//                     } else {
//                         console.log("Email sent: " + info.response);
//                     }
//                 });
//             }

//             sendEmailNotification();

//             return res.status(200).json({ success: true, razorpay_payment_id, message: "Payment Successful" });
//         } else {
//             function sendEmailNotification() {

//                 const mailOptions = {
//                     from: "team@kgvl.co.in",
//                     to: `${paymentDetails.notes.email}`,
//                     subject: "Customer booking Detail",
//                     html: `<p>New registration details:</p>
//                                        <p>Payment failed</p>
//                                        <p>Try again </p>`,
//                 };

//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log("Email error: " + error);
//                     } else {
//                         console.log("Email sent: " + info.response);
//                     }
//                 });

//             }
//             sendEmailNotification();
//             //   res.status(400).json({ success: false, });
//             return res.status(400).json({ success: false, message: "Invalid signature" });
//         }
//     } catch (error) {
//         console.log("Error during payment verification:", error);
//         res.status(error.statusCode || 500).json({
//             success: false,
//             message: error.message || "Internal server error",
//         });
//     }
// });

// export {
//     checkout,
//     paymentVerification
// };
