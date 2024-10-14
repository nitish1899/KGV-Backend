import AWS from 'aws-sdk';  // AWS SDK for S3 interactions
import multer from 'multer';  // Middleware for handling multipart/form-data
import Upload from '../models/PrimumUpload.model.js';  // Your MongoDB model

// Configure AWS SDK with S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AccessKey,
    secretAccessKey: process.env.SecretKey,
    region: process.env.region
});

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);  // Accept only images
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
}).array('images', 4);

// Helper function to upload to S3
const uploadToS3 = async (buffer, fileName) => {
    const params = {
        Bucket: process.env.bucketName,
        Key: `${Date.now()}-${fileName}`,
        Body: buffer,
        ContentType: 'image/jpeg'
    };

    try {
        const s3Data = await s3.upload(params).promise();
        return s3Data;
    } catch (error) {
        console.error("Error uploading to S3:", error); // Improved error logging
        throw error; // Re-throw error to be handled in the calling function
    }
};

// POST: Handle the upload of user data and images
export const uploadImages = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { visitorId, amount } = req.body;

            // Validate required fields
            if (!visitorId || !amount) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            let imageUrls = [];

            // Loop through each uploaded file and upload to S3
            for (let file of req.files) {
                const s3Data = await uploadToS3(file.buffer, file.originalname);
                imageUrls.push(s3Data.Location);  // Save the S3 image URL
            }

            // Create a new upload entry in the database
            const newUpload = new Upload({
                visitorId,
                amount,
                images: imageUrls  // Store the image URLs
            });

            // Save the data to the database
            const savedUpload = await newUpload.save();

            // make user to premium from Backend

            res.status(201).json({
                message: 'Images and data uploaded successfully!',
                data: savedUpload
            });

        } catch (error) {
            console.error("Error in uploadImages:", error); // Log error for debugging
            res.status(500).json({ message: 'Server error', error });
        }
    });
};