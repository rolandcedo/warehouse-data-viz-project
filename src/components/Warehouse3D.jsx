/**
 * Warehouse3D.jsx
 * Renders warehouse floor, grid, and zone layers
 * Provides container for all 3D warehouse geometry
 */

import React from 'react';
import { WAREHOUSE_CONFIG } from '../data/warehouseData';
import { C } from '../styles/designSystem';
import ZoneLayer from './ZoneLayer';

const Warehouse3D = () => {
  const { floorWidth, floorDepth, gridSize } = WAREHOUSE_CONFIG;

  return (
    <group>
      {/* Floor Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[floorWidth / 2, -0.1, floorDepth / 2]}
        receiveShadow
      >
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial color={C.neutral[300]} />
      </mesh>

      {/* Grid Lines */}
      <gridHelper
        args={[
          Math.max(floorWidth, floorDepth),
          Math.max(floorWidth, floorDepth) / gridSize,
          C.neutral[300],
          C.neutral[200]
        ]}
        position={[floorWidth / 2, 0, floorDepth / 2]}
      />

      {/* Zone Layer - 16 interactive zones */}
      <ZoneLayer />
    </group>
  );
};

export default Warehouse3D;
