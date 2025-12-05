import React from 'react';
import theme from '../../styles/theme';

/**
 * Standardized Loading Spinner Component
 * Consistent loading states across the app
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
}) => {
  const sizeStyles = {
    sm: { width: '16px', height: '16px', borderWidth: '2px' },
    md: { width: '24px', height: '24px', borderWidth: '3px' },
    lg: { width: '32px', height: '32px', borderWidth: '4px' },
  };

  const colorStyles = {
    primary: {
      borderColor: 'rgba(107, 163, 255, 0.2)',
      borderTopColor: '#6ba3ff',
    },
    white: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderTopColor: '#ffffff',
    },
    dark: {
      borderColor: 'rgba(26, 32, 44, 0.2)',
      borderTopColor: '#1A202C',
    },
  };

  const spinner = (
    <div
      style={{
        ...sizeStyles[size],
        border: `${sizeStyles[size].borderWidth} solid ${colorStyles[color].borderColor}`,
        borderTopColor: colorStyles[color].borderTopColor,
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        display: 'inline-block',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.overlayDark,
          backdropFilter: `blur(${theme.backdropBlur.sm})`,
          zIndex: theme.zIndex.modal,
        }}
      >
        {spinner}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {spinner}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LoadingSpinner;

