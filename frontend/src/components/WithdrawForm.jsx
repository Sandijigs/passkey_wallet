import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WithdrawForm = ({ walletData }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!recipient) {
      toast.error('Please enter recipient address');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Processing withdrawal...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss();
      toast.success(`Withdrawn ${amount} STX successfully!`);
      setAmount('');
      setRecipient('');
    } catch (error) {
      toast.dismiss();
      toast.error('Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Withdraw STX</h2>
      <form onSubmit={handleWithdraw} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (STX)</label>
          <input type="number" step="0.000001" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stacks-purple"
            placeholder="0.000000" disabled={loading} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stacks-purple font-mono text-sm"
            placeholder="ST..." disabled={loading} />
        </div>
        <button type="submit" disabled={loading || !amount || !recipient}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50">
          <FaArrowUp /> <span>{loading ? 'Processing...' : 'Withdraw STX'}</span>
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
