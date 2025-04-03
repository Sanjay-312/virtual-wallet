import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

        newSocket.on("balanceUpdated", (data) => {
            console.log("📢 Balance Updated:", data);
            setBalance(data.balance);
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={{ socket, balance }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
