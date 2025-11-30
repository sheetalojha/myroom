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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 500,
            color: '#1A202C',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          }}
        >
          <Wallet size={12} />
          Connect Wallet
        </button>
        {connectError && (
          <div style={{
            marginTop: 8,
            padding: '8px 12px',
            background: 'rgba(255, 238, 238, 0.95)',
            backdropFilter: 'blur(16px)',
            color: '#c33',
            borderRadius: '12px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 500,
            color: '#1A202C',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          }}
        >
          <AlertCircle size={12} />
          Switch Network
        </button>
      )}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '6px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          }}
        >
          <Wallet size={12} color="#1A202C" />
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#1A202C'
          }}>
            {formatAddress(address)}
          </span>
          <ChevronDown 
            size={12} 
            color="#6B7280" 
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
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minWidth: 200,
            overflow: 'hidden',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease'
          }}>
            {/* Account Info */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(0,0,0,0.02)'
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
              gap: 4
            }}>
              <button
                onClick={handleCopyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
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
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
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
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A202C',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
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
                background: 'rgba(0,0,0,0.06)',
                margin: '4px 0'
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
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
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