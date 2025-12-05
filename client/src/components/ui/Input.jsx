import React from 'react';
import theme from '../../styles/theme';

/**
 * Standardized Input Component
 * Unified styling for all form inputs
 */
const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  size = 'md',
  fullWidth = false,
  icon: Icon,
  style = {},
  ...props
}) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    background: theme.colors.background.overlay,
    backdropFilter: `blur(${theme.backdropBlur.md})`,
    border: `1px solid ${error ? theme.colors.error : theme.colors.border.light}`,
    borderRadius: theme.borderRadius['2xl'],
    outline: 'none',
    transition: `all ${theme.transitions.fast} ${theme.easing.easeOut}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...style,
  };

  const sizeStyles = {
    sm: {
      padding: '6px 12px',
      height: '28px',
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      padding: '8px 14px',
      height: '32px',
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      padding: '10px 16px',
      height: '40px',
      fontSize: theme.typography.fontSize.md,
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    paddingLeft: Icon ? '36px' : sizeStyles[size].padding.split(' ')[1],
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.primary[300];
      e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 163, 255, 0.1)'}`;
    }
  };

  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.border.light;
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      {Icon && (
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.colors.text.secondary,
          pointerEvents: 'none',
        }}>
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={combinedStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
};

export default Input;

