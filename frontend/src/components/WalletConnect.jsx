/**
 * Wallet Connect Button Component
 * Week 3 Builder Challenge - Seamless WalletKit Integration
 */

import React from 'react';
import { useWallet } from '../providers/WalletProvider';
import { connectWallet } from '../config/walletConfig';
import { FaWallet, FaSignOutAlt } from 'react-icons/fa';

const WalletConnect = () => {
  const { isConnected, address, balance, loading, disconnectWallet } = useWallet();

  const handleConnect = () => {
    connectWallet();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* Balance Display */}
        {balance && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <span className="text-sm font-medium text-gray-700">
              {balance.stx.toFixed(2)} STX
            </span>
          </div>
        )}

        {/* Address Display */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-stacks-purple to-stacks-blue text-white rounded-lg shadow-md">
          <FaWallet className="text-white" />
          <span className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={disconnectWallet}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          title="Disconnect Wallet"
        >
          <FaSignOutAlt className="text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stacks-purple to-stacks-blue text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
    >
      <FaWallet className="text-lg" />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletConnect;
