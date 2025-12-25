import React from 'react';
import { WalletProvider } from './providers/WalletProvider';
import { Toaster } from 'react-hot-toast';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import { FaGithub, FaBook } from 'react-icons/fa';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-stacks-purple to-stacks-blue rounded-lg"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Passkey Wallet</h1>
                  <p className="text-xs text-gray-500">Week 3 Builder Challenge</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaGithub className="text-2xl" />
                </a>
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <Dashboard />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>© 2025 Passkey Wallet - Stacks Builder Challenge</p>
              <div className="flex items-center gap-2">
                <span>WalletConnect ID: 973aec75d9c96397c8ccd94d62bada81</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Toast Notifications */}
        <Toaster position="bottom-right" />
      </div>
    </WalletProvider>
  );
}

export default App;
