import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Visitor } from "../models/visitor.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyKYC = asyncHandler(async (req, res) => {
    // uid, name, dob, gender, mobile
    const { fullName, phoneNumber, address, aadhar, dlno, dob, gender } = req.body;

    // Check if any required field is missing
    if ([fullName, phoneNumber, address, aadhar, dlno, dob, gender].some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if a Visitor with the same phone number, aadhar, or dlno already exists
    const existedUser = await Visitor.findOne({ phoneNumber });

    if (existedUser) {
        let errorMsg = '';
        if (existedUser.phoneNumber === phoneNumber) {
            errorMsg = "User with this phone number already exists";
        } else if (existedUser.aadhar === aadhar) {
            errorMsg = "User with this Aadhar number already exists";
        } else if (existedUser.dlno === dlno) {
            errorMsg = "User with this DL number already exists";
        }

        throw new ApiError(400, errorMsg);
    }

    await aadharVerification(aadhar, fullName, dob, gender, phoneNumber);
    await drivingLicenceVerification(dlno, dob);
    // Create the new Visitor
    const visitor = await Visitor.findByIdAndUpdate({ phoneNumber }, {
        address, aadhar, dlno, dob, gender
    });

    // Fetch the created Visitor to avoid returning the refresh token
    // const createdVisitor = await Visitor.findById(visitor._id).select("-refreshToken");

    // if (!createdVisitor) {
    //   throw new ApiError(500, "Something went wrong while registering the user");
    // }

    // Return the created Visitor
    return res.status(201).json(
        new ApiResponse(201, visitor, "User registered successfully")
    );
});

const getVisitor = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    // Fetch the bike details based on the ID
    const visitor = await Visitor.find({ _id: visitorId }).select(['-pin', '-updatedAt', '-createdAt', '-_v']);
    console.log()

    if (!visitor) {
        throw new ApiError(404, "Visitor bike detail not found");
    }

    return res.status(200).json(new ApiResponse(200,
        visitor, "Visitor detail fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber, address, aadhar, dlno, dob, gender } = req.body;
    const { userId } = req.params;

    // Check if any required field is missing
    if ([fullName, phoneNumber, address, aadhar, dlno, dob, gender].some(field => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if a user with the same phone number, aadhar, or dlno already exists, excluding the current user
    const existingUser = await Visitor.findOne({
        $or: [
            { phoneNumber },
            { aadhar },
            { dlno }
        ],
        _id: { $ne: userId } // Exclude the user being updated
    });

    if (existingUser) {
        let errorMsg = '';
        if (existingUser?.phoneNumber === phoneNumber) {
            errorMsg = "User with this phone number already exists";
        } else if (existingUser?.aadhar === aadhar) {
            errorMsg = "User with this Aadhar number already exists";
        } else if (existingUser?.dlno === dlno) {
            errorMsg = "User with this DL number already exists";
        }

        throw new ApiError(400, errorMsg);
    }

    // Update user details
    const updatedUser = await Visitor.findByIdAndUpdate(
        userId,
        { fullName, phoneNumber, address, aadhar, dlno, dob, gender },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    // Prepare response data
    const data = {
        userId: updatedUser._id,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        aadhar: updatedUser.aadhar,
        dlno: updatedUser.dlno,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
    };

    return res.status(200).json(new ApiResponse(200, data, "User details updated successfully"));
});

const registerReferal = asyncHandler(async (req, res) => {

});

const updatePremiumStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, 'User Id not found');
    }

    const user = await Visitor.findByIdAndUpdate(userId, { isPremiumUser: true });

    return res.status(200).json({ success: true, message: 'Premium status updated successfully' });
}
);

export {
    verifyKYC, getVisitor, updateUserDetails, registerReferal, updatePremiumStatus
}