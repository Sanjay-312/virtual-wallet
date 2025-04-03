const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const Wallet = require("../models/walletSchema");
const Transaction = require("../models/transactionSchema");
const dotenv =  require("dotenv")
dotenv.config()
const KAFKA_TOPICS = require("../enums/kafkaTopics")
const { ETransactionType } = require("../enums/transaction")
const { io } = require("../sockets/io")
const kafka = new Kafka(JSON.parse(process.env.KAFKA_CONFIG_COMMON));
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "transaction-group" });
const {emitBalanceUpdate} = require("../sockets/io")

const sendToKafka = async (topic, message) => {
    try {
    await producer.connect();
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
    await producer.disconnect();
    } catch (error) {
        console.error("Kafka Producer Error:", error.message);  
    }
    
}

async function consumeKafkaMessages() {
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPICS.TRANSACTIONS_TOPIC, fromBeginning: true });
   await consumer.run({
        eachMessage: async ({ message }) => {
            const { userId, amount, type } = JSON.parse(message.value.toString());
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const wallet = await Wallet.findOne({ userId }).session(session);
                if (!wallet) throw new Error("Wallet not found");

                if (type === ETransactionType.deposit ) {
                    wallet.balance += amount;
                } else if (type === ETransactionType.payout) {
                    if (wallet.balance < amount) throw new Error("Insufficient funds");
                    wallet.balance -= amount;
                }

                await wallet.save({ session });
                await Transaction.create([{ userId, amount, type,status: "success", timestamp: new Date() }], { session });
                await session.commitTransaction();
                session.endSession();
                emitBalanceUpdate(userId, wallet.balance);
                console.log(`✅ Wallet updated: User ${userId}, New Balance: ${wallet.balance}`);
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                await Transaction.create([{ userId, amount, type, status: "failed", timestamp: new Date(), error: err.message }]);
                console.error("Transaction Failed: ", err.message);
            }
        }
    });
}

module.exports = { sendToKafka, consumeKafkaMessages };
