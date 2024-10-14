import mongoose from 'mongoose';

const primumuploadSchema = new mongoose.Schema({
    visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true }, // Reference to Visitor
    amount: { type: Number, required: true },
    images: [String],
    createdAt: { type: Date, default: Date.now },
});

const PrimumUpload = mongoose.model('PrimumUpload', primumuploadSchema);

export default PrimumUpload;