import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowRight, Home } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        maxWidth: '800px',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Home size={20} color="#333" />
          <h2 style={{
            margin: 0,
            fontSize: '18px', 
            fontWeight: 500,
            color: '#333'
          }}>
            Chambers
          </h2>
        </div>
        <WalletConnect />
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 400,
          margin: '0 0 24px 0',
          lineHeight: 1.2,
          color: '#333'
        }}>
          Design <span style={{
            background: 'linear-gradient(135deg, #ff4757 0%, #ffa502 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>chambers</span>,
          <br />
          mint as <span style={{
            background: 'linear-gradient(135deg, #ff4757 0%, #ffa502 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>NFTs</span>
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '0 0 48px 0',
          lineHeight: 1.5
        }}>
          Create 3D chamber designs and turn them into collectible NFTs
        </p>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {!isConnected ? (
            <div style={{
              padding: '12px 24px',
              backgroundColor: '#e9ecef',
              borderRadius: '8px',
              color: '#666',
              fontSize: '16px'
            }}>
              Connect wallet to continue
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/editor')}
                style={{
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Create Chamber
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/explore')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Browse Chambers
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
