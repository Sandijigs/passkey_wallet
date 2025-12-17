#!/bin/bash
set -e

echo "🚀 Deploying passkey-wallet contract to Stacks Testnet..."
echo ""
echo "📍 Deployer Address: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
echo "🌐 Network: Testnet"
echo "📝 Contract: passkey-wallet"
echo "✨ Clarity Version: 4"
echo "📊 Epoch: 3.3"
echo ""

# Try non-interactive deployment with expect-like behavior
cat << EOF | clarinet deployments apply --testnet || true
Y
Y
EOF

echo ""
echo "Deployment command executed!"
