/**
 * SelectionContext.jsx
 * Manages selection state for warehouse canvas interactions
 * Provides zone/rack/entity selection and breadcrumb navigation
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { getZoneById } from '../data/warehouseData';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  // Selection state
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Hover state (for tooltips)
  const [hoveredZone, setHoveredZone] = useState(null);

  // Navigation state
  const [viewLevel, setViewLevel] = useState('warehouse'); // 'warehouse' | 'zone' | 'rack'

  // Breadcrumb computation
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Warehouse', level: 'warehouse' }];
    if (selectedZone) {
      const zone = getZoneById(selectedZone);
      if (zone) {
        crumbs.push({ label: zone.name, level: 'zone', id: selectedZone });
      }
    }
    if (selectedRack) {
      crumbs.push({ label: `Rack ${selectedRack}`, level: 'rack', id: selectedRack });
    }
    return crumbs;
  }, [selectedZone, selectedRack]);

  // Action handlers
  const selectZone = (zoneId) => {
    setSelectedZone(zoneId);
    setSelectedRack(null);
    setSelectedEntity(null);
    setViewLevel('zone');
  };

  const selectRack = (rackId) => {
    setSelectedRack(rackId);
    setSelectedEntity(null);
    setViewLevel('rack');
  };

  const clearSelection = () => {
    setSelectedZone(null);
    setSelectedRack(null);
    setSelectedEntity(null);
    setViewLevel('warehouse');
  };

  return (
    <SelectionContext.Provider value={{
      // Selection state
      selectedZone,
      selectedRack,
      selectedEntity,

      // Hover state
      hoveredZone,
      setHoveredZone,

      // Navigation
      viewLevel,
      breadcrumbs,

      // Actions
      selectZone,
      selectRack,
      clearSelection
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return context;
};
