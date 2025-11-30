import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Performance thresholds - More lenient to prevent false positives
const LOW_FPS_THRESHOLD = 20; // FPS below this triggers warning (was 30)
const CRITICAL_FPS_THRESHOLD = 10; // FPS below this triggers critical adjustment (was 20)
const SAMPLE_WINDOW = 120; // Number of frames to sample (increased for more stable average)

export const usePerformanceMonitor = () => {
    const [performanceState, setPerformanceState] = useState({
        fps: 60,
        isLowPerformance: false,
        isCritical: false,
        showNotification: false,
        notificationMessage: ''
    });

    const frameTimes = useRef([]);
    const lastTime = useRef(performance.now());
    const notificationTimeout = useRef(null);

    useFrame(() => {
        const now = performance.now();
        const delta = now - lastTime.current;
        lastTime.current = now;

        // Calculate FPS
        const fps = delta > 0 ? 1000 / delta : 60;
        
        // Store frame times (keep last N frames)
        frameTimes.current.push(fps);
        if (frameTimes.current.length > SAMPLE_WINDOW) {
            frameTimes.current.shift();
        }

        // Calculate average FPS over the window
        const avgFps = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;

        // Determine performance state
        const isCritical = avgFps < CRITICAL_FPS_THRESHOLD;
        const isLowPerformance = avgFps < LOW_FPS_THRESHOLD;

        // Update state if performance changed significantly
        setPerformanceState(prev => {
            const stateChanged = isCritical !== prev.isCritical || isLowPerformance !== prev.isLowPerformance;
            
            if (stateChanged) {
                // Only show notification when transitioning TO low performance, not when recovering
                const wasLowPerformance = prev.isLowPerformance || prev.isCritical;
                const isNowLowPerformance = isLowPerformance || isCritical;
                const shouldShowNotification = isNowLowPerformance && !wasLowPerformance;

                let message = '';
                if (isCritical && shouldShowNotification) {
                    message = 'Low performance detected, optimizing settings...';
                } else if (isLowPerformance && shouldShowNotification) {
                    message = 'Performance reduced, adjusting quality...';
                }

                // Auto-hide notification after 2 seconds
                if (notificationTimeout.current) {
                    clearTimeout(notificationTimeout.current);
                }
                
                if (shouldShowNotification) {
                    notificationTimeout.current = setTimeout(() => {
                        setPerformanceState(prevState => ({
                            ...prevState,
                            showNotification: false
                        }));
                    }, 2000);
                }

                return {
                    fps: Math.round(avgFps),
                    isLowPerformance,
                    isCritical,
                    showNotification: shouldShowNotification,
                    notificationMessage: message
                };
            } else {
                // Update FPS even if state hasn't changed, but hide notification if performance recovered
                const wasShowing = prev.showNotification;
                const isNowLowPerformance = isLowPerformance || isCritical;
                
                // If performance recovered, hide notification immediately
                if (wasShowing && !isNowLowPerformance) {
                    if (notificationTimeout.current) {
                        clearTimeout(notificationTimeout.current);
                    }
                    return {
                        ...prev,
                        fps: Math.round(avgFps),
                        showNotification: false
                    };
                }
                
                return {
                    ...prev,
                    fps: Math.round(avgFps)
                };
            }
        });
    });

    return performanceState;
};

