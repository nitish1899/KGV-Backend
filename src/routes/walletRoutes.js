import { Router } from 'express';
import {
  createWallet,
  getWalletBalance,
  rechargeWallet,
  payWithWallet,
  getTransactions
} from '../controllers/walletController.js'; 

const router = Router();


router.post('/create', createWallet);
// Fetch wallet balance
router.get('/:userId', getWalletBalance);

// Recharge wallet
router.post('/:userId/recharge', rechargeWallet);

// Pay using wallet
router.post('/:userId/pay', payWithWallet);

// Get wallet transaction history (optional)
router.get('/:userId/transactions', getTransactions);

export default router;
