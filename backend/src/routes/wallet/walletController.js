const { sendToKafka } = require("../../config/kafka");
const { ETransactionType } = require("../../enums/transaction");
const KAFKA_TOPICS = require("../../enums/kafkaTopics");
const Wallet = require("../../models/walletSchema");
const Transaction = require("../../models/transactionSchema")

const transactions = []; 

//Depost API
const deposit = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount <= 0)
      return res.status(400).json({ error: "Invalid input" });
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new Error("Wallet not found");
    await sendToKafka(KAFKA_TOPICS.TRANSACTIONS_TOPIC, {
      userId,
      amount,
      type: ETransactionType.deposit,
    });
    res.json({ message: "Deposit request received" });
  } catch (error) {
    return res.json({
      code: 400,
      message: error.message,
      error: error.name,
      userData: null,
    });
  }
};

// Payout API
const payout = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount <= 0)
      return res.status(400).json({ error: "Invalid input" });
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new Error("Wallet not found");

    await sendToKafka(KAFKA_TOPICS.TRANSACTIONS_TOPIC, {
      userId,
      amount,
      type: ETransactionType.payout,
    });
    res.json({ message: "Payout request received" });
  } catch (error) {
    return res.json({
      code: 400,
      message: error.message,
      error: error.name,
      userData: null,
    });
  }
};

// Balance API
const getBallence = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json({ balance: wallet ? wallet.balance : 0 });
  } catch (error) {
    return res.json({
      code: 400,
      message: error.message,
      error: error.name,
      userData: null,
    });
  }
};

const getHistory = async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.params.userId,
  }).sort({ timestamp: -1 });
  res.json(transactions);
};

module.exports = { deposit, payout, getBallence, getHistory };
