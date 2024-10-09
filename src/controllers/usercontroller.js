import { uploadToS3 } from '../models/s3Service.js';
import User from '../models/user.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from "../utils/ApiError.js";
// import XLSX from 'xlsx';
import ExcelJS from 'exceljs'

// Upload multiple images and store user data
const uploadMultipleImages = async (req, res) => {
    try {
        const { name, phone, vehicleno, adhaarno, email, dailyrunning } = req.body;

        if (!name || !phone) {
            return res.status(400).send({ error: 'Name and phone are required.' });
        }

        if (req.files && req.files.length > 0) {

            const userInfo = await User.findOne({ phone, isParticipated: true });

            if (userInfo) {
                throw new Error('You have already participated');
            }
            // Array to hold image URLs
            const imageUrls = [];

            for (const file of req.files) {
                const s3Data = await uploadToS3(file.buffer);
                imageUrls.push(s3Data.Location);
            }

            // Save user data along with image URLs
            const user = new User({
                name,
                phone,
                vehicleno,
                adhaarno,
                email,
                dailyrunning,
                imageUrls,
            });

            await user.save();

            return res.send({
                msg: 'Images uploaded successfully',
                user: user,
            });

        } else {
            return res.status(400).send({
                error: 'No images provided',
            });
        }
    } catch (error) {
        console.log('Error uploading images or saving user data:', error.message);
        //     throw new ApiError(400, error.message);
        return res.status(400).json({
            error: error.message,
        });
    }
};

const updateUserRewardInfo = async (req, res) => {
    const { userId } = req.params;
    const { reward } = req.body;

    if (!userId) {
        throw new Error('User Id not found');
    }

    const user = await User.findByIdAndUpdate(userId, { reward: reward, isParticipated: true });

    if (!user) {
        throw new Error('User does not exists ')
    }

    console.log(user)

    return res.status(200).json({ user, message: 'User reward updated successfully' })
};

const getUserIfo = async (req, res) => {
    const { phone } = req.params;

    if (!phone) {
        throw new Error('Phone not found');
    }

    const user = await User.findOne({ phone });

    return res.status(201).json(
        new ApiResponse(201, { user }, "User data found successfully!")
    );
};


const getExcelSheet = async (req, res) => {

    const users = await User.find();

    console.log(users);
    // const data = {
    //     _id: '66fe853c7b07621ef927d73d',
    //     name: 'Umesh Sahu',
    //     phone: '8800128938',
    //     dlno: 'Hshssbbs',
    //     adhaarno: '649797979797',
    //     email: 'jagdish0000singh@gmail.com',
    //     dailyrunning: '464',
    //     imageUrls: [
    //         'https://kgvl.s3.ap-south-1.amazonaws.com/1727956281794_0.19918158887270399.jpg',
    //         'https://kgvl.s3.ap-south-1.amazonaws.com/1727956282355_0.7531041558258862.jpg',
    //         'https://kgvl.s3.ap-south-1.amazonaws.com/1727956282910_0.09414767202640473.jpg',
    //         'https://kgvl.s3.ap-south-1.amazonaws.com/1727956283438_0.02013121450429667.jpg'
    //     ],
    //     isParticipated: false,
    //     createdAt: new Date('2024-10-03T11:51:24.050Z'),
    //     updatedAt: new Date('2024-10-03T11:51:24.050Z')
    // };

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Details');

    // Add columns to the worksheet
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Vehicle No', key: 'vehicleno', width: 15 },
        { header: 'Aadhaar No', key: 'adhaarno', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Daily Running', key: 'dailyrunning', width: 15 },
        { header: 'Image URLs', key: 'imageUrls', width: 50 },
        { header: 'Created At', key: 'createdAt', width: 20 }
    ];
    // Add multiple rows from an array of objects
    const formattedUsers = users.map(user => ({
        name: user.name,
        phone: user.phone,
        vehicleno: user.vehicleno,
        adhaarno: user.adhaarno,
        email: user.email,
        dailyrunning: user.dailyrunning,
        imageUrls: user.imageUrls.join(', '), // Join the array to fit in a single cell
        createdAt: user.createdAt.toLocaleString(),
    }));

    worksheet.addRows(formattedUsers); // Add all rows at once

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers and send the file
    res.setHeader('Content-Disposition', 'attachment; filename=user_details.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // return res.send(buffer);
    return;
};

export { uploadMultipleImages, updateUserRewardInfo, getUserIfo, getExcelSheet };