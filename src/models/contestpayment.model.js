import mongoose from 'mongoose';

const contestuploadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    images: [String],
    createdAt: { type: Date, default: Date.now },
});

const ContestUpload = mongoose.model('ContestUpload', contestuploadSchema);

export default ContestUpload;