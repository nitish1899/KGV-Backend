// controllers/kit.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { Kit } from '../models/Kit.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new kit
const createKit = asyncHandler(async (req, res) => {
    const { name, price, addonItems } = req.body;

    if (!name || price === undefined) {
        throw new ApiError(400, "Name and cost are required");
    }

    const existingKit = await Kit.findOne({ name });

    if (existingKit) {
        throw new ApiError(409, "Kit with this name already exists");
    }

    const newKit = await Kit.create({ name, price, addonItems: addonItems.map(r => r) });

    return res.status(201).json(new ApiResponse(201, newKit, "Kit created successfully"));
});

// Get all kits
const getAllKits = asyncHandler(async (req, res) => {
    const kits = await Kit.find();
    return res.status(200).json(new ApiResponse(200, kits, "Kits fetched successfully"));
});

// Get a single kit by ID
const getKitById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const kit = await Kit.findById(id);
    if (!kit) {
        throw new ApiError(404, "Kit not found");
    }

    return res.status(200).json(new ApiResponse(200, kit, "Kit fetched successfully"));
});

// Update a kit by ID
const updateKitById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, cost } = req.body;

    const updatedKit = await Kit.findByIdAndUpdate(id, { name, cost }, { new: true, runValidators: true });
    if (!updatedKit) {
        throw new ApiError(404, "Kit not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedKit, "Kit updated successfully"));
});

// Delete a kit by ID
const deleteKitById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedKit = await Kit.findByIdAndDelete(id);
    if (!deletedKit) {
        throw new ApiError(404, "Kit not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Kit deleted successfully"));
});

export {
    createKit,
    getAllKits,
    getKitById,
    updateKitById,
    deleteKitById
};
