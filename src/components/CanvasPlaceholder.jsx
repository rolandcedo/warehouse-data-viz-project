import React from 'react';
import { Box, Grid3X3, Map, Calendar } from 'lucide-react';
import { C, sp, typography } from '../styles/designSystem';

/**
 * CanvasPlaceholder - 20K ft view placeholder
 * Temporary component for the Canvas visualization area
 * Will be replaced with 3D warehouse, Gantt charts, 2D views, War Room, etc.
 */
const CanvasPlaceholder = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: C.neutral[50],
      padding: sp.xl
    }}>
      {/* Icon Grid */}
      <div style={{
        display: 'flex',
        gap: sp.lg,
        marginBottom: sp.xl
      }}>
        <div style={{
          padding: sp.lg,
          background: 'white',
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`
        }}>
          <Box style={{ width: 32, height: 32, color: C.neutral[400] }} />
        </div>
        <div style={{
          padding: sp.lg,
          background: 'white',
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`
        }}>
          <Grid3X3 style={{ width: 32, height: 32, color: C.neutral[400] }} />
        </div>
        <div style={{
          padding: sp.lg,
          background: 'white',
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`
        }}>
          <Map style={{ width: 32, height: 32, color: C.neutral[400] }} />
        </div>
        <div style={{
          padding: sp.lg,
          background: 'white',
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`
        }}>
          <Calendar style={{ width: 32, height: 32, color: C.neutral[400] }} />
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        ...typography.h2(),
        color: C.neutral[800],
        marginBottom: sp.sm,
        textAlign: 'center'
      }}>
        20K View
      </h2>

      {/* Subtitle */}
      <h3 style={{
        ...typography.h4(),
        color: C.neutral[600],
        fontWeight: 500,
        marginBottom: sp.lg,
        textAlign: 'center'
      }}>
        Canvas Visualization Area
      </h3>

      {/* Description */}
      <p style={{
        ...typography.body(),
        color: C.neutral[500],
        textAlign: 'center',
        maxWidth: 600,
        lineHeight: 1.6
      }}>
        3D warehouse views, Gantt charts, 2D floor plans, and War Room visualizations will appear here.
        <br />
        This is the interactive canvas for exploring your facility operations.
      </p>

      {/* Coming Soon Badge */}
      <div style={{
        marginTop: sp.xl,
        padding: `${sp.xs} ${sp.md}`,
        background: C.purple[50],
        border: `1px solid ${C.purple[200]}`,
        borderRadius: 16,
        ...typography.caption(),
        color: C.purple[700],
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Coming Next
      </div>
    </div>
  );
};

export default CanvasPlaceholder;
