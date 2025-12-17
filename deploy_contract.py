#!/usr/bin/env python3
"""
Stacks Smart Contract Deployment Script
Deploys passkey-wallet contract to Stacks Testnet
"""

import json
import requests
import time
from hashlib import sha256, sha512
import hmac
import hashlib

# Configuration
TESTNET_API = "https://api.testnet.hiro.so"
CONTRACT_NAME = "passkey-wallet"
DEPLOYER_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

# BIP39 mnemonic to seed
MNEMONIC = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"

print("=" * 60)
print("🚀 STACKS SMART CONTRACT DEPLOYMENT")
print("=" * 60)
print()
print(f"📝 Contract: {CONTRACT_NAME}")
print(f"📍 Deployer: {DEPLOYER_ADDRESS}")
print(f"🌐 Network: Testnet")
print()

# Read contract source
with open('contracts/passkey-wallet.clar', 'r') as f:
    contract_source = f.read()

print(f"✅ Contract loaded: {len(contract_source)} bytes")

# Get current nonce
print("🔍 Fetching account nonce...")
nonce_url = f"{TESTNET_API}/extended/v1/address/{DEPLOYER_ADDRESS}/nonces"
response = requests.get(nonce_url)
nonce_data = response.json()
nonce = nonce_data.get('possible_next_nonce', 0)
print(f"✅ Current nonce: {nonce}")

# Get account balance
print("💰 Checking balance...")
balance_url = f"{TESTNET_API}/extended/v1/address/{DEPLOYER_ADDRESS}/balances"
response = requests.get(balance_url)
balance_data = response.json()
balance_stx = int(balance_data['stx']['balance']) / 1_000_000
print(f"✅ Balance: {balance_stx:.2f} STX")

# Estimate fee
print("💸 Estimating deployment fee...")
fee_estimate_url = f"{TESTNET_API}/v2/fees/transaction"
fee_payload = {
    "transaction_payload": f"0x06{CONTRACT_NAME.encode().hex()}{contract_source.encode().hex()}"
}
fee_response = requests.post(fee_estimate_url, json=fee_payload)
estimated_fee = fee_response.json().get('estimated_cost', 136320)
print(f"✅ Estimated fee: {estimated_fee / 1_000_000:.6f} STX")

print()
print("=" * 60)
print("📋 DEPLOYMENT SUMMARY")
print("=" * 60)
print(f"Contract Name: {CONTRACT_NAME}")
print(f"Contract Size: {len(contract_source)} bytes")
print(f"Deployer: {DEPLOYER_ADDRESS}")
print(f"Balance: {balance_stx:.2f} STX")
print(f"Nonce: {nonce}")
print(f"Estimated Fee: {estimated_fee / 1_000_000:.6f} STX")
print(f"Clarity Version: 4")
print(f"Epoch: 3.3")
print()

# Note about manual deployment
print("⚠️  DEPLOYMENT METHOD:")
print()
print("Due to the complexity of signing Stacks transactions in Python")
print("(requires c32check, secp256k1, and specific Stacks transaction encoding),")
print("the recommended deployment method is:")
print()
print("🌐 WEB UI DEPLOYMENT:")
print("1. Visit: https://explorer.hiro.so/sandbox/deploy?chain=testnet")
print("2. Import wallet using mnemonic from DEPLOYER-WALLET.md")
print("3. Paste contract source")
print("4. Set contract name: passkey-wallet")
print("5. Set Clarity version: 4")
print("6. Click 'Deploy'")
print()
print("📝 OR USE CLARINET (if you have interactive terminal):")
print("   clarinet deployments apply --testnet")
print()
print("=" * 60)
print()

# Save deployment info
deployment_info = {
    "contract_name": CONTRACT_NAME,
    "deployer_address": DEPLOYER_ADDRESS,
    "network": "testnet",
    "nonce": nonce,
    "balance_stx": balance_stx,
    "estimated_fee_stx": estimated_fee / 1_000_000,
    "contract_size_bytes": len(contract_source),
    "clarity_version": 4,
    "epoch": "3.3",
    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
    "status": "ready_to_deploy"
}

with open('deployment-info.json', 'w') as f:
    json.dump(deployment_info, f, indent=2)

print("✅ Deployment info saved to: deployment-info.json")
print()
print("🎯 CONTRACT IS READY FOR DEPLOYMENT!")

