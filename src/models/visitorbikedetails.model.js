import mongoose, { Schema } from "mongoose";

const visitorbikedetailsSchema = new Schema(
    {
        vehicleno: {
            type: String,
            required: [true, "vehicleno is required"],
            unique: true,
        },
        runningPerDay: {
            type: String,
            required: [true, "Running Per Day Number is required"],
        },
        fueltype: {
            type: String,
            enum: ['Petrol', 'Diesel', 'CNG'],
            required: [true, "Fuel type is required"],
        },
        model: {
            type: String,
        },
        cc: {
            type: String,
            enum: ['100', '125', '150'],
            required: [true, "cc is required"],
        },
        threeYearPetrolCost: {
            type: Number,
            default: 0,
        },
        threeYearKitCost: {
            type: Number,
            default: 0,
        },
        petrolKitCostDifference: {
            type: Number,
            default: 0,
        },
        visitor: {
            type: mongoose.Schema.Types.ObjectId, ref: "Visitor"
        },
        kit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }],
    },
    {
        timestamps: true
    }
);

// Pre-save hook to calculate costs
visitorbikedetailsSchema.pre('save', function (next) {
    this.threeYearPetrolCost = 4380 * this.runningPerDay; //  (3 year * 365 days * ₹4/km) * (x km)

    this.threeYearKitCost = 153.3 * this.runningPerDay; // (3 year * 365 days * ₹0.14/km)*(x km)

    this.petrolKitCostDifference = this.threeYearPetrolCost - this.threeYearKitCost; // ₹

    next();
});

export const Visitorbikedetails = mongoose.model("Visitorbikedetails", visitorbikedetailsSchema);
