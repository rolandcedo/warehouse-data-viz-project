import React from 'react';
import { C } from '../styles/designSystem';

/**
 * HexagonLogo - Placeholder hexagon SVG logo for ProModel.ai
 */
const HexagonLogo = ({ size = 24 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
        stroke={C.brand[500]}
        strokeWidth="2"
        fill="transparent"
      />
    </svg>
  );
};

export default HexagonLogo;
