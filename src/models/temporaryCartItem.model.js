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
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    kitPrice: {
        type: Number,
        required: true
    },
    vehicleno: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const temporaryCartItemSchema = new mongoose.Schema({
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

const TemporaryCartItem = mongoose.model('TemporaryCartItem', temporaryCartItemSchema);

export { itemSchema, TemporaryCartItem };