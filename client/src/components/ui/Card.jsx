import React from 'react';
import theme from '../../styles/theme';

/**
 * Standardized Card Component
 * Double border design: outer and inner borders with gap filled with mild color
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  style = {},
  ...props
}) => {
  // Simple white background for internal UI
  const baseStyles = {
    background: variant === 'glass' 
      ? theme.colors.background.overlay
      : theme.colors.background.tertiary, // Simple white
    backdropFilter: variant === 'glass' ? `blur(${theme.backdropBlur.lg})` : 'none',
    borderRadius: theme.borderRadius.xl,
    border: variant === 'simple' ? 'none' : theme.borders.cardOuter, // No border for simple variant
    padding: variant === 'simple' ? 0 : theme.borders.cardGap, // No padding gap for simple
    position: 'relative',
    transition: `all ${theme.transitions.normal} ${theme.easing.easeOut}`,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  // Inner content style - only for double border variant
  const innerContentStyle = variant === 'simple' ? {} : {
    border: theme.borders.cardInner,
    borderRadius: `calc(${theme.borderRadius.xl} - ${theme.borders.cardGap})`,
    background: theme.colors.background.tertiary,
    width: '100%',
    height: '100%',
  };

  const paddingStyles = {
    none: { padding: 0 },
    sm: { padding: theme.spacing[3] },
    md: { padding: theme.spacing[4] },
    lg: { padding: theme.spacing[6] },
    xl: { padding: theme.spacing[8] },
  };

  // Calculate inner padding (outer padding - gap)
  const innerPadding = paddingStyles[padding].padding 
    ? `calc(${paddingStyles[padding].padding} - ${theme.borders.cardGap})`
    : `calc(${theme.spacing[4]} - ${theme.borders.cardGap})`;

  const combinedStyles = {
    ...baseStyles,
  };

  const handleMouseEnter = (e) => {
    if (hover || onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      if (variant !== 'simple') {
        e.currentTarget.style.border = theme.borders.cardHoverOuter;
        const innerBorder = e.currentTarget.querySelector('.card-inner-border');
        if (innerBorder) {
          innerBorder.style.border = theme.borders.cardHoverInner;
        }
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (hover || onClick) {
      e.currentTarget.style.transform = 'translateY(0)';
      if (variant !== 'simple') {
        e.currentTarget.style.border = theme.borders.cardOuter;
        const innerBorder = e.currentTarget.querySelector('.card-inner-border');
        if (innerBorder) {
          innerBorder.style.border = theme.borders.cardInner;
        }
      }
    }
  };

  // Simple variant - no double border, just white background
  if (variant === 'simple') {
    return (
      <div
        style={{
          ...baseStyles,
          ...paddingStyles[padding],
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Double border variant
  return (
    <div
      style={combinedStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {/* Gap fill background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.borders.cardFill,
        borderRadius: theme.borderRadius.xl,
        zIndex: -1,
      }} />
      
      {/* Inner border wrapper */}
      <div
        className="card-inner-border"
        style={{
          ...innerContentStyle,
          padding: innerPadding,
          ...paddingStyles[padding],
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;

