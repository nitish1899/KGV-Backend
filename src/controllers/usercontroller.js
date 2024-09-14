import { uploadToS3 } from '../models/s3Service.js';
import User from '../models/user.js';

// Upload multiple images and store user data
const uploadMultipleImages = async (req, res) => {
    const { name, phone, dlno, adhaarno, email, dailyrunning } = req.body;

    if (!name || !phone) {
        return res.status(400).send({ error: 'Name and phone are required.' });
    }

    if (req.files && req.files.length > 0) {
        try {
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
                dlno,
                adhaarno,
                email,
                dailyrunning,
                imageUrls,
            });

            await user.save();

            res.send({
                msg: 'Images uploaded successfully',
                user: user,
            });
        } catch (error) {
            console.log('Error uploading images or saving user data:', error);
            res.status(500).send({
                error: 'Failed to upload images or save user data',
            });
        }
    } else {
        res.status(400).send({
            error: 'No images provided',
        });
    }
};

export { uploadMultipleImages };

// import { uploadToS3 } from '../models/s3Service.js';
// import User from '../models/user.js';

// // Upload multiple images and store user data
// const uploadMultipleImages = async (req, res) => {
//     const { name, phone } = req.body;

//     if (!name || !phone) {
//         return res.status(400).send({ error: 'Name and phone are required.' });
//     }

//     if (req.files && req.files.length > 0) {
//         try {
//             // Array to hold image URLs
//             const imageUrls = [];

//             for (const file of req.files) {
//                 const s3Data = await uploadToS3(file.buffer);
//                 imageUrls.push(s3Data.Location);
//             }

//             // Save user data along with image URLs
//             const user = new User({
//                 name,
//                 phone,
//                 imageUrls,
//             });

//             await user.save();

//             res.send({
//                 msg: 'Images uploaded successfully',
//                 user: user,
//             });
//         } catch (error) {
//             console.log('Error uploading images or saving user data:', error);
//             res.status(500).send({
//                 error: 'Failed to upload images or save user data',
//             });
//         }
//     } else {
//         res.status(400).send({
//             error: 'No images provided',
//         });
//     }
// };

// export { uploadMultipleImages };


// const { uploadToS3 } = require('../models/s3Service');
// const User = require('../models/user');

// // Upload multiple images and store user data
// const uploadMultipleImages = async (req, res) => {
//     const { name, phone } = req.body;

//     if (!name || !phone) {
//         return res.status(400).send({ error: 'Name and phone are required.' });
//     }

//     if (req.files && req.files.length > 0) {
//         try {
//             // Array to hold image URLs
//             const imageUrls = [];

//             for (const file of req.files) {
//                 const s3Data = await uploadToS3(file.buffer);
//                 imageUrls.push(s3Data.Location);
//             }

//             // Save user data along with image URLs
//             const user = new User({
//                 name,
//                 phone,
//                 imageUrls,
//             });

//             await user.save();

//             res.send({
//                 msg: 'Images uploaded successfully',
//                 user: user,
//             });
//         } catch (error) {
//             console.log('Error uploading images or saving user data:', error);
//             res.status(500).send({
//                 error: 'Failed to upload images or save user data',
//             });
//         }
//     } else {
//         res.status(400).send({
//             error: 'No images provided',
//         });
//     }
// };

// module.exports = { uploadMultipleImages };


// const { uploadToS3 } = require("../model/s3Service");
// const User = require("../model/user");

// const uploadSingleImage = async (req, res) => {
//     const { name, phone } = req.body;

//     if (!name || !phone) {
//         return res.status(400).send({ error: "Name and phone are required." });
//     }

//     if (req.file) {
//         try {
//             const s3Data = await uploadToS3(req.file.buffer); // Upload image to S3

//             // Save user data along with image URL in MongoDB
//             const user = new User({
//                 name,
//                 phone,
//                 imageUrl: s3Data.Location,
//             });

//             await user.save();

//             res.send({
//                 message: "Image uploaded and user data saved successfully",
//                 user,
//             });
//         } catch (error) {
//             res.status(500).send({ error: "Failed to upload image or save user data" });
//         }
//     } else {
//         res.status(400).send({ error: "No image provided" });
//     }
// };

// module.exports = { uploadSingleImage };


// const { uploadToS3 } = require("../model/user");

// // Upload single image
// const uploadSingleImage = async (req, res) => {
//     if (req.file) {
//         try {
//             await uploadToS3(req.file.buffer);
//             res.send({
//                 msg: "Image uploaded successfully",
//             });
//         } catch (error) {
//             res.status(500).send({
//                 error: "Failed to upload image",
//             });
//         }
//     } else {
//         res.status(400).send({
//             error: "No image provided",
//         });
//     }
// };

// // Upload multiple images
// const uploadMultipleImages = async (req, res) => {
//     if (req.files && req.files.length > 0) {
//         try {
//             for (let i = 0; i < req.files.length; i++) {
//                 await uploadToS3(req.files[i].buffer);
//             }
//             res.send({
//                 msg: "Successfully uploaded " + req.files.length + " files!",
//             });
//         } catch (error) {
//             res.status(500).send({
//                 error: "Failed to upload images",
//             });
//         }
//     } else {
//         res.status(400).send({
//             error: "No images provided",
//         });
//     }
// };

// module.exports = { uploadSingleImage, uploadMultipleImages };
