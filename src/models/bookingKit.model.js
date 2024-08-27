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
        required: true, 
    }
});

// Create and export the BookingKit model
const BookingKit = mongoose.model("BookingKit", BookingKitSchema);

export { BookingKit };


// import mongoose from "mongoose";

// // Define the BookingKit schema
// const BookingKitSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     aadhar: {
//         type: String,
//         required: true,
//     },
//     dlno: {
//         type: String,
//         required: true,
//     },
//     dob: {
//         type: String,
//         required: true,
//     },
//     gender: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     amount: {
//         type: String,
//         required: true,
//     },
//     razorpay_order_id: {
//         type: String,
//         required: true,
//     },
//     razorpay_payment_id: {
//         type: String,
//         required: true,
//     },
//     razorpay_signature: {
//         type: String,
//         required: true,
//     },
   
// });

// const BookingKit = mongoose.model("BookingKit", BookingKitSchema);

// export { BookingKit };
