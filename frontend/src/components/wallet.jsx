import { useSocket } from "../context/socketcontext";
const Wallet = () => {
    const { balance } = useSocket();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
            <div className="text-3xl font-bold text-blue-600">
                {balance !== null ? `₹${balance}` : "Loading..."}
            </div>
        </div>
    );
};

export default Wallet;
