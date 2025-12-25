# Passkey Wallet Frontend

Modern React frontend for Passkey Wallet with WalletKit SDK integration - Week 3 Builder Challenge.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 📦 Tech Stack

- **React 18.3** - UI library
- **Vite 5** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **@stacks/connect 7.10** - Wallet connection SDK
- **@stacks/transactions** - Transaction building
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## 🎯 Features

### Wallet Connection
- ✅ One-click connect with Stacks wallet
- ✅ Multi-wallet support (Hiro, Leather, Xverse)
- ✅ Session persistence
- ✅ Real-time balance updates

### Smart Contract Interaction
- ✅ Register passkey wallet
- ✅ Deposit STX
- ✅ Withdraw STX with passkey verification
- ✅ Transaction history

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Modern gradient themes
- ✅ Loading states & error handling
- ✅ Toast notifications
- ✅ Smooth animations

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── WalletConnect.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RegisterWallet.jsx
│   │   ├── DepositForm.jsx
│   │   ├── WithdrawForm.jsx
│   │   ├── WalletStats.jsx
│   │   └── TransactionHistory.jsx
│   │
│   ├── providers/           # Context providers
│   │   └── WalletProvider.jsx
│   │
│   ├── config/              # Configuration
│   │   └── walletConfig.js
│   │
│   ├── styles/              # CSS files
│   │   └── index.css
│   │
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
│
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## 🔧 Configuration

### WalletConnect ID
**Project ID**: `973aec75d9c96397c8ccd94d62bada81`

Configured in `src/config/walletConfig.js`:
```javascript
export const WALLET_CONNECT_PROJECT_ID = '973aec75d9c96397c8ccd94d62bada81';
```

### Contract Configuration
```javascript
export const CONTRACT_CONFIG = {
  address: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R',
  name: 'passkey-wallet',
  network: NETWORK,
};
```

### Network
- **Default**: Testnet
- **Switch**: Update `NETWORK` in `walletConfig.js`

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  stacks: {
    purple: '#5546FF',
    blue: '#0062FF',
  }
}
```

### Styling
- Tailwind CSS classes in components
- Global styles in `src/styles/index.css`
- Custom animations in Tailwind config

## 🔌 Wallet Integration

### Connect Wallet
```javascript
import { connectWallet } from './config/walletConfig';

const handleConnect = () => {
  connectWallet();
};
```

### Use Wallet Context
```javascript
import { useWallet } from './providers/WalletProvider';

function Component() {
  const { isConnected, address, balance } = useWallet();
  
  return <div>{address}</div>;
}
```

### Make Contract Call
```javascript
import { openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';

const txOptions = {
  contractAddress: 'SP1...',
  contractName: 'passkey-wallet',
  functionName: 'deposit',
  functionArgs: [uintCV(1000000)],
  network: NETWORK,
  onFinish: (data) => console.log('TX:', data.txId),
};

await openContractCall(txOptions);
```

## 📊 Week 3 Builder Challenge

### Requirements Met
- [x] **WalletKit SDK**: @stacks/connect integrated
- [x] **WalletConnect ID**: 973aec75d9c96397c8ccd94d62bada81
- [x] **User Tracking**: Active via WalletProvider
- [x] **Fee Tracking**: Via contract interactions
- [x] **UI/UX**: Modern, responsive interface

### Tracking Implementation
```javascript
// Wallet connections tracked in localStorage
const trackWalletConnection = () => {
  const event = {
    type: 'wallet_connection',
    timestamp: new Date().toISOString(),
    walletConnectId: WALLET_CONNECT_PROJECT_ID,
    week: 3,
  };
  
  const connections = JSON.parse(
    localStorage.getItem('wallet_connections') || '[]'
  );
  connections.push(event);
  localStorage.setItem('wallet_connections', JSON.stringify(connections));
};
```

## 🧪 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Stacks wallet (Hiro, Leather, or Xverse)

### Environment
No `.env` file needed for development. All configuration is in `walletConfig.js`.

### Hot Reload
Vite provides instant hot module replacement during development.

### Build
```bash
npm run build
```
Output: `dist/` folder ready for deployment

## 🚢 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

### Static Hosting
Serve the `dist/` folder with any static host.

## 🐛 Troubleshooting

### Wallet Not Connecting
- Ensure you have a Stacks wallet installed
- Check browser console for errors
- Verify WalletConnect ID is correct

### Transactions Failing
- Check wallet has sufficient STX
- Verify network (testnet vs mainnet)
- Check contract address is correct

### Build Errors
- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf .vite`
- Update dependencies: `npm update`

## 📚 Resources

- **Stacks Connect Docs**: https://docs.hiro.so/stacks/connect
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

---

**Week 3 Builder Challenge** - WalletKit SDK Integration ✅

**Last Updated**: 2025-12-17
