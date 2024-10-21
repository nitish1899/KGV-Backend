import mongoose from "mongoose";

const newpaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    vehicleno: {
        type: String,
        required: false,
    },
    adhaarno: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dailyrunning: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
        required: true,
    },
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
}, { timestamps: true });

const NewPayment = mongoose.model("NewPayment", newpaymentSchema);

export { NewPayment };