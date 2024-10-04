import { Router } from "express";
import { verifyKYC, getVisitor, updateUserDetails, updatePremiumStatus,updateSpinTheWheelStatus } from "../controllers/visitor.controller.js";

const router = Router()
router.route("/verifyKYC").post(verifyKYC)
router.route("/details/:visitorId").get(getVisitor);
router.put('/user/:userId', updateUserDetails);
router.patch('/user/premium/:userId', updatePremiumStatus);
router.patch('/spinTheWheel/:userId', updateSpinTheWheelStatus);

export default router;