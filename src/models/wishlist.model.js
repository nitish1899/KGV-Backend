import mongoose from "mongoose";
import { itemSchema } from "./cartItems.model.js";

const wishlistSchema = new mongoose.Schema({
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
    item: itemSchema,
}, {
    timestamps: true
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
