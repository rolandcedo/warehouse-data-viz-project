import React from 'react';
import { C } from '../styles/designSystem';

/**
 * AILogo - BigBear.ai hexagon logo with 4-pointed stars
 * Used in LLM chat sidebar for new chat button
 */
const AILogo = ({ size = 24, color = C.brand[500] }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center hexagon (BigBear.ai logo) */}
      <path
        d="M20 4L30 10V22L20 28L10 22V10L20 4Z"
        fill={color}
        opacity="0.9"
      />

      {/* Inner hexagon detail */}
      <path
        d="M20 8L26 11.5V18.5L20 22L14 18.5V11.5L20 8Z"
        fill="white"
        opacity="0.2"
      />

      {/* Top-right 4-pointed star */}
      <g transform="translate(28, 6)">
        <path
          d="M4 0L4.8 2L7 2.8L4.8 3.6L4 6L3.2 3.6L1 2.8L3.2 2L4 0Z"
          fill={color}
          opacity="0.7"
        />
      </g>

      {/* Bottom-left 4-pointed star */}
      <g transform="translate(4, 28)">
        <path
          d="M4 0L4.8 2L7 2.8L4.8 3.6L4 6L3.2 3.6L1 2.8L3.2 2L4 0Z"
          fill={color}
          opacity="0.7"
        />
      </g>
    </svg>
  );
};

export default AILogo;
