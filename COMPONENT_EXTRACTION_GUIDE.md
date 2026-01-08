# Component Extraction Guide

## Overview
This guide provides the exact line numbers and import requirements for extracting all components from `warehouse_dashboard.jsx` into individual files.

## Source File
**Path:** `/Users/roland.cedo/Documents/Warehouse Concepts/_project research/warehouse_dashboard.jsx`

---

## Extraction Plan

### 1. Category Views (4 files)

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/CategoryViews/ZonesView.jsx`
- **Lines:** 21778-21971
- **Component Name:** `ZonesView`
- **Export:** `export default ZonesView;`
- **Imports Needed:**
```javascript
import React from 'react';
import { MapPin, AlertTriangle, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../designSystem';
import { Card, Badge, Progress, DonutChart, Breadcrumb, Header, Alert, DataGrid, PredictiveTimeline, TimeScrubber } from '../../components';
import { ALERTS_DATA } from '../../data/alertsData';
```
- **Note:** Uses `ALERTS_DATA['zones-z04-capacity']`, `ALERTS_DATA['zones-z02-underutilized']`, `ALERTS_DATA['zones-z01-pick-congestion']`, `ALERTS_DATA['zones-z03-replen-needed']`

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/CategoryViews/WorkView.jsx`
- **Lines:** 23875-24062
- **Component Name:** `WorkView`
- **Export:** `export default WorkView;`
- **Imports Needed:**
```javascript
import React from 'react';
import { ClipboardList, Zap } from 'lucide-react';
import { C, sp } from '../../designSystem';
import { Card, Badge, Breadcrumb, Header, Alert, DataGrid, PredictiveTimeline } from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/CategoryViews/SchedView.jsx`
- **Lines:** 24063-24200
- **Component Name:** `SchedView`
- **Export:** `export default SchedView;`
- **Imports Needed:**
```javascript
import React from 'react';
import { Calendar, Truck, Users, Wrench, Zap } from 'lucide-react';
import { C, sp } from '../../designSystem';
import { Card, Badge, Breadcrumb, Header, Alert, DataGrid, PredictiveTimeline } from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/CategoryViews/FinView.jsx`
- **Lines:** 24201-24337
- **Component Name:** `FinView`
- **Export:** `export default FinView;`
- **Imports Needed:**
```javascript
import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, ArrowRight, Zap } from 'lucide-react';
import { C, sp } from '../../designSystem';
import { Card, Badge, Breadcrumb, Header, Alert, DataGrid, PredictiveTimeline } from '../../components';
```

---

### 2. Zone Detail Views (5 files)

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/ZoneViews/InboundZoneDetail.jsx`
- **Lines:** 21972-22862
- **Component Name:** `InboundZoneDetail`
- **Export:** `export default InboundZoneDetail;`
- **Props:** `{ zoneId, onBack, onBackToExec, onDockDetail }`
- **Imports Needed:**
```javascript
import React, { useState } from 'react';
import {
  LayoutDashboard, Users, MapPin, Package, BoxSelect, Wrench, Calendar,
  Lightbulb, Filter, Truck, ClipboardList, CheckCircle, Clock, ChevronRight,
  ArrowRight, AlertTriangle
} from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../designSystem';
import {
  Card, Badge, Progress, DataGrid, PredictiveTimeline, TimeScrubber,
  Breadcrumb, Header, DonutChart, Alert
} from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/ZoneViews/DockDoorsDetail.jsx`
- **Lines:** 22863-23154
- **Component Name:** `DockDoorsDetail`
- **Export:** `export default DockDoorsDetail;`
- **Props:** `{ zoneId, locationId = 'D01', initialTab = 'dashboard', onBack, onBackToZones, onBackToExec }`
- **Imports Needed:**
```javascript
import React, { useState } from 'react';
import {
  LayoutDashboard, Users, MapPin, Package, BoxSelect, Wrench, Calendar,
  Lightbulb, Filter, ChevronRight, Truck, Zap, AlertTriangle
} from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../designSystem';
import { Card, Badge, Progress, Alert, PredictiveTimeline, TimeScrubber } from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/ZoneViews/DockDoorsListView.jsx`
- **Lines:** 23155-23232
- **Component Name:** `DockDoorsListView`
- **Export:** `export default DockDoorsListView;`
- **Props:** `{ zoneId, onBack, onBackToZones, onBackToExec }`
- **Imports Needed:**
```javascript
import React from 'react';
import { MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../designSystem';
import { Badge, Breadcrumb, TimeScrubber } from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/ZoneViews/StorageZoneDetail.jsx`
- **Lines:** 23233-23874
- **Component Name:** `StorageZoneDetail`
- **Export:** `export default StorageZoneDetail;`
- **Props:** `{ zoneId, onBack, onBackToExec, onNavigate }`
- **Imports Needed:**
```javascript
import React from 'react';
import {
  Package, Users, ClipboardList, MapPin, Truck, CheckCircle, Clock,
  TrendingUp, AlertTriangle, ChevronRight, ArrowRight
} from 'lucide-react';
import { C, sp } from '../../designSystem';
import {
  Card, Badge, Progress, DonutChart, Breadcrumb, Alert,
  PredictiveTimeline
} from '../../components';
```

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/ZoneViews/ZonePanel.jsx`
- **Lines:** 24338-25281
- **Component Name:** `ZonePanel`
- **Export:** `export default ZonePanel;`
- **Props:** `{ zoneId, zoneName, zoneType, onNavigate, onBack }`
- **Imports Needed:**
```javascript
import React, { useState } from 'react';
import {
  LayoutDashboard, DollarSign, Users, Package, MapPin, Wrench, Calendar,
  Lightbulb, Filter, Clock, CheckCircle, ArrowRight, ChevronRight,
  TrendingUp, TrendingDown, AlertTriangle, Info, Settings, MoreHorizontal
} from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../designSystem';
import { Card, Badge, Progress, DataGrid } from '../../components';
```

---

### 3. Executive View (1 file)

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/views/Executive.jsx`
- **Lines:** 4564-9162 (VERY LARGE - ~4600 lines)
- **Component Name:** `Executive`
- **Export:** `export default Executive;`
- **Props:** `{ onCat, onShift, onZone }`
- **Imports Needed:**
```javascript
import React, { useState } from 'react';
import {
  LayoutDashboard, ClipboardList, Users, Package, MapPin, Wrench, Calendar,
  DollarSign, Lightbulb, Filter, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Clock, Activity, Navigation, Settings, MoreHorizontal,
  ChevronRight, ArrowRight, ArrowUpRight, ArrowDownRight, Info, Zap,
  X, Plus, Check, Edit, Trash2, Eye, EyeOff, BarChart3, LineChart,
  PieChart, Target
} from 'lucide-react';
import { useTimeContext } from '../context/TimeContext';
import { C, sp } from '../designSystem';
import {
  Card, Badge, Progress, DonutChart, Breadcrumb, Header, Alert,
  DataGrid, PredictiveTimeline, TimeScrubber
} from '../components';
import { ALERTS_DATA } from '../data/alertsData';
```
- **Note:** This is the largest component with extensive internal state management, modal components, and multiple sub-tabs

---

### 4. Main App (1 file)

#### `/Users/roland.cedo/Documents/Warehouse Concepts/src/App.jsx`
- **Lines:** 25282-25362
- **Component Name:** `WarehouseDashboard` → **RENAME TO** `App`
- **Export:** `export default App;`
- **Imports Needed:**
```javascript
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { TimeProvider } from './context/TimeContext';
import { C, sp } from './designSystem';
import { Card, Breadcrumb } from './components';

// View imports
import Executive from './views/Executive';
import DayShift from './views/ShiftViews/DayShift';
import SwingShift from './views/ShiftViews/SwingShift';
import NightShift from './views/ShiftViews/NightShift';
import StaffView from './views/CategoryViews/StaffView';
import ZonesView from './views/CategoryViews/ZonesView';
import WorkView from './views/CategoryViews/WorkView';
import SchedView from './views/CategoryViews/SchedView';
import FinView from './views/CategoryViews/FinView';
import InboundZoneDetail from './views/ZoneViews/InboundZoneDetail';
import StorageZoneDetail from './views/ZoneViews/StorageZoneDetail';
import DockDoorsDetail from './views/ZoneViews/DockDoorsDetail';

// Import styles from warehouse_dashboard.jsx (lines 1-4562)
import './warehouse_dashboard.css'; // OR include styles inline
```
- **Critical Changes:**
  1. Rename `WarehouseDashboard` to `App`
  2. Add all view component imports
  3. Extract and include the styles (lines 1-4562 contain imports, styles, and utility components)

---

## Common Dependencies

All components require access to these shared resources:

### Design System
- **File:** `src/designSystem.js`
- **Exports:** `C` (colors), `sp` (spacing)

### Time Context
- **File:** `src/context/TimeContext.jsx`
- **Exports:** `TimeProvider`, `useTimeContext`

### UI Components
- **File:** `src/components/index.js` (barrel export)
- **Components:** Card, Badge, Progress, DonutChart, Breadcrumb, Header, Alert, DataGrid, PredictiveTimeline, TimeScrubber

### Data
- **File:** `src/data/alertsData.js`
- **Exports:** `ALERTS_DATA` (shared alert definitions)

---

## Extraction Instructions

### For Each Component:

1. **Read the exact line range** from `warehouse_dashboard.jsx`
2. **Copy the complete component code** (preserve all formatting, styles, logic)
3. **Add the import statements** listed above for that component
4. **Add the default export** at the end
5. **Save to the specified file path**
6. **Verify:**
   - All imports are present
   - Component name matches
   - Export is added
   - No modifications to logic or styling

### Critical Notes:

- **DO NOT MODIFY** any inline styles
- **DO NOT MODIFY** any component logic
- **DO NOT MODIFY** variable names or data structures
- **PRESERVE EXACTLY** as written in the source file
- **ADD ONLY:** import statements and export statement

### Dependencies Must Be Created First:

Before extracting components, ensure these exist:
1. `/src/designSystem.js`
2. `/src/context/TimeContext.jsx`
3. `/src/components/` (all UI components)
4. `/src/data/alertsData.js`

---

## Verification Checklist

After extraction, verify each component:

- [ ] File created in correct location
- [ ] All imports present and correct paths
- [ ] Component code exactly matches source (lines X-Y)
- [ ] Default export added
- [ ] No syntax errors
- [ ] No missing dependencies
- [ ] Inline styles preserved
- [ ] Props match function signature

---

## Example: Complete File Structure

```
src/
├── App.jsx                              (Main app, renamed from WarehouseDashboard)
├── designSystem.js
├── warehouse_dashboard.css              (Extracted styles)
├── components/
│   └── index.js
├── context/
│   └── TimeContext.jsx
├── data/
│   └── alertsData.js
└── views/
    ├── Executive.jsx                    (Lines 4564-9162)
    ├── CategoryViews/
    │   ├── StaffView.jsx                (Already extracted ✓)
    │   ├── ZonesView.jsx                (Lines 21778-21971)
    │   ├── WorkView.jsx                 (Lines 23875-24062)
    │   ├── SchedView.jsx                (Lines 24063-24200)
    │   └── FinView.jsx                  (Lines 24201-24337)
    ├── ZoneViews/
    │   ├── InboundZoneDetail.jsx        (Lines 21972-22862)
    │   ├── DockDoorsDetail.jsx          (Lines 22863-23154)
    │   ├── DockDoorsListView.jsx        (Lines 23155-23232)
    │   ├── StorageZoneDetail.jsx        (Lines 23233-23874)
    │   └── ZonePanel.jsx                (Lines 24338-25281)
    └── ShiftViews/
        ├── DayShift.jsx                 (Lines from earlier extraction)
        ├── SwingShift.jsx               (Lines from earlier extraction)
        └── NightShift.jsx               (Lines from earlier extraction)
```

---

## Notes

- StaffView.jsx has already been extracted successfully
- Executive.jsx is the largest file (~4600 lines) - handle with care
- All components use inline styles - these MUST be preserved exactly
- The App.jsx component requires importing styles from the original file
- ZonesView requires ALERTS_DATA import for shared alert definitions

---

**Generated:** 2026-01-06
**Source:** `/Users/roland.cedo/Documents/Warehouse Concepts/_project research/warehouse_dashboard.jsx`
