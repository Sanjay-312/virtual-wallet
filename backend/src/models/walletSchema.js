const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
