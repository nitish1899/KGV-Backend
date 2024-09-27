import mongoose, { Schema } from 'mongoose';

const kitSchema = new Schema({
    // Define your schema fields here
    name: { type: String, required: true },
    price: { type: Number, required: true },
    addonItems: {
        type: [{
            name: { type: String, required: true },
            price: { type: String, required: true }
        }]
    }
}, { timestamps: true });

const Kit = mongoose.model('Kit', kitSchema);

export { Kit };
