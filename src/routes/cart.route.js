import express from 'express';
import { addToCart, getCartItems, deleteCartItem } from '../controllers/cart.js';

const router = express.Router();

router.route('/item').post(addToCart).get(getCartItems).delete(deleteCartItem);

export default router;
