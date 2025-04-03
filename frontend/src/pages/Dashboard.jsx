import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const userId = "67ed84078ea13dfaf6b0c209";

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    // Listen for real-time balance updates
    socket.on("balanceUpdated", (data) => {
      if (data.userId === userId) {
        console.log("🔄 Balance Updated:", data.balance);
        setBalance(data.balance);
      }
    });

    return () => {
      socket.off("balanceUpdated");
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/wallet/balance/${userId}`
      );
      setBalance(response.data.balance);
    } catch (error) {
      setMessage("⚠️ Failed to fetch balance. Please try again.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/wallet/history/${userId}`
      );
      setTransactions(response.data);
    } catch (error) {
      setMessage("⚠️ Error fetching transactions.");
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage("⚠️ Enter a valid amount.");
      return;
    }
    try {
      await axios.post(`http://localhost:3000/wallet/${type}`, {
        userId,
        amount: parseFloat(amount),
      });
      setMessage("Transaction request sent!");
      fetchBalance();
      fetchTransactions();
    } catch (error) {
      setMessage("⚠️ Transaction failed.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dash-board-heading">Wallet Dashboard</h2>
      <p className="balance">Balance: ₹{balance}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input-field"
        placeholder="Enter amount"
      />

      <div className="button-group">
        <button
          onClick={() => handleTransaction("deposit")}
          className="button deposit-btn"
        >
          Deposit
        </button>
        <button
          onClick={() => handleTransaction("payout")}
          className="button payout-btn"
        >
          Payout
        </button>
      </div>

      <p className="message">{message}</p>

      <div className="transaction-history">
        <h3>Transaction History</h3>
        {transactions.map((txn, index) => (
          <div key={index} className="transaction-item">
            {txn.type} - ₹{txn.amount} - {txn.status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletDashboard;
