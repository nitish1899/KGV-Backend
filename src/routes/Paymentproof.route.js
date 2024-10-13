import express from 'express';  
import { uploadImages } from '../controllers/Paymentproof.controller.js';  

const router = express.Router();

router.post('/upload', uploadImages);

export default router;  
