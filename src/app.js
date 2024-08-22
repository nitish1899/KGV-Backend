import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: '*',
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import visitorRouter from './routes/visitor.routes.js';
import visitorbikedetailsRouter from './routes/visitorbikedetails.routes.js';
import uploadRouter from './routes/upload.routes.js';
import authRoutes from './routes/auth.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';
import kitRoutes from './routes/kit.routes.js';


//routes declaration
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/visitor", visitorRouter)
app.use("/api/v1/visitorbikedetails", visitorbikedetailsRouter)
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// app.use("/api/v1/bookingkit", bookingKitRouter)

app.use('/api/kits', kitRoutes);


app.use("/api", uploadRouter)

app.get("/api/getkey", (req, res) =>
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error (optional)

    // Set the status code (default to 500 if not set)
    res.status(err.statusCode || 500);

    // Send a response with the error message
    res.json({
        success: false,
        message: err.message || 'Internal Server Error',
        // You can include other information like `err.code` or `err.details` if needed
    });
});

export { app }