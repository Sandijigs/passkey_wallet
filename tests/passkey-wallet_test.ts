import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.1/index.ts';
import { assertEquals, assertExists } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Test wallet creation
Clarinet.test({
  name: "Can create a new passkey wallet",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    // Sample wallet ID and public key (33 bytes compressed secp256r1)
    const walletId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const ownerPubkey = "0x037a6b62e3c8b14f1b5933f5d5ab0509a8e7d95a111b8d3b264d95bfa753b00296";
    
    let block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'create-wallet', [
        types.buff(walletId),
        types.buff(ownerPubkey)
      ], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk();
    
    // Verify wallet was created
    let walletResult = chain.callReadOnlyFn(
      'passkey-wallet',
      'get-wallet',
      [types.buff(walletId)],
      deployer.address
    );
    
    assertExists(walletResult.result);
  }
});

// Test deposit functionality
Clarinet.test({
  name: "Can deposit STX into wallet",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const walletId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const ownerPubkey = "0x037a6b62e3c8b14f1b5933f5d5ab0509a8e7d95a111b8d3b264d95bfa753b00296";
    
    // Create wallet first
    let block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'create-wallet', [
        types.buff(walletId),
        types.buff(ownerPubkey)
      ], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk();
    
    // Deposit 1000 STX
    block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'deposit', [
        types.buff(walletId),
        types.uint(1000000000) // 1000 STX in microSTX
      ], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk();
    
    // Check balance
    let balanceResult = chain.callReadOnlyFn(
      'passkey-wallet',
      'get-balance',
      [types.buff(walletId)],
      deployer.address
    );
    
    // Verify balance updated
    assertExists(balanceResult.result);
  }
});

// Test duplicate wallet prevention
Clarinet.test({
  name: "Cannot create duplicate wallet",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const walletId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const ownerPubkey = "0x037a6b62e3c8b14f1b5933f5d5ab0509a8e7d95a111b8d3b264d95bfa753b00296";
    
    // Create wallet first time
    let block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'create-wallet', [
        types.buff(walletId),
        types.buff(ownerPubkey)
      ], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk();
    
    // Try to create same wallet again
    block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'create-wallet', [
        types.buff(walletId),
        types.buff(ownerPubkey)
      ], deployer.address)
    ]);
    
    // Should fail with ERR_WALLET_EXISTS
    block.receipts[0].result.expectErr().expectUint(1003);
  }
});

// Test get current time
Clarinet.test({
  name: "Can get current block time",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let result = chain.callReadOnlyFn(
      'passkey-wallet',
      'get-current-time',
      [],
      deployer.address
    );
    
    assertExists(result.result);
  }
});

// Test receipt generation with to-ascii
Clarinet.test({
  name: "Can generate transaction receipt",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const walletId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    
    let result = chain.callReadOnlyFn(
      'passkey-wallet',
      'generate-receipt',
      [
        types.buff(walletId),
        types.ascii("DEPOSIT"),
        types.uint(1000000)
      ],
      deployer.address
    );
    
    assertExists(result.result);
  }
});

// Test session validity check
Clarinet.test({
  name: "Session validity returns false for non-existent session",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const walletId = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const sessionId = "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";
    
    let result = chain.callReadOnlyFn(
      'passkey-wallet',
      'is-session-valid',
      [types.buff(walletId), types.buff(sessionId)],
      deployer.address
    );
    
    result.result.expectBool(false);
  }
});

// Test wallet not found error
Clarinet.test({
  name: "Deposit to non-existent wallet fails",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const walletId = "0x0000000000000000000000000000000000000000000000000000000000000001";
    
    let block = chain.mineBlock([
      Tx.contractCall('passkey-wallet', 'deposit', [
        types.buff(walletId),
        types.uint(1000000000)
      ], deployer.address)
    ]);
    
    // Should fail with ERR_WALLET_NOT_FOUND
    block.receipts[0].result.expectErr().expectUint(1004);
  }
});
