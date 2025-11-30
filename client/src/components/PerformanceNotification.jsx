import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const PerformanceNotification = ({ show, message, isCritical, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (show) {
            setIsAnimating(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [show]);

    if (!isAnimating) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: isCritical 
                    ? 'rgba(239, 68, 68, 0.95)' 
                    : 'rgba(59, 130, 246, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: `1px solid ${isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 1000,
                pointerEvents: 'auto',
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '280px',
                maxWidth: '400px'
            }}
        >
            {isCritical ? (
                <AlertCircle size={18} color="white" />
            ) : (
                <CheckCircle2 size={18} color="white" />
            )}
            <div style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: 'white',
                letterSpacing: '-0.01em',
                lineHeight: 1.4
            }}>
                {message}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '6px',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default PerformanceNotification;

