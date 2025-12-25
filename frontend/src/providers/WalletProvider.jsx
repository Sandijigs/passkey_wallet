/**
 * Wallet Provider - Context for managing wallet state
 * Week 3 Builder Challenge - WalletKit SDK Integration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import {
  userSession,
  connectOptions,
  getCurrentUser,
  disconnectWallet as disconnect,
  WALLET_CONNECT_PROJECT_ID,
} from '../config/walletConfig';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check wallet connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Fetch balance when address changes
  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);

  const checkConnection = () => {
    try {
      if (userSession.isUserSignedIn()) {
        const user = getCurrentUser();
        setUserData(user);
        setAddress(user.address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!address) return;

    try {
      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`
      );
      const data = await response.json();
      setBalance({
        stx: data.stx.balance / 1000000, // Convert micro-STX to STX
        locked: data.stx.locked / 1000000,
        total: (data.stx.balance + data.stx.locked) / 1000000,
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = () => {
    // Track wallet connection for Builder Challenge
    trackWalletConnection();
  };

  const disconnectWallet = () => {
    disconnect();
    setIsConnected(false);
    setUserData(null);
    setAddress(null);
    setBalance(null);
  };

  // Track wallet connection for Week 3 Builder Challenge
  const trackWalletConnection = () => {
    const event = {
      type: 'wallet_connection',
      timestamp: new Date().toISOString(),
      walletConnectId: WALLET_CONNECT_PROJECT_ID,
      week: 3,
    };

    // Store in localStorage for tracking
    const connections = JSON.parse(
      localStorage.getItem('wallet_connections') || '[]'
    );
    connections.push(event);
    localStorage.setItem('wallet_connections', JSON.stringify(connections));

    console.log('📊 Week 3 Challenge: Wallet connection tracked', event);
  };

  const value = {
    isConnected,
    userData,
    address,
    balance,
    loading,
    connectWallet,
    disconnectWallet,
    refreshBalance: fetchBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      <Connect authOptions={connectOptions}>{children}</Connect>
    </WalletContext.Provider>
  );
};

export default WalletProvider;
