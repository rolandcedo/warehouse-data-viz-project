import React, { useState } from 'react';
import { C } from '../styles/designSystem';

/**
 * ResizeHandle - Draggable resize handle for panels
 * Allows users to resize panels by dragging
 */
const ResizeHandle = ({ onResize, direction = 'vertical', position = 'right' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    let currentDelta = 0;

    const handleMouseMove = (moveEvent) => {
      const newDelta = moveEvent.clientX - startX;
      currentDelta = newDelta;
      onResize(newDelta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = direction === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const isVertical = direction === 'vertical';
  const isRight = position === 'right';
  const isLeft = position === 'left';

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        position: 'absolute',
        ...(isVertical ? {
          width: 8,
          height: '100%',
          top: 0,
          [isLeft ? 'left' : 'right']: 0,
          cursor: 'ew-resize'
        } : {
          width: '100%',
          height: 8,
          left: 0,
          bottom: 0,
          cursor: 'ns-resize'
        }),
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Visual indicator */}
      <div style={{
        ...(isVertical ? {
          width: 3,
          height: '100%'
        } : {
          width: '100%',
          height: 3
        }),
        background: (isHovering || isDragging) ? C.brand[500] : 'transparent',
        transition: 'background 0.2s',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default ResizeHandle;
