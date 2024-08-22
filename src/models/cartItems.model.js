import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,  // Changed from String to Number
        required: true
    },
    price: {
        type: Number,  // Changed from String to Number
        required: true
    },
    addons: [{
        addonId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,  // Changed from String to Number
            required: true
        },
        price: {
            type: Number,  // Changed from String to Number
            required: true
        },
    }],
    visitorBikeDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: "Visitorbikedetails", required: true
    }
}, {
    timestamps: true
});

const cartItemSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true
    },
    items: itemSchema
}, {
    timestamps: true
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export { itemSchema, CartItem };