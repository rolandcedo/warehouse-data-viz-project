/**
 * CanvasView - 20K ft view: 3D Warehouse Visualization
 * Replaces CanvasPlaceholder with interactive Three.js scene
 * Main container for warehouse 3D visualization with header bar
 */

import React, { useState } from 'react';
import ThreeScene from './ThreeScene';
import Warehouse3D from './Warehouse3D';
import SelectionManager from './SelectionManager';
import CanvasHeader from './CanvasHeader';
import DayShift from '../views/WarRoom/DayShift';
import { useSelection } from '../context/SelectionContext';

const CanvasView = ({ onNavigateToWarRoom }) => {
  const [viewMode, setViewMode] = useState('threeD');
  const { breadcrumbs, selectZone, clearSelection } = useSelection();

  // Handle breadcrumb navigation
  const handleBreadcrumbNav = (item) => {
    if (item.level === 'warehouse') {
      clearSelection();
    } else if (item.level === 'zone') {
      selectZone(item.id);
      // Camera will animate to selected zone via ThreeScene
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Static Header */}
      <CanvasHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Canvas Body */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'auto'
      }}>
        {viewMode === 'threeD' && (
          <>
            <ThreeScene>
              <Warehouse3D />
            </ThreeScene>
            <SelectionManager />
          </>
        )}
        {viewMode === 'twoD' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#667085',
            fontSize: '14px'
          }}>
            2D View - Coming Soon
          </div>
        )}
        {viewMode === 'gantt' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#667085',
            fontSize: '14px'
          }}>
            Gantt View - Coming Soon
          </div>
        )}
        {viewMode === 'warRoom' && (
          <DayShift onBack={() => setViewMode('threeD')} />
        )}
      </div>
    </div>
  );
};

export default CanvasView;
