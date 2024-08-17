import express from 'express';
import { register, login, sendVisitorOtp, forgotPin } from '../controllers/auth.js';

const router = express.Router();

router.route('/forgotPin').post(forgotPin);
router.route("/signup").post(register)
router.route("/sendOtp").get(sendVisitorOtp)
router.route("/login").post(login)

export default router;