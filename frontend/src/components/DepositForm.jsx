import React, { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DepositForm = ({ walletData }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Processing deposit...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss();
      toast.success(`Deposited ${amount} STX successfully!`);
      setAmount('');
    } catch (error) {
      toast.dismiss();
      toast.error('Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Deposit STX</h2>
      <form onSubmit={handleDeposit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (STX)</label>
          <input type="number" step="0.000001" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stacks-purple"
            placeholder="0.000000" disabled={loading} />
        </div>
        <button type="submit" disabled={loading || !amount}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50">
          <FaArrowDown /> <span>{loading ? 'Processing...' : 'Deposit STX'}</span>
        </button>
      </form>
    </div>
  );
};

export default DepositForm;
