import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowRight, Home } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
        }
        @keyframes path1 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(30px, -20px); }
          50% { transform: translate(0, -40px); }
          75% { transform: translate(-30px, -20px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      <div style={{
        width: '100%',
        backgroundColor: '#fff8f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 40px 40px 40px',
        position: 'relative'
      }}>
        {/* Voxel SVGs - Scattered around the page with animations */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '220px',
          height: '220px',
          zIndex: 1,
          opacity: 0.8
        }}>
          <img 
            src="/Group 5.svg" 
            alt="Voxel decoration" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: '200px',
          height: '200px',
          zIndex: 1,
          opacity: 0.75
        }}>
          <img 
            src="/Group 6.svg" 
            alt="Voxel decoration" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: '210px',
          height: '210px',
          zIndex: 1,
          opacity: 0.7
        }}>
          <img 
            src="/Group 4.svg" 
            alt="Voxel decoration" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '6%',
          width: '240px',
          height: '240px',
          zIndex: 1,
          opacity: 0.8
        }}>
          <img 
            src="/Group 3.svg" 
            alt="Voxel decoration" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

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
        maxWidth: '1200px',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Home size={20} color="#7a6b7a" />
          <h2 style={{
            margin: 0,
            fontSize: '18px', 
            fontWeight: 500,
            color: '#7a6b7a'
          }}>
            LittleWorlds
          </h2>
        </div>
        <WalletConnect />
      </div>

      {/* Main content - Centered */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 500,
          margin: '0 0 20px 0',
          lineHeight: 1.2,
          color: '#6b5d6b',
          textAlign: 'center'
        }}>
          Build <span style={{
            background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>worlds</span>.
          <br />
          Own them <span style={{
            background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>truly</span>.
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#8b7d8b',
          margin: '0 0 48px 0',
          lineHeight: 1.5,
          textAlign: 'center',
          maxWidth: '550px',
          fontWeight: 400
        }}>
          On-chain ownership. Portable across apps. Discover rewards in-world.
        </p>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {!isConnected ? (
            <div style={{
              padding: '12px 24px',
              backgroundColor: '#f0d8e8',
              borderRadius: '8px',
              color: '#8b7d8b',
              fontSize: '16px'
            }}>
              Connect wallet to continue
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/editor')}
                style={{
                  backgroundColor: '#ff6b9d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
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
                Create LittleWorld
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/explore')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b5d6b',
                  border: '2px solid #b894f5',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0e8ff'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Browse LittleWorlds
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Demo Asset */}
        <div style={{
          margin: '64px 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{
            position: 'relative',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(139, 125, 139, 0.12)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '700px'
          }}>
            <img 
              src="/Demo.png" 
              alt="Demo" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                imageRendering: 'pixelated',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>

      {/* Subsections - Bento Grid */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '20px',
        paddingBottom: '80px'
      }}>
        {/* Section 1 - Trust-first Ownership - Long Vertically */}
        <div style={{
          padding: '1px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#fff',
          gridRow: 'span 2',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            border: '3px solid #e0e0e0',
            borderRadius: '11px',
            backgroundColor: '#fff',
            gap: '16px',
            height: '100%'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              opacity: 0.5
            }}>
              <img 
                src="/Group 6.svg" 
                alt="Voxel" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#6b5d6b',
              margin: 0,
              lineHeight: 1.3
            }}>
              Trust-first <span style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>ownership</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#8b7d8b',
              lineHeight: 1.5,
              margin: 0
            }}>
              Every object is an on-chain token with verifiable provenance.
            </p>
          </div>
        </div>

        {/* Section 2 - Portable Composability */}
        <div style={{
          padding: '1px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: '2'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            border: '3px solid #e0e0e0',
            borderRadius: '11px',
            backgroundColor: '#fff',
            gap: '16px',
            height: '100%'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#6b5d6b',
              margin: 0,
              lineHeight: 1.3
            }}>
              Portable <span style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>composability</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#8b7d8b',
              lineHeight: 1.5,
              margin: 0
            }}>
              Assets move seamlessly between rooms, apps, and marketplaces.
            </p>
          </div>
        </div>

        {/* Section 3 - Gamified Discovery */}
        <div style={{
          padding: '1px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: '3'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            border: '3px solid #e0e0e0',
            borderRadius: '11px',
            backgroundColor: '#fff',
            gap: '16px',
            height: '100%'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#6b5d6b',
              margin: 0,
              lineHeight: 1.3
            }}>
              Gamified <span style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>discovery</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#8b7d8b',
              lineHeight: 1.5,
              margin: 0
            }}>
              Easter eggs and spatial rewards turn exploration into viral distribution.
            </p>
          </div>
        </div>

        {/* Section 4 - Creator Economy */}
        <div style={{
          padding: '1px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gridColumn: '2 / span 2',
          gridRow: '2'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            border: '3px solid #e0e0e0',
            borderRadius: '11px',
            backgroundColor: '#fff',
            gap: '16px',
            height: '100%'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#6b5d6b',
              margin: 0,
              lineHeight: 1.3
            }}>
              Creator-first <span style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>economy</span>
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#8b7d8b',
              lineHeight: 1.5,
              margin: 0
            }}>
              Mint with royalties and control distribution while users trade safely.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LandingPage;
