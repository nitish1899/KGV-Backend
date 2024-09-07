import express from 'express';
import { addKitToCart, addExtraItemsToKit, getCartItems, deleteCartItem, getCart, deleteCartItemByCartItemId, getCartSummary, moveToCart } from '../controllers/cart.js';

const router = express.Router();

router.route('/item').post(addKitToCart);
router.route('/kit/addons').post(addExtraItemsToKit);
router.route('/item/:cartId').get(getCartItems);
router.route('/:visitorId').get(getCart);
router.delete('/delete', deleteCartItem);
router.delete('/cart/item/:cartItemId', deleteCartItemByCartItemId);
router.get('/summary/:visitorId', getCartSummary);
router.post('/moveToCart/:wishlistId', moveToCart);

export default router;
