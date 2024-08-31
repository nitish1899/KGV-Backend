import { Router } from "express";
import { verifyKYC, getVisitor, updateUserDetails } from "../controllers/visitor.controller.js";

const router = Router()
router.route("/verifyKYC").post(verifyKYC)
router.route("/details/:visitorId").get(getVisitor);
router.put('/user/:userId', updateUserDetails);

export default router;