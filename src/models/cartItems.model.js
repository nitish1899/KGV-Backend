import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    kit: {
        type: mongoose.Schema.Types.ObjectId, ref: "Kit",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    addons: [{
        addOnItemId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,  // Changed from String to Number
            required: true
        },
    }],
    price: {
        type: Number,
        required: true
    },
    vehicleno: {
        type: String,
        required: true
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
    item: itemSchema,
}, {
    timestamps: true
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export { itemSchema, CartItem };