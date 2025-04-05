const axios = require("axios");

const BASE_URL = "http://localhost:3000/wallet";
const GLOBAL_WALLET_ID = '67f01cf1958e2a35f1e9d42c'

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function simulateRandomTransactions() {
  // Create 500 deposit requests
  const deposits = Array(500).fill().map(() => ({
    type: "deposit",
    request: () =>  axios.post(`${BASE_URL}/deposit`, { userId: GLOBAL_WALLET_ID, amount: Math.ceil(Math.random() * 100) }),
  }));

  // Create 300 payout requests
  const payouts = Array(300).fill().map(() => ({
    type: "payout",
    request: () => axios.post(`${BASE_URL}/payout`, { userId: GLOBAL_WALLET_ID, amount: Math.ceil(Math.random() * 1000) }),
  }));

  // Combine and shuffle all requests
  const allRequests = shuffleArray([...deposits, ...payouts]);

  // Execute all requests simultaneously
  const promises = allRequests.map((req) => req.request());
  await Promise.all(promises);

  console.log(`Queued ${deposits.length} deposits and ${payouts.length} payouts in random order`);
}

async function runTests() {
  console.log("Starting random transaction simulation...");
  await simulateRandomTransactions();

}

runTests().catch((err) => {
  console.error("Test failed:", err.message);
  if (err.response) {
    console.error("Response data:", err.response.data);
    console.error("Status:", err.response.status);
  } else {
    console.error("No response received. Server might be down.");
  }
});