/**
 * warehouseData.js
 * Centralized warehouse spatial data structure
 * Contains zone layout, rack positions, and helper functions
 */

// Warehouse configuration
export const WAREHOUSE_CONFIG = {
  floorWidth: 200,    // meters
  floorDepth: 150,    // meters
  gridSize: 5,        // 5m grid spacing
  zoneCount: 16
};

// 16 zones in 4×4 grid layout
// Warehouse flow: Receiving → Storage → Picking → Outbound
export const ZONES = [
  // Row 1: Receiving (blue) - Inbound operations
  { id: 'Z01', name: 'Inbound A', type: 'receiving', position: [0, 0], size: [50, 37.5], color: '#0BA5EC' },
  { id: 'Z02', name: 'Inbound B', type: 'receiving', position: [50, 0], size: [50, 37.5], color: '#0BA5EC' },
  { id: 'Z03', name: 'QA Station', type: 'receiving', position: [100, 0], size: [50, 37.5], color: '#0BA5EC' },
  { id: 'Z04', name: 'Dock Staging', type: 'receiving', position: [150, 0], size: [50, 37.5], color: '#0BA5EC' },

  // Row 2: Storage (purple) - Reserve inventory
  { id: 'Z05', name: 'Bulk Storage', type: 'storage', position: [0, 37.5], size: [50, 37.5], color: '#7A5AF8' },
  { id: 'Z06', name: 'Reserve 1', type: 'storage', position: [50, 37.5], size: [50, 37.5], color: '#7A5AF8' },
  { id: 'Z07', name: 'Reserve 2', type: 'storage', position: [100, 37.5], size: [50, 37.5], color: '#7A5AF8' },
  { id: 'Z08', name: 'Cold Storage', type: 'storage', position: [150, 37.5], size: [50, 37.5], color: '#7A5AF8' },

  // Row 3: Picking (orange) - Active fulfillment
  { id: 'Z09', name: 'Forward Pick A', type: 'picking', position: [0, 75], size: [50, 37.5], color: '#FB6514' },
  { id: 'Z10', name: 'Forward Pick B', type: 'picking', position: [50, 75], size: [50, 37.5], color: '#FB6514' },
  { id: 'Z11', name: 'Forward Pick C', type: 'picking', position: [100, 75], size: [50, 37.5], color: '#FB6514' },
  { id: 'Z12', name: 'Replen Staging', type: 'picking', position: [150, 75], size: [50, 37.5], color: '#FB6514' },

  // Row 4: Outbound (green) - Shipping operations
  { id: 'Z13', name: 'Pack Station A', type: 'outbound', position: [0, 112.5], size: [50, 37.5], color: '#66C61C' },
  { id: 'Z14', name: 'Pack Station B', type: 'outbound', position: [50, 112.5], size: [50, 37.5], color: '#66C61C' },
  { id: 'Z15', name: 'Shipping Dock A', type: 'outbound', position: [100, 112.5], size: [50, 37.5], color: '#66C61C' },
  { id: 'Z16', name: 'Shipping Dock B', type: 'outbound', position: [150, 112.5], size: [50, 37.5], color: '#66C61C' }
];

