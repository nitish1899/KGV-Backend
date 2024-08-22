import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true
    },
    totalPrice: {
        type: Number,  // Changed from String to Number
        required: true
    }
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export { Cart };
