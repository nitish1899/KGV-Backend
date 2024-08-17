import { Router } from "express";
import { checkout, paymentVerification, verifyKYC } from "../controllers/visitor.controller.js";
// import { upload } from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/placeOrder").post(checkout)
router.route("/verifyPayment").post(paymentVerification)
router.route("/verifyKYC").post(verifyKYC)

// router.route("/bookVehicle").post(bookVehicle);

export default router;