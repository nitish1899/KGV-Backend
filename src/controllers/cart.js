import { Cart } from "../models/cart.model.js";
import { CartItem } from "../models/cartItems.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Visitor } from "../models/visitor.model.js";
import { Visitorbikedetails } from "../models/visitorbikedetails.model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { visitorId, visitorbikedetailsId } = req.body;

    const [visitor, visitorbikedetails, cart] = await Promise.all([
        Visitor.findById(visitorId), Visitorbikedetails.findById(visitorbikedetailsId).populate('kit'), Cart.findOne({ visitor: visitorId })
    ]);

    if (!visitor) {
        throw new ApiError(400, 'User not found');
    }

    if (!visitorbikedetails) {
        throw new ApiError(400, 'Visitorbikedetails not found');
    }

    console.log(visitorbikedetails);

    const item = {
        kit: visitorbikedetails.kit[0]._id,
        name: visitorbikedetails.kit[0].name,
        quantity: 1,
        addons: [],
        price: visitorbikedetails.kit[0].price,
    }

    let existingCart = cart;

    // If the cart doesn't exist, create a new one with a totalPrice of 0
    if (!existingCart) {
        existingCart = await Cart.create({ visitor: visitorId, totalPrice: 0 });
    }

    // const updatedItems = cartItems ? [...cartItems.items, item] : [item];

    // let totalPrice = cartItems ? cartItems.price : 0;

    // totalPrice += Number(item.price) * Number(item.quantity);



    // item.addons.forEach(addon => {
    //     totalPrice += Number(addon.price) * Number(addon.quantity);
    // });

    // Create a new cart item
    const cartItem = await CartItem.create({ visitor, cart: existingCart, item });

    // Calculate the new total price for the cart
    const cartTotalPrice = Number(existingCart.totalPrice) + Number(item.price);

    // Update the cart's totalPrice with the new total
    await Cart.findOneAndUpdate(
        { _id: existingCart._id },
        { totalPrice: cartTotalPrice },
        { new: true }
    );

    return res.status(200).json({ cartItemId: cartItem._id });
});

const getCartItems = asyncHandler(async (req, res) => {
    const cartItems = await CartItem.find({ cart: req.params.cartId });

    if (!cartItems) {
        throw new ApiError('No items found. Please add items to your cart', 404);
    }

    return res.status(200).json({ cartItems });
});

const deleteCartItem = asyncHandler(async (req, res) => {
    const { cartId, cartItemId, visitorId } = req.body;

    let cartItem = await CartItem.findOneAndDelete({ _id: cartItemId, cart: cartId, visitor: visitorId });

    // if (!cartItems) {
    //     throw new ApiError(404, 'CartItem not found');
    // }

    const cartItems = await CartItem.find({ cart: cartId, visitor: visitorId });

    const totalPrice = cartItems.reduce((acc, cartitem) => {
        let itemTotalPrice = Number(cartitem.item.price);
        // item.addons.forEach(addon => {
        //     itemTotalPrice += Number(addon.price);
        // });
        return acc + itemTotalPrice;
    }, 0);

    const cart = await Cart.findOneAndUpdate(
        { _id: cartId, visitor: visitorId },
        { totalPrice },
        { new: true }
    );

    return res.status(200).json({ cartId: cart._id });
});

// const addExtraItems = asyncHandler(async (req, res) => {
//     const { cartItemId, cartId, visitorId, addOnItemList } = req.body;

//     const addOnItemIds = addOnItemList.map(addOnItem => addOnItem.id);

//     const addOnItems = Item.find({ _id: addOnItemIds });

//     const cartItem = await CartItem.findOneAndUpdate({ _id: cartItemId, cart: cartId, visitor: visitorId }, {
//         addons: addOnItems.map(addOnItem => (
//             { addOnItemId: addOnItem._id, quantity: addOnItemList.filter(a => a.id === addOnItem._id)[0].quantity }
//         ))
//     });
// })

export { addToCart, getCartItems, deleteCartItem };
