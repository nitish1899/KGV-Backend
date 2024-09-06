import express from 'express';
import { createOrder, getOrderDetails, createSerialOrder, getOrdersByVisitorId } from '../controllers/order.js';

const router = express.Router();

router.route('/item').post(createOrder);
router.route('/orders/:id').get(getOrderDetails);
router.route('/serial').post(createSerialOrder);
router.route('/allorders/:visitorId').get(getOrdersByVisitorId);


export default router;
