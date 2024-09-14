import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AccessKey,
    secretAccessKey: process.env.SecretKey,
    region: process.env.region
});

const uploadToS3 = (buffer) => {
    const params = {
        Bucket: process.env.bucketName,
        Key: `${Date.now()}_${Math.random()}.jpg`,
        Body: buffer,
        ContentType: 'image/jpeg',
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (error, data) => {
            if (error) {
                console.log("S3 Upload Error:", error);
                reject(error);
            } else {
                console.log("S3 Upload Success:", data);
                resolve(data);
            }
        });
    });
};

export { uploadToS3 };


// import AWS from 'aws-sdk';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AccessKey,
//     secretAccessKey: process.env.SecretKey,
//     region: process.env.region
// });

// const uploadToS3 = (buffer) => {
//     const params = {
//         Bucket: process.env.bucketName,
//         Key: `${Date.now()}_${Math.random()}.jpg`,
//         Body: buffer,
//         ContentType: 'image/jpeg',
//     };

//     return new Promise((resolve, reject) => {
//         s3.upload(params, (error, data) => {
//             if (error) {
//                 console.log("S3 Upload Error:", error);
//                 reject(error);
//             } else {
//                 console.log("S3 Upload Success:", data);
//                 resolve(data);
//             }
//         });
//     });
// };

// export { uploadToS3 };


// const AWS = require('aws-sdk');
// const dotenv = require("dotenv");
// dotenv.config();

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AccessKey,
//     secretAccessKey: process.env.SecretKey,
//     region: process.env.region
// });


// const uploadToS3 = (buffer) => {
//     const params = {
//         Bucket: process.env.bucketName,
//         Key: `${Date.now()}_${Math.random()}.jpg`,
//         Body: buffer,
//         ContentType: 'image/jpeg',
      
//     };

//     return new Promise((resolve, reject) => {
//         s3.upload(params, (error, data) => {
//             if (error) {
//                 console.log("S3 Upload Error:", error);
//                 reject(error);
//             } else {
//                 console.log("S3 Upload Success:", data);
//                 resolve(data);
//             }
//         });
//     });
// };

// const uploadToS3 = (buffer) => {
//     const params = {
//         Bucket: process.env.bucketName,
//         Key: `${Date.now()}_${Math.random()}.jpg`,
//         Body: buffer,
//         ACL: 'public-read',
//         ContentType: 'image/jpeg'
//     };

//     return new Promise((resolve, reject) => {
//         s3.upload(params, (error, data) => {
//             if (error) {
//                 console.log("S3 Upload Error:", error);
//                 reject(error);
//             } else {
//                 console.log("S3 Upload Success:", data);
//                 resolve(data);
//             }
//         });
//     });
// };

// module.exports = { uploadToS3 };


// const AWS = require("aws-sdk");
// const dotenv = require("dotenv");
// dotenv.config();

// // Configure S3
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AccessKey,
//     secretAccessKey: process.env.SecretKey,
//     region: process.env.region,
// });

// const uploadToS3 = (buffer) => {
//     const params = {
//         Bucket: process.env.bucketName,
//         Key: `uploads/${Date.now().toString()}.jpg`, // Unique key for the file
//         Body: buffer,
//         ACL: "public-read",
//     };

//     return s3.upload(params).promise(); // Returns a promise
// };

// module.exports = { uploadToS3 };
