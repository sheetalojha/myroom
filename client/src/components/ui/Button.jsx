import React from 'react';
import theme from '../../styles/theme';

/**
 * Standardized Button Component
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm, md, lg
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  style = {},
  ...props
}) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: theme.typography.letterSpacing.tight,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    borderRadius: theme.borderRadius['2xl'],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  // Size styles
  const sizeStyles = {
    sm: {
      padding: '4px 12px',
      fontSize: theme.typography.fontSize.sm,
      height: '28px',
    },
    md: {
      padding: '6px 14px',
      fontSize: theme.typography.fontSize.base,
      height: '32px',
    },
    lg: {
      padding: '10px 20px',
      fontSize: theme.typography.fontSize.md,
      height: '40px',
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.gradient.start} 0%, ${theme.colors.gradient.middle} 50%, ${theme.colors.gradient.end} 100%)`,
      color: theme.colors.text.primary,
      border: theme.borders.cardOuter,
      boxShadow: `
        0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill}, 
        inset 0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill},
        0 0 0 calc(${theme.borders.cardGap} + 1px) ${theme.borders.cardInner}
      `,
    },
    secondary: {
      background: theme.colors.background.overlay,
      backdropFilter: `blur(${theme.backdropBlur.md})`,
      color: theme.colors.text.primary,
      border: theme.borders.cardOuter,
      boxShadow: `
        0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill}, 
        inset 0 0 0 ${theme.borders.cardGap} ${theme.borders.cardFill},
        0 0 0 calc(${theme.borders.cardGap} + 1px) ${theme.borders.cardInner}
      `,
    },
    ghost: {
      background: 'transparent',
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.medium}`,
      boxShadow: 'none',
    },
    danger: {
      background: theme.colors.error,
      color: theme.colors.text.inverse,
      boxShadow: 'none',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.opacity = '0.9';
      if (variant === 'secondary' || variant === 'ghost') {
        e.currentTarget.style.background = variant === 'secondary' 
          ? 'rgba(255, 255, 255, 1)' 
          : 'rgba(0, 0, 0, 0.02)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.opacity = '1';
      if (variant === 'secondary' || variant === 'ghost') {
        e.currentTarget.style.background = variantStyles[variant].background;
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'scale(0.98)';
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {loading && (
        <span style={{
          width: '14px',
          height: '14px',
          border: `2px solid ${variant === 'primary' || variant === 'danger' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
          borderTopColor: variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.text.primary,
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={14} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={14} />}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;

