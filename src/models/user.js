import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dlno: {
        type: String,
        required: true,
    },
    adhaarno: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dailyrunning: {
        type: String,
        required: true,
    },
    imageUrls: {
        type: [String],
        required: true,
    },
    reward: {
        type: String,
        required: false,
    },
    isParticipated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     imageUrls: {
//         type: [String],
//         required: true,
//     },
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
