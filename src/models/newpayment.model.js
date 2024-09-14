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
    dlno: {
        type: String,
        required: true,
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
        required: true,
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
});

const NewPayment = mongoose.model("NewPayment", newpaymentSchema);

export { NewPayment };