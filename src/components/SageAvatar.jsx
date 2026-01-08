import React, { useState } from 'react';
import { C } from '../styles/designSystem';

/**
 * SageAvatar - Avatar image for Ask Sage AI
 * Used in LLM sidebar for new chat button
 * Falls back to placeholder if image not found
 */
const SageAvatar = ({ size = 24 }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback placeholder with gradient
  if (imageError) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.brand[500]} 0%, ${C.brand[600]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.5,
          fontWeight: 700,
          border: `2px solid ${C.brand[400]}`
        }}
      >
        S
      </div>
    );
  }

  return (
    <img
      src="/sage-avatar.png"
      alt="Ask Sage"
      onError={() => setImageError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  );
};

export default SageAvatar;
