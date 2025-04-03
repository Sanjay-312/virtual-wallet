const axios = require("axios");
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 60; // Adjust as needed (e.g., 50 for 1000 requests)

const BASE_URL = "http://localhost:3000/wallet";

function generateUserId(index) {
  return `user_${index}`;
}

async function simulateDeposits() {
  const promises = Array(500).fill().map(async (_, i) =>
        await axios.post(`${BASE_URL}/deposit`, {userId: generateUserId(i),amount: 100})
    );
  const response = await Promise.all(promises);
  for (let res of response) {
    // console.log(res.data);
  }
  console.log("500 deposits queued for 500 unique users");
}

async function simulatePayouts() {
  const promises = Array(500).fill().map(async (_, i) =>
        await axios.post(`${BASE_URL}/payout`, {userId: generateUserId(i),amount: 100})
    );
  const response = await Promise.all(promises);
  for (let res of response) {
    // console.log(res.data);
  }
  console.log("500 payouts queued for 500 unique users");
}

async function runTests() {
  console.log("Starting deposit simulation...");
  await simulateDeposits();
  console.log("Starting payout simulation...");
  await simulatePayouts();
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  if (err.response) {
    console.error("Response data:", err.response.data);
    console.error("Status:", err.response.status);
  } else {
    console.error("No response received. Server might be down.");
  }
});
