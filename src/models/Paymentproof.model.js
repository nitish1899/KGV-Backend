import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
    visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true }, // Reference to Visitor
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }, // Reference to Cart
    amount: { type: Number, required: true },  // Amount for payment
    images: [String],  // Array of images (up to 4)
    createdAt: { type: Date, default: Date.now },  // Timestamp for when the record was created
    paymentFor: { type: String, required: true },
});

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;
