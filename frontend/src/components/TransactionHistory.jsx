import React from 'react';
import { FaArrowDown, FaArrowUp, FaHistory } from 'react-icons/fa';

const TransactionHistory = ({ limit }) => {
  const mockTransactions = [
    { id: 1, type: 'deposit', amount: 10.5, timestamp: Date.now() - 3600000, status: 'confirmed' },
    { id: 2, type: 'withdraw', amount: 5.0, timestamp: Date.now() - 7200000, status: 'confirmed' },
    { id: 3, type: 'deposit', amount: 20.0, timestamp: Date.now() - 10800000, status: 'confirmed' },
  ];

  const transactions = limit ? mockTransactions.slice(0, limit) : mockTransactions;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FaHistory className="text-gray-600" />
        <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                  {tx.type === 'deposit' ? <FaArrowDown className="text-green-600" /> : <FaArrowUp className="text-red-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 capitalize">{tx.type}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{tx.type === 'deposit' ? '+' : '-'}{tx.amount} STX</p>
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
