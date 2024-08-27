
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import { Payment } from "../models/payment.model.js";
import crypto from "crypto";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = asyncHandler(async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            throw new ApiError(400, "Invalid amount");
        }

        const options = {
            amount: Number(amount * 1), // Amount in paise
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});

const bookingVerification = asyncHandler(async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new ApiError(400, "Missing required fields");
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body)
            .digest("hex");

        console.log("Signature received:", razorpay_signature);
        console.log("Signature generated:", expectedSignature);

        const isAuthentic = razorpay_signature === expectedSignature;

        const transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            secure: false,
            port: 465,
            // service: " GoDaddy",
            auth: {
                user: process.env.GODADDY_EMAIL, // Update with your Gmail address
                pass: process.env.GODADDY_PASSWORD, // Update with your Gmail password
            },
        });

        if (isAuthentic) {
            const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

            console.log("paymentDetails:", paymentDetails);

            // Save payment details to BookingKit collection
            const bookingKit = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                fullName: paymentDetails.notes.fullName || 'N/A',
                phoneNumber: paymentDetails.notes.phoneNumber || 'N/A',
                address: paymentDetails.notes.address || 'N/A',
                aadhar: paymentDetails.notes.aadhar || 'N/A',
                dlno: paymentDetails.notes.dlno || 'N/A',
                dob: paymentDetails.notes.dob || 'N/A',
                gender: paymentDetails.notes.gender || 'N/A',
                email: paymentDetails.notes.email || 'N/A',
                pan: paymentDetails.notes.pan || 'N/A',
                amount: paymentDetails.notes.amount || 'N/A',
            });

            await bookingKit.save();

            function sendEmailNotification() {
                const mailOptions = {
                    from: "team@kgvl.co.in",
                    to: `${paymentDetails.notes.email}`,
                    subject: "Customer booking Detail",
                    html: `<p>New registration details:</p>
                                <p> Full Name: ${paymentDetails.notes.fullName}</p>
                                 <p>Email: ${paymentDetails.notes.email}</p>
                                 <p>Address: ${paymentDetails.notes.address}</p>
                                 <p>Phone No.: ${paymentDetails.notes.phoneNumber}</p>
                                 <p>razorpay_order_id: ${razorpay_order_id}</p>
                                <p>razorpay_payment_id: ${razorpay_payment_id}</p>`,
                };


                const mailOptions1 = {
                    from: "team@kgvl.co.in",
                    to: "sales@kgvl.co.in",
                    subject: "Customer booking Detail",
                    html: `<p>New registration details:</p>
                                  <p> Full Name: ${paymentDetails.notes.fullName}</p>
                                  <p>Email: ${paymentDetails.notes.email}</p>
                                  <p>Address: ${paymentDetails.notes.address}</p>
                                  <p>Phone No.: ${paymentDetails.notes.phoneNumber}</p>
                                  <p>razorpay_order_id: ${razorpay_order_id}</p>
                                  <p>razorpay_payment_id: ${razorpay_payment_id}</p>`,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("Email error: " + error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                transporter.sendMail(mailOptions1, function (error, info) {
                    if (error) {
                        console.log("Email error: " + error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }

            sendEmailNotification();

            // await deleteVistuserByEmail(email);
            res.redirect(
                `https://benevolent-queijadas-f11d8c.netlify.app/paymentsuccess?reference=${razorpay_payment_id}`);

            // return res.status(200).json({ success: true, razorpay_payment_id, message: "Payment Successful" });
        } else {
            function sendEmailNotification() {

                const mailOptions = {
                    from: "team@kgvl.co.in",
                    to: `${paymentDetails.notes.email}`,
                    subject: "Customer booking Detail",
                    html: `<p>New registration details:</p>
                                       <p>payment failed</p>
                                       <p>again try</p>`,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("Email error: " + error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

            }
            sendEmailNotification();
            //   res.status(400).json({ success: false, });
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
});

export {
    checkout,
    bookingVerification
};
