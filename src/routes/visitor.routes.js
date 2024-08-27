import { Router } from "express";
import { verifyKYC, getVisitor } from "../controllers/visitor.controller.js";

const router = Router()
router.route("/verifyKYC").post(verifyKYC)
router.route("/details/:visitorId").get(getVisitor);

export default router;