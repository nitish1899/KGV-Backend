import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const referralSchema = new Schema({
    referralCode: {
        type: String,
        required: true,
        unique: true
    },
    referrer: {
        type: Schema.Types.ObjectId,
        ref: 'Visitor',  
        required: true
    },
    referredUser: {
        type: Schema.Types.ObjectId,
        ref: 'Visitor',  // 'User' is also used for the referred user
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false  // This will be set to true when the referral is used
    },
    usedAt: {
        type: Date,
        default: null  // Set when the referral code is used
    }
}, {
    timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);

export { Referral };