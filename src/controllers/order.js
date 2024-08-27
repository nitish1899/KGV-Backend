import { Visitor } from "../models/visitor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { CartItem } from "../models/cartItems.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { visitorId, cartId } = req.body;

    if ([visitorId, cartId].some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    const [visitor, cartItems, cart] = await Promise.all([
        Visitor.findOne({ _id: visitorId }),
        CartItem.find({ cart: cartId, visitor: visitorId }),
        Cart.findById(cartId)
    ]);

    if (!visitor) {
        throw new ApiError(400, "Visitor not found");
    }

    if (!cart) {
        throw new ApiError(400, "Cart not found");
    }

    if (!cartItems) {
        throw new ApiError(400, "Please add items in your cart ");
    }

    console.log('cart:', cart);
    console.log('cartitem:', cartItems)

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 30); // Add 30 days to current date

    const  items = cartItems.map(cartItem => cartItem.item);

    const order = await Order.create({
        visitor,
        items: cartItems.map(cartItem => cartItem.item),
        totalPrice: Number(cart.totalPrice),
        status: 'Pending', // Assuming 'Pending' is the first status in your statusEnum
        delivery_date: deliveryDate
    });

    await CartItem.deleteMany({ cart: cartId });

    return res.status(200).json({ order, message: 'Order placed successfully' });
});

export { createOrder };
