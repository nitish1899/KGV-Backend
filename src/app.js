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
app.use(cookieParser());


import fileRoutes from './routes/userroutes.js';
import visitorRouter from './routes/visitor.routes.js';
import visitorbikedetailsRouter from './routes/visitorbikedetails.routes.js';
import uploadRouter from './routes/upload.routes.js';
import authRoutes from './routes/auth.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';
import kitRoutes from './routes/kit.routes.js';
import bookingKitRouter from './routes/bookingKit.routes.js';
import kgvRouter from './routes/kgvmitr.route.js';
import primimumRouter from './routes/primimum.routes.js';
import { getbikes } from "./utils/bike.js"
import wishlistRouter from "./routes/wishlist.route.js"
import walletRoutes from './routes/walletRoutes.js';
import uploadRoute from './routes/Paymentproof.route.js';
import contestuploadRoute from './routes/contestpayment.route.js';
import primiumUploadRoute from './routes/PrimumUpload.route.js';

//routes declaration
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/visitor", visitorRouter)
app.use("/api/v1/visitorbikedetails", visitorbikedetailsRouter)
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/v1/bookingkit", bookingKitRouter);
app.use("/api/v1/kgvmitra", kgvRouter);
app.use("/api/v1/payment", primimumRouter);
app.use("/api/wishlist", wishlistRouter);

app.use('/api/wallet', walletRoutes);

app.use('/api/kits', kitRoutes);

app.use("/api/files", fileRoutes);

app.use("/api", uploadRoute);

app.use("/api", contestuploadRoute);

app.use("/api", uploadRouter);
app.use("/api", primiumUploadRoute);

app.get("/api/redirect", (req, res) => {
    res.redirect('https://play.google.com/store/apps/details?id=com.tsilteam.KGVHybridSol&contest=kgvlcontest');
});

app.get("/api/bikes", (req, res) => {
    return res.status(200).json({ bikes: getbikes() });
});

app.get("/api/getkey", (req, res) =>
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.get("/api/getRewards", (req, res) => res.status(200).json({ rewards: ['Reward 1', 'Reward 2', 'Reward 3', 'Reward 4', 'Reward 5', 'Reward 6'] }))

app.use('/', (req, res) => res.json({ message: 'Welcome to the world of KGV Hybrid E-mobility' }));

app.use((err, req, res, next) => {
    console.log(err.stack); // Log the error (optional)

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