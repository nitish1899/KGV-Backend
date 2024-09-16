
import bcrypt from "bcrypt";
// const jwt = require('jsonwebtoken');
import { Visitor } from "../models/visitor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import otpGenerator from 'otp-generator';
import axios from "axios";
import { aadharVerification } from '../utils/digilocker.js';
import { drivingLicenceVerification } from "../utils/drivingLicenceVerification.js";
import crypto from 'crypto';

// Function to generate referral code
const generateReferralCode = (userData) => {
  const { fullName, phoneNumber } = userData;

  // Take the first 3 letters of the full name (uppercase) and the last 4 digits of the phone number
  const namePart = fullName.substring(0, 3).toUpperCase();
  const phonePart = phoneNumber.substring(phoneNumber.length - 4);

  // Generate a random string of 4 characters
  const randomString = crypto.randomBytes(2).toString('hex').toUpperCase();

  // Combine all parts to generate a unique referral code
  const referralCode = `${namePart}${phonePart}${randomString}`;

  return referralCode;
};


const register = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, pin, confirmPin, aadhar, pan, address, dlno, dob, gender, email } = req.body;

  if ([fullName, phoneNumber, pin, confirmPin, aadhar, pan, dlno, dob, gender, email].some(field => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await Visitor.findOne({
    $or: [
      { phoneNumber },
      { aadhar },
      { pan },
      { dlno },
      { email }
    ]
  });

  if (existingUser) {
    let message = "User already exists";

    if (existingUser.phoneNumber === phoneNumber) {
      message = "Phone number already exists";
    } else if (existingUser.aadhar === aadhar) {
      message = "Aadhar number already exists";
    } else if (existingUser.pan === pan) {
      message = "PAN number already exists";
    } else if (existingUser.dlno === dlno) {
      message = "Driving license number already exists";
    } else if (existingUser.email === email) {
      message = "Email already exists";
    }

    return res.status(400).json({ status: "failed", msg: message });
  }

  // Validate pin and confirmPin
  if (pin !== confirmPin) {
    return res.status(400).json({ status: "failed", msg: "Pin and confirm pin mismatch" });
  }

  // Hash the pin
  const hashPin = await bcrypt.hash(pin.toString(), 10);

  const referralCode = generateReferralCode({ fullName, phoneNumber });

  // Create a new user with the additional fields
  const newUser = await Visitor.create({
    fullName,
    phoneNumber,
    pin: hashPin,
    aadhar,
    pan,
    address,
    dlno,
    dob,
    gender,
    email,
    referralCode
  });

  // Prepare the response data
  const data = {
    userId: newUser._id,
    fullName: newUser.fullName,
    phoneNumber: newUser.phoneNumber,
    aadhar: newUser.aadhar,
    pan: newUser.pan,
    address: newUser.address,
    dlno: newUser.dlno,
    dob: newUser.dob,
    gender: newUser.gender,
    email: newUser.email,
    referralCode: newUser.referralCode,
  };


  return res.json(new ApiResponse(201, data, "User registered Successfully"));
});


const login = asyncHandler(async (req, res) => {
  const { phoneNumber, pin } = req.body;
  const existingUser = await Visitor.findOne({ phoneNumber });
  // console.log('existingUser', existingUser)
  if (!existingUser) {
    // user is not registered yet need to register yourself.
    throw new Error("User does not exist");
  }

  // console.log(' existingUser.pin', existingUser.pin)
  const isPinCorrect = await bcrypt.compare(pin.toString(), existingUser.pin);
  // console.log('isPinCorrect', isPinCorrect)

  if (!isPinCorrect)
    throw new Error("Incorrect pin found");

  const data = {
    userId: existingUser._id,
    fullName: existingUser.fullName,
    phoneNumber: existingUser.phoneNumber,
    referralCode: existingUser.referralCode,
  };

  return res.json(new ApiResponse(201, data, "Login Successful"));
})

const sendVisitorOtp = asyncHandler(async (req, res) => {
  try {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const phoneNumber = req.body.phoneNumber;
    const existedUser = await Visitor.findOne({ phoneNumber })

    if (existedUser) {
      throw new ApiError(409, " phoneNumber already exists")
    }
    // sent otp on mobile number
    await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: 'otp',
        numbers: phoneNumber
      }
    });

    // console.log('sent otp')
    return res.status(201).json(
      new ApiResponse(201, { otp }, "OTP sent successfully!"));
  } catch (error) {
    console.log('Error sending OTP:', error);
    res.status(400).json(
      // { success: false, message: 'Failed to send OTP.' }
      new ApiResponse(400, { error }, "Failed to send OTP")
    );
  }
})


const sendExistingVisitorOtp = asyncHandler(async (req, res) => {
  try {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const phoneNumber = req.body.phoneNumber;

    // Check if the phone number exists
    const existedUser = await Visitor.findOne({ phoneNumber });

    if (!existedUser) {
      throw new ApiError(404, "Phone number not found");
    }

    // Send OTP to the existing phone number
    await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: 'otp',
        numbers: phoneNumber
      }
    });

    return res.status(201).json(
      new ApiResponse(201, { otp }, "OTP sent successfully!")
    );
  } catch (error) {
    console.log('Error sending OTP:', error);
    res.status(400).json(
      new ApiResponse(400, { error }, "Failed to send OTP")
    );
  }
});


const forgotPin = asyncHandler(async (req, res) => {
  const { phoneNumber, pin, confirmPin } = req.body;

  // Check if user exists
  const existingUser = await Visitor.findOne({ phoneNumber });

  if (!existingUser) {
    return res.status(400).json({ status: 'failed', msg: "User doesn't exist" });
  }

  // Check if pin and confirmPin match
  if (pin !== confirmPin) {
    return res.status(400).json({ status: 'failed', msg: 'Pin and confirmPin must be the same' });
  }

  // Hash the new pin
  const hashPin = await bcrypt.hash(pin.toString(), 10);

  // Update the user's pin
  await Visitor.findOneAndUpdate(
    { phoneNumber }, // Query to find the user
    { $set: { pin: hashPin } }, // Update to apply
    { new: true } // Options: return the updated document
  );

  // Respond with success message
  res.status(200).json({ status: 'success', msg: 'Pin has been updated successfully' });
})

export { register, login, sendVisitorOtp, sendExistingVisitorOtp, forgotPin };