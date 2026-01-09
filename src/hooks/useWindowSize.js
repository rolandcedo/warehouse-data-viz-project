import { useState, useEffect } from 'react';
import { breakpoints } from '../styles/designSystem';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({ width, height: window.innerHeight });

      if (width >= breakpoints.ultrawide) setBreakpoint('ultrawide');
      else if (width >= breakpoints.widePanel) setBreakpoint('widePanel');
      else if (width >= breakpoints.desktop) setBreakpoint('desktop');
      else if (width >= breakpoints.tablet) setBreakpoint('tablet');
      else setBreakpoint('mobile');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    breakpoint,
    isUltrawide: breakpoint === 'ultrawide',
    isWidePanel: breakpoint === 'widePanel' || breakpoint === 'ultrawide'
  };
};
