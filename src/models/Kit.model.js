import mongoose, { Schema } from 'mongoose';

const kitSchema = new Schema({
    // Define your schema fields here
    name: { type: String, required: true },
    cost: { type: Number, required: true }
});

const Kit = mongoose.model('Kit', kitSchema);

export { Kit };
