import mongoose, { Schema } from "mongoose";

const visitorSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Name is required"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone Number is required"],
            unique: true,
        },
        pin: {
            type: String,
            required: [true, "Pin Number is required"],
        },
        address: {
            type: String,
            required: false,
        },
        aadhar: {
            type: String,
            required: false,
            unique: true,
        },
        dlno: {
            type: String,
            required: false,
            unique: true,
        },
        dob: {
            type: String,
            required: false
        },
        gender: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export const Visitor = mongoose.model("Visitor", visitorSchema);
