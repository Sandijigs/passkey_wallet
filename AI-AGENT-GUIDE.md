# AI Agent Guide - Passkey Wallet

This document provides complete instructions for AI agents to discover, understand, and interact with this Stacks smart contract project.

## 🤖 Quick Discovery

### Essential Files (Read These First)

1. **`PROJECT-METADATA.json`** - Complete machine-readable project metadata
2. **`DEPLOYMENT-SUCCESS.json`** - Live contract deployment details
3. **`README.md`** - Human-readable documentation
4. **`contracts/passkey-wallet.clar`** - Smart contract source code
5. **`AI-AGENT-GUIDE.md`** - This file

## 📍 Contract Deployment Information

```json
{
  "network": "testnet",
  "contract_address": "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet",
  "deployer": "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R",
  "deployment_tx": "d5ec4a16bd07dc281681245acc9def4c2b068e71fe4c3da934a96ffa70902c8a",
  "deployment_date": "2025-12-17T02:09:07.932Z",
  "clarity_version": 4,
  "epoch": "3.3",
  "explorer_url": "https://explorer.hiro.so/txid/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet?chain=testnet"
}
```

## 🎯 Purpose

This is a **WebAuthn/Passkey-based smart contract wallet** built for the **Stacks Builder Challenge**. It demonstrates:

- ✅ Clarity 4 smart contracts with modern features
- ✅ WebAuthn/Passkey authentication using secp256r1-verify
- ✅ **Hiro Chainhooks integration** (required for challenge)
- ✅ Real-time event monitoring
- ✅ Multi-signature wallet capabilities

## 🔧 How to Interact

### Method 1: Use Provided Scripts (Recommended)

```bash
# Monitor contract events with Chainhooks
npm run monitor

# Interact with contract
npm run interact

# Run full automated workflow
./scripts/workflow.sh full

# Generate Builder Challenge report
./scripts/workflow.sh report
```

### Method 2: Programmatic Access (Node.js)

```javascript
const { PasskeyWalletClient } = require('./scripts/interact.js');
const { STACKS_TESTNET } = require('@stacks/network');

const client = new PasskeyWalletClient(
  'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R',
  'passkey-wallet',
  STACKS_TESTNET
);

// Query wallet balance (read-only, no key needed)
const walletId = Buffer.from('your-wallet-id-hex', 'hex');
await client.getBalance(walletId);

// Get wallet info
await client.getWallet(walletId);

// Register new wallet (requires private key)
const senderKey = 'your-private-key';
const newWalletId = client.generateWalletId();
const { x, y } = client.generateMockPublicKey();
await client.registerWallet(senderKey, newWalletId, x, y, "Metadata");
```

### Method 3: Direct API Calls

#### Read-Only Call (No Transaction)

```bash
curl -X POST https://api.testnet.hiro.so/v2/contracts/call-read/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R/passkey-wallet/get-balance \
  -H 'Content-Type: application/json' \
  -d '{
    "sender": "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R",
    "arguments": ["0x1234..."]
  }'
```

#### Get Contract Info

```bash
curl https://api.testnet.hiro.so/v2/contracts/interface/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R/passkey-wallet
```

#### Get Contract Events

```bash
curl https://api.testnet.hiro.so/extended/v1/contract/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet/events?limit=50
```

## 📊 Chainhooks Integration (Builder Challenge)

### What is Integrated

