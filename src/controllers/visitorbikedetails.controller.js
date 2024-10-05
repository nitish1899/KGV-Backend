
import { asyncHandler } from "../utils/asyncHandler.js";
import { Visitorbikedetails } from '../models/visitorbikedetails.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Visitor } from "../models/visitor.model.js";
import { Kit } from '../models/Kit.model.js';

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
    const visitorBikeDetails = await Visitorbikedetails.findOne({ vehicleno }).populate({
        path: 'visitor',
        select: ['-pin', '-updatedAt', '-createdAt', '-__v']  // Exclude the pin field
    });

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

async function addKitToBikeDetail(kitId, vehicleno) {
    try {
        if (!kitId) {
            throw new ApiError(400, "Kit ID is required");
        }

        // Fetch the bike details and the kit
        const [visitorBikeDetail, kit] = await Promise.all([
            Visitorbikedetails.findOne({ vehicleno }),
            Kit.findById(kitId)
        ]);

        if (!visitorBikeDetail) {
            throw new ApiError(404, "Visitor bike detail not found");
        }

        if (!kit) {
            throw new ApiError(404, "Kit not found");
        }

        // Add the kit to the bike details
        await Visitorbikedetails.findOneAndUpdate({ vehicleno }, { kit });

        return new ApiResponse(200, {
            visitorBikeDetail,
            message: "Kit added to bike details successfully"
        });
    } catch (error) {
        throw new ApiError(400, error.message);
    }
};

export {
    createVisitorBikeDetail,
    getVisitorBikeDetailById,
    addKitToBikeDetail
};

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Visitorbikedetails } from '../models/visitorbikedetails.model.js';
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { Visitor } from "../models/visitor.model.js";


// const createVisitorBikeDetail = asyncHandler(async (req, res) => {
//     const { vehicleno, runningPerDay, fueltype, model, cc, visitorId } = req.body;

//     if (!vehicleno || !runningPerDay) {
//         throw new ApiError(400, "Vehicle number and running per day are required");
//     }

//     // Check if the bike details already exist
//     const [existingDetail, visitor] = await Promise.all(
//         [
//             Visitorbikedetails.findOne({ vehicleno }),
//             Visitor.findOne({ _id: visitorId })
//         ]);

//     if (existingDetail) {
//         throw new ApiError(409, "Bike details with this vehicle number already exist");
//     }

//     // Create the visitor bike detail
//     const visitorBikeDetail = await Visitorbikedetails.create({
//         vehicleno,
//         runningPerDay,
//         fueltype,
//         model,
//         cc,
//         visitor
//     });

//     return res.status(201).json(new ApiResponse(201, {
//         visitorBikeDetail,
//         threeYearPetrolCost: `₹${visitorBikeDetail.threeYearPetrolCost.toFixed(2)}`,
//         threeYearKitCost: `₹${visitorBikeDetail.threeYearKitCost.toFixed(2)}`,
//         petrolKitCostDifference: `₹${visitorBikeDetail.petrolKitCostDifference.toFixed(2)}`
//     }, "Visitor bike detail created successfully"));
// });

// const getVisitorBikeDetailById = asyncHandler(async (req, res) => {
//     const { vehicleno } = req.params;

//     // Fetch the bike details based on the ID
//     const visitorBikeDetails = await Visitorbikedetails.findOne({ vehicleno }).populate({
//         path: 'visitor',
//         select: '-pin'  // Exclude the pin field
//         });

//     if (!visitorBikeDetails) {
//         throw new ApiError(404, "Visitor bike detail not found");
//     }

//     return res.status(200).json(new ApiResponse(200, {
//         visitorBikeDetails,
//         threeYearPetrolCost: `₹${visitorBikeDetails.threeYearPetrolCost.toFixed(2)}`,
//         threeYearKitCost: `₹${visitorBikeDetails.threeYearKitCost.toFixed(2)}`,
//         petrolKitCostDifference: `₹${visitorBikeDetails.petrolKitCostDifference.toFixed(2)}`
//     }, "Visitor bike detail fetched successfully"));
// });


// const addKitToBikeDetail = asyncHandler(async (req, res) => {
//     const { vehicleno } = req.params;
//     const { kitId } = req.body;

//     if (!kitId) {
//         throw new ApiError(400, "Kit ID is required");
//     }

//     // Fetch the bike details and the kit
//     const [visitorBikeDetail, kit] = await Promise.all([
//         Visitorbikedetails.findOne({ vehicleno }),
//         Kit.findById(kitId)
//     ]);

//     if (!visitorBikeDetail) {
//         throw new ApiError(404, "Visitor bike detail not found");
//     }

//     if (!kit) {
//         throw new ApiError(404, "Kit not found");
//     }

//     // Add the kit to the bike details
//     if (!visitorBikeDetail.kits.includes(kitId)) {
//         visitorBikeDetail.kits.push(kitId);
//         await visitorBikeDetail.save();
//     }

//     return res.status(200).json(new ApiResponse(200, {
//         visitorBikeDetail,
//         message: "Kit added to bike details successfully"
//     }));
// });



// export {
//     createVisitorBikeDetail,
//     getVisitorBikeDetailById,
//     addKitToBikeDetail
// };