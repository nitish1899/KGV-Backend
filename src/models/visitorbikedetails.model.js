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
        },
        model: {
            type: String,
        },
        cc: {
            type: String,
        },
        threeYearPetrolCost: {
            type: Number,
            default: 0,  // Provide a default value
        },
        threeYearKitCost: {
            type: Number,
            default: 0,  // Provide a default value
        },
        petrolKitCostDifference: {
            type: Number,
            default: 0,  // Provide a default value
        },
        visitor: {
            type : mongoose.Schema.Types.ObjectId, ref:"Visitor"
        }
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
visitorbikedetailsSchema.pre('save', function(next) {
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

// import mongoose, { Schema } from "mongoose";

// const visitorbikedetailsSchema = new Schema(
//     {
//         vehicleno: {
//             type: String, 
//             required: [true, "vehicleno is required"],
//             unique: true,
//         },
//         runningPerDay: {
//             type: String, 
//             required: [true, "Running Per Day Number is required"],
//         },
//         feultype: {
//             type: String,
//         },
//         model: {
//             type: String,
//         },
//         cc: {
//             type: String,
//         },
//         threeYearPetrolCost: {
//             type: Number,
//         },
//         threeYearKitCost: {
//             type: Number,
//         },
//         totalThreeYearCost: {
//             type: Number,
//         },
//         petrolKitCostDifference: {
//             type: Number, // New field to store the difference between petrol and kit cost
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Set the petrol price, mileage per liter, and kit cost
// const petrolPricePerLiter = 95; // ₹
// const mileagePerLiter = 40; // Assuming 40 km/l, adjust if you have a different value
// const kitCostPerYear = 21 * 365; // ₹ for 100 km per 21 rupees, adjust if needed

// // Pre-save hook to calculate threeYearPetrolCost, totalThreeYearCost, and the cost difference
// visitorbikedetailsSchema.pre('save', function(next) {
//     const annualDistance = this.runningPerDay * 365; // km
//     const annualPetrolNeeded = annualDistance / mileagePerLiter; // liters
//     const annualPetrolCost = annualPetrolNeeded * petrolPricePerLiter; // ₹
//     this.threeYearPetrolCost = annualPetrolCost * 3; // ₹

//     const totalKitCost = kitCostPerYear * 3; // Total kit cost for three years
//     this.threeYearKitCost = totalKitCost;

//     this.totalThreeYearCost = this.threeYearPetrolCost + this.threeYearKitCost; // Sum of petrol and kit cost

//     // Calculate the difference between petrol and kit cost
//     this.petrolKitCostDifference = this.threeYearPetrolCost - this.threeYearKitCost;

//     next();
// });

// export const Consumer = mongoose.model("visitorbikedetails", visitorbikedetailsSchema);

// import mongoose, { Schema } from "mongoose";

// const visitorbikedetailsSchema = new Schema(
//     {
//         vehicleno: {
//             type: String, 
//             required: [true, "vehicleno is required"],
//             unique: true,
//         },
//         runningPerDay: {
//             type: String, 
//             required: [true, "Running Per Day Number is required"],
//         },
//         feultype: {
//             type: String,
//         },
//         model: {
//             type: String,
//         },
//         cc: {
//             type: String,
//         },
//         threeYearPetrolCost: {
//             type: Number,
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// // Set the petrol price and mileage per liter
// const petrolPricePerLiter = 95; // ₹
// const mileagePerLiter = 40; // Assuming 40 km/l, adjust if you have a different value

// // Pre-save hook to calculate threeYearPetrolCost
// visitorbikedetailsSchema.pre('save', function(next) {
//     const annualDistance = this.runningPerDay * 365; // km
//     const annualPetrolNeeded = annualDistance / mileagePerLiter; // liters
//     const annualPetrolCost = annualPetrolNeeded * petrolPricePerLiter; // ₹
//     this.threeYearPetrolCost = annualPetrolCost * 3; // ₹
//     next();
// });

// export const Consumer = mongoose.model("visitorbikedetails", visitorbikedetailsSchema);



// import mongoose, { Schema } from "mongoose";

// const visitorbikedetailsSchema = new Schema(
//     {
//         vehicleno: {
//             type: String, 
//             required: [true, "vehicleno is required"],
//             unique: true,
//         },
//         runningPerDay: {
//             type: String, 
//             required: [true, "Running Per Day Number is required"],
           
//         },
//         feultype: {
//             type: String,
    
//         },
//         model: {
//             type: String,
           
//         },
//         cc: {
//             type: String,
           
//         },

//     },
//     {
//         timestamps: true
//     }
// );

// export const Consumer = mongoose.model("visitorbikedetails", visitorbikedetailsSchema);
