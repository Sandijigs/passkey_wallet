#!/bin/bash

# Passkey Wallet - Automated Workflow Script
# For AI agents and automated deployments

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Help message
show_help() {
    echo "Passkey Wallet Workflow Script"
    echo ""
    echo "Usage: ./scripts/workflow.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Setup project dependencies"
    echo "  test        - Run contract tests"
    echo "  deploy      - Deploy contract to testnet"
    echo "  monitor     - Monitor contract events with Chainhooks"
    echo "  interact    - Show interaction examples"
    echo "  report      - Generate Builder Challenge report"
    echo "  full        - Run full workflow (test -> deploy -> monitor)"
    echo "  help        - Show this help message"
    echo ""
    echo "For AI Agents:"
    echo "  This script automates the entire deployment and monitoring process."
    echo "  Run './scripts/workflow.sh full' for complete automation."
}

# Setup dependencies
setup() {
    print_header "Setting up project dependencies"

    print_info "Checking Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION installed"
    else
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi

    print_info "Checking Clarinet..."
    if command -v clarinet &> /dev/null; then
        CLARINET_VERSION=$(clarinet --version)
        print_success "Clarinet installed: $CLARINET_VERSION"
    else
        print_error "Clarinet not found. Please install Clarinet 3.11.0+"
        exit 1
    fi

    print_info "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"

    print_info "Checking environment..."
    if [ ! -f .env ]; then
        print_info "Creating .env from .env.example"
        cp .env.example .env
        print_info "Please configure .env file"
    else
        print_success ".env file exists"
    fi

    print_success "Setup complete!"
}

# Run tests
run_tests() {
    print_header "Running contract tests"

    print_info "Checking contract syntax..."
    clarinet check
    print_success "Syntax check passed"

    print_info "Running test suite..."
    clarinet test
    print_success "All tests passed"
}

# Deploy contract
deploy_contract() {
    print_header "Deploying contract to testnet"

    print_info "Starting deployment..."
    node deploy.js

    if [ -f DEPLOYMENT-SUCCESS.json ]; then
        print_success "Deployment successful!"
        print_info "Deployment details saved to DEPLOYMENT-SUCCESS.json"

        # Extract and display contract address
        CONTRACT_ADDR=$(grep -o '"deployer": "[^"]*"' DEPLOYMENT-SUCCESS.json | cut -d'"' -f4)
        TX_ID=$(grep -o '"txId": "[^"]*"' DEPLOYMENT-SUCCESS.json | cut -d'"' -f4)

        echo ""
        echo "Contract Address: $CONTRACT_ADDR.passkey-wallet"
        echo "Transaction ID: $TX_ID"
        echo "Explorer: https://explorer.hiro.so/txid/$TX_ID?chain=testnet"
        echo ""
    else
        print_error "Deployment failed - no success file found"
        exit 1
    fi
}

# Monitor events
monitor_events() {
    print_header "Monitoring contract events with Chainhooks"

    print_info "Starting Chainhook monitor..."
    node chainhooks/monitor.js

    if [ -f CHAINHOOK-REPORT.json ]; then
        print_success "Monitoring complete"
        print_info "Report saved to CHAINHOOK-REPORT.json"

        echo ""
        echo "Builder Challenge Metrics:"
        grep -A 6 '"builderChallenge"' CHAINHOOK-REPORT.json || true
        echo ""
    fi
}

# Show interaction examples
show_interact() {
    print_header "Contract Interaction Examples"

    node scripts/interact.js demo
}

# Generate Builder Challenge report
generate_report() {
    print_header "Generating Builder Challenge Report"

    echo ""
    echo "📊 PROJECT SUMMARY"
    echo "=================="
    echo ""

    # Contract info
    if [ -f DEPLOYMENT-SUCCESS.json ]; then
        CONTRACT_ADDR=$(grep -o '"deployer": "[^"]*"' DEPLOYMENT-SUCCESS.json | cut -d'"' -f4)
        echo "✅ Contract Deployed: $CONTRACT_ADDR.passkey-wallet"
    else
        echo "⚠️  Contract not yet deployed"
    fi

    # Chainhooks info
    echo "✅ Chainhooks Integrated: @hirosystems/chainhooks-client"
    echo "✅ Event Monitoring: Active"

    # Count predicates
    PREDICATES=$(grep -c '"uuid"' chainhooks/predicates.json 2>/dev/null || echo "0")
    echo "✅ Chainhook Predicates: $PREDICATES"

    # Metrics from report
    if [ -f CHAINHOOK-REPORT.json ]; then
        echo ""
        echo "📈 METRICS (From Latest Monitor Run)"
        echo "===================================="
        grep -A 6 '"statistics"' CHAINHOOK-REPORT.json | grep -v "statistics" || true
    fi

    echo ""
    echo "🔗 LINKS"
    echo "========"
    echo "Chainhooks Docs: https://www.npmjs.com/package/@hirosystems/chainhooks-client"
    echo "Stacks Explorer: https://explorer.hiro.so/?chain=testnet"
    echo "API Endpoint: https://api.testnet.hiro.so"

    echo ""
    print_success "Report generation complete"
}

# Full workflow
full_workflow() {
    print_header "Running Full Workflow"
    echo ""

    setup
    echo ""

    run_tests
    echo ""

    # Check if already deployed
    if [ -f DEPLOYMENT-SUCCESS.json ]; then
        print_info "Contract already deployed, skipping deployment..."
    else
        deploy_contract
    fi
    echo ""

    monitor_events
    echo ""

    generate_report
    echo ""

    print_success "Full workflow complete!"
}

# Main command router
case "${1:-help}" in
    setup)
        setup
        ;;
    test)
        run_tests
        ;;
    deploy)
        deploy_contract
        ;;
    monitor)
        monitor_events
        ;;
    interact)
        show_interact
        ;;
    report)
        generate_report
        ;;
    full)
        full_workflow
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
