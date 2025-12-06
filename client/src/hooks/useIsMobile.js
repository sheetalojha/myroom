import { useState, useEffect } from 'react';
import theme from '../styles/theme';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Parse the '768px' string to a number for comparison
      const breakpoint = parseInt(theme.breakpoints.md, 10);
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;

