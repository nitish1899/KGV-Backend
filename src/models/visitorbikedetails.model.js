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

// Set the petrol price, kit cost, and mileage per liter
const petrolPricePerLiter = 95; // ₹
const kitCostPer100Km = 21; // ₹
const mileagePerLiter = 40; // Assuming 40 km/l

// Pre-save hook to calculate costs
visitorbikedetailsSchema.pre('save', function (next) {
    const annualDistance = this.runningPerDay * 365; // km
    const annualPetrolNeeded = annualDistance / mileagePerLiter; // liters
    const annualPetrolCost = annualPetrolNeeded * petrolPricePerLiter; // ₹
    this.threeYearPetrolCost = annualPetrolCost * 3; // ₹

    const annualKitCost = (annualDistance / 100) * kitCostPer100Km; // ₹
    this.threeYearKitCost = annualKitCost * 3; // ₹

    this.petrolKitCostDifference = this.threeYearPetrolCost - this.threeYearKitCost; // ₹

    next();
});

export const Visitorbikedetails = mongoose.model("Visitorbikedetails", visitorbikedetailsSchema);
