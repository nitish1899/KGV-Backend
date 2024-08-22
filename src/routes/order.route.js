import express from 'express';
import { createOrder } from '../controllers/order.js';

const router = express.Router();

router.route('/item').post(createOrder);

export default router;
