import express from 'express';
import { addToCart, getCartItems, deleteCartItem } from '../controllers/cart.js';

const router = express.Router();

router.route('/item').post(addToCart).delete(deleteCartItem);
router.route('/item/:cartId').get(getCartItems);

export default router;
