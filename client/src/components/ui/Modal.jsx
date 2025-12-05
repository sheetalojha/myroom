import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import theme from '../../styles/theme';
import Button from './Button';

/**
 * Standardized Modal Component
 * Consistent modal styling with backdrop blur
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1200px' },
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing[4],
        background: theme.colors.background.overlayDark,
        backdropFilter: `blur(${theme.backdropBlur.sm})`,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,252,255,0.98) 100%)',
          backdropFilter: `blur(${theme.backdropBlur.lg})`,
          borderRadius: theme.borderRadius.xl,
          border: theme.borders.cardOuter,
          boxShadow: `
            0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill}, 
            inset 0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill},
            0 0 0 calc(${theme.borders.cardGap} + 1px) ${theme.borders.cardInner}
          `,
          width: '100%',
          ...sizeStyles[size],
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            padding: theme.spacing[4],
            borderBottom: `1px solid ${theme.colors.border.medium}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={X}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: theme.spacing[4],
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: theme.spacing[4],
            borderTop: `1px solid ${theme.colors.border.medium}`,
            display: 'flex',
            gap: theme.spacing[2],
            justifyContent: 'flex-end',
          }}>
            {footer}
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Modal;

