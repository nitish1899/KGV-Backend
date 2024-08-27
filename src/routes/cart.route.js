import express from 'express';
import { addToCart, getCartItems, deleteCartItem, getCart, deleteCartItemByCartItemId, getCartSummary } from '../controllers/cart.js';

const router = express.Router();

router.route('/item').post(addToCart);
router.route('/item/:cartId').get(getCartItems);
router.route('/:visitorId').get(getCart);
router.delete('/delete', deleteCartItem);
router.delete('/cart/item/:cartItemId', deleteCartItemByCartItemId);
router.get('/summary/:visitorId', getCartSummary);

export default router;
