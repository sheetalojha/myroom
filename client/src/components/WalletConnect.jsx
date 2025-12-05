import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { baseSepoliaChain } from '../config/web3Config';
import { Wallet, LogOut, AlertCircle, Copy, ExternalLink, RefreshCw, ChevronDown } from 'lucide-react';
import { Button, Card } from './ui';
import theme from '../styles/theme';

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
        <Button
          variant="primary"
          size="md"
          onClick={handleConnect}
          icon={Wallet}
        >
          Connect Wallet
        </Button>
        {connectError && (
          <Card
            padding="sm"
            style={{
              marginTop: theme.spacing[2],
              background: theme.colors.warning + '15',
              border: `1px solid ${theme.colors.warning}40`,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.sm,
            }}>
              <AlertCircle size={12} />
              {connectError.message}
            </div>
          </Card>
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
        <Button
          variant="primary"
          size="md"
          onClick={handleSwitchNetwork}
          icon={AlertCircle}
          style={{ marginBottom: theme.spacing[2] }}
        >
          Switch Network
        </Button>
      )}
      <div style={{ position: 'relative' }}>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowMenu(!showMenu)}
          icon={Wallet}
          iconPosition="left"
        >
          {formatAddress(address)}
          <ChevronDown 
            size={14} 
            style={{
              transition: 'transform 0.15s ease',
              transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              marginLeft: theme.spacing[1]
            }}
          />
        </Button>

        {/* Dropdown Menu */}
        {showMenu && (
          <Card
            padding="none"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: theme.spacing[2],
              minWidth: 200,
              overflow: 'hidden',
              zIndex: theme.zIndex.dropdown,
              animation: 'slideDown 0.2s ease',
              background: `linear-gradient(135deg, ${theme.colors.gradientPurple.start} 0%, ${theme.colors.gradientPurple.middle} 50%, ${theme.colors.gradientPurple.end} 100%)`
            }}
          >
            {/* Account Info */}
            <div style={{
              padding: theme.spacing[3],
              borderBottom: `1px solid ${theme.colors.border.medium}`,
              background: `linear-gradient(135deg, ${theme.colors.gradientPurple.start} 0%, ${theme.colors.gradientPurple.middle} 100%)`
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: theme.typography.letterSpacing.wide,
                marginBottom: theme.spacing[1]
              }}>
                Connected Account
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.mono
              }}>
                {formatAddress(address)}
              </div>
            </div>

            {/* Menu Items */}
            <div style={{
              padding: theme.spacing[2],
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[1],
              background: `linear-gradient(135deg, ${theme.colors.gradientPurple.middle} 0%, ${theme.colors.gradientPurple.end} 100%)`
            }}>
              <button
                onClick={handleCopyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary,
                  transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Copy size={14} color={theme.colors.text.secondary} />
                Copy Address
              </button>

              <button
                onClick={handleViewOnExplorer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary,
                  transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ExternalLink size={14} color={theme.colors.text.secondary} />
                View on BaseScan
              </button>

              <button
                onClick={handleChangeAccount}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary,
                  transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <RefreshCw size={14} color={theme.colors.text.secondary} />
                Change Account
              </button>

              <div style={{
                height: 1,
                background: theme.colors.border.medium,
                margin: `${theme.spacing[2]} ${theme.spacing[2]}`
              }} />

              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  borderRadius: theme.borderRadius.full,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.error,
                  transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.colors.error + '15';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <LogOut size={14} color={theme.colors.error} />
                Disconnect
              </button>
            </div>
          </Card>
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