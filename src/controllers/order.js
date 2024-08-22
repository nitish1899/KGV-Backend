import { Visitor } from "../models/visitor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";

const createOrder = asyncHandler(async (req, res) => {
    const { orderId, visitorId, cartId } = req.body;

    if ([orderId, visitorId, cartId].some((field) => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    const [visitor, cart] = await Promise.all([
        Visitor.findOne({ _id: visitorId }),
        Cart.findOne({ _id: cartId })
    ]);

    if (!visitor) {
        throw new ApiError(400, "Visitor not found");
    }

    if (!cart) {
        throw new ApiError(400, "User cart not found");
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 30); // Add 30 days to current date

    const order = await Order.create({
        orderId,
        visitor: visitorId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        status: 'Pending', // Assuming 'Pending' is the first status in your statusEnum
        delivery_date: deliveryDate
    });

    return res.status(200).json({ order, message: 'Order placed successfully' });
});

export { createOrder };
