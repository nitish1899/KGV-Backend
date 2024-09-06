import mongoose from "mongoose";
import { Counter } from "./counter.model.js";  // Import the Counter model
import { itemSchema } from "./cartItems.model.js";

const statusEnum = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema({
    _id: { type: Number },  // Use Number type for sequential ID
    visitor: {
        type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true
    },
    items: [itemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: statusEnum,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    amountToBePaid: {
        type: Number,
        required: true
    },
    order_date: { type: Date, default: Date.now },
    delivery_date: { type: Date }
}, {
    timestamps: true
});

// Pre-save middleware to handle the sequential ID generation
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'orderId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export { Order, statusEnum };

// Initialize the Counter document with starting sequence 999 (if not already done)
// This should be done only once, during setup
// await Counter.create({ _id: 'orderId', seq: 999 });


// import mongoose from "mongoose";
// import { itemSchema } from "./cartItems.model.js";

// const statusEnum = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

// const orderSchema = new mongoose.Schema({
//     _id: { type: Number },
//     visitor: {
//         type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true
//     },
//     items: [itemSchema],
//     totalPrice: {
//         type: Number,  // Changed from String to Number
//         required: true
//     },
//     status: {
//         type: String,
//         enum: statusEnum,  // Added enum validation
//         required: true
//     },
//     order_date: { type: Date, default: Date.now },
//     delivery_date: { type: Date }
// }, {
//     timestamps: true
// });

// const Order = mongoose.model('Order', orderSchema);

// export { Order, statusEnum };
