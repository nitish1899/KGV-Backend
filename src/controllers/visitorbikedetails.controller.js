import { asyncHandler } from "../utils/asyncHandler.js";
import { Visitorbikedetails } from '../models/visitorbikedetails.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Visitor } from "../models/visitor.model.js";

const createVisitorBikeDetail = asyncHandler(async (req, res) => {
    const { vehicleno, runningPerDay, fueltype, model, cc, visitorId } = req.body;

    if (!vehicleno || !runningPerDay) {
        throw new ApiError(400, "Vehicle number and running per day are required");
    }

    // Check if the bike details already exist
    const [existingDetail, visitor] = await Promise.all(
        [
            Visitorbikedetails.findOne({ vehicleno }),
            Visitor.findOne({ _id: visitorId })
        ]);

    if (existingDetail) {
        throw new ApiError(409, "Bike details with this vehicle number already exist");
    }

    // Create the visitor bike detail
    const visitorBikeDetail = await Visitorbikedetails.create({
        vehicleno,
        runningPerDay,
        fueltype,
        model,
        cc,
        visitor
    });

    return res.status(201).json(new ApiResponse(201, {
        visitorBikeDetail,
        threeYearPetrolCost: `₹${visitorBikeDetail.threeYearPetrolCost.toFixed(2)}`,
        threeYearKitCost: `₹${visitorBikeDetail.threeYearKitCost.toFixed(2)}`,
        petrolKitCostDifference: `₹${visitorBikeDetail.petrolKitCostDifference.toFixed(2)}`
    }, "Visitor bike detail created successfully"));
});

const getVisitorBikeDetailById = asyncHandler(async (req, res) => {
    const { vehicleno } = req.params;

    // Fetch the bike details based on the ID
    const visitorBikeDetails = await Visitorbikedetails.findOne({ vehicleno });

    if (!visitorBikeDetails) {
        throw new ApiError(404, "Visitor bike detail not found");
    }

    return res.status(200).json(new ApiResponse(200, {
        visitorBikeDetails,
        threeYearPetrolCost: `₹${visitorBikeDetails.threeYearPetrolCost.toFixed(2)}`,
        threeYearKitCost: `₹${visitorBikeDetails.threeYearKitCost.toFixed(2)}`,
        petrolKitCostDifference: `₹${visitorBikeDetails.petrolKitCostDifference.toFixed(2)}`
    }, "Visitor bike detail fetched successfully"));
});

// const getVisitorBikeDetails = asyncHandler(async (req, res) => {
//     // Fetch all bike details
//     const visitorBikeDetails = await Consumer.find();

//     if (!visitorBikeDetails.length) {
//         throw new ApiError(404, "No visitor bike details found");
//     }

//     // Return all bike details along with calculated costs
//     return res.status(200).json(new ApiResponse(200, {
//         visitorBikeDetails: visitorBikeDetails.map(detail => ({
//             ...detail.toObject(),
//             threeYearPetrolCost: `₹${detail.threeYearPetrolCost.toFixed(2)}`,
//             threeYearKitCost: `₹${detail.threeYearKitCost.toFixed(2)}`,
//             petrolKitCostDifference: `₹${detail.petrolKitCostDifference.toFixed(2)}`
//         }))
//     }, "Visitor bike details fetched successfully"));
// });

// const getVisitorBikeDetailByVehicleNo = asyncHandler(async (req, res) => {
//     const { vehicleno } = req.params;

//     // Fetch the bike detail based on the vehicle number
//     const visitorBikeDetail = await Consumer.findOne({ vehicleno });

//     if (!visitorBikeDetail) {
//         throw new ApiError(404, "Visitor bike detail not found");
//     }

//     return res.status(200).json(new ApiResponse(200, {
//         visitorBikeDetail,
//         threeYearPetrolCost: `₹${visitorBikeDetail.threeYearPetrolCost.toFixed(2)}`,
//         threeYearKitCost: `₹${visitorBikeDetail.threeYearKitCost.toFixed(2)}`,
//         petrolKitCostDifference: `₹${visitorBikeDetail.petrolKitCostDifference.toFixed(2)}`
//     }, "Visitor bike detail fetched successfully"));
// });

export {
    createVisitorBikeDetail,
    getVisitorBikeDetailById
};