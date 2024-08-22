import { Cart } from "../models/cart.model.js";
import { CartItem } from "../models/cartItems.model.js";
import { Visitorbikedetails } from "../models/visitorbikedetails.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
    const { visitorId, visitorBikeDetailsId, item } = req.body;
    const visitorBikeDetails = await Visitorbikedetails.findOne({ _id: visitorBikeDetailsId, visitor: visitorId });

    if (!visitorBikeDetails) {
        throw new ApiError('Bike Details Not found', 404);
    }

    item.Visitorbikedetails = visitorBikeDetails;

    const cart = await Cart.findOneAndUpdate(
        { visitor: visitorId },
        { totalPrice: 0 },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let cartItems = await CartItem.findOne({ cart: cart._id, visitor: visitorId });

    let updatedItems = cartItems ? [...cartItems.items, item] : [item];

    let totalPrice = cartItems ? cartItems.totalPrice : 0;

    totalPrice += Number(item.price);

    item.addons.forEach(addon => {
        totalPrice += Number(addon.price) * Number(addon.quantity);
    });

    await CartItem.findOneAndUpdate(
        { visitor: visitorId, cart: cart._id, },
        { items: updatedItems, totalPrice },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ cartId: cart._id });
});

const getCartItems = asyncHandler(async (req, res) => {
    const cartItems = await CartItem.findOne({ cart: req.params.cartId });

    if (!cartItems) {
        throw new ApiError('No items found. Please add items to your cart', 404);
    }

    return res.status(200).json({ cartItems });
});

const deleteCartItem = asyncHandler(async (req, res) => {
    const { cartId, cartItemId, visitorId } = req.body;

    let cartItems = await CartItem.findOneAndDelete({ _id: cartItemId, cart: cartId, visitor: visitorId });

    if (!cartItems) {
        throw new ApiError('CartItem not found', 404);
    }

    const items = CartItem.find({ cart: cartId, visitor: visitorId });

    const totalPrice = items.reduce((acc, item) => {
        let itemTotalPrice = Number(item.price);
        item.addons.forEach(addon => {
            itemTotalPrice += Number(addon.price);
        });
        return acc + itemTotalPrice;
    }, 0);

    const cart = await Cart.findOneAndUpdate(
        { _id: cartId, visitor: visitorId },
        { totalPrice },
        { new: true }
    );

    return res.status(200).json({ cartId: cart._id });
});

export { addToCart, getCartItems, deleteCartItem };
