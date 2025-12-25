# Installation & Setup Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Stacks wallet (Hiro, Leather, or Xverse)

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will open at **http://localhost:3000**

### Step 3: Connect Your Wallet

1. Click "Connect Wallet" button in the header
2. Choose your Stacks wallet
3. Approve the connection
4. Start using the app!

---

## 📦 What Gets Installed

### Frontend Dependencies
```json
{
  "@stacks/connect": "^7.10.0",
  "@stacks/connect-react": "^29.1.0",
  "@stacks/transactions": "^6.19.3",
  "@stacks/network": "^6.19.3",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^5.0.1"
}
```

### Dev Dependencies
```json
{
  "vite": "^5.3.1",
  "tailwindcss": "^3.4.1",
  "@vitejs/plugin-react": "^4.3.1"
}
```

---

## 🔧 Configuration

### WalletConnect ID
Already configured in `src/config/walletConfig.js`:
```javascript
export const WALLET_CONNECT_PROJECT_ID = '973aec75d9c96397c8ccd94d62bada81';
```

### Contract Address
Pointing to deployed testnet contract:
```javascript
export const CONTRACT_CONFIG = {
  address: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R',
  name: 'passkey-wallet',
  network: NETWORK,
};
```

---

## 🧪 Testing the App

### 1. Connect Wallet
- Click "Connect Wallet"
- Choose your wallet
- Approve connection

### 2. Register Wallet (First time)
- Enter wallet name
- Click "Register Wallet"
- Approve transaction

### 3. Deposit STX
- Go to "Deposit" tab
- Enter amount
- Click "Deposit STX"
- Approve transaction

### 4. Withdraw STX
- Go to "Withdraw" tab
- Enter amount and recipient
- Click "Withdraw STX"
- Approve transaction

### 5. View History
- Go to "History" tab
- See all transactions

---

## 🏗️ Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Other Static Hosts
Upload the `dist/` folder to any static hosting service.

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet Not Connecting
- Ensure wallet extension is installed
- Check browser console for errors
- Try different wallet (Hiro, Leather, Xverse)

### Transactions Failing
- Check wallet has sufficient STX
- Verify you're on testnet
- Check contract address is correct

---

## 📚 Additional Resources

- **Stacks Connect**: https://docs.hiro.so/stacks/connect
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Frontend runs at http://localhost:3000
- [ ] Wallet connect button appears
- [ ] Can connect wallet successfully
- [ ] Dashboard loads with stats
- [ ] Forms are interactive
- [ ] No console errors

---

**Installation Time**: ~5 minutes
**First Transaction**: ~2 minutes
**Total Setup**: ~7 minutes

Ready to use! 🎉
