import AWS from 'aws-sdk';  // AWS SDK for S3 interactions
import multer from 'multer';  // Middleware for handling multipart/form-data
import Upload from '../models/Paymentproof.model.js';  // Your MongoDB model
import { TemporaryCartItem } from '../models/temporaryCartItem.model.js';
import { CartItem } from '../models/cartItems.model.js';
import { Cart } from '../models/cart.model.js';

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
}).array('images', 4);  // Max 4 images

// Helper function to upload to S3
const uploadToS3 = async (buffer, fileName) => {
    const params = {
        Bucket: process.env.bucketName,
        Key: `${Date.now()}-${fileName}`,
        Body: buffer,
        ContentType: 'image/jpeg'  // Adjust based on your needs
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
            const { visitorId, cartId, amount, paymentFor } = req.body;

            // Validate required fields
            if (!visitorId || !cartId || !amount || !paymentFor) {
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
                cartId,
                amount,
                images: imageUrls,  // Store the image URLs
                paymentFor
            });

            // Save the data to the database
            const savedUpload = await newUpload.save();

            const cartItems = await CartItem.find({ cart: cartId });

            for (const cartItem of cartItems) {
                // Iterate over each cart item

                // Create a corresponding temporary cart item
                const temporaryCartItem = new TemporaryCartItem({
                    visitor: cartItem.visitor,
                    cart: cartItem.cart,
                    item: {
                        kit: cartItem.item.kit,
                        name: cartItem.item.name,
                        quantity: cartItem.item.quantity,
                        addons: cartItem.item.addons,
                        kitPrice: cartItem.item.kitPrice,
                        vehicleno: cartItem.item.vehicleno,
                        totalPrice: cartItem.item.totalPrice,
                    }
                });

                // Save the temporary cart item
                await temporaryCartItem.save();

                // Remove the original cart item after saving the temporary one
                await CartItem.findOneAndDelete({ _id: cartItem._id });
                // create temporaryCartItem
                // remove all item from cart
            }

            await Cart.findByIdAndUpdate(cartId, { totalItems: 0, totalPrice: 0 });

            return res.status(201).json({
                message: 'Images and data uploaded successfully!',
                data: savedUpload
            });

        } catch (error) {
            console.error("Error in uploadImages:", error); // Log error for debugging
            return res.status(500).json({ message: 'Server error', error });
        }
    });
};