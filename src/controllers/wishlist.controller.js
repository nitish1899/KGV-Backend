import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Visitor } from "../models/visitor.model.js";
import { CartItem } from "../models/cartItems.model.js";
import { Cart } from "../models/cart.model.js";
import cron from 'node-cron';
import { deleteCartItem } from "./cart.js";

// cron.schedule('*/10 * * * *', async () => {
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const groupedCartItems = await CartItem.aggregate([
//         {
//             $match: {
//                 updatedAt: { $gte: sevenDaysAgo } // Filter by items updated within the last 7 days
//             }
//         },
//         {
//             $group: {
//                 _id: "$visitor", // Group by visitor field
//                 items: { $push: "$$ROOT" }, // Collect all cart items for each visitor
//             },
//         },
//     ]);

//     groupedCartItems.forEach(async (group) => {
//         const visitorId = group._id;
//         const items = group.items;

//         // Insert items into Wishlist
//         await Wishlist.insertMany(
//             items.map(item => ({
//                 visitor: item.visitor,
//                 item: item.item,
//             }))
//         );

//         const totalAmount = items.map(item => item.item.totalPrice);
//         const cart = await Cart.findOne({ visitor: visitorId });
//         await Cart.findByIdAndUpdate({ _id: cart._id }, {
//             totalPrice: Number(Number(cart.totalPrice) - totalAmount), totalItems:
//                 Number(Number(cart.totalItems) - items.length)
//         })

//         // Remove items from CartItem collection
//         await CartItem.deleteMany({ _id: items.map(item => item._id), visitor: visitorId });


//     });
// });

cron.schedule('*/45 * * * *', async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch and group cart items by visitor
        const groupedCartItems = await CartItem.aggregate([
            {
                $match: {
                    updatedAt: { $lte: sevenDaysAgo } // Filter items updated in the last 7 days
                }
            },
            {
                $group: {
                    _id: "$visitor", // Group by visitor field
                    items: { $push: "$$ROOT" }, // Collect all cart items for each visitor
                },
            },
        ]);

        // Prepare bulk operations for Wishlist and Cart updates
        const wishlistOperations = [];
        const cartOperations = [];
        const cartItemDeletions = [];

        // Loop through each group (each visitor)
        groupedCartItems.forEach((group) => {
            const visitorId = group._id;
            const items = group.items;

            // Insert items into Wishlist
            wishlistOperations.push(
                ...items.map(item => ({
                    visitor: item.visitor,
                    item: item.item,
                }))
            );

            // Calculate total price and update cart
            const totalAmount = items.reduce((sum, item) => sum + item.item.totalPrice, 0);
            cartOperations.push({
                updateOne: {
                    filter: { visitor: visitorId },
                    update: {
                        $inc: {
                            totalPrice: -totalAmount, // Decrease total price by totalAmount
                            totalItems: -items.length, // Decrease total items count
                        }
                    }
                }
            });

            // Prepare for deletion from CartItem collection
            cartItemDeletions.push(...items.map(item => item._id));
        });

        // Bulk insert into Wishlist
        if (wishlistOperations.length > 0) {
            await Wishlist.insertMany(wishlistOperations);
        }

        // Bulk update Cart for each visitor
        if (cartOperations.length > 0) {
            await Cart.bulkWrite(cartOperations);
        }

        // Bulk delete CartItems
        if (cartItemDeletions.length > 0) {
            await CartItem.deleteMany({ _id: { $in: cartItemDeletions } });
        }

        console.log("Cart items moved to wishlist and cart updated successfully.");
    } catch (error) {
        console.log("Error during the cron operation:", error);
    }
});

const getWishlistItems = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    if (!visitorId) {
        throw new ApiError('400', 'UserId not found');
    }

    const wishlistItems = await Wishlist.find({ visitor: visitorId });

    if (!wishlistItems) {
        throw new ApiError('400', 'Wishlist Item not found');
    }

    return res.status(200).json({ wishlistItems });
});

const removeWishlistItem = asyncHandler(async (req, res) => {
    const { visitorId, wishlistItemId } = req.params;

    if ([visitorId, wishlistItemId].some(item => !item)) {
        throw new ApiError('400', 'All fields are required');
    }

    await Wishlist.findOneAndDelete({ _id: wishlistItemId, visitor: visitorId });

    return res.status(200).json({ message: 'Item removed successfully' });
});

const moveToWishlist = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;
    const { userId } = req.body;

    if (!cartItemId) {
        throw new ApiError(400, 'cartItemId not found');
    }

    if (!userId) {
        throw new ApiError(400, 'userId not found');
    }

    const [cartItem, visitor] = await Promise.all([
        CartItem.findById(cartItemId),
        Visitor.findById(userId)
    ]);

    if (!cartItem) {
        throw new ApiError(404, 'CartItem not found');
    }

    if (!visitor) {
        throw new ApiError(404, 'User not found');
    }

    // Create a new wishlist item
    // const wishlistItem = await Wishlist.create({ visitor, item: cartItem.item });

    // Move cart item to wishlist and get all wishlist items in one step
    const wishlistItems = await Wishlist.insertMany([
        { visitor, item: cartItem.item }
    ]).then(() => Wishlist.find({ visitor: userId }).populate('item'));

    // Use the deleteCartItem utility function
    await deleteCartItem(cartItemId);

    return res.status(200).json({ message: 'Item moved to wishlist successfully', wishlistItems });
});

export { getWishlistItems, removeWishlistItem, moveToWishlist };