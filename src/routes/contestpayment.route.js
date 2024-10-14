import express from 'express';
import { uploadImages } from '../controllers/contestpayment.controller.js';

const router = express.Router();

router.post('/contestupload', uploadImages);

export default router;