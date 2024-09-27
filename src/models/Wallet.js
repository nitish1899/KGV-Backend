import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ['credit', 'debit'] }, // credit for adding money, debit for spending
    },
  ],
}, {
  timestamps: true
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
