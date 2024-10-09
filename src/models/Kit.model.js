import mongoose, { Schema } from 'mongoose';

const kitSchema = new Schema({
    // Define your schema fields here
    name: { type: String, required: true },
    price: { type: Number, required: true },
    addonItems: [{
        type: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });

const Kit = mongoose.model('Kit', kitSchema);

export { Kit };
