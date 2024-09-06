import { Visitor } from "../models/visitor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { CartItem } from "../models/cartItems.model.js";
import { Counter } from "../models/counter.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { visitorId, cartId, totalAmount, amountPaid } = req.body;

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

    // console.log('cart:', cart);
    // console.log('cartitem:', cartItems)

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 30); // Add 30 days to current date

    const items = cartItems.map(cartItem => cartItem.item);

    const order = await Order.create({
        visitor,
        items: cartItems.map(cartItem => cartItem.item),
        status: 'Pending', // Assuming 'Pending' is the first status in your statusEnum
        delivery_date: deliveryDate,
        totalAmount,
        amountPaid,
        amountToBePaid: (Number(totalAmount) - Number(amountPaid))
    });

    await CartItem.deleteMany({ cart: cartId });

    return res.status(200).json({ order, message: 'Order placed successfully' });
});

const getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate the order ID
    if (!id) {
        throw new ApiError(400, "Order ID is required");
    }

    // Find the order by ID and populate related fields
    const order = await Order.findById(id)
        .populate({
            path: 'visitor',
            select: 'name email' // Adjust fields as needed
        })
        .populate({
            path: 'items',
            populate: {
                path: 'product', // Assuming CartItem has a reference to a Product model
                select: 'name price' // Adjust fields as needed
            }
        });

    // Check if the order exists
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Return the order details
    return res.status(200).json({ order });
});

const createSerialOrder = asyncHandler(async (req, res) => {
    await Counter.create({ _id: 'orderId', seq: 999 });

    return res.status(200).json('serial created successfully');
});

const getOrdersByVisitorId = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    // Validate the visitor ID
    if (!visitorId) {
        throw new ApiError(400, "Visitor ID is required");
    }

    // Find all orders associated with the visitorId
    const orders = await Order.find({ visitor: visitorId })
        .populate({
            path: 'items',
            populate: {
                path: 'product', // Assuming CartItem has a reference to a Product model
                select: 'name price' // Adjust fields as needed
            }
        });

    // Check if orders exist
    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found for this visitor");
    }

    // Return the orders
    return res.status(200).json({ orders });
});

export { createOrder, getOrderDetails, createSerialOrder, getOrdersByVisitorId };
