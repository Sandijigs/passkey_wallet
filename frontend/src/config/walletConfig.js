/**
 * Wallet Configuration for Passkey Wallet
 * Week 3 Builder Challenge - WalletKit SDK Integration
 */

import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

// WalletConnect Project ID for Week 3 Challenge
export const WALLET_CONNECT_PROJECT_ID = '973aec75d9c96397c8ccd94d62bada81';

// Network Configuration
export const NETWORK_CONFIG = {
  testnet: new StacksTestnet(),
  mainnet: new StacksMainnet(),
};

// Current network (testnet for development)
export const NETWORK = NETWORK_CONFIG.testnet;
export const NETWORK_NAME = 'testnet';

// Contract Configuration (Updated December 26, 2025 - Final Deployment)
export const CONTRACT_CONFIG = {
  address: 'SP1WPQWDNG2H8VMG93PW3JM74SGXVTA38EVCH7GYS',
  name: 'passkey-wallet',
  network: NETWORK,
  deploymentTx: '0a5155ce5be30301f259999819214ab750e8b1801eb7f3496a316cd92c76337c',
};

// App Configuration for Stacks Connect
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// WalletConnect Configuration
export const walletConnectConfig = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: 'Passkey Wallet',
    description: 'WebAuthn/Passkey-based smart contract wallet on Stacks',
    url: window.location.origin,
    icons: [`${window.location.origin}/logo.png`],
  },
  chains: ['stacks:testnet'],
};

// Connect Options for Stacks Connect
export const connectOptions = {
  appDetails: {
    name: 'Passkey Wallet',
    icon: `${window.location.origin}/logo.png`,
  },
  redirectTo: '/',
  onFinish: () => {
    window.location.reload();
  },
  userSession,
};

// Helper function to connect wallet
export const connectWallet = () => {
  showConnect(connectOptions);
};

// Helper function to get current user data
export const getCurrentUser = () => {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    return {
      address: userData.profile.stxAddress.testnet,
      mainnetAddress: userData.profile.stxAddress.mainnet,
      username: userData.username,
      profile: userData.profile,
    };
  }
  return null;
};

// Helper function to disconnect wallet
export const disconnectWallet = () => {
  userSession.signUserOut();
  window.location.reload();
};

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://api.testnet.hiro.so',
  contractInterface: `/v2/contracts/interface/${CONTRACT_CONFIG.address}/${CONTRACT_CONFIG.name}`,
  contractEvents: `/extended/v1/contract/${CONTRACT_CONFIG.address}.${CONTRACT_CONFIG.name}/events`,
  readOnlyCall: `/v2/contracts/call-read/${CONTRACT_CONFIG.address}/${CONTRACT_CONFIG.name}`,
};

// Builder Challenge Tracking
export const BUILDER_CHALLENGE = {
  week: 3,
  requirements: {
    walletKit: true,
    walletConnectId: WALLET_CONNECT_PROJECT_ID,
    userTracking: true,
    feeTracking: true,
  },
};

export default {
  WALLET_CONNECT_PROJECT_ID,
  NETWORK,
  NETWORK_NAME,
  CONTRACT_CONFIG,
  appConfig,
  userSession,
  walletConnectConfig,
  connectOptions,
  connectWallet,
  getCurrentUser,
  disconnectWallet,
  API_CONFIG,
  BUILDER_CHALLENGE,
};
