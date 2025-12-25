import React from 'react';
import { FaWallet, FaUsers, FaChartLine, FaCoins } from 'react-icons/fa';

const WalletStats = ({ walletData, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <FaWallet className="text-2xl opacity-80" />
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">STX</span>
        </div>
        <p className="text-3xl font-bold">{balance?.stx?.toFixed(2) || '0.00'}</p>
        <p className="text-sm opacity-90 mt-1">Wallet Balance</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <FaCoins className="text-2xl opacity-80" />
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Contract</span>
        </div>
        <p className="text-3xl font-bold">{walletData?.balance?.toFixed(2) || '0.00'}</p>
        <p className="text-sm opacity-90 mt-1">Deposited</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <FaChartLine className="text-2xl opacity-80" />
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
        </div>
        <p className="text-3xl font-bold">{((balance?.stx || 0) + (walletData?.balance || 0)).toFixed(2)}</p>
        <p className="text-sm opacity-90 mt-1">Total Assets</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <FaUsers className="text-2xl opacity-80" />
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Week 3</span>
        </div>
        <p className="text-3xl font-bold">Active</p>
        <p className="text-sm opacity-90 mt-1">WalletKit SDK</p>
      </div>
    </div>
  );
};

export default WalletStats;
