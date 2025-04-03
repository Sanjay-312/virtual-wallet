# Virtual Wallet System

## Overview
This project is a high-concurrency virtual wallet system designed to handle multiple simultaneous transactions while ensuring data integrity, race condition prevention, and accurate balance updates. It includes a backend built with Node.js, Express, and MongoDB, along with a React-based frontend for real-time transaction monitoring.

## Features
### Backend
- Deposit and payout functionality
- Balance inquiry and transaction history retrieval
- Concurrency handling with Kafka
- MongoDB transactions for atomic operations
- WebSockets for real-time updates
- Robust error handling and logging

### Frontend
- Dashboard to monitor transactions in real-time
- Balance and transaction history display
- WebSocket-based live balance updates
- Responsive UI using React and CSS

## Technologies Used
### Backend:
- **Node.js** with Express framework
- **MongoDB** with Mongoose ORM
- **Kafka** for asynchronous message queue processing
- **Redis** for caching
- **WebSockets (Socket.io)** for real-time updates
- **Docker** for containerization

### Frontend:
- **React.js** (Vite-based setup)
- **WebSockets (Socket.io-client)** for real-time balance updates
- **Axios** for API communication

## Installation and Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- MongoDB (local or cloud instance)
- Docker (for Kafka setup)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/virtual-wallet
   KAFKA_BROKER=localhost:9092
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the Kafka broker (using Docker Compose):
   ```sh
   docker-compose up -d
   ```
5. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

## API Endpoints
### Wallet Operations
- **POST `/wallet/deposit`** - Deposit funds
- **POST `/wallet/payout`** - Withdraw funds
- **GET `/wallet/balance/:userId`** - Get user balance
- **GET `/wallet/history/:userId`** - Fetch transaction history

## Real-Time Balance Updates
- The frontend listens for `balanceUpdated` WebSocket events.
- The backend emits `balanceUpdated` events whenever a transaction is processed.

## Performance Testing
To simulate high-concurrency traffic:
- Use **k6**, **JMeter**, or **Postman**.
- Example k6 script:
  ```js
  import http from 'k6/http';
  import { sleep } from 'k6';

  export default function () {
      http.post('http://localhost:3000/wallet/deposit', { userId: '123', amount: 100 });
      sleep(1);
  }
  ```
  Run with:
  ```sh
  k6 run script.js
  ```

## Submission Requirements
- [ ] Public GitHub repository
- [ ] Video demonstration covering:
  - System architecture explanation
  - Live transaction processing
  - Queue system handling concurrent requests
  - React dashboard real-time monitoring
  - Error handling for failures
- [ ] Email submission with GitHub & video links

## Known Limitations & Future Improvements
- Optimize Kafka consumer for better performance.
- Implement rate limiting to prevent abuse.
- Add multi-currency support.
- Improve UI with additional filtering and sorting options.

---
🚀 **Happy Coding!**

