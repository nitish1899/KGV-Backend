import express from 'express';
import { createVisitorBikeDetail, getVisitorBikeDetailById } from '../controllers/visitorbikedetails.controller.js';

const router = express.Router();

router.post('/v1', createVisitorBikeDetail);

router.get('/visitorbikedetails/:vehicleno', getVisitorBikeDetailById);

export default router;
