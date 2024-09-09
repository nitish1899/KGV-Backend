import { Cart } from "../models/cart.model.js";
import { CartItem } from "../models/cartItems.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Visitor } from "../models/visitor.model.js";
import { Visitorbikedetails } from "../models/visitorbikedetails.model.js";
import { addKitToBikeDetail } from "./visitorbikedetails.controller.js";
import { Wishlist } from "../models/wishlist.model.js";



const addCartItem = async (visitorId, item) => {
    const [cart, visitor] = await Promise.all([Cart.findOne({ visitor: visitorId }), Visitor.findById(visitorId)]);
    let existingCart = cart;

    // If the cart doesn't exist, create a new one with a totalPrice of 0
    if (!existingCart) {
        existingCart = await Cart.create({ visitor: visitorId, totalPrice: 0 });
    }

    // Create a new cart item
    const cartItem = await CartItem.create({ visitor, cart: existingCart, item });

    // Calculate the new total price for the cart
    const cartTotalPrice = Number(existingCart.totalPrice) + Number(item.totalPrice);

    const totalItems = Number(existingCart.totalItems) + 1;

    // Update the cart's totalPrice with the new total
    await Cart.findOneAndUpdate(
        { _id: existingCart._id },
        { totalPrice: cartTotalPrice, totalItems },
        { new: true }
    );

    return cartItem._id;

}

const addKitToCart = asyncHandler(async (req, res) => {
    const { visitorId, visitorbikedetailsId, kitId, vehicleno } = req.body;

    await addKitToBikeDetail(kitId, vehicleno);

    const [visitor, visitorbikedetails, cart] = await Promise.all([
        Visitor.findById(visitorId), Visitorbikedetails.findById(visitorbikedetailsId).populate('kit'), Cart.findOne({ visitor: visitorId })
    ]);

    if (!visitor) {
        throw new ApiError(400, 'User not found');
    }

    if (!visitorbikedetails) {
        throw new ApiError(400, 'Visitorbikedetails not found');
    }

    const item = {
        kit: visitorbikedetails.kit[0]._id,
        name: visitorbikedetails.kit[0].name,
        quantity: 1,
        addons: [],
        kitPrice: Number(visitorbikedetails.kit[0].price),
        totalPrice: Number(visitorbikedetails.kit[0].price),
        vehicleno: visitorbikedetails.vehicleno,
    }
    const cartItemId = await addCartItem(visitorId, item);
    // let existingCart = cart;

    // // If the cart doesn't exist, create a new one with a totalPrice of 0
    // if (!existingCart) {
    //     existingCart = await Cart.create({ visitor: visitorId, totalPrice: 0 });
    // }

    // // Create a new cart item
    // const cartItem = await CartItem.create({ visitor, cart: existingCart, item });

    // // Calculate the new total price for the cart
    // const cartTotalPrice = Number(existingCart.totalPrice) + Number(item.totalPrice);

    // const totalItems = Number(existingCart.totalItems) + 1;

    // // Update the cart's totalPrice with the new total
    // await Cart.findOneAndUpdate(
    //     { _id: existingCart._id },
    //     { totalPrice: cartTotalPrice, totalItems },
    //     { new: true }
    // );

    return res.status(200).json({ cartItemId });
});


const addExtraItemsToKit = asyncHandler(async (req, res) => {
    const { cartItemId, addons, visitorId } = req.body;

    if ([cartItemId, addons, visitorId].some(item => !item)) {
        throw new ApiError(400, 'Please fill required fields');
    }

    // Find the cart item by visitor ID and cart item ID
    const cartItem = await CartItem.findOne({ visitor: visitorId, _id: cartItemId });

    if (!cartItem) {
        throw new ApiError(400, 'No items found. Please add items to your cart');
    }

    const addonsTotalPrice = addons.reduce((acc, item) => {
        const addonItemPrice = Number(item.price) * Number(item.quantity);
        return acc + addonItemPrice;
    }, 0);

    // Calculate the new total price of the cart item
    const totalPrice = Number(cartItem.item.kitPrice) + addonsTotalPrice;

    // Update the cart item with new addons and total price
    const updatedCartItem = await CartItem.findOneAndUpdate(
        { visitor: visitorId, _id: cartItemId },
        {
            $set: {
                "item.totalPrice": totalPrice,
                "item.addons": addons.map(r => r)
            }
        },
        { new: true } // To return the updated document
    );

    if (!updatedCartItem) {
        throw new ApiError(400, 'Failed to update cart item');
    }

    // Find the existing cart
    const existingCart = await Cart.findOne({ visitor: visitorId });

    if (!existingCart) {
        throw new ApiError(400, 'Cart not found');
    }

    // Calculate the new total price for the cart
    const cartTotalPrice = Number(existingCart.totalPrice) + addonsTotalPrice;

    // Update the cart's totalPrice with the new total
    await Cart.findOneAndUpdate(
        { _id: existingCart._id },
        { $set: { totalPrice: cartTotalPrice } },
        { new: true }
    );

    return res.status(200).json({ updatedCartItem });
});


