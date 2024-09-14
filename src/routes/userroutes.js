import express from 'express';
import multer from 'multer';
import { uploadMultipleImages } from '../controllers/usercontroller.js';

const router = express.Router();

// Multer configuration
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit to 5MB per file
    },
    fileFilter: (req, file, done) => {
        if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg'
        ) {
            done(null, true);
        } else {
            const newError = new Error('File type is incorrect');
            newError.name = 'MulterError';
            done(newError, false);
        }
    },
});

// Route for uploading multiple images with user data
router.post('/upload', upload.array('images'), uploadMultipleImages);

export default router;




// import express from 'express';
// import multer from 'multer';
// import { uploadMultipleImages } from '../controllers/usercontroller.js';

// const router = express.Router();

// // Multer configuration
// const upload = multer({
//     limits: {
//         fileSize: 1024 * 1024 * 5, // Limit to 5MB per file
//     },
//     fileFilter: (req, file, done) => {
//         if (
//             file.mimetype === 'image/jpeg' ||
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpg'
//         ) {
//             done(null, true);
//         } else {
//             const newError = new Error('File type is incorrect');
//             newError.name = 'MulterError';
//             done(newError, false);
//         }
//     },
// });

// // Route for uploading multiple images with user data
// router.post('/upload', upload.array('images'), uploadMultipleImages);

// export default router;


// const express = require('express');
// const multer = require('multer');
// const { uploadMultipleImages } = require('../controllers/usercontroller');

// const router = express.Router();

// // Multer configuration
// let upload = multer({
//     limits: {
//         fileSize: 1024 * 1024 * 5, // Limit to 5MB per file
//     },
//     fileFilter: (req, file, done) => {
//         if (
//             file.mimetype === 'image/jpeg' ||
//             file.mimetype === 'image/png' ||
//             file.mimetype === 'image/jpg'
//         ) {
//             done(null, true);
//         } else {
//             var newError = new Error('File type is incorrect');
//             newError.name = 'MulterError';
//             done(newError, false);
//         }
//     },
// });

// // Route for uploading multiple images with user data
// router.post('/upload', upload.array('images'), uploadMultipleImages);

// module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const { uploadSingleImage } = require("../controllers/usercontroller");

// const router = express.Router();

// // Configure Multer for file uploads
// let upload = multer({
//     limits: {
//         fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
//     },
//     fileFilter: (req, file, done) => {
//         if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//             done(null, true);
//         } else {
//             var newError = new Error("Invalid file type. Only JPEG and PNG are allowed.");
//             newError.name = "MulterError";
//             done(newError, false);
//         }
//     },
// });

// // Route for uploading a single image with user data
// router.post("/upload", upload.single("image"), uploadSingleImage);

// module.exports = router;



// const express = require("express");
// const multer = require("multer");
// const {
//     uploadSingleImage,
//     uploadMultipleImages,
// } = require("../controllers/usercontroller");

// const router = express.Router();

// // Multer configuration
// let upload = multer({
//     limits: {
//         fileSize: 1024 * 1024 * 5, // Limit to 5MB
//     },
//     fileFilter: (req, file, done) => {
//         if (
//             file.mimetype === "image/jpeg" ||
//             file.mimetype === "image/png" ||
//             file.mimetype === "image/jpg"
//         ) {
//             done(null, true);
//         } else {
//             var newError = new Error("File type is incorrect");
//             newError.name = "MulterError";
//             done(newError, false);
//         }
//     },
// });

// // Routes
// router.post("/upload", upload.single("image"), uploadSingleImage);
// router.post("/upload-multiple", upload.array("images", 3), uploadMultipleImages);

// module.exports = router;
