import React, { useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { FaShieldAlt, FaKey, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterWallet = ({ onSuccess }) => {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState('My Passkey Wallet');

  const handleRegister = async () => {
    try {
      setLoading(true);
      toast.loading('Registering wallet...');

      // Simulate wallet registration
      // In production, call the smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.dismiss();
      toast.success('Wallet registered successfully!');

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to register wallet');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <FaKey className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Register Your Passkey Wallet
        </h2>
        <p className="text-gray-600">
          Set up your secure WebAuthn-based wallet
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Metadata
          </label>
          <input
            type="text"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stacks-purple focus:border-transparent"
            placeholder="Enter wallet name"
          />
        </div>
      </div>

      <button
        onClick={handleRegister}
        disabled={loading || !metadata}
        className="w-full py-3 bg-gradient-to-r from-stacks-purple to-stacks-blue text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register Wallet'}
      </button>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <FaShieldAlt className="text-blue-500 mt-1" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Secure & Decentralized</p>
            <p className="text-gray-600">
              Your wallet will be secured with WebAuthn/Passkey authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWallet;