const getCartItems = asyncHandler(async (req, res) => {
    const cartItems = await CartItem.find({ cart: req.params.cartId }).populate({
        path: 'visitor',
        select: ['-pin', '-updatedAt', '-createdAt', '-__v']  // Exclude the pin field
    });

    if (!cartItems || cartItems.length === 0) {
        throw new ApiError(400, 'No items found. Please add items to your cart');
    }

    // Calculate total price and total items
    const totalPrice = cartItems.reduce((acc, cartitem) => {
        // let itemTotalPrice = Number(cartitem.item.price) * Number(cartitem.item.quantity);
        // // Uncomment if you have addons with prices to add to total
        // cartitem.addons.forEach(addon => {
        //     itemTotalPrice += Number(addon.price) * Number(addon.quantity);
        // });
        return acc + cartitem.item.totalPrice;
    }, 0);

    // const totalItems = cartItems.reduce((acc, cartitem) => acc + Number(cartitem.item.quantity), 0);
    const totalItems = cartItems.length;

    return res.status(200).json({ cartItems, totalPrice, totalItems });
});


// const deleteCartItemq = asyncHandler(async (req, res) => {
//     const { cartId, cartItemId, visitorId } = req.body;

//     await CartItem.findOneAndDelete({ _id: cartItemId, cart: cartId, visitor: visitorId });

//     const cartItems = await CartItem.find({ cart: cartId, visitor: visitorId });

//     const totalPrice = cartItems.reduce((acc, cartitem) => {
//         let itemTotalPrice = Number(cartitem.item.totalPrice);
//         return acc + itemTotalPrice;
//     }, 0);

//     const cart = await Cart.findOneAndUpdate(
//         { _id: cartId, visitor: visitorId },
//         { totalPrice, totalItems: cartItems.length },
//         { new: true }
//     );

//     return res.status(200).json({ cartId: cart._id });
// });


const getCart = asyncHandler(async (req, res) => {
    if (!req.params.visitorId || !(req.params.visitorId.length)) {
        throw new ApiError(400, 'Visitor id not found')
    }

    const visitor = await Visitor.findById(req.params.visitorId);

    if (!visitor) {
        throw new ApiError(400, 'Visitor not found');
    }

    const cart = await Cart.findOne({ visitor: req.params.visitorId });

    return res.status(200).json(cart);
})

const deleteCartItem = async (cartItemId) => {
    // Find the cart item by its ID
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
        throw new ApiError(404, 'CartItem not found');
    }

    // Get the cart ID associated with the cart item
    const cartId = cartItem.cart;

    // Delete the cart item
    await CartItem.findByIdAndDelete(cartItemId);

    // Fetch all remaining items in the cart to recalculate the total price
    const remainingCartItems = await CartItem.find({ cart: cartId });

    // Calculate the new total price
    const newTotalPrice = remainingCartItems.reduce((acc, item) => {
        let itemTotalPrice = Number(item.item.totalPrice);
        // Uncomment below if you have addons in the cart items
        // item.item.addons.forEach(addon => {
        //     itemTotalPrice += Number(addon.price) * Number(addon.quantity);
        // });
        return acc + itemTotalPrice;
    }, 0);

    // Update the cart with the new total price and total items count
    await Cart.findByIdAndUpdate(cartId, { totalPrice: newTotalPrice, totalItems: remainingCartItems.length }, { new: true });

    return cartId; // Return the cart ID for additional actions if needed
};

const deleteCartItemByCartItemId = asyncHandler(async (req, res) => {
    const { cartItemId } = req.params;

    const cartId = await deleteCartItem(cartItemId); // Use the utility function

    return res.status(200).json({ message: 'Cart item deleted successfully', cartId });
});

const getCartSummary = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    // Find the cart for the visitor
    const cart = await Cart.findOne({ visitor: visitorId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    // Fetch all items in the cart
    const cartItems = await CartItem.find({ cart: cart._id });

    // Calculate total price and total items
    const totalPrice = cartItems.reduce((acc, cartitem) => {
        let itemTotalPrice = Number(cartitem.item.totalPrice) * Number(cartitem.item.quantity);
        // Uncomment if you have addons with prices to add to total
        // cartitem.item.addons.forEach(addon => {
        //     itemTotalPrice += Number(addon.price) * Number(addon.quantity);
        // });
        return acc + itemTotalPrice;
    }, 0);

    const totalItems = cartItems.reduce((acc, cartitem) => acc + Number(cartitem.item.quantity), 0);

    return res.status(200).json({ totalPrice, totalItems });
});

const moveToCart = asyncHandler(async (req, res) => {
    const { wishlistId } = req.params;
    const { userId } = req.body;

    if (!wishlistId) {
        throw new ApiError(400, 'WishlistId not found');
    }

    if (!userId) {
        throw new ApiError(400, 'VisitorId not found');
    }

    const [wishlist, visitor] = await Promise.all([
        Wishlist.findById(wishlistId),
        Visitor.findById(userId)
    ]);

    if (!wishlist) {
        throw new ApiError(404, 'Wishlist item not found');
    }

    if (!visitor) {
        throw new ApiError(404, 'User not found');
    }

    await addCartItem(userId, wishlist.item);

    const cartItems = await CartItem.find({ visitor: userId }).populate('item');

    await Wishlist.findByIdAndDelete(wishlistId);

    return res.status(200).json({ message: 'Item moved to cart successfully', cartItems });
});



export { addExtraItemsToKit, addKitToCart, getCartItems, deleteCartItem, getCart, deleteCartItemByCartItemId, getCartSummary, moveToCart };
