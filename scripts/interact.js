/**
 * Passkey Wallet Contract Interaction Script
 *
 * This script provides examples of how to interact with the deployed contract
 * Perfect for AI agents and automated workflows
 *
 * Usage:
 *   node scripts/interact.js <command> [options]
 *
 * Commands:
 *   register  - Register a new wallet
 *   deposit   - Deposit STX into wallet
 *   withdraw  - Withdraw STX from wallet
 *   query     - Query wallet information
 *   balance   - Check wallet balance
 */

require('dotenv').config();
const {
  makeContractCall,
  makeContractSTXPostCondition,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  bufferCV,
  uintCV,
  principalCV,
  stringAsciiCV,
  callReadOnlyFunction,
  cvToJSON
} = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const { randomBytes, createHash } = require('crypto');

// Configuration
const network = STACKS_TESTNET;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R';
const CONTRACT_NAME = process.env.CONTRACT_NAME || 'passkey-wallet';

class PasskeyWalletClient {
  constructor(contractAddress, contractName, network) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
    this.network = network;
  }

  /**
   * Generate a random wallet ID
   */
  generateWalletId() {
    return randomBytes(32);
  }

  /**
   * Generate mock passkey public key (for testing)
   * In production, this would come from WebAuthn
   */
  generateMockPublicKey() {
    const x = randomBytes(32);
    const y = randomBytes(32);
    return { x, y };
  }

  /**
   * Register a new wallet
   */
  async registerWallet(senderKey, walletId, publicKeyX, publicKeyY, metadata) {
    try {
      console.log('📝 Registering new wallet...');

      const txOptions = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'register-wallet',
        functionArgs: [
          bufferCV(walletId),
          bufferCV(publicKeyX),
          bufferCV(publicKeyY),
          stringAsciiCV(metadata)
        ],
        senderKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        fee: 200000n,
        postConditions: []
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network: this.network });

      const txId = broadcastResponse.txid || broadcastResponse;

      console.log('✅ Wallet registration submitted');
      console.log(`   Wallet ID: 0x${walletId.toString('hex')}`);
      console.log(`   TX ID: ${txId}`);
      console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);

      return { txId, walletId };
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  }

  /**
   * Deposit STX into wallet
   */
  async deposit(senderKey, walletId, amount) {
    try {
      console.log(`💰 Depositing ${amount / 1000000} STX...`);

      // Create post-condition to ensure STX transfer
      const postCondition = makeContractSTXPostCondition(
        this.contractAddress,
        this.contractName,
        FungibleConditionCode.LessEqual,
        amount
      );

      const txOptions = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'deposit',
        functionArgs: [
          bufferCV(walletId),
          uintCV(amount)
        ],
        senderKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        fee: 200000n,
        postConditions: [postCondition]
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network: this.network });

      const txId = broadcastResponse.txid || broadcastResponse;

      console.log('✅ Deposit submitted');
      console.log(`   Amount: ${amount / 1000000} STX`);
      console.log(`   TX ID: ${txId}`);
      console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);

      return { txId };
    } catch (error) {
      console.error('❌ Deposit failed:', error.message);
      throw error;
    }
  }

  /**
   * Withdraw STX from wallet (requires signature)
   */
  async withdraw(senderKey, walletId, amount, recipient, messageHash, signature) {
    try {
      console.log(`💸 Withdrawing ${amount / 1000000} STX...`);

      const txOptions = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'withdraw',
        functionArgs: [
          bufferCV(walletId),
          uintCV(amount),
          principalCV(recipient),
          bufferCV(messageHash),
          bufferCV(signature)
        ],
        senderKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        fee: 200000n
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network: this.network });

      const txId = broadcastResponse.txid || broadcastResponse;

      console.log('✅ Withdrawal submitted');
      console.log(`   Amount: ${amount / 1000000} STX`);
      console.log(`   Recipient: ${recipient}`);
      console.log(`   TX ID: ${txId}`);
      console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);

      return { txId };
    } catch (error) {
      console.error('❌ Withdrawal failed:', error.message);
      throw error;
    }
  }

  /**
   * Get wallet information (read-only)
   */
  async getWallet(walletId) {
    try {
      console.log('🔍 Querying wallet...');

      const result = await callReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-wallet',
        functionArgs: [bufferCV(walletId)],
        network: this.network,
        senderAddress: this.contractAddress
      });

      const data = cvToJSON(result);
      console.log('✅ Wallet data:', JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      console.error('❌ Query failed:', error.message);
      throw error;
    }
  }

  /**
   * Get wallet balance (read-only)
   */
  async getBalance(walletId) {
    try {
      console.log('💵 Checking balance...');

      const result = await callReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-balance',
        functionArgs: [bufferCV(walletId)],
        network: this.network,
        senderAddress: this.contractAddress
      });

      const data = cvToJSON(result);
      const balance = data?.value?.balance?.value || 0;

      console.log(`✅ Balance: ${balance / 1000000} STX`);

      return balance;
    } catch (error) {
      console.error('❌ Balance check failed:', error.message);
      throw error;
    }
  }

  /**
   * Get contract info from API
   */
  async getContractInfo() {
    try {
      const url = `https://api.testnet.hiro.so/v2/contracts/interface/${this.contractAddress}/${this.contractName}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Failed to get contract info:', error.message);
      return null;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🔐 PASSKEY WALLET INTERACTION TOOL');
  console.log('='.repeat(70));
  console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`Network: testnet`);
  console.log('='.repeat(70));
  console.log('');

  const client = new PasskeyWalletClient(CONTRACT_ADDRESS, CONTRACT_NAME, network);

  // Demo mode - show all capabilities
  if (!command || command === 'demo') {
    console.log('📖 DEMO MODE - Showing contract interaction capabilities\n');

    // Show contract info
    console.log('📋 Fetching contract interface...');
    const contractInfo = await client.getContractInfo();
    if (contractInfo) {
      console.log('✅ Contract is live and accessible\n');
    }

    // Generate example wallet ID
    const walletId = client.generateWalletId();
    console.log('Generated example wallet ID:', `0x${walletId.toString('hex')}\n`);

    // Show available commands
    console.log('📚 Available Commands:\n');
    console.log('  register  - Register a new passkey wallet');
    console.log('  deposit   - Deposit STX into wallet');
    console.log('  withdraw  - Withdraw STX from wallet');
    console.log('  query     - Query wallet information');
    console.log('  balance   - Check wallet balance');
    console.log('  info      - Show contract information\n');

    console.log('💡 Example Usage:\n');
    console.log('  # Register wallet (requires private key in .env)');
    console.log('  node scripts/interact.js register\n');
    console.log('  # Check balance');
    console.log('  node scripts/interact.js balance <wallet-id>\n');
    console.log('  # Query wallet');
    console.log('  node scripts/interact.js query <wallet-id>\n');

    console.log('🤖 For AI Agents:\n');
    console.log('  Import the PasskeyWalletClient class:');
    console.log('  const { PasskeyWalletClient } = require("./scripts/interact.js");\n');
    console.log('  Then call methods programmatically with your private key.\n');

    return;
  }

  // Handle specific commands
  switch (command) {
    case 'info':
      const info = await client.getContractInfo();
      console.log(JSON.stringify(info, null, 2));
      break;

    case 'register':
      // This would require a private key - show example
      console.log('⚠️  Registration requires a funded wallet');
      console.log('Add PRIVATE_KEY to .env file, then run:\n');
      console.log('Example code:');
      console.log(`
const wallet = await generateWallet({ secretKey: process.env.MNEMONIC, password: '' });
const senderKey = wallet.accounts[0].stxPrivateKey;
const walletId = client.generateWalletId();
const { x, y } = client.generateMockPublicKey();

await client.registerWallet(
  senderKey,
  walletId,
  x,
  y,
  "My Passkey Wallet"
);
      `);
      break;

    case 'query':
    case 'balance':
      const walletIdHex = args[1];
      if (!walletIdHex) {
        console.error('❌ Please provide wallet ID');
        console.error('Usage: node scripts/interact.js', command, '<wallet-id-hex>');
        process.exit(1);
      }

      const walletIdBuf = Buffer.from(walletIdHex.replace('0x', ''), 'hex');

      if (command === 'query') {
        await client.getWallet(walletIdBuf);
      } else {
        await client.getBalance(walletIdBuf);
      }
      break;

    default:
      console.error('❌ Unknown command:', command);
      console.log('Run without arguments for help');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for programmatic use
module.exports = { PasskeyWalletClient };
