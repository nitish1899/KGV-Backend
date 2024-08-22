import mongoose from "mongoose";

// Define the BookingKit schema
const BookingKitSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    visitorBikeDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitorbikedetails",
        required: true, // Set to true if the association is mandatory
    }
});

// Create and export the BookingKit model
const BookingKit = mongoose.model("BookingKit", BookingKitSchema);

export { BookingKit };