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
            required: [true, "Aadhar Number is required"],
            unique: true,
        },
        dlno: {
            type: String,
            required: [true, "Dl Number is required"],
            unique: true,
        },
        dob: {
            type: String,
            required: [true, "Dob is required"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
        }
    },
    {
        timestamps: true
    }
);

visitorSchema.index({ aadhar: 1 }, { unique: true, partialFilterExpression: { aadhar: { $exists: true } } });

visitorSchema.index({ dlno: 1 }, { unique: true, partialFilterExpression: { dlno: { $exists: true } } });

visitorSchema.index({ pan: 1 }, { unique: true, partialFilterExpression: { pan: { $exists: true } } });

export const Visitor = mongoose.model("Visitor", visitorSchema);


// import mongoose, { Schema } from "mongoose";

// const visitorSchema = new Schema(
//     {
//         fullName: {
//             type: String,
//             required: [true, "Name is required"],
//         },
//         phoneNumber: {
//             type: String,
//             required: [true, "Phone Number is required"],
//             unique: true,
//         },
//         pin: {
//             type: String,
//             required: [true, "Pin Number is required"],
//         },
//         address: {
//             type: String,
//             required: false,
//         },
//         aadhar: {
//             type: String,
//             required: false,
//             unique: true,
//         },
//         dlno: {
//             type: String,
//             required: false,
//             unique: true,
//         },
//         dob: {
//             type: String,
//             required: false
//         },
//         gender: {
//             type: String,
//             required: false
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// visitorSchema.index({ aadhar: 1 }, { unique: true, partialFilterExpression: { aadhar: { $exists: true } } });

// visitorSchema.index({ dlno: 1 }, { unique: true, partialFilterExpression: { dlno: { $exists: true } } });

// export const Visitor = mongoose.model("Visitor", visitorSchema);