// Placeholder rack data (~50 racks distributed across zones)
// Phase 3 will use this for drill-down visualization
export const RACKS = [
  // Z01 - Inbound A (3 racks)
  { id: 'R01', zoneId: 'Z01', position: [10, 10], capacity: 24, current: 18 },
  { id: 'R02', zoneId: 'Z01', position: [20, 10], capacity: 24, current: 22 },
  { id: 'R03', zoneId: 'Z01', position: [30, 10], capacity: 24, current: 15 },

  // Z02 - Inbound B (3 racks)
  { id: 'R04', zoneId: 'Z02', position: [60, 10], capacity: 24, current: 20 },
  { id: 'R05', zoneId: 'Z02', position: [70, 10], capacity: 24, current: 24 },
  { id: 'R06', zoneId: 'Z02', position: [80, 10], capacity: 24, current: 19 },

  // Z03 - QA Station (2 racks)
  { id: 'R07', zoneId: 'Z03', position: [110, 10], capacity: 16, current: 8 },
  { id: 'R08', zoneId: 'Z03', position: [125, 10], capacity: 16, current: 12 },

  // Z04 - Dock Staging (3 racks)
  { id: 'R09', zoneId: 'Z04', position: [160, 10], capacity: 32, current: 28 },
  { id: 'R10', zoneId: 'Z04', position: [170, 10], capacity: 32, current: 30 },
  { id: 'R11', zoneId: 'Z04', position: [180, 10], capacity: 32, current: 25 },

  // Z05 - Bulk Storage (4 racks)
  { id: 'R12', zoneId: 'Z05', position: [10, 47.5], capacity: 48, current: 45 },
  { id: 'R13', zoneId: 'Z05', position: [20, 47.5], capacity: 48, current: 48 },
  { id: 'R14', zoneId: 'Z05', position: [30, 47.5], capacity: 48, current: 42 },
  { id: 'R15', zoneId: 'Z05', position: [40, 47.5], capacity: 48, current: 46 },

  // Z06 - Reserve 1 (4 racks)
  { id: 'R16', zoneId: 'Z06', position: [60, 47.5], capacity: 40, current: 38 },
  { id: 'R17', zoneId: 'Z06', position: [70, 47.5], capacity: 40, current: 35 },
  { id: 'R18', zoneId: 'Z06', position: [80, 47.5], capacity: 40, current: 40 },
  { id: 'R19', zoneId: 'Z06', position: [90, 47.5], capacity: 40, current: 37 },

  // Z07 - Reserve 2 (4 racks)
  { id: 'R20', zoneId: 'Z07', position: [110, 47.5], capacity: 40, current: 32 },
  { id: 'R21', zoneId: 'Z07', position: [120, 47.5], capacity: 40, current: 36 },
  { id: 'R22', zoneId: 'Z07', position: [130, 47.5], capacity: 40, current: 40 },
  { id: 'R23', zoneId: 'Z07', position: [140, 47.5], capacity: 40, current: 34 },

  // Z08 - Cold Storage (3 racks)
  { id: 'R24', zoneId: 'Z08', position: [160, 47.5], capacity: 32, current: 28 },
  { id: 'R25', zoneId: 'Z08', position: [170, 47.5], capacity: 32, current: 30 },
  { id: 'R26', zoneId: 'Z08', position: [180, 47.5], capacity: 32, current: 32 },

  // Z09 - Forward Pick A (3 racks)
  { id: 'R27', zoneId: 'Z09', position: [10, 85], capacity: 24, current: 20 },
  { id: 'R28', zoneId: 'Z09', position: [20, 85], capacity: 24, current: 18 },
  { id: 'R29', zoneId: 'Z09', position: [30, 85], capacity: 24, current: 22 },

  // Z10 - Forward Pick B (3 racks)
  { id: 'R30', zoneId: 'Z10', position: [60, 85], capacity: 24, current: 19 },
  { id: 'R31', zoneId: 'Z10', position: [70, 85], capacity: 24, current: 21 },
  { id: 'R32', zoneId: 'Z10', position: [80, 85], capacity: 24, current: 24 },

  // Z11 - Forward Pick C (3 racks)
  { id: 'R33', zoneId: 'Z11', position: [110, 85], capacity: 24, current: 17 },
  { id: 'R34', zoneId: 'Z11', position: [120, 85], capacity: 24, current: 23 },
  { id: 'R35', zoneId: 'Z11', position: [130, 85], capacity: 24, current: 20 },

  // Z12 - Replen Staging (2 racks)
  { id: 'R36', zoneId: 'Z12', position: [165, 85], capacity: 32, current: 25 },
  { id: 'R37', zoneId: 'Z12', position: [175, 85], capacity: 32, current: 28 },

  // Z13 - Pack Station A (2 racks)
  { id: 'R38', zoneId: 'Z13', position: [15, 122.5], capacity: 16, current: 12 },
  { id: 'R39', zoneId: 'Z13', position: [30, 122.5], capacity: 16, current: 14 },

  // Z14 - Pack Station B (2 racks)
  { id: 'R40', zoneId: 'Z14', position: [65, 122.5], capacity: 16, current: 10 },
  { id: 'R41', zoneId: 'Z14', position: [80, 122.5], capacity: 16, current: 15 },

  // Z15 - Shipping Dock A (3 racks)
  { id: 'R42', zoneId: 'Z15', position: [110, 122.5], capacity: 32, current: 30 },
  { id: 'R43', zoneId: 'Z15', position: [120, 122.5], capacity: 32, current: 28 },
  { id: 'R44', zoneId: 'Z15', position: [135, 122.5], capacity: 32, current: 32 },

  // Z16 - Shipping Dock B (3 racks)
  { id: 'R45', zoneId: 'Z16', position: [160, 122.5], capacity: 32, current: 26 },
  { id: 'R46', zoneId: 'Z16', position: [170, 122.5], capacity: 32, current: 31 },
  { id: 'R47', zoneId: 'Z16', position: [185, 122.5], capacity: 32, current: 29 }
];

// Helper functions
export const getZoneById = (id) => ZONES.find(z => z.id === id);
export const getRacksByZone = (zoneId) => RACKS.filter(r => r.zoneId === zoneId);
export const getRackById = (id) => RACKS.filter(r => r.id === id);
