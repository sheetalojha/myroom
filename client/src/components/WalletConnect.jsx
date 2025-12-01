import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { baseSepoliaChain } from '../config/web3Config';
import { Wallet, LogOut, AlertCircle, Copy, ExternalLink, RefreshCw, ChevronDown } from 'lucide-react';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isCorrectNetwork = chain?.id === baseSepoliaChain.id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

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

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        // You could add a toast notification here
        setShowMenu(false);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleViewOnExplorer = () => {
    if (address) {
      const explorerUrl = `https://sepolia.basescan.org/address/${address}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
      setShowMenu(false);
    }
  };

  const handleChangeAccount = async () => {
    // Disconnect first, then user can reconnect with a different account
    disconnect();
    setShowMenu(false);
    // Optionally trigger a reconnect prompt
    setTimeout(() => {
      handleConnect();
    }, 500);
  };

  if (!isConnected) {
    return (
      <div>
        <button
          onClick={handleConnect}
          style={{
            backgroundColor: '#ff6b9d',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'opacity 0.2s',
            fontWeight: 500
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <Wallet size={16} />
          Connect Wallet
        </button>
        {connectError && (
          <div style={{
            marginTop: 8,
            padding: '8px 16px',
            background: '#FEFCF3',
            color: '#c33',
            borderRadius: '9999px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <AlertCircle size={12} />
            {connectError.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'relative'
    }} ref={menuRef}>
      {!isCorrectNetwork && (
        <button
          onClick={handleSwitchNetwork}
          style={{
            backgroundColor: '#ff6b9d',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'opacity 0.2s',
            fontWeight: 500,
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          <AlertCircle size={16} />
          Switch Network
        </button>
      )}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            backgroundColor: '#FEFCF3',
            color: '#1A202C',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '9999px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#F5F5F5';
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FEFCF3';
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
          }}
        >
          <Wallet size={16} />
          <span>{formatAddress(address)}</span>
          <ChevronDown 
            size={16} 
            style={{
              transition: 'transform 0.15s ease',
              transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: '#FEFCF3',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            minWidth: 200,
            overflow: 'hidden',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease'
          }}>
            {/* Account Info */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.08)'
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 4
              }}>
                Connected Account
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#1A202C',
                fontFamily: 'monospace'
              }}>
                {formatAddress(address)}
              </div>
            </div>

            {/* Menu Items */}
            <div style={{
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <button
                onClick={handleCopyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Copy size={14} color="#6B7280" />
                Copy Address
              </button>

              <button
                onClick={handleViewOnExplorer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ExternalLink size={14} color="#6B7280" />
                View on BaseScan
              </button>

              <button
                onClick={handleChangeAccount}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <RefreshCw size={14} color="#6B7280" />
                Change Account
              </button>

              <div style={{
                height: 1,
                background: 'rgba(0,0,0,0.08)',
                margin: '6px 8px'
              }} />

              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#DC2626',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={14} color="#DC2626" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default WalletConnect;