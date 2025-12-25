/**
 * Dashboard Component - Main interface for Passkey Wallet
 * Week 3 Builder Challenge
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { CONTRACT_CONFIG, API_CONFIG } from '../config/walletConfig';
import {
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaHistory,
  FaChartLine,
  FaShieldAlt
} from 'react-icons/fa';
import RegisterWallet from './RegisterWallet';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransactionHistory from './TransactionHistory';
import WalletStats from './WalletStats';

const Dashboard = () => {
  const { isConnected, address, balance } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [walletRegistered, setWalletRegistered] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      checkWalletRegistration();
    }
  }, [isConnected, address]);

  const checkWalletRegistration = async () => {
    try {
      setLoading(true);
      // Check if wallet is registered in the contract
      // For demo purposes, we'll simulate this
      // In production, you'd call the contract's read-only function

      const mockWalletData = {
        id: address,
        balance: 0,
        registered: false,
      };

      setWalletData(mockWalletData);
      setWalletRegistered(mockWalletData.registered);
    } catch (error) {
      console.error('Error checking wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletRegistered = () => {
    setWalletRegistered(true);
    checkWalletRegistration();
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-stacks-purple to-stacks-blue rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaWallet className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Passkey Wallet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connect your Stacks wallet to get started with WebAuthn/Passkey-based
            secure wallet management on Stacks blockchain.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              <span>Clarity 4</span>
            </div>
            <div className="flex items-center gap-2">
              <FaWallet className="text-purple-500" />
              <span>WalletKit SDK</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Please connect your wallet using the button in the header
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!walletRegistered) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <RegisterWallet onSuccess={handleWalletRegistered} />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'deposit', label: 'Deposit', icon: FaArrowDown },
    { id: 'withdraw', label: 'Withdraw', icon: FaArrowUp },
    { id: 'history', label: 'History', icon: FaHistory },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Stats */}
      <WalletStats walletData={walletData} balance={balance} />

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2 mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-stacks-purple to-stacks-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Wallet Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  STX Balance
                </h3>
                <p className="text-3xl font-bold text-stacks-purple">
                  {balance?.stx?.toFixed(6) || '0.000000'} STX
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Contract Balance
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {walletData?.balance?.toFixed(6) || '0.000000'} STX
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TransactionHistory limit={5} />
            </div>
          </div>
        )}

        {activeTab === 'deposit' && <DepositForm walletData={walletData} />}
        {activeTab === 'withdraw' && <WithdrawForm walletData={walletData} />}
        {activeTab === 'history' && <TransactionHistory />}
      </div>

      {/* Builder Challenge Badge */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200">
          <FaShieldAlt className="text-stacks-purple" />
          <span className="text-sm font-medium text-gray-700">
            Week 3 Builder Challenge - WalletKit SDK Integrated
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
