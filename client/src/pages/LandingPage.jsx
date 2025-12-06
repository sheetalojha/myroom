import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowRight, Home } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import { Button, Card } from '../components/ui';
import theme from '../styles/theme';
import useIsMobile from '../hooks/useIsMobile';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const isMobile = useIsMobile();

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
        backgroundColor: theme.colors.background.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${isMobile ? theme.spacing[16] : theme.spacing[20]} ${theme.spacing[6]} ${theme.spacing[10]} ${theme.spacing[6]}`,
        position: 'relative',
        minHeight: '100vh'
      }}>
        {/* Voxel SVGs - Hidden on mobile to reduce clutter or sized down */}
        {!isMobile && (
            <>
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  left: '-2%',
                  width: '220px',
                  height: '220px',
                  zIndex: 1,
                  opacity: 0.8
                }}>
                  <img src="/Group 5.svg" alt="Voxel decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  right: '-2%',
                  width: '200px',
                  height: '200px',
                  zIndex: 1,
                  opacity: 0.75
                }}>
                  <img src="/Group 6.svg" alt="Voxel decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '-2%',
                  width: '210px',
                  height: '210px',
                  zIndex: 1,
                  opacity: 0.7
                }}>
                  <img src="/Group 4.svg" alt="Voxel decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '15%',
                  right: '-2%',
                  width: '240px',
                  height: '240px',
                  zIndex: 1,
                  opacity: 0.8
                }}>
                  <img src="/Group 3.svg" alt="Voxel decoration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </>
        )}

      {/* Header */}
      <div style={{
        position: 'fixed',
        top: theme.spacing[5],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        maxWidth: '1200px',
        zIndex: theme.zIndex.fixed
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2],
          background: 'transparent',
        }}>
          <Home size={20} color={theme.colors.text.tertiary} />
          <h2 style={{
            margin: 0,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.tertiary
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
          fontSize: isMobile ? theme.typography.fontSize['4xl'] : theme.typography.fontSize['5xl'],
          fontWeight: theme.typography.fontWeight.medium,
          margin: `0 0 ${theme.spacing[5]} 0`,
          lineHeight: theme.typography.lineHeight.tight,
          color: theme.colors.primary[500],
          textAlign: 'center'
        }}>
          Build <span style={{
            background: `linear-gradient(135deg, ${theme.colors.gradientDark.start} 0%, ${theme.colors.gradientDark.middle} 50%, ${theme.colors.gradientDark.end} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>worlds</span>.
          <br />
          Own them <span style={{
            background: `linear-gradient(135deg, ${theme.colors.gradientDark.start} 0%, ${theme.colors.gradientDark.middle} 50%, ${theme.colors.gradientDark.end} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}>truly</span>.
        </h1>
        
        <p style={{
          fontSize: isMobile ? theme.typography.fontSize.md : theme.typography.fontSize.lg,
          color: theme.colors.text.tertiary,
          margin: `0 0 ${theme.spacing[12]} 0`,
          lineHeight: theme.typography.lineHeight.normal,
          textAlign: 'center',
          maxWidth: '550px',
          fontWeight: theme.typography.fontWeight.normal,
          padding: isMobile ? `0 ${theme.spacing[4]}` : 0
        }}>
          On-chain ownership. Portable across apps. Discover rewards in-world.
        </p>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: theme.spacing[4],
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          {!isConnected ? (
            <Card padding="md" style={{
              background: theme.colors.primary[100],
              color: theme.colors.text.tertiary,
              width: isMobile ? '100%' : 'auto'
            }}>
              Connect wallet to continue
            </Card>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/editor')}
                icon={ArrowRight}
                iconPosition="right"
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                Create LittleWorld
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/explore')}
                icon={ArrowRight}
                iconPosition="right"
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                Browse LittleWorlds
              </Button>
            </>
          )}
        </div>

        {/* Demo Asset */}
        <div style={{
          margin: `${theme.spacing[12]} 0 0 0`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: `0 ${theme.spacing[4]}`
        }}>
          <Card
            padding="sm"
            hover
            style={{
              width: '100%',
              maxWidth: '900px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img 
              src="/Demo.png" 
              alt="Demo" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: theme.borderRadius.md,
                imageRendering: 'pixelated',
                display: 'block'
              }}
            />
          </Card>
        </div>
      </div>

      {/* Subsections - Bento Grid */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: theme.spacing[20],
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gridTemplateRows: isMobile ? 'auto' : 'auto auto',
        gap: theme.spacing[5],
        paddingBottom: theme.spacing[20]
      }}>
        {/* Section 1 - Trust-first Ownership - Long Vertically */}
        <Card
          padding="none"
          hover
          style={{
            gridRow: isMobile ? 'auto' : 'span 2',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing[8],
            gap: theme.spacing[4],
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
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.primary[500],
              margin: 0,
              lineHeight: theme.typography.lineHeight.tight
            }}>
              Trust-first <span style={{
                color: theme.colors.primary[500]
              }}>ownership</span>
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.text.tertiary,
              lineHeight: theme.typography.lineHeight.normal,
              margin: 0
            }}>
              Every object is an on-chain token with verifiable provenance.
            </p>
          </div>
        </Card>

        {/* Section 2 - Portable Composability */}
        <Card
          padding="lg"
          hover
          style={{
            gridColumn: isMobile ? 'auto' : '2',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <h2 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.primary[500],
            margin: 0,
            lineHeight: theme.typography.lineHeight.tight
          }}>
              Portable <span style={{
              color: theme.colors.primary[500]
            }}>composability</span>
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.xl,
            color: theme.colors.text.tertiary,
            lineHeight: theme.typography.lineHeight.normal,
            margin: 0,
            marginTop: theme.spacing[4]
          }}>
            Assets move seamlessly between rooms, apps, and marketplaces.
          </p>
        </Card>

        {/* Section 3 - Gamified Discovery */}
        <Card
          padding="lg"
          hover
          style={{
            gridColumn: isMobile ? 'auto' : '3',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <h2 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.primary[500],
            margin: 0,
            lineHeight: theme.typography.lineHeight.tight
          }}>
              Gamified <span style={{
              color: theme.colors.primary[500]
            }}>discovery</span>
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.xl,
            color: theme.colors.text.tertiary,
            lineHeight: theme.typography.lineHeight.normal,
            margin: 0,
            marginTop: theme.spacing[4]
          }}>
            Easter eggs and spatial rewards turn exploration into viral distribution.
          </p>
        </Card>

        {/* Section 4 - Creator Economy */}
        <Card
          padding="lg"
          hover
          style={{
            gridColumn: isMobile ? 'auto' : '2 / span 2',
            gridRow: isMobile ? 'auto' : '2',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <h2 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.primary[500],
            margin: 0,
            lineHeight: theme.typography.lineHeight.tight
          }}>
              Creator-first <span style={{
              color: theme.colors.primary[500]
            }}>economy</span>
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.xl,
            color: theme.colors.text.tertiary,
            lineHeight: theme.typography.lineHeight.normal,
            margin: 0,
            marginTop: theme.spacing[4]
          }}>
            Mint with royalties and control distribution while users trade safely.
          </p>
        </Card>
      </div>
    </div>
    </>
  );
};

export default LandingPage;
