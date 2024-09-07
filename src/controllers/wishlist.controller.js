import { Wishlist } from "../models/wishlist.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const getWishlistItems = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    if (visitorId) {
        throw new ApiError('400', 'UserId not found');
    }

    const wishlistItems = await Wishlist.find({ visitor: visitorId });

    return res.status('200').json({ wishlistItems });
});

const removeWishlistItem = asyncHandler(async (req, res) => {
    const { visitorId, wishlistItemId } = req.params;

    if ([visitorId, wishlistItemId].some(item => !item)) {
        throw new ApiError('400', 'All fields are required');
    }

    await Wishlist.findOneAndDelete({ _id: wishlistItemId, visitor: visitorId });

    return res.status('200').json({ message: 'Item removed successfully' });
});

export { getWishlistItems, removeWishlistItem };