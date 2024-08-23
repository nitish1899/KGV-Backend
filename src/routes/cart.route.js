import express from 'express';
import { addToCart, getCartItems, deleteCartItem, getCart } from '../controllers/cart.js';

const router = express.Router();

router.route('/item').post(addToCart).delete(deleteCartItem);
router.route('/item/:cartId').get(getCartItems);
router.route('/:visitorId').get(getCart);

export default router;
