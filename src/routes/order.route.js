import express from 'express';
import { createOrder, getOrderDetails, createSerialOrder } from '../controllers/order.js';

const router = express.Router();

router.route('/item').post(createOrder);
router.route('/orders/:id').get(getOrderDetails);
router.route('/serial').post(createSerialOrder);


export default router;
