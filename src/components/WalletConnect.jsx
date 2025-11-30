import React from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { baseSepoliaChain } from '../config/web3Config';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isCorrectNetwork = chain?.id === baseSepoliaChain.id;

  const handleConnect = () => {
    const connector = connectors[0]; // Use first available connector (injected)
    if (connector) {
      connect({ connector });
    }
  };

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: baseSepoliaChain.id });
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div>
        <button
          onClick={handleConnect}
          className="wallet-button wallet-connect"
        >
          <Wallet size={16} />
          Connect Wallet
        </button>
        {connectError && (
          <div className="wallet-error">
            <AlertCircle size={14} />
            {connectError.message}
          </div>
        )}
        <style>{`
          .wallet-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
          }
          .wallet-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .wallet-error {
            margin-top: 8px;
            padding: 8px 12px;
            background: #fee;
            color: #c33;
            border-radius: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wallet-connected-container">
      {!isCorrectNetwork && (
        <button
          onClick={handleSwitchNetwork}
          className="wallet-button wallet-switch"
        >
          <AlertCircle size={16} />
          Switch to Base Sepolia
        </button>
      )}
      <div className="wallet-info">
        <div className="wallet-address">
          <Wallet size={14} />
          {formatAddress(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="wallet-disconnect"
          title="Disconnect"
        >
          <LogOut size={14} />
        </button>
      </div>
      <style>{`
        .wallet-connected-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wallet-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }
        .wallet-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .wallet-switch {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
        }
        .wallet-switch:hover {
          box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
        }
        .wallet-info {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
        }
        .wallet-address {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #333;
        }
        .wallet-disconnect {
          background: #f5f5f5;
          border: none;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .wallet-disconnect:hover {
          background: #fee;
          color: #c33;
        }
      `}</style>
    </div>
  );
};

export default WalletConnect;
