import mongoose from "mongoose";
import { itemSchema } from "./cartItems.model.js";

const statusEnum = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    visitor: {
        type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true
    },
    items: [itemSchema],
    totalPrice: {
        type: Number,  // Changed from String to Number
        required: true
    },
    status: {
        type: String,
        enum: statusEnum,  // Added enum validation
        required: true
    },
    order_date: { type: Date, default: Date.now },
    delivery_date: { type: Date }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export { Order, statusEnum };
