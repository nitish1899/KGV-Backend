import express from 'express';
import { register, login, sendVisitorOtp, sendExistingVisitorOtp, forgotPin } from '../controllers/auth.js';

const router = express.Router();

router.route('/forgotPin').post(forgotPin);
router.route("/signup").post(register)
router.route("/sendOtp").post(sendVisitorOtp)
router.route("/sendExistingVisitorOtp").post(sendExistingVisitorOtp)
router.route("/login").post(login)

export default router;