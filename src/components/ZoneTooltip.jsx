/**
 * ZoneTooltip.jsx
 * HTML overlay tooltip for zone hover information
 * Renders via portal to document.body for proper layering
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { C, sp, typography } from '../styles/designSystem';

const ZoneTooltip = ({ zone, position }) => {
  const tooltipStyle = {
    position: 'fixed',
    left: position.x + 12,
    top: position.y + 12,
    background: 'white',
    border: `1px solid ${C.neutral[300]}`,
    borderRadius: 8,
    padding: sp.sm,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    pointerEvents: 'none',
    zIndex: 10000,
    minWidth: 180
  };

  return ReactDOM.createPortal(
    <div style={tooltipStyle}>
      <div style={{ ...typography.h4(), marginBottom: 2 }}>
        {zone.name}
      </div>
      <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
        {zone.id} • {zone.type}
      </div>
    </div>,
    document.body
  );
};

export default ZoneTooltip;
