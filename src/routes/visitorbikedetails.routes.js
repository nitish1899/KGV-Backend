import express from 'express';
import { createVisitorBikeDetail, getVisitorBikeDetailById, addKitToBikeDetail } from '../controllers/visitorbikedetails.controller.js';

const router = express.Router();

router.post('/v1', createVisitorBikeDetail);

router.get('/visitorbikedetails/:vehicleno', getVisitorBikeDetailById);

router.post('/add-kit/:vehicleno', addKitToBikeDetail);

export default router;
