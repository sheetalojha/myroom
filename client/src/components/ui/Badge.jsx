import React from 'react';
import theme from '../../styles/theme';

/**
 * Standardized Badge Component
 * Status indicators and labels
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  style = {},
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: theme.typography.letterSpacing.tight,
    borderRadius: theme.borderRadius.full,
    ...style,
  };

  const sizeStyles = {
    sm: {
      padding: '2px 8px',
      fontSize: theme.typography.fontSize.xs,
      height: '18px',
    },
    md: {
      padding: '4px 10px',
      fontSize: theme.typography.fontSize.sm,
      height: '20px',
    },
    lg: {
      padding: '6px 12px',
      fontSize: theme.typography.fontSize.base,
      height: '24px',
    },
  };

  const variantStyles = {
    default: {
      background: theme.colors.neutral[200],
      color: theme.colors.text.primary,
    },
    primary: {
      background: 'linear-gradient(135deg, #ff6b9d 0%, #b894f5 50%, #6ba3ff 100%)',
      color: theme.colors.text.inverse,
    },
    success: {
      background: theme.colors.success,
      color: theme.colors.text.inverse,
    },
    error: {
      background: theme.colors.error,
      color: theme.colors.text.inverse,
    },
    warning: {
      background: theme.colors.warning,
      color: theme.colors.text.inverse,
    },
    info: {
      background: theme.colors.info,
      color: theme.colors.text.inverse,
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <span style={combinedStyles} {...props}>
      {children}
    </span>
  );
};

export default Badge;

