import { Router } from "express";
import { getWishlistItems, removeWishlistItem, moveToWishlist } from "../controllers/wishlist.controller.js";

const router = Router();

router.route('/:visitorId').get(getWishlistItems);
router.route('/:visitorId/:wishlistItemId').delete(removeWishlistItem);
router.post('/moveToWishlist/:cartItemId', moveToWishlist);

export default router;