This project uses **[@hirosystems/chainhooks-client](https://www.npmjs.com/package/@hirosystems/chainhooks-client)** to:

1. Monitor deposit events in real-time
2. Track withdrawal events
3. Observe wallet registrations
4. Monitor all contract calls

### Chainhook Predicates

Located in `chainhooks/predicates.json`:

- **Deposit Events** - Tracks STX deposits
- **Withdrawal Events** - Monitors withdrawals
- **Registration Events** - New wallet creation
- **Contract Calls** - All interactions

### Running the Monitor

```bash
# Start event monitoring
npm run monitor

# Or directly
node chainhooks/monitor.js

# View generated report
cat CHAINHOOK-REPORT.json
```

### Metrics Tracked for Builder Challenge

```javascript
{
  "chainhooksUsed": true,
  "usersGenerated": <number>,      // Unique wallet addresses
  "feesGenerated": <number>,        // Total transaction fees in micro-STX
  "totalVolume": <number>,          // Total STX volume
  "deposits": <number>,             // Number of deposits
  "withdrawals": <number>,          // Number of withdrawals
  "registrations": <number>         // Number of wallets created
}
```

## 📚 Contract Functions

### Public Functions (Require Transaction)

#### 1. `register-wallet`
```clarity
(register-wallet
  (wallet-id (buff 32))           ;; Unique wallet identifier
  (public-key-x (buff 32))        ;; Passkey public key X coordinate
  (public-key-y (buff 32))        ;; Passkey public key Y coordinate
  (metadata (string-ascii 256))   ;; Wallet metadata
)
;; Returns: (response bool uint)
```

#### 2. `deposit`
```clarity
(deposit
  (wallet-id (buff 32))           ;; Wallet to deposit into
  (amount uint)                   ;; Amount in micro-STX
)
;; Returns: (response uint uint)
```

#### 3. `withdraw`
```clarity
(withdraw
  (wallet-id (buff 32))           ;; Wallet to withdraw from
  (amount uint)                   ;; Amount in micro-STX
  (recipient principal)           ;; Recipient address
  (message-hash (buff 32))        ;; Message hash for signature
  (signature (buff 64))           ;; Passkey signature
)
;; Returns: (response uint uint)
```

#### 4. `add-signer`
```clarity
(add-signer
  (wallet-id (buff 32))           ;; Wallet ID
  (new-signer principal)          ;; New signer to add
)
;; Returns: (response bool uint)
```

### Read-Only Functions (No Transaction)

#### 1. `get-wallet`
```clarity
(get-wallet (wallet-id (buff 32)))
;; Returns wallet data or none
```

#### 2. `get-balance`
```clarity
(get-balance (wallet-id (buff 32)))
;; Returns: {balance: uint}
```

#### 3. `get-transaction`
```clarity
(get-transaction
  (wallet-id (buff 32))
  (tx-index uint)
)
;; Returns transaction details or none
```

## 🔔 Events Emitted

The contract emits events that Chainhooks can monitor:

```clarity
// Wallet registration
{
  event: "wallet_registered",
  wallet-id: <buff>,
  owner: <principal>,
  timestamp: <uint>
}

// Deposit
{
  event: "deposit",
  wallet-id: <buff>,
  amount: <uint>,
  sender: <principal>
}

// Withdrawal
{
  event: "withdraw",
  wallet-id: <buff>,
  amount: <uint>,
  recipient: <principal>,
  verified: true
}
```

## 🗂️ Project Structure

```
passkey-wallet/
├── contracts/
│   └── passkey-wallet.clar          # Smart contract (Clarity 4)
│
├── chainhooks/
│   ├── predicates.json              # Chainhook event predicates
│   └── monitor.js                   # Event monitoring script
│
├── scripts/
│   ├── interact.js                  # Contract interaction client
│   └── workflow.sh                  # Automated workflow script
│
├── tests/
│   └── passkey-wallet_test.clar     # Contract tests
│
├── settings/
│   ├── Devnet.toml                  # Local network config
│   ├── Simnet.toml                  # Simulation config
│   └── Testnet.toml                 # Testnet config
│
├── deploy.js                        # Deployment script
├── PROJECT-METADATA.json            # Machine-readable metadata
├── DEPLOYMENT-SUCCESS.json          # Deployment details
├── CHAINHOOK-REPORT.json            # Event monitoring report
├── README.md                        # Documentation
├── AI-AGENT-GUIDE.md                # This file
├── .env.example                     # Environment template
└── package.json                     # Dependencies and scripts
```

## 🚀 Automated Workflows

### Full Workflow (Test → Deploy → Monitor)

```bash
./scripts/workflow.sh full
```

This will:
1. ✅ Setup dependencies
2. ✅ Run contract tests
3. ✅ Deploy to testnet (if not already deployed)
4. ✅ Monitor events with Chainhooks
5. ✅ Generate Builder Challenge report

### Individual Commands

```bash
./scripts/workflow.sh setup      # Install dependencies
./scripts/workflow.sh test       # Run tests
./scripts/workflow.sh deploy     # Deploy contract
./scripts/workflow.sh monitor    # Monitor events
./scripts/workflow.sh report     # Generate report
```

## 📋 Required Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
# Chainhooks Configuration
CHAINHOOK_BASE_URL=https://api.hiro.so
CHAINHOOK_API_KEY=your_api_key_here

# Contract Details
CONTRACT_ADDRESS=SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R
CONTRACT_NAME=passkey-wallet

# Network
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so

# Optional - for deploying new instances
MNEMONIC="your 24 word mnemonic here"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Or with clarinet directly
clarinet test

# Check contract syntax
clarinet check

# Interactive console
clarinet console
```

## 📈 Builder Challenge Compliance

This project meets all Stacks Builder Challenge requirements:

### ✅ Hiro Chainhooks Integration
- Package: `@hirosystems/chainhooks-client` installed
- 4 active chainhook predicates monitoring contract events
- Real-time event monitoring script
- Automated reporting

### ✅ User & Fee Tracking
- Tracks unique users (wallet creators/users)
- Monitors all transaction fees
- Calculates total volume
- Reports in `CHAINHOOK-REPORT.json`

### ✅ GitHub Contributions
- Open-source repository
- Comprehensive documentation
- Well-structured codebase
- Regular commits

### ✅ Documentation
- AI-discoverable metadata
- Complete API reference
- Interaction examples
- Automated workflows

## 💡 Tips for AI Agents

1. **Start with metadata**: Read `PROJECT-METADATA.json` for complete project structure
2. **Check deployment**: Read `DEPLOYMENT-SUCCESS.json` for live contract details
3. **Use provided scripts**: `scripts/interact.js` has ready-to-use functions
4. **Monitor events**: Run `npm run monitor` to see contract activity
5. **Generate reports**: Use `./scripts/workflow.sh report` for metrics

## 🔗 Important Links

- **Contract Explorer**: https://explorer.hiro.so/txid/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet?chain=testnet
- **Deployment TX**: https://explorer.hiro.so/txid/d5ec4a16bd07dc281681245acc9def4c2b068e71fe4c3da934a96ffa70902c8a?chain=testnet
- **API Endpoint**: https://api.testnet.hiro.so
- **Chainhooks Docs**: https://www.npmjs.com/package/@hirosystems/chainhooks-client
- **Clarity Docs**: https://docs.stacks.co/clarity

## 🆘 Common Tasks

### Get Contract State
```javascript
const response = await fetch(
  'https://api.testnet.hiro.so/v2/contracts/interface/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R/passkey-wallet'
);
const data = await response.json();
```

### Monitor Events in Real-Time
```bash
npm run monitor
```

### Query Wallet Balance
```bash
node scripts/interact.js balance 0x<wallet-id-hex>
```

### Generate Metrics Report
```bash
./scripts/workflow.sh report
```

## 📊 Expected Output

After running the monitor, you should see:

```
🔍 PASSKEY WALLET CHAINHOOK MONITOR
======================================================================
Contract: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet
Network: testnet
======================================================================

📈 STATISTICS (For Stacks Builder Challenge)
======================================================================
Total Deposits:        X
Total Withdrawals:     X
Total Registrations:   X
Total Volume:          X.XXXXXX STX
Unique Users:          X
Total Fees Generated:  X.XXXXXX STX
======================================================================
```

---

**Last Updated**: 2025-12-17

**For Questions**: Check README.md or PROJECT-METADATA.json for additional details.

**Contract Address**: `SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R.passkey-wallet`
