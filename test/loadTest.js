const axios = require('axios');

const BASE_URL = 'http://localhost:3000/wallet';
const USER_ID = 'testUser';

async function simulateDeposits() {
  const promises = Array(500).fill().map(() =>
    axios.post(`${BASE_URL}/deposit`, { userId: USER_ID, amount: 100 })
  );
  await Promise.all(promises);
  console.log('500 deposits queued');
}

async function simulatePayouts() {
  const promises = Array(300).fill().map(() =>
    axios.post(`${BASE_URL}/payout`, { userId: USER_ID, amount: 50 })
  );
  await Promise.all(promises);
  console.log('300 payouts queued');
}

async function runTests() {
  await simulateDeposits();
  await simulatePayouts();
  const { data } = await axios.get(`${BASE_URL}/balance/${USER_ID}`);
  console.log(`Final balance: ${data.balance}`);
}

runTests();