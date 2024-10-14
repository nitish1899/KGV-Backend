import express from 'express';  
import { uploadImages } from '../controllers/PrimumUpload.controller.js';  

const router = express.Router();

router.post('/primumupload', uploadImages);

export default router;