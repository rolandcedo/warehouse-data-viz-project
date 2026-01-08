# ProModel.ai Warehouse Operations Dashboard

Interactive prototype for warehouse operations management, featuring executive dashboards and war room views for shift managers.

## Project Overview

**Phase**: Interactive prototype development (post-discovery/research)

**Architecture**: Two-tier dashboard system
- **Executive Summary**: Leadership-focused overview
- **War Room**: Shift manager operational control

**Design System**: BigBear.ai
- Primary: #2F72FF (brand blue)
- Predictions: #7A5AF8 (purple)
- Typography: Roboto (Thin 100, Light 300, Regular 400, Medium 500)
- Spacing: Rule of 8 (8, 16, 24, 32, 48px)

## Project Structure

```
src/
├── App.jsx                           # Main app with navigation state
├── index.jsx                         # Entry point
├── components/
│   ├── Charts/index.jsx              # PredictiveTimeline, ScenarioPredictiveTimeline
│   ├── TimeScrubber.jsx              # Timeline scrubber control
│   ├── TriTemporalMetric.jsx         # Temporal metric display
│   └── UI/index.js                   # Shared UI components
├── context/
│   └── TimeContext.jsx               # Time state management
├── data/
│   └── alertsData.js                 # Alert definitions
├── styles/
│   └── designSystem.js               # Colors, spacing, utilities
├── utils/
│   └── timelineData.js               # Timeline data generator
└── views/
    ├── Executive.jsx                 # Executive dashboard (5 tabs)
    ├── CategoryViews/                # Detail category views
    │   ├── FinView.jsx
    │   ├── SchedView.jsx
    │   ├── StaffView.jsx
    │   ├── WorkView.jsx
    │   └── ZonesView.jsx
    ├── DetailViews/                  # Entity detail views
    │   ├── EquipmentDetailContent.jsx
    │   ├── StaffDetailContent.jsx
    │   └── ZoneDetailContent.jsx
    ├── WarRoom/                      # Shift manager views
    │   ├── DayShift.jsx
    │   ├── NightShift.jsx
    │   └── SwingShift.jsx
    ├── ZoneViews/                    # Zone-specific views
    │   ├── DockDoorsDetail.jsx
    │   ├── DockDoorsListView.jsx
    │   ├── InboundZoneDetail.jsx
    │   ├── StorageZoneDetail.jsx
    │   └── ZonePanel.jsx
    └── tabs/                         # Executive dashboard tabs
        ├── EquipmentTabContent.jsx
        ├── FinancialTabContent.jsx
        ├── PlansTabContent.jsx
        ├── ScheduleTabContent.jsx
        ├── StaffTabContent.jsx
        ├── WorkTabContent.jsx
        └── ZonesTabContent.jsx
```

## Key Features

### 5 Operational Categories
1. **Staff**: Workforce management, UPLH tracking, attendance
2. **Zones**: Z01-Z16 capacity, utilization, throughput
3. **Work Content**: Orders, picks, packs, shipments
4. **Schedules**: Shifts, breaks, carrier cutoffs, maintenance
5. **Financials**: Labor costs, budget tracking, forecasting

### Views & Perspectives
- **3D top-down**: Facility visualization
- **2D layouts**: High-density alternatives
- **Gantt charts**: Timeline scheduling
- **Heat maps**: Utilization and congestion

### Modes
- **Live**: Real-time current state
- **Plan**: Predictive forecasting (4-48 hour window)
- **Solve**: What-if scenario analysis
- **Apply**: Plan execution and tracking

### Time Scrubber
- Contextual time exploration
- Historical replay
- Future prediction visualization
- Scenario impact comparison

## Primary Persona: June - Warehouse Operations Manager

**Pre-shift planning focus**
- Key Question: "Over my shift, how well will my facility perform vs plan?"
- Decision Pattern: Visualize → Analyze → Optimize
- Needs: Common operating picture, bottleneck identification, actionable recommendations

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm build
```

Builds the app for production to the `build` folder.

## Design Rationale

**Predictive Differentiation**: Competitors (Blue Yonder, Manhattan) show current state only—this dashboard shows forward-looking predictions with confidence intervals.

**Weight Rationale**:
- Staff/Work: 25% (directly impact throughput)
- Zones: 20% (capacity constraints)
- Schedule: 20% (timing critical)
- Financial: 10% (lagging indicator)

**First Goal**: Establish "common operating picture" before layering optimization features. Target clients (FedEx) currently use whiteboards and tribal knowledge.

## Technology Stack

- **React 18**: UI framework
- **Recharts**: Charting library
- **Lucide React**: Icon system
- **Inline CSS**: Component-scoped styling

## License

Proprietary - ProModel.ai
