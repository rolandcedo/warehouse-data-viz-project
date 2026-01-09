/**
 * CanvasHeader.jsx
 * Static header bar for Canvas view (20K ft view)
 * Provides search bar and view mode controls
 */

import { Box, Square, GanttChart, Zap, Search } from 'lucide-react';
import { C, sp } from '../styles/designSystem';

const CanvasHeader = ({
  viewMode,
  onViewModeChange
}) => {
  // View mode configuration
  const viewModes = [
    { id: 'threeD', icon: Box, label: '3D View' },
    { id: 'twoD', icon: Square, label: '2D View' },
    { id: 'gantt', icon: GanttChart, label: 'Gantt View' },
    { id: 'warRoom', icon: Zap, label: 'War Room' }
  ];

  return (
    <div style={{
      flexShrink: 0,
      background: 'white',
      borderBottom: `1px solid ${C.neutral[300]}`
    }}>
      {/* Single Row: Search Bar + View Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: sp.md,
        padding: `${sp.md} ${sp.lg}`
      }}>
        {/* Left: Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: 400,
          position: 'relative'
        }}>
          <Search
            size={18}
            color={C.neutral[400]}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search warehouse..."
            style={{
              width: '100%',
              height: 40,
              paddingLeft: 40,
              paddingRight: sp.md,
              border: `1px solid ${C.neutral[300]}`,
              borderRadius: 6,
              fontSize: '14px',
              color: C.neutral[900],
              outline: 'none',
              transition: 'border-color 0.15s',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.brand[500];
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = C.neutral[300];
            }}
          />
        </div>

        {/* Right: View Mode Buttons */}
        <div style={{ display: 'flex', gap: sp.xs }}>
          {viewModes.map(mode => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                title={mode.label}
                style={{
                  width: 40,
                  height: 40,
                  border: isActive ? `2px solid ${C.brand[500]}` : `1px solid ${C.neutral[300]}`,
                  borderRadius: 6,
                  background: isActive ? C.brand[500] : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = C.neutral[50];
                    e.currentTarget.style.borderColor = C.neutral[400];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = C.neutral[300];
                  }
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? 'white' : C.neutral[600]}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CanvasHeader;
