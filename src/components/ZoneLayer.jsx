/**
 * ZoneLayer.jsx
 * Renders 16 interactive zone boxes with hover/selection states
 * Handles zone selection and tooltip positioning
 */

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ZONES } from '../data/warehouseData';
import { useSelection } from '../context/SelectionContext';
import { C, sp, typography } from '../styles/designSystem';

const ZONE_HEIGHT = 0.5;

const Zone = ({ zone }) => {
  const { selectedZone, hoveredZone, setHoveredZone, selectZone } = useSelection();
  const meshRef = useRef();

  const isSelected = selectedZone === zone.id;
  const isHovered = hoveredZone === zone.id;

  const centerX = zone.position[0] + zone.size[0] / 2;
  const centerZ = zone.position[1] + zone.size[1] / 2;

  const opacity = isSelected ? 0.9 : isHovered ? 0.6 : 0.3;
  const elevation = isSelected ? 1.0 : isHovered ? 0.5 : 0;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHoveredZone(zone.id);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredZone(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    selectZone(zone.id);
  };

  return (
    <>
      {/* Zone Box */}
      <mesh
        ref={meshRef}
        position={[centerX, elevation, centerZ]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerOver}
      >
        <boxGeometry args={[zone.size[0], ZONE_HEIGHT, zone.size[1]]} />
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={opacity}
          emissive={zone.color}
          emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.2 : 0}
        />
      </mesh>

      {/* Zone Border - always visible */}
      <lineSegments position={[centerX, elevation + ZONE_HEIGHT / 2, centerZ]}>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(zone.size[0], ZONE_HEIGHT, zone.size[1])]}
        />
        <lineBasicMaterial
          color={isSelected ? C.brand[600] : C.neutral[400]}
          linewidth={isSelected ? 2 : 1}
        />
      </lineSegments>

      {/* Tooltip using drei Html component */}
      {isHovered && (
        <Html position={[centerX, elevation + 2, centerZ]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'white',
            border: `1px solid ${C.neutral[300]}`,
            borderRadius: 8,
            padding: sp.sm,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 180
          }}>
            <div style={{ ...typography.h4(), marginBottom: 2 }}>
              {zone.name}
            </div>
            <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
              {zone.id} • {zone.type}
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

const ZoneLayer = () => {
  return (
    <group>
      {ZONES.map(zone => (
        <Zone key={zone.id} zone={zone} />
      ))}
    </group>
  );
};

export default ZoneLayer;
