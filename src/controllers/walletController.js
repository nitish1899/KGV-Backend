import Wallet from '../models/Wallet.js'; 

export const createWallet = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Check if the wallet already exists for the user
      const existingWallet = await Wallet.findOne({ userId });
      if (existingWallet) {
        return res.status(400).json({ message: 'Wallet already exists for this user' });
      }
  
      // Create a new wallet
      const wallet = new Wallet({
        userId,
        balance: 0, // Initial balance set to 0
        transactions: [], 
      });
  
      // Save the wallet in the database
      await wallet.save();
  
      res.status(201).json({ message: 'Wallet created successfully', wallet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Fetch wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Recharge wallet
export const rechargeWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += parseFloat(amount);
    wallet.transactions.push({ amount: parseFloat(amount), type: 'credit' });
    await wallet.save();

    res.json({ balance: wallet.balance, message: 'Wallet recharged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Pay using wallet
export const payWithWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= parseFloat(amount);
    wallet.transactions.push({ amount: parseFloat(amount), type: 'debit' });
    await wallet.save();

    res.json({ balance: wallet.balance, message: 'Payment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get wallet transaction history (optional)
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId }).select('transactions');

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json({ transactions: wallet.transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
