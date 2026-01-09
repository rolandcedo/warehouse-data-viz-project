import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MapPin, ClipboardList, Calendar, DollarSign, ChevronRight, ChevronLeft, 
  ChevronDown, Clock, Package, Truck, AlertTriangle, ArrowRight, ArrowUpRight, 
  ArrowDownRight, Zap, Sun, Moon, Star, UserCheck, UserX, UserPlus, Wrench, 
  CheckCircle, Info, AlertOctagon, LayoutDashboard, Radio, TrendingUp, TrendingDown, 
  Search, Filter, X, RotateCcw, GripVertical, Grid3X3, BoxSelect, Lightbulb, 
  Coffee, MoreVertical, MoreHorizontal, Eye, RefreshCw, MapPinIcon, Settings, 
  Trash2, Navigation, Route, Activity, Minus, Fuel, Play, Circle, Plus 
} from 'lucide-react';

import { useTimeContext } from '../context/TimeContext';
import { useWindowSize } from '../hooks/useWindowSize';
import { C, sp, scoreColor, scoreStatus } from '../styles/designSystem';
import { ALERTS_DATA } from '../data/alertsData';

// Tab content components
import StaffTabContent from './tabs/StaffTabContent';
import ZonesTabContent from './tabs/ZonesTabContent';
import WorkTabContent from './tabs/WorkTabContent';
import ScheduleTabContent from './tabs/ScheduleTabContent';
import EquipmentTabContent from './tabs/EquipmentTabContent';
import FinancialTabContent from './tabs/FinancialTabContent';
import PlansTabContent from './tabs/PlansTabContent';

// Detail view components
import StaffDetailContent from './DetailViews/StaffDetailContent';
import ZoneDetailContent from './DetailViews/ZoneDetailContent';
import EquipmentDetailContent from './DetailViews/EquipmentDetailContent';

// UI Components
import {
  Card, Badge, Alert, Progress, DonutChart, InlineAlert,
  ContributingFactorsModal, TaskCreationModal, ExecuteLivePlanModal,
  ContributingFactorsLink, ScenarioInlineAlert, SeverityPills,
  Accordion, AlertVisualization, DataGrid, Spark, Back, Breadcrumb, Header
} from '../components/UI';
import TriTemporalMetric from '../components/TriTemporalMetric';
import { PredictiveTimeline, ScenarioPredictiveTimeline } from '../components/Charts';

const Executive = ({ onCat, onShift, onZone, activeTab: propActiveTab, setActiveTab: propSetActiveTab, setSidepanelData }) => {
  const {
    contextualTime, isContextualDifferent, isContextualPast, interpolateValue,
    scenarioMode, activeScenario, activeScenarioId, toggleScenarioMode,
    viewMode, setViewMode,
    endTimeMode, endTime, endTimeLabel
  } = useTimeContext();

  // Use props for activeTab if provided (from App.jsx), otherwise use local state
  const [localActiveTab, setLocalActiveTab] = useState('dashboard');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTabState = propSetActiveTab || setLocalActiveTab;
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [insightsSubTab, setInsightsSubTab] = useState('overall');
  const [staffShiftFilter, setStaffShiftFilter] = useState(null);
  const [highlightedAlert, setHighlightedAlert] = useState(null);
  const { isUltrawide, isWidePanel } = useWindowSize();

  // Track container width for responsive masonry layout
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine column count based on container width (not window width)
  const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 1024 ? 2 : 1);

  // Wrapper to scroll to top on tab change
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    // Find the scrollable container and scroll to top
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Contributing Factors Modal state
  const [contributingFactorsModal, setContributingFactorsModal] = useState({ isOpen: false, title: '', data: null });
  
  // Selected actions for Analysis scenario planning
  const [selectedActions, setSelectedActions] = useState(['action-1']); // Default first action selected
  
  // Execute Live Plan Modal state
  const [executePlanModal, setExecutePlanModal] = useState({ isOpen: false });

  // Accordion state management for Insights tab
  const [isActivePlanExpanded, setIsActivePlanExpanded] = useState(false);
  const [isFteCardExpanded, setIsFteCardExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    whatsHappening: true,
    whyImportant: true,
    contributingIssues: true,
    suggestedResolution: true
  });

  // Shared Plans State (lifted from PlansTabContent for cross-component access)
  const [allPlans, setAllPlans] = useState([
    {
      id: 'plan-001',
      name: 'Peak Hour Staffing Rebalance',
      status: 'active',
      priority: 'high',
      progress: 75,
      createdAt: '10:15 AM',
      createdBy: { id: 'mike', name: 'Mike Chen', role: 'Zone Lead' },
      targetCompletion: '12:30 PM',
      shiftContext: 'Day',
      date: 'Dec 19',
      duration: null,
      outcome: null,
      origin: {
        type: 'analysis',
        title: 'Picking Shortfall - Root Cause #2',
        alertId: 'alert-z02-staff',
        alertTitle: 'Zone Z02 Understaffed'
      },
      projectedImpact: {
        staff: { base: 76, projected: 88, delta: 12 },
        zones: { base: 82, projected: 88, delta: 6 },
        schedule: { base: 91, projected: 89, delta: -2 },
        equip: { base: 94, projected: 92, delta: -2 }
      },
      successCriteria: [
        { id: 'c1', text: 'Picking throughput reaches 850 orders/hr', met: true },
        { id: 'c2', text: 'Z02/Z04 backlog cleared', met: false }
      ],
      tasks: [
        { 
          id: 'task-1', 
          title: 'Add 4 FTE pickers to Day shift', 
          status: 'done', 
          assignee: { name: 'Mike Chen', role: 'Shift Lead' }, 
          dueTime: '11:00', 
          duration: 15, 
          completedAt: '10:52', 
          notes: 'Pulled from break pool',
          type: 'staff-addition',
          actions: [
            { id: 'a1', type: 'staff-assign', entity: { type: 'staff', id: 's1', name: 'Tom Wilson' }, target: { function: 'Picker', zone: 'Z02' }, actual: { function: 'Picker', zone: 'Z02' }, status: 'applied', appliedAt: '10:45' },
            { id: 'a2', type: 'staff-assign', entity: { type: 'staff', id: 's2', name: 'Amy Chen' }, target: { function: 'Picker', zone: 'Z02' }, actual: { function: 'Picker', zone: 'Z02' }, status: 'applied', appliedAt: '10:47' },
            { id: 'a3', type: 'staff-assign', entity: { type: 'staff', id: 's3', name: 'Carlos Ruiz' }, target: { function: 'Picker', zone: 'Z02' }, actual: { function: 'Picker', zone: 'Z02' }, status: 'applied', appliedAt: '10:50' },
            { id: 'a4', type: 'staff-assign', entity: { type: 'staff', id: 's4', name: 'Diana Park' }, target: { function: 'Picker', zone: 'Z02' }, actual: { function: 'Picker', zone: 'Z02' }, status: 'applied', appliedAt: '10:52' }
          ],
          systemImpact: { before: { pickingFTEs: 8, staffScore: 76 }, after: { pickingFTEs: 12, staffScore: 82 } }
        },
        { 
          id: 'task-2', 
          title: 'Reassign 2 FTEs from Receiving to Picking', 
          status: 'done', 
          assignee: { name: 'Sarah Kim', role: 'Shift Lead' }, 
          dueTime: '11:15', 
          duration: 10, 
          completedAt: '11:08', 
          tradeoff: 'Slower inbound (~30 min delay)',
          type: 'staff-movement',
          actions: [
            { id: 'a5', type: 'staff-move', entity: { type: 'staff', id: 's5', name: 'Jake Morrison' }, target: { fromFunction: 'Receiving', toFunction: 'Picking', fromZone: 'Dock A', toZone: 'Z02' }, actual: { fromFunction: 'Receiving', toFunction: 'Picking', fromZone: 'Dock A', toZone: 'Z02' }, status: 'applied', appliedAt: '11:05' },
            { id: 'a6', type: 'staff-move', entity: { type: 'staff', id: 's6', name: 'Lin Zhang' }, target: { fromFunction: 'Receiving', toFunction: 'Picking', fromZone: 'Dock A', toZone: 'Z02' }, actual: { fromFunction: 'Receiving', toFunction: 'Picking', fromZone: 'Dock A', toZone: 'Z02' }, status: 'applied', appliedAt: '11:08' }
          ],
          systemImpact: { before: { receivingFTEs: 6, pickingFTEs: 12 }, after: { receivingFTEs: 4, pickingFTEs: 14 } }
        },
        { 
          id: 'task-3', 
          title: 'Activate overflow Zone Z07', 
          status: 'in-progress', 
          assignee: { name: 'James Liu', role: 'Zone Manager' }, 
          dueTime: '11:30', 
          duration: 20, 
          startedAt: '11:12', 
          notes: 'Equipment staging in progress',
          type: 'zone-activation',
          actions: [
            { id: 'a7', type: 'zone-status', entity: { type: 'zone', id: 'z07', name: 'Zone Z07' }, target: { status: 'Active', capacity: 500 }, actual: { status: 'Partial', capacity: 250 }, status: 'pending' },
            { id: 'a8', type: 'equipment-stage', entity: { type: 'equipment', id: 'e1', name: 'EPJ-12', equipType: 'Electric Pallet Jack' }, target: { zone: 'Z07' }, actual: { zone: 'Z07' }, status: 'applied', appliedAt: '11:18' },
            { id: 'a9', type: 'equipment-stage', entity: { type: 'equipment', id: 'e2', name: 'EPJ-15', equipType: 'Electric Pallet Jack' }, target: { zone: 'Z07' }, actual: { zone: 'Z07' }, status: 'applied', appliedAt: '11:22' },
            { id: 'a10', type: 'equipment-stage', entity: { type: 'equipment', id: 'e3', name: 'FL-08', equipType: 'Forklift' }, target: { zone: 'Z07' }, actual: null, status: 'pending' },
            { id: 'a11', type: 'staff-assign', entity: { type: 'staff', id: 's7', name: 'Ryan Peters' }, target: { function: 'Picker', zone: 'Z07' }, actual: { function: 'Picker', zone: 'Z07' }, status: 'applied', appliedAt: '11:20' },
            { id: 'a12', type: 'staff-assign', entity: { type: 'staff', id: 's8', name: 'Maria Santos' }, target: { function: 'Picker', zone: 'Z07' }, actual: { function: 'Picker', zone: 'Z07' }, status: 'applied', appliedAt: '11:25' },
            { id: 'a13', type: 'staff-assign', entity: { type: 'staff', id: 's9', name: 'Kevin Tran' }, target: { function: 'Picker', zone: 'Z07' }, actual: null, status: 'pending' },
            { id: 'a14', type: 'staff-assign', entity: { type: 'staff', id: 's10', name: 'Emily Ross' }, target: { function: 'Picker', zone: 'Z07' }, actual: null, status: 'pending' }
          ],
          systemImpact: { before: { z07Status: 'Inactive', activeZones: 6 }, after: { z07Status: 'Partial', activeZones: 7 }, projected: { z07Status: 'Active', activeZones: 7 } }
        },
        { 
          id: 'task-4', 
          title: 'Monitor throughput and adjust if needed', 
          status: 'todo', 
          assignee: { name: 'Mike Chen', role: 'Shift Lead' }, 
          dueTime: '12:30', 
          duration: 60,
          type: 'monitoring',
          actions: [
            { id: 'a15', type: 'metric-watch', entity: { type: 'metric', id: 'm1', name: 'Picking Throughput' }, target: { value: 850, unit: 'orders/hr', threshold: 750 }, actual: null, status: 'pending' }
          ],
          systemImpact: null
        }
      ]
    },
    {
      id: 'plan-002',
      name: 'UPS Cutoff Recovery',
      status: 'completed',
      priority: 'critical',
      progress: 100,
      createdAt: '09:30 AM',
      createdBy: { id: 'sarah', name: 'Sarah Kim', role: 'Shift Lead' },
      targetCompletion: '11:00 AM',
      shiftContext: 'Day',
      date: 'Dec 18',
      duration: '1h 45m',
      outcome: 'success',
      origin: { type: 'alert', alertTitle: 'UPS Cutoff Risk' },
      successCriteria: [
        { id: 'c1', text: 'Clear 200 UPS orders before 10:45', met: true },
        { id: 'c2', text: 'No SLA violations', met: true }
      ],
      tasks: [
        { id: 't1', title: 'Prioritize UPS orders in queue', status: 'done', assignee: { name: 'Sarah Kim' }, completedAt: '09:45', type: 'priority-change', actions: [{ id: 'a1', type: 'queue-priority', entity: { type: 'queue', id: 'q1', name: 'UPS Express Queue' }, target: { priority: 'Critical' }, actual: { priority: 'Critical' }, status: 'applied', appliedAt: '09:45' }], systemImpact: null },
        { id: 't2', title: 'Add 2 pickers to UPS lane', status: 'done', assignee: { name: 'Mike Chen' }, completedAt: '09:50', type: 'staff-addition', actions: [{ id: 'a2', type: 'staff-assign', entity: { type: 'staff', id: 's1', name: 'Alex Thompson' }, target: { function: 'Picker', zone: 'UPS Lane' }, actual: { function: 'Picker', zone: 'UPS Lane' }, status: 'applied', appliedAt: '09:48' }, { id: 'a3', type: 'staff-assign', entity: { type: 'staff', id: 's2', name: 'Jordan Lee' }, target: { function: 'Picker', zone: 'UPS Lane' }, actual: { function: 'Picker', zone: 'UPS Lane' }, status: 'applied', appliedAt: '09:50' }], systemImpact: { before: { upsLaneFTEs: 3 }, after: { upsLaneFTEs: 5 } } },
        { id: 't3', title: 'Expedite packing for UPS', status: 'done', assignee: { name: 'James Liu' }, completedAt: '10:30', type: 'process-change', actions: [{ id: 'a4', type: 'lane-mode', entity: { type: 'lane', id: 'l1', name: 'UPS Priority Lane' }, target: { mode: 'Express' }, actual: { mode: 'Express' }, status: 'applied', appliedAt: '10:30' }], systemImpact: null }
      ]
    },
    {
      id: 'plan-003',
      name: 'Zone Z04 Capacity Fix',
      status: 'completed',
      priority: 'high',
      progress: 100,
      createdAt: '02:15 PM',
      createdBy: { id: 'james', name: 'James Liu', role: 'Zone Manager' },
      targetCompletion: '04:30 PM',
      shiftContext: 'Swing',
      date: 'Dec 18',
      duration: '2h 10m',
      outcome: 'success',
      origin: { type: 'analysis', alertTitle: 'Z04 at 95% capacity' },
      successCriteria: [{ id: 'c1', text: 'Z04 capacity below 80%', met: true }],
      tasks: [
        { id: 't1', title: 'Redistribute inventory to Z05', status: 'done', assignee: { name: 'James Liu' }, completedAt: '03:00', type: 'inventory-movement', actions: [{ id: 'a1', type: 'inventory-move', entity: { type: 'inventory', id: 'inv1', name: '45 Pallets' }, target: { fromZone: 'Z04', toZone: 'Z05', quantity: 45 }, actual: { fromZone: 'Z04', toZone: 'Z05', quantity: 45 }, status: 'applied', appliedAt: '03:00' }], systemImpact: { before: { z04Capacity: 95 }, after: { z04Capacity: 78 } } },
        { id: 't2', title: 'Clear overflow staging', status: 'done', assignee: { name: 'Tom Wilson' }, completedAt: '03:45', type: 'zone-cleanup', actions: [{ id: 'a2', type: 'zone-clear', entity: { type: 'zone', id: 'z04s', name: 'Z04 Staging Area' }, target: { itemsToClear: 120 }, actual: { itemsToClear: 115 }, status: 'applied', appliedAt: '03:45' }], systemImpact: { before: { stagingItems: 120 }, after: { stagingItems: 5 } } }
      ]
    },
    {
      id: 'plan-004',
      name: 'Equipment Reallocation',
      status: 'partial',
      priority: 'medium',
      progress: 60,
      createdAt: '11:00 AM',
      createdBy: { id: 'tom', name: 'Tom Wilson', role: 'Equipment Lead' },
      targetCompletion: '02:00 PM',
      shiftContext: 'Day',
      date: 'Dec 17',
      duration: '2h 15m',
      outcome: 'partial',
      stopReason: 'priority',
      notes: 'Stopped due to UPS emergency taking priority. 2 of 3 forklifts reallocated.',
      origin: { type: 'alert', alertTitle: 'Forklift shortage in Zone A' },
      tasks: [
        { id: 't1', title: 'Move FL-01 to Zone A', status: 'done', assignee: { name: 'Tom Wilson' }, completedAt: '11:30', type: 'equipment-move', actions: [], systemImpact: null },
        { id: 't2', title: 'Move FL-02 to Zone A', status: 'done', assignee: { name: 'Tom Wilson' }, completedAt: '12:15', type: 'equipment-move', actions: [], systemImpact: null },
        { id: 't3', title: 'Move FL-03 to Zone A', status: 'incomplete', assignee: { name: 'Tom Wilson' }, type: 'equipment-move', actions: [], systemImpact: null }
      ]
    }
  ]);
  
  // Derive active plans for Executive Summary
  // When viewMode is 'live', show no plans; when 'live-plan', show active plans
  const activePlans = viewMode === 'live' ? [] : allPlans.filter(p => p.status === 'active');
  
  // Suggested actions data
  const suggestedActions = [
    {
      id: 'action-1',
      title: 'Add 4 FTE pickers to Day shift',
      rationale: '3 picking zones are understaffed during peak hours (10:00-14:00), causing backlog accumulation in Z02 and Z04.',
      role: 'Shift Lead',
      iconType: 'userPlus',
      impact: { staff: 12, zones: 8, schedule: 0, equip: 0 },
      cost: '+$480 labor'
    },
    {
      id: 'action-2',
      title: 'Reassign 2 FTEs from Receiving to Picking',
      rationale: 'Receiving is ahead of schedule; reallocating capacity addresses picking bottleneck without added cost.',
      role: 'Shift Lead',
      iconType: 'refresh',
      impact: { staff: 4, zones: 3, schedule: -2, equip: 0 },
      tradeoff: 'Slower inbound (~30 min delay)',
      cost: 'No added cost'
    },
    {
      id: 'action-3',
      title: 'Activate overflow zone Z07',
      rationale: 'Z04 approaching 95% capacity. Z07 can absorb bulk items and prevent throughput slowdown.',
      role: 'Zone Manager',
      iconType: 'grid',
      impact: { staff: 0, zones: 6, schedule: 0, equip: -2 },
      tradeoff: 'Requires 30 min setup',
      cost: 'Setup time only'
    }
  ];
  
  // Calculate projected impact based on selected actions
  const calculateProjectedImpact = () => {
    const baseScores = { staff: 76, zones: 82, schedule: 91, equip: 94 };
    const impact = { staff: 0, zones: 0, schedule: 0, equip: 0 };
    
    selectedActions.forEach(actionId => {
      const action = suggestedActions.find(a => a.id === actionId);
      if (action) {
        // Simple additive for now - later can model diminishing returns
        impact.staff += action.impact.staff;
        impact.zones += action.impact.zones;
        impact.schedule += action.impact.schedule;
        impact.equip += action.impact.equip;
      }
    });
    
    return {
      staff: { base: baseScores.staff, projected: Math.min(100, baseScores.staff + impact.staff), delta: impact.staff },
      zones: { base: baseScores.zones, projected: Math.min(100, baseScores.zones + impact.zones), delta: impact.zones },
      schedule: { base: baseScores.schedule, projected: Math.min(100, baseScores.schedule + impact.schedule), delta: impact.schedule },
      equip: { base: baseScores.equip, projected: Math.min(100, baseScores.equip + impact.equip), delta: impact.equip }
    };
  };
  
  const projectedImpact = calculateProjectedImpact();
  
  // Toggle action selection
  const toggleAction = (actionId) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };
  
  // Contributing Factors data for Health Score
  const healthScoreContributingFactors = {
    whatsHappening: 'The facility health score is currently 84, tracking toward 80 by end of shift. This represents a 4-point decline driven primarily by staffing coverage gaps during the lunch period and equipment availability constraints.',
    whyImportant: 'Health scores below 85 correlate with missed SLAs, increased overtime costs, and elevated safety incident risk. Proactive intervention before the 13:00 dip can prevent cascading operational impacts.',
    contributorsLabel: 'Impact on Health Score',
    contributors: [
      { 
        label: 'Equipment Availability', 
        weight: 30, 
        direction: 'down', 
        detail: '2 forklifts in maintenance, 1 reach truck low battery',
        onClick: () => { setActiveTab('equipment'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
      },
      { 
        label: 'Staffing Coverage', 
        weight: 25, 
        direction: 'down', 
        detail: '4 call-outs not backfilled, lunch coverage gap at 12:00',
        onClick: () => { setActiveTab('staff'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
      },
      { 
        label: 'Zone Throughput', 
        weight: 25, 
        direction: 'neutral', 
        detail: 'Z04 congestion building, Z01 on target',
        onClick: () => { setActiveTab('zones'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
      },
      { 
        label: 'Safety Compliance', 
        weight: 20, 
        direction: 'up', 
        detail: '0 incidents today, all certifications current',
        onClick: () => { setActiveTab('insights'); setInsightsSubTab('safety'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
      }
    ],
    calculation: {
      formula: 'Health Score = (Equipment × 0.30) + (Staffing × 0.25) + (Throughput × 0.25) + (Safety × 0.20)',
      dataSources: ['Equipment telematics', 'Time & attendance system', 'WMS throughput metrics', 'Safety incident logs', 'Zone sensors'],
      refreshRate: 'Every 5 minutes',
      confidence: 92
    },
    actions: [
      { label: 'View All Alerts', onClick: () => { setActiveTab('insights'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } },
      { label: 'Run Scenario', onClick: () => { toggleScenarioMode(); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } }
    ]
  };
  
  // Contributing Factors data for Throughput Forecast (context-aware)
  const getThroughputContributingFactors = () => {
    // Current throughput values (would come from real data)
    const currentThroughput = 1890;
    const targetThroughput = 13000;
    const baselinePredicted = 12850;
    const scenarioPredicted = 13850;
    
    // Contextual value when scrubber is moved
    const contextualValue = isContextualDifferent ? Math.round(interpolateValue([
      { time: '06:00', actual: 0 }, { time: '08:00', actual: 420 }, { time: '10:00', actual: 1890 },
      { time: '12:00', predicted: 4200 }, { time: '14:00', predicted: 7800 }
    ], contextualTime) || currentThroughput) : currentThroughput;
    
    const isScenario = scenarioMode;
    const predictedValue = isScenario ? scenarioPredicted : baselinePredicted;
    const willHitTarget = predictedValue >= targetThroughput;
    
    // Build context-aware description
    let whatsHappening;
    if (isScenario) {
      whatsHappening = `With the +4 FTE scenario active, throughput is projected to reach ${scenarioPredicted.toLocaleString()} orders by ${endTimeLabel}, exceeding the ${targetThroughput.toLocaleString()} target by ${(scenarioPredicted - targetThroughput).toLocaleString()} orders. This represents a ${((scenarioPredicted - baselinePredicted) / baselinePredicted * 100).toFixed(0)}% improvement over baseline.`;
    } else if (isContextualDifferent) {
      whatsHappening = `At ${contextualTime}, throughput ${isContextualPast ? 'was' : 'will be'} approximately ${contextualValue.toLocaleString()} orders. Current trajectory projects ${baselinePredicted.toLocaleString()} by ${endTimeLabel}, ${willHitTarget ? 'meeting' : 'falling short of'} the ${targetThroughput.toLocaleString()} target.`;
    } else {
      whatsHappening = `Current throughput is ${currentThroughput.toLocaleString()} orders processed today. Based on current pace, projected to reach ${baselinePredicted.toLocaleString()} by ${endTimeLabel}, ${willHitTarget ? 'meeting' : 'falling short of'} the ${targetThroughput.toLocaleString()} daily target.`;
    }
    
    return {
      whatsHappening,
      whyImportant: 'Throughput directly impacts customer SLAs, carrier pickup windows, and daily revenue recognition. Missing the daily target cascades into overtime costs and next-day backlog accumulation.',
      contributorsLabel: 'Impact on Forecast',
      contributors: [
        { 
          label: 'Work Content Remaining', 
          weight: 35, 
          direction: isScenario ? 'up' : 'neutral',
          detail: isScenario ? '2,100 orders remaining — faster burn rate with added pickers' : '2,100 orders remaining — on pace for completion',
          onClick: () => { setActiveTab('work'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
        },
        { 
          label: 'Staffing Levels', 
          weight: 25, 
          direction: isScenario ? 'up' : 'down',
          detail: isScenario ? '46 FTEs active (+4 scenario) — improved pick rate' : '42 FTEs active — 4 call-outs reducing capacity',
          onClick: () => { setActiveTab('staff'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
        },
        { 
          label: 'Equipment Availability', 
          weight: 20, 
          direction: 'down',
          detail: '2 forklifts in maintenance — constraining putaway rate',
          onClick: () => { setActiveTab('equipment'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
        },
        { 
          label: 'Zone Capacity', 
          weight: 20, 
          direction: isScenario ? 'neutral' : 'down',
          detail: isScenario ? 'Z04 congestion managed with redistributed staff' : 'Z04 at 91% capacity — creating bottleneck',
          onClick: () => { setActiveTab('zones'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); }
        }
      ],
      calculation: {
        formula: 'Throughput = (Active Workers × Avg UPH) × Equipment Factor × Zone Efficiency',
        dataSources: ['WMS order completions', 'Time & attendance', 'Equipment telematics', 'Zone sensors'],
        refreshRate: 'Real-time',
        confidence: isScenario ? 88 : 94
      },
      actions: isScenario ? [
        { label: 'View Work Content', onClick: () => { setActiveTab('work'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } },
        { label: 'Exit Scenario', onClick: () => { toggleScenarioMode(); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } }
      ] : [
        { label: 'View Work Content', onClick: () => { setActiveTab('work'); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } },
        { label: 'Run Scenario', onClick: () => { toggleScenarioMode(); setContributingFactorsModal({ isOpen: false, title: '', data: null }); } }
      ]
    };
  };
  
  // Navigation stack for journey-based breadcrumbs
  // Each item: { type: 'facility' | 'zone' | 'equipment' | 'staff', id: string, label: string }
  const [navigationStack, setNavigationStack] = useState([
    { type: 'facility', id: 'facility', label: 'Facility Overview' }
  ]);
  
  // Detail view sub-tab state (for zone/equipment/staff detail views)
  const [detailSubTab, setDetailSubTab] = useState('dashboard');
  
  // Get current view from navigation stack
  const currentView = navigationStack[navigationStack.length - 1];
  const isAtFacilityLevel = currentView.type === 'facility';
  
  // Helper to scroll content to top
  const scrollToTop = () => {
    setTimeout(() => {
      const scrollContainer = document.querySelector('[data-scroll-container]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 10);
  };
  
  // Navigate INTO a detail view (push to stack)
  const navigateTo = (type, id, label) => {
    setNavigationStack(prev => [...prev, { type, id, label }]);
    setDetailSubTab('dashboard'); // Reset to dashboard when entering new detail view
    scrollToTop();
  };
  
  // Navigate BACK via breadcrumb (pop stack to that index)
  const navigateBack = (index) => {
    setNavigationStack(prev => prev.slice(0, index + 1));
    setDetailSubTab('dashboard');
    scrollToTop();
  };
  
  // Function to navigate to alert in Insights tab
  const navigateToAlert = (alertId, category, showDetail = false) => {
    // Set the sub-tab based on category
    if (category) {
      setInsightsSubTab(category);
    }

    // If showDetail is true, find and select the alert to show its detail view
    if (showDetail) {
      const alertToSelect = alerts.find(a => a.id === alertId);

      if (alertToSelect) {
        // Use inline detail view in Insights tab (not ContextualSidepanel)
        setSelectedAlert(alertToSelect);
      }
    } else {
      // Set the highlighted alert for scroll + pulse
      setHighlightedAlert(alertId);
      // Scroll to alert after a short delay
      setTimeout(() => {
        const el = document.getElementById(`insight-${alertId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      // Clear the highlight after the pulse animation
      setTimeout(() => {
        setHighlightedAlert(null);
      }, 2000);
    }

    // If at facility level, navigate to insights tab
    // If in detail view, switch to insights sub-tab
    if (isAtFacilityLevel) {
      setActiveTab('insights');
    } else {
      setDetailSubTab('insights');
    }
  };
  
  // Facility-level tabs
  const facilityTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plans', icon: ClipboardList, label: 'Plans' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'work', icon: Package, label: 'Work Content' },
    { id: 'zones', icon: MapPin, label: 'Zones' },
    { id: 'equipment', icon: Wrench, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'financial', icon: DollarSign, label: 'Financial' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Filter, label: 'Config' }
  ];
  
  // Equipment detail tabs (contextual)
  const equipmentTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'operators', icon: Users, label: 'Operators' },
    { id: 'work', icon: Package, label: 'Work' },
    { id: 'routes', icon: Navigation, label: 'Routes' },
    { id: 'location', icon: MapPin, label: 'Location' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'fleet', icon: Truck, label: 'Fleet' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Settings, label: 'Config' }
  ];
  
  // Staff detail tabs (contextual)
  const staffTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'performance', icon: TrendingUp, label: 'Performance' },
    { id: 'equipment', icon: Truck, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'certifications', icon: ClipboardList, label: 'Certifications' },
    { id: 'safety', icon: AlertTriangle, label: 'Safety' },
    { id: 'attendance', icon: Clock, label: 'Attendance' },
    { id: 'history', icon: Activity, label: 'History' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Settings, label: 'Config' }
  ];
  
  // Zone detail tabs (contextual) - matching your screenshot
  const zoneTabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'work', icon: Package, label: 'Work' },
    { id: 'zones', icon: MapPin, label: 'Locations' },
    { id: 'equipment', icon: Truck, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Settings, label: 'Config' }
  ];
  
  // Get tabs based on current view type
  const getTabsForView = () => {
    switch (currentView.type) {
      case 'equipment': return equipmentTabs;
      case 'staff': return staffTabs;
      case 'zone': return zoneTabs;
      default: return facilityTabs;
    }
  };
  
  const currentTabs = getTabsForView();
  
  const health = 84;
  const healthPredicted = 80;
  
  // Timeline data for interpolation (baseline)
  const healthTimeline = [
    { time: '06:00', actual: 88, predicted: null },
    { time: '08:00', actual: 86, predicted: null },
    { time: '10:00', actual: 84, predicted: 84, now: true },
    { time: '12:00', actual: null, predicted: 80, upper: 83, lower: 77 },
    { time: '14:00', actual: null, predicted: 82, upper: 86, lower: 78 },
    { time: '16:00', actual: null, predicted: 84, upper: 88, lower: 80 },
    { time: '18:00', actual: null, predicted: 85, upper: 89, lower: 81 },
    { time: '20:00', actual: null, predicted: 86, upper: 90, lower: 82 },
    { time: '22:00', actual: null, predicted: 87, upper: 91, lower: 83 }
  ];
  
  // Scenario timeline data (what happens if we apply the scenario)
  const healthTimelineScenario = [
    { time: '06:00', actual: 88, predicted: null },
    { time: '08:00', actual: 86, predicted: null },
    { time: '10:00', actual: 84, predicted: 84, now: true },
    { time: '12:00', actual: null, predicted: 83, upper: 86, lower: 80 },  // Scenario kicks in
    { time: '14:00', actual: null, predicted: 88, upper: 91, lower: 85 },  // Improved
    { time: '16:00', actual: null, predicted: 90, upper: 93, lower: 87 },  // Improved
    { time: '18:00', actual: null, predicted: 91, upper: 94, lower: 88 },
    { time: '20:00', actual: null, predicted: 91, upper: 94, lower: 88 },
    { time: '22:00', actual: null, predicted: 92, upper: 95, lower: 89 }
  ];
  
  const throughputTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '08:00', actual: 1680, predicted: null },
    { time: '10:00', actual: 4200, predicted: 4200, now: true },
    { time: '12:00', actual: null, predicted: 6300, upper: 6600, lower: 6000 },
    { time: '14:00', actual: null, predicted: 8400, upper: 8800, lower: 8000 },
    { time: '16:00', actual: null, predicted: 10200, upper: 10800, lower: 9600 },
    { time: '18:00', actual: null, predicted: 11400, upper: 12200, lower: 10600 },
    { time: '20:00', actual: null, predicted: 12400, upper: 13400, lower: 11400 },
    { time: '22:00', actual: null, predicted: 12850, upper: 14000, lower: 11700 }
  ];
  
  // Scenario throughput - improved with additional staffing
  const throughputTimelineScenario = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '08:00', actual: 1680, predicted: null },
    { time: '10:00', actual: 4200, predicted: 4200, now: true },
    { time: '12:00', actual: null, predicted: 6800, upper: 7100, lower: 6500 },
    { time: '14:00', actual: null, predicted: 9200, upper: 9700, lower: 8700 },
    { time: '16:00', actual: null, predicted: 11200, upper: 11900, lower: 10500 },
    { time: '18:00', actual: null, predicted: 12600, upper: 13400, lower: 11800 },
    { time: '20:00', actual: null, predicted: 13400, upper: 14400, lower: 12400 },
    { time: '22:00', actual: null, predicted: 13850, upper: 15000, lower: 12700 }
  ];
  
  // Predictive alerts - baseline
  const baselineAlerts = [
    { id: 'alert-picking', sev: 'warning', title: 'Picking shortfall', msg: 'Zone B velocity dropping below target pace', time: '+2.5hr', conf: 78 },
    { id: 'alert-ups', sev: 'critical', title: 'UPS cutoff at risk', msg: '~40 orders may miss 15:30 cutoff', time: '+5.5hr', conf: 72 },
    { id: 'alert-dock', sev: 'warning', title: 'Dock congestion', msg: 'D03-D06 backing up, dwell time increasing', time: '+4hr', conf: 65 }
  ];
  
  // Scenario alerts - some mitigated, some new
  const scenarioAlerts = [
    { ...baselineAlerts[0], state: 'mitigated' }, // Picking shortfall resolved by added pickers
    { ...baselineAlerts[1], state: 'mitigated' }, // UPS cutoff resolved by improved velocity
    { ...baselineAlerts[2], state: 'persists' },  // Dock congestion still exists
    { id: 'alert-overtime', sev: 'info', title: 'Overtime budget impact', msg: '4 additional FTEs = ~$480 added labor cost', time: '+8hr', conf: 95, state: 'new' }
  ];
  
  // Get contextual values by interpolating from timeline data
  const contextualHealth = isContextualDifferent ? interpolateValue(healthTimeline, contextualTime) : null;
  const contextualThroughput = isContextualDifferent ? interpolateValue(throughputTimeline, contextualTime) : null;
  
  // Scenario values
  const contextualHealthScenario = isContextualDifferent ? interpolateValue(healthTimelineScenario, contextualTime) : null;
  const healthPredictedScenario = interpolateValue(healthTimelineScenario, endTime) || 92;
  const endTimeHealthBaseline = interpolateValue(healthTimeline, endTime) || healthPredicted;
  const endTimeHealthScenario = interpolateValue(healthTimelineScenario, endTime) || healthPredictedScenario;
  
  // Metrics with timeline data for contextual values
  const metricsTimelines = {
    orders: [
      { time: '06:00', actual: 0 },
      { time: '08:00', actual: 5200 },
      { time: '10:00', actual: 12450 },
      { time: '12:00', actual: null, predicted: 12650 },
      { time: '14:00', actual: null, predicted: 12750 },
      { time: '22:00', actual: null, predicted: 12850 }
    ],
    units: [
      { time: '06:00', actual: 0 },
      { time: '08:00', actual: 19500 },
      { time: '10:00', actual: 48200 },
      { time: '14:00', actual: null, predicted: 50800 },
      { time: '22:00', actual: null, predicted: 51400 }
    ],
    onTime: [
      { time: '06:00', actual: 96.2 },
      { time: '08:00', actual: 95.1 },
      { time: '10:00', actual: 94.2 },
      { time: '14:00', actual: null, predicted: 93.8 },
      { time: '22:00', actual: null, predicted: 93.8 }
    ],
    cost: [
      { time: '06:00', actual: 5.20 },
      { time: '08:00', actual: 4.95 },
      { time: '10:00', actual: 4.82 },
      { time: '14:00', actual: null, predicted: 4.78 },
      { time: '22:00', actual: null, predicted: 4.78 }
    ]
  };
  
  const metrics = [
    { l: 'Orders Today', v: '12,450', vNum: 12450, t: '13,000', tNum: 13000, p: 96, tr: '+4.2%', up: true, ok: true, pred: '12,850', predNum: 12850, predScenario: '13,150', predScenarioNum: 13150, timeline: metricsTimelines.orders, format: v => v.toLocaleString(), higherIsBetter: true, tab: 'work' },
    { l: 'Units Processed', v: '48,200', vNum: 48200, t: '52,000', tNum: 52000, p: 93, tr: '+2.8%', up: true, ok: true, pred: '51,400', predNum: 51400, predScenario: '53,800', predScenarioNum: 53800, timeline: metricsTimelines.units, format: v => v.toLocaleString(), higherIsBetter: true, tab: 'work' },
    { l: 'On-Time Ship %', v: '94.2%', vNum: 94.2, t: '95%', tNum: 95, p: 94, tr: '-0.8%', up: false, ok: false, pred: '93.8%', predNum: 93.8, predScenario: '95.4%', predScenarioNum: 95.4, timeline: metricsTimelines.onTime, format: v => v.toFixed(1) + '%', higherIsBetter: true, tab: 'zones' },
    { l: 'Cost per Order', v: '$4.82', vNum: 4.82, t: '$4.50', tNum: 4.50, p: 93, tr: '-2.4%', up: false, ok: false, pred: '$4.78', predNum: 4.78, predScenario: '$4.65', predScenarioNum: 4.65, timeline: metricsTimelines.cost, format: v => '$' + v.toFixed(2), higherIsBetter: false, tab: 'insights' }
  ];
  
  // Day shift timelines for contextual interpolation (active shift only)
  const dayShiftTimelines = {
    throughput: [
      { time: '06:00', actual: 0 },
      { time: '08:00', actual: 1680 },
      { time: '10:00', actual: 4200 },
      { time: '12:00', predicted: 6300 },
      { time: '14:00', predicted: 8400 }
    ],
    completion: [
      { time: '06:00', actual: 0 },
      { time: '08:00', actual: 20 },
      { time: '10:00', actual: 50 },
      { time: '12:00', predicted: 75 },
      { time: '14:00', predicted: 97 }
    ],
    staffing: [
      { time: '06:00', actual: 92 },
      { time: '08:00', actual: 90 },
      { time: '10:00', actual: 88 },
      { time: '12:00', predicted: 83 },
      { time: '14:00', predicted: 85 }
    ]
  };
  
  const shifts = [
    { name: 'Day Shift', id: 'day', status: 'active', time: '06:00-14:00', tp: 4200, tpPred: 8400, tpPredScenario: 9200, comp: 50, compPred: 97, compPredScenario: 99, staff: 88, staffScenario: 92, ot: 94, otScenario: 96, timelines: dayShiftTimelines },
    { name: 'Swing Shift', id: 'swing', status: 'upcoming', time: '14:00-22:00', tp: null, tpPred: 3600, tpPredScenario: 3800, comp: null, compPred: 95, compPredScenario: 97, staff: 87, staffScenario: 87, ot: null, otScenario: null },
    { name: 'Night Shift', id: 'night', status: 'completed', time: '22:00-06:00', tp: 3850, tpPred: null, comp: 96, compPred: null, staff: 94, ot: 91 }
  ];
  
  const alerts = [
    { 
      id: 'alert-1',
      sev: 'critical', 
      title: 'Zone Z04 capacity breach', 
      msg: 'Bulk Storage at 91% by 12:00', 
      time: '+2hr', 
      conf: 84,
      category: 'zones',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: 'Z04 Bulk Storage is currently at 83% capacity and trending upward. Based on inbound velocity and current putaway rates, we project 91% capacity by 12:00. The zone has limited overflow options and is approaching the threshold where new pallets will need to be staged in aisles.',
      whyItMatters: 'Capacity breach in Z04 will block inbound receiving operations, creating a cascade effect. Trailers at dock will experience extended dwell times, potentially triggering detention fees ($150/hr per trailer). Additionally, staged pallets in aisles create safety hazards and slow forklift travel times by ~15%.',
      actions: [
        { action: 'Expedite putaway in Z04 (reassign 1 FTE from Z02)', impact: '-8% capacity in 2hrs', tradeoff: 'Z02 putaway slows ~15%', confidence: 86, owner: 'Shift Lead' },
        { action: 'Activate overflow zone Z07', impact: 'Additional 200 pallet capacity', tradeoff: 'Longer travel times for picks', confidence: 92, owner: 'Ops Manager' }
      ]
    },
    { 
      id: 'alert-2',
      sev: 'critical', 
      title: 'UPS cutoff at risk', 
      msg: '~40 orders may miss 15:30', 
      time: '+5.5hr', 
      conf: 72,
      category: 'work',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: 'Current pick velocity is 520 orders/hr against a target of 600/hr. With 1,240 UPS orders remaining in queue and a 15:30 carrier cutoff, approximately 40 orders are projected to miss the window based on current trajectory.',
      whyItMatters: 'Missed UPS cutoffs result in next-day delivery delays for customers, potential SLA penalties ($2.50/order = ~$100), and customer satisfaction impact. UPS represents 35% of daily volume and has strict cutoff enforcement.',
      actions: [
        { action: 'Reassign 2 FTEs from Pack to Pick zone', impact: '+18% pick velocity', tradeoff: 'Pack queue grows temporarily', confidence: 89, owner: 'Shift Lead' },
        { action: 'Prioritize UPS orders in pick queue', impact: 'UPS on-time ↑15%', tradeoff: 'FedEx orders may slip 8%', confidence: 78, owner: 'System' }
      ]
    },
    { 
      id: 'alert-3',
      sev: 'warning', 
      title: 'Swing understaffed', 
      msg: '4 FTE gap vs volume', 
      time: '+4hr', 
      conf: 88,
      category: 'staffing',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: 'Swing shift (14:00-22:00) is scheduled with 38 FTEs against a volume-based requirement of 42 FTEs. The gap is concentrated in Pick and Pack functions. Two call-outs have been reported, exacerbating the shortage.',
      whyItMatters: 'Understaffing during swing shift will create a throughput bottleneck during peak outbound hours (16:00-20:00). This risks missing evening carrier cutoffs (FedEx 18:00, USPS 19:00) and creates carryover work for night shift, impacting their productivity.',
      actions: [
        { action: 'Authorize 4 hrs OT for 2 Day Shift FTEs', impact: '+2 FTE coverage until 18:00', tradeoff: '+$180 labor cost', confidence: 94, owner: 'Ops Manager', conflict: true },
        { action: 'Request 2 temp workers for 14:00 start', impact: '+2 FTE for full swing', tradeoff: '+$240 temp labor cost', confidence: 85, owner: 'Ops Manager' }
      ]
    },
    { 
      id: 'alert-4',
      sev: 'warning', 
      title: 'Labor over budget', 
      msg: '+5.6% predicted at shift end', 
      time: '+4hr', 
      conf: 95,
      category: 'staffing',
      rootCause: { id: 2, name: 'Labor Cost Overrun', alertCount: 1 },
      whatsHappening: 'Current labor spend is $6,420 against a planned $6,080 at this hour (5.6% over). OT hours are at 24 vs target of 18. Temp labor is at 4 FTEs. Projected end-of-day spend is $13,100 vs $12,400 budget.',
      whyItMatters: 'Continued trajectory will result in $700 budget overrun for the day. If pattern continues through week, monthly impact could reach $15,000+. Finance has flagged labor efficiency as a Q4 focus area with executive visibility.',
      actions: [
        { action: 'Reduce temp labor by 1 FTE after 12:00', impact: '-$95 labor cost', tradeoff: 'Slightly slower pack rate', confidence: 82, owner: 'Shift Lead' },
        { action: 'Cap OT at 40 hrs total for shift', impact: 'Stay within budget ceiling', tradeoff: 'May need to deprioritize non-critical work', confidence: 91, owner: 'Ops Manager', conflict: true }
      ]
    },
    // Schedule > Staffing alerts
    { 
      ...ALERTS_DATA['staffing-ups-cutoff'],
      id: 'staffing-ups-cutoff',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['staffing-ups-cutoff'].msg,
      whyItMatters: 'Missing UPS cutoff impacts customer delivery promises and carrier relationships.',
      actions: [
        { action: 'Reassign 2 FTE to Pack Station 1', impact: '+8/hr velocity', tradeoff: 'Pick queue grows slightly', confidence: 85, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['staffing-break-coverage'],
      id: 'staffing-break-coverage',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['staffing-break-coverage'].msg,
      whyItMatters: 'Coverage gaps during breaks can create throughput bottlenecks and safety concerns.',
      actions: [
        { action: 'Stagger breaks by 15 minutes', impact: 'Maintain 24+ FTE coverage', tradeoff: 'Longer total break window', confidence: 88, owner: 'Shift Lead' }
      ]
    },
    // Schedule > Inbound alerts  
    { 
      ...ALERTS_DATA['inbound-dock-congestion'],
      id: 'inbound-dock-congestion',
      rootCause: { id: 3, name: 'Dock Scheduling Conflict', alertCount: 2 },
      whatsHappening: ALERTS_DATA['inbound-dock-congestion'].msg,
      whyItMatters: 'Dock congestion delays unloading, increases truck dwell time and potential detention fees.',
      actions: [
        { action: 'Reassign T-1855 to Dock 4', impact: 'Avoid dock conflict', tradeoff: 'Longer putaway travel', confidence: 90, owner: 'Dock Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['inbound-crew-gap'],
      id: 'inbound-crew-gap',
      rootCause: { id: 3, name: 'Dock Scheduling Conflict', alertCount: 2 },
      whatsHappening: ALERTS_DATA['inbound-crew-gap'].msg,
      whyItMatters: 'Idle crew time is wasted labor cost while other areas may be understaffed.',
      actions: [
        { action: 'Reassign 2 FTE from Dock 3 to Dock 1', impact: 'Accelerate T-1847 unload', tradeoff: 'T-1852 unload delayed further', confidence: 92, owner: 'Dock Lead' }
      ]
    },
    // Schedule > Outbound alerts
    { 
      ...ALERTS_DATA['outbound-ups-cutoff'],
      id: 'outbound-ups-cutoff',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['outbound-ups-cutoff'].msg,
      whyItMatters: 'UPS cutoff miss impacts same-day delivery commitments and carrier SLAs.',
      actions: [
        { action: 'Reassign 2 FTE from Pack Station 2', impact: '+8/hr ship velocity', tradeoff: 'Pack Station 2 queue grows', confidence: 80, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['outbound-fedex-staging'],
      id: 'outbound-fedex-staging',
      rootCause: { id: 4, name: 'Staging Delay', alertCount: 1 },
      whatsHappening: ALERTS_DATA['outbound-fedex-staging'].msg,
      whyItMatters: 'Late staging risks missing FedEx Express cutoff and premium delivery commitments.',
      actions: [
        { action: 'Prioritize FedEx Express in pick queue', impact: 'On-time staging by 15:30', tradeoff: 'Other carrier orders deprioritized', confidence: 88, owner: 'Pick Lead' }
      ]
    },
    // Schedule > Maintenance alerts
    { 
      ...ALERTS_DATA['maint-fl02-pm-peak'],
      id: 'maint-fl02-pm-peak',
      rootCause: { id: 5, name: 'Maintenance Scheduling', alertCount: 1 },
      whatsHappening: ALERTS_DATA['maint-fl02-pm-peak'].msg,
      whyItMatters: 'Equipment downtime during shift change compounds staffing transition challenges.',
      actions: [
        { action: 'Reschedule PM to 13:00', impact: 'Avoid swing shift conflict', tradeoff: 'Earlier crew assignment needed', confidence: 75, owner: 'Maintenance Lead' }
      ]
    },
    // ===== STAFF TAB ALERTS =====
    { 
      ...ALERTS_DATA['staff-break-coverage'],
      id: 'staff-break-coverage',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['staff-break-coverage'].msg,
      whyItMatters: 'Break coverage gaps create throughput bottlenecks and safety concerns.',
      actions: [
        { action: 'Stagger breaks by 15 minutes', impact: 'Maintain 24+ FTE coverage', tradeoff: 'Longer total break window', confidence: 88, owner: 'Shift Lead' },
        { action: 'Authorize 2 OT extensions', impact: '+2 FTE during lunch', tradeoff: '+$90 labor cost', confidence: 92, owner: 'Ops Manager' }
      ]
    },
    { 
      ...ALERTS_DATA['staff-swing-understaffed'],
      id: 'staff-swing-understaffed',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['staff-swing-understaffed'].msg,
      whyItMatters: 'Understaffing during swing shift risks evening carrier cutoffs.',
      actions: [
        { action: 'Request 4 temp workers for 14:00', impact: 'Close FTE gap', tradeoff: '+$320 temp labor cost', confidence: 85, owner: 'Ops Manager' }
      ]
    },
    { 
      ...ALERTS_DATA['staff-receiving-uplh'],
      id: 'staff-receiving-uplh',
      rootCause: { id: 6, name: 'Productivity Decline', alertCount: 1 },
      whatsHappening: ALERTS_DATA['staff-receiving-uplh'].msg,
      whyItMatters: 'Declining UPLH increases labor cost per unit and may cause carryover.',
      actions: [
        { action: 'Rebalance 1 FTE from shipping to receiving', impact: '+5% receiving UPLH', tradeoff: 'Shipping velocity -3%', confidence: 74, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['staff-handoff-optimal'],
      id: 'staff-handoff-optimal',
      rootCause: null,
      whatsHappening: ALERTS_DATA['staff-handoff-optimal'].msg,
      whyItMatters: 'Clean shift handoffs maintain productivity continuity and prevent carryover issues.',
      actions: []
    },
    // ===== ZONES TAB ALERTS =====
    { 
      ...ALERTS_DATA['zones-z04-capacity'],
      id: 'zones-z04-capacity',
      rootCause: { id: 7, name: 'Zone Capacity Breach', alertCount: 1 },
      whatsHappening: ALERTS_DATA['zones-z04-capacity'].msg,
      whyItMatters: 'Capacity breach blocks inbound receiving and triggers detention fees.',
      actions: [
        { action: 'Expedite 40 pallets to Reserve', impact: '-8% capacity in 2hrs', tradeoff: 'Longer pick travel times', confidence: 86, owner: 'Shift Lead' },
        { action: 'Activate overflow zone Z07', impact: 'Additional 200 pallet capacity', tradeoff: '+15% travel time for picks', confidence: 92, owner: 'Ops Manager' }
      ]
    },
    { 
      ...ALERTS_DATA['zones-z02-underutilized'],
      id: 'zones-z02-underutilized',
      rootCause: { id: 8, name: 'Zone Imbalance', alertCount: 1 },
      whatsHappening: ALERTS_DATA['zones-z02-underutilized'].msg,
      whyItMatters: 'Underutilized zones represent wasted capacity while others are constrained.',
      actions: [
        { action: 'Redirect inbound to Z02', impact: 'Balance zone utilization', tradeoff: 'Different putaway routes', confidence: 90, owner: 'Dock Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['zones-z01-pick-congestion'],
      id: 'zones-z01-pick-congestion',
      rootCause: { id: 9, name: 'Pick Congestion', alertCount: 1 },
      whatsHappening: ALERTS_DATA['zones-z01-pick-congestion'].msg,
      whyItMatters: 'Picker congestion reduces individual productivity and creates safety hazards.',
      actions: [
        { action: 'Stagger pick waves by 10 minutes', impact: 'Reduce aisle congestion', tradeoff: 'Slightly longer cycle time', confidence: 78, owner: 'Pick Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['zones-z03-replen-needed'],
      id: 'zones-z03-replen-needed',
      rootCause: null,
      whatsHappening: ALERTS_DATA['zones-z03-replen-needed'].msg,
      whyItMatters: 'Timely replenishment prevents pick stockouts and maintains velocity.',
      actions: []
    },
    // ===== WORK CONTENT TAB ALERTS =====
    { 
      ...ALERTS_DATA['work-ups-velocity'],
      id: 'work-ups-velocity',
      rootCause: { id: 1, name: 'Staffing-Capacity Mismatch', alertCount: 3 },
      whatsHappening: ALERTS_DATA['work-ups-velocity'].msg,
      whyItMatters: 'Missing UPS cutoff impacts customer delivery promises and SLAs.',
      actions: [
        { action: 'Reassign 2 FTE to pack', impact: '+8/hr velocity', tradeoff: 'Pick queue grows slightly', confidence: 85, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['work-pick-queue-growing'],
      id: 'work-pick-queue-growing',
      rootCause: { id: 10, name: 'Queue Imbalance', alertCount: 1 },
      whatsHappening: ALERTS_DATA['work-pick-queue-growing'].msg,
      whyItMatters: 'Growing pick queue risks carryover and missed cutoffs.',
      actions: [
        { action: 'Add 1 picker from pack', impact: 'Stabilize queue growth', tradeoff: 'Pack velocity -5%', confidence: 82, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['work-fedex-express-priority'],
      id: 'work-fedex-express-priority',
      rootCause: { id: 4, name: 'Staging Delay', alertCount: 1 },
      whatsHappening: ALERTS_DATA['work-fedex-express-priority'].msg,
      whyItMatters: 'FedEx Express has premium delivery commitments with higher penalty costs.',
      actions: [
        { action: 'Prioritize in pick queue', impact: 'On-time for 17:00 cutoff', tradeoff: 'Standard orders deprioritized', confidence: 88, owner: 'Pick Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['work-pack-station-balanced'],
      id: 'work-pack-station-balanced',
      rootCause: null,
      whatsHappening: ALERTS_DATA['work-pack-station-balanced'].msg,
      whyItMatters: 'Balanced pack stations maximize throughput and prevent bottlenecks.',
      actions: []
    },
    // ===== EQUIPMENT ALERTS =====
    { 
      ...ALERTS_DATA['equip-pm-overdue'],
      id: 'equip-pm-overdue',
      rootCause: { id: 11, name: 'Maintenance Compliance', alertCount: 2 },
      whatsHappening: 'FL-06 is 25 hours past its scheduled preventive maintenance window. The unit has accumulated 425 operating hours since last PM against a 400-hour interval. Currently pulled from service for inspection.',
      whyItMatters: 'Overdue PM increases breakdown risk and potential safety hazards. Extended operation without maintenance accelerates wear on hydraulics and drivetrain, potentially leading to costly repairs or unplanned downtime during peak operations.',
      actions: [
        { action: 'Complete PM immediately', impact: 'Return to service by 14:00', tradeoff: '1 hr reduced forklift capacity', confidence: 95, owner: 'Maintenance' },
        { action: 'Expedite parts if needed', impact: 'Avoid extended downtime', tradeoff: '+$50 rush delivery', confidence: 88, owner: 'Maintenance' }
      ]
    },
    { 
      ...ALERTS_DATA['equip-tt03-offline'],
      id: 'equip-tt03-offline',
      rootCause: { id: 11, name: 'Maintenance Compliance', alertCount: 2 },
      whatsHappening: 'TT-03 (Tugger/Tow Tractor) is offline due to transmission failure. Unit requires major repair with parts on order. Current ETA for parts is 12/20, with repair completion expected 12/21.',
      whyItMatters: 'With only 3 of 4 tuggers operational, yard operations and dock-to-warehouse material flow is constrained. This impacts inbound receiving throughput and trailer turn times.',
      actions: [
        { action: 'Expedite parts delivery', impact: 'Reduce downtime by 1 day', tradeoff: '+$180 rush shipping', confidence: 75, owner: 'Maintenance' },
        { action: 'Rent temporary replacement', impact: 'Maintain full capacity', tradeoff: '$350/day rental', confidence: 90, owner: 'Ops Manager' }
      ]
    },
    { 
      ...ALERTS_DATA['equip-epj03-repair'],
      id: 'equip-epj03-repair',
      rootCause: { id: 12, name: 'Equipment Availability', alertCount: 1 },
      whatsHappening: 'EPJ-03 is currently in repair for a faulty lift cylinder. Technician started work at 08:30 and estimates completion by 14:00. Unit will require testing before return to service.',
      whyItMatters: 'Inbound receiving area is operating with reduced pallet jack capacity. Current workload is manageable but any additional equipment issues would create bottlenecks.',
      actions: [
        { action: 'Monitor repair progress', impact: 'Ensure on-time return', tradeoff: 'None', confidence: 85, owner: 'Maintenance' }
      ]
    },
    { 
      ...ALERTS_DATA['equip-battery-low'],
      id: 'equip-battery-low',
      rootCause: { id: 13, name: 'Battery Management', alertCount: 1 },
      whatsHappening: 'Three electric MHE units have battery levels below 60%: RT-04 (35%, charging), EPJ-06 (28%, charging), and OP-02 (52%, still in use). OP-02 will need to rotate to charging within 2 hours.',
      whyItMatters: 'Running batteries below 20% damages cells and shortens lifespan. Unplanned charging during peak hours reduces fleet availability. OP-02 operating in Forward Pick zone.',
      actions: [
        { action: 'Schedule OP-02 for lunch break charging', impact: 'Avoid mid-shift interruption', tradeoff: 'None', confidence: 92, owner: 'Shift Lead' },
        { action: 'Swap OP-02 with OP-04 (idle, 89%)', impact: 'Immediate capacity', tradeoff: 'Operator transition time', confidence: 88, owner: 'Shift Lead' }
      ]
    },
    { 
      ...ALERTS_DATA['equip-pm-upcoming'],
      id: 'equip-pm-upcoming',
      rootCause: null,
      whatsHappening: 'Four preventive maintenance appointments scheduled this week: FL-04 (today 14:00), FL-02 (tomorrow 08:00), EPJ-01 (12/18), and RT-03 (12/19). All technicians confirmed.',
      whyItMatters: 'Scheduled PMs maintain equipment reliability and prevent unplanned breakdowns. Proper planning ensures minimal operational impact.',
      actions: []
    }
  ];
  
  // Category timelines for contextual interpolation
  const catTimelines = {
    staff: [{ time: '06:00', actual: 85 }, { time: '08:00', actual: 82 }, { time: '10:00', actual: 78 }, { time: '12:00', predicted: 72 }, { time: '14:00', predicted: 75 }],
    zones: [{ time: '06:00', actual: 88 }, { time: '08:00', actual: 85 }, { time: '10:00', actual: 82 }, { time: '12:00', predicted: 78 }, { time: '14:00', predicted: 78 }],
    work: [{ time: '06:00', actual: 82 }, { time: '08:00', actual: 85 }, { time: '10:00', actual: 88 }, { time: '12:00', predicted: 90 }, { time: '14:00', predicted: 92 }],
    sched: [{ time: '06:00', actual: 90 }, { time: '08:00', actual: 88 }, { time: '10:00', actual: 86 }, { time: '12:00', predicted: 85 }, { time: '14:00', predicted: 88 }],
    fin: [{ time: '06:00', actual: 85 }, { time: '08:00', actual: 82 }, { time: '10:00', actual: 79 }, { time: '12:00', predicted: 76 }, { time: '14:00', predicted: 74 }]
  };
  
  const cats = [
    { id: 'staff', icon: Users, label: 'Staff', color: C.purple[500], score: 78, pred: 75, predScenario: 78, sum: '42/48 now → 38 @ 14:00', sumScenario: '42/48 now → 44/48 scenario', alerts: 2, timeline: catTimelines.staff },
    { id: 'zones', icon: MapPin, label: 'Zones', color: C.blueLight[500], score: 82, pred: 78, predScenario: 78, sum: 'Z04: 83% → 91% @ 14:00', sumScenario: 'Z04: 83% → 91% scenario', alerts: 1, timeline: catTimelines.zones },
    { id: 'work', icon: ClipboardList, label: 'Work Content', color: C.orange[500], score: 88, pred: 92, predScenario: 95, sum: '1,890 done → 1,100 @ 14:00', sumScenario: '1,890 done → 1,200 scenario', alerts: 1, timeline: catTimelines.work },
    { id: 'sched', icon: Calendar, label: 'Schedules', color: C.greenLight[500], score: 86, pred: 88, predScenario: 88, sum: 'All docks active @ 14:00', sumScenario: 'All docks active scenario', alerts: 1, timeline: catTimelines.sched },
    { id: 'fin', icon: DollarSign, label: 'Financials', color: C.success[500], score: 79, pred: 74, predScenario: 77, sum: '$6.34K now → $13.1K @ 14:00', sumScenario: '$6.34K now → $13.5K scenario', alerts: 1, timeline: catTimelines.fin }
  ];

  return (
    <>
      {/* Contributing Factors Modal */}
      <ContributingFactorsModal
        isOpen={contributingFactorsModal.isOpen}
        onClose={() => setContributingFactorsModal({ isOpen: false, title: '', data: null })}
        title={contributingFactorsModal.title}
        data={contributingFactorsModal.data}
      />

      {/* Task Creation Modal - temporarily disabled for debugging */}
      {/* <TaskCreationModal
        isOpen={taskCreationModal.isOpen}
        onClose={() => setTaskCreationModal({ isOpen: false, action: null })}
        action={taskCreationModal.action}
      /> */}

      {/* Execute Live Plan Modal */}
      <ExecuteLivePlanModal
        isOpen={executePlanModal.isOpen}
        onClose={() => setExecutePlanModal({ isOpen: false })}
        selectedActions={selectedActions}
        suggestedActions={suggestedActions}
        onExecute={(planData) => {
          console.log('Plan executed:', planData);
          // TODO: Actually execute the plan, update state, show confirmation
        }}
      />

      {/* Scrollable content wrapper */}
      <div ref={containerRef} style={{ flex: 1, overflow: 'auto', padding: sp.lg }}>
        {/* ===== FACILITY LEVEL VIEWS ===== */}
        {isAtFacilityLevel && activeTab === 'dashboard' && (
          <>
            <Header title="Executive Summary" sub="Warehouse-wide health and cross-shift visibility • Predictive 16-hour window" color={C.neutral[700]} />
      
      {/* Active Plans Card - Lightweight, time-aware summary */}
      {activePlans.length > 0 && (
        <div style={{ 
          marginBottom: sp.md, 
          padding: `${sp.sm} ${sp.md}`,
          background: C.success[50], 
          borderRadius: 8,
          border: `1px solid ${C.success[200]}`
        }}>
          {(() => {
            const parseTime = (timeStr) => {
              if (!timeStr) return null;
              const match = timeStr.match(/(\d+):(\d+)/);
              if (!match) return null;
              return parseInt(match[1]) * 60 + parseInt(match[2]);
            };
            
            // Use contextual time for time-aware calculations
            const contextualMinutes = parseTime(contextualTime) || (14 * 60 + 15);
            const nowMinutes = parseTime('10:00') || (10 * 60); // NOW_TIME
            
            // Time-aware progress calculation
            const getTimeAwareProgress = (plan) => {
              const tasks = plan.tasks || [];
              if (tasks.length === 0) return { progress: 0, complete: 0, total: 0 };
              
              // If viewing past time, show historical progress
              // If viewing future time, project progress
              let completedTasks = tasks.filter(t => {
                if (t.status === 'done') {
                  // Task is done - check if it would have been done at contextual time
                  const completedAt = parseTime(t.completedAt || t.dueTime);
                  return !completedAt || contextualMinutes >= completedAt;
                }
                return false;
              }).length;
              
              // For future projection, estimate additional completions
              if (contextualMinutes > nowMinutes) {
                const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
                inProgressTasks.forEach(t => {
                  const dueMinutes = parseTime(t.dueTime);
                  if (dueMinutes && contextualMinutes >= dueMinutes) {
                    completedTasks++; // Assume it would be done by due time
                  }
                });
              }
              
              return {
                progress: Math.min(100, Math.round((completedTasks / tasks.length) * 100)),
                complete: Math.min(completedTasks, tasks.length),
                total: tasks.length
              };
            };
            
            const plan = activePlans[0];
            const timeAware = getTimeAwareProgress(plan);
            const tasks = plan.tasks || [];
            
            // Check for overdue at contextual time
            const overdueCount = tasks.filter(t => {
              if (t.status === 'done') return false;
              const dueMinutes = parseTime(t.dueTime);
              return dueMinutes && dueMinutes < contextualMinutes;
            }).length;
            
            // EOS detection
            const currentHour = parseInt(contextualTime?.split(':')[0]) || 14;
            const shiftEndHour = 15;
            const isNearEOS = shiftEndHour - currentHour <= 1 && shiftEndHour > currentHour;
            const minutesToEOS = Math.max(0, (shiftEndHour - currentHour) * 60 - (parseInt(contextualTime?.split(':')[1]) || 0));
            
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                {/* Icon and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flex: '0 0 auto' }}>
                  <Zap style={{ width: 16, height: 16, color: C.success[600] }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: C.success[700] }}>
                    Active Plan
                  </span>
                </div>
                
                {/* Separator */}
                <div style={{ width: 1, height: 20, background: C.success[200] }} />
                
                {/* Plan Name + Priority */}
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', color: C.neutral[700], fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {plan.name}
                  </span>
                  <span style={{ 
                    padding: '1px 5px', 
                    fontSize: '9px', 
                    fontWeight: 600, 
                    background: plan.priority === 'critical' ? C.error[100] : plan.priority === 'high' ? C.warning[100] : C.neutral[100], 
                    color: plan.priority === 'critical' ? C.error[700] : plan.priority === 'high' ? C.warning[700] : C.neutral[600], 
                    borderRadius: 3,
                    textTransform: 'uppercase',
                    flexShrink: 0
                  }}>{plan.priority}</span>
                </div>
                
                {/* Progress - Time-aware */}
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flex: '0 0 auto' }}>
                  {/* Contextual time indicator if different from now */}
                  {isContextualDifferent && (
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      background: C.brand[100], 
                      color: C.brand[700], 
                      borderRadius: 4,
                      fontWeight: 500
                    }}>
                      @{contextualTime}
                    </span>
                  )}
                  
                  {/* Progress bar */}
                  <div style={{ width: 80, height: 6, background: C.success[100], borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${timeAware.progress}%`, 
                      background: overdueCount > 0 ? C.warning[500] : C.success[500], 
                      borderRadius: 3,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: C.neutral[600], fontWeight: 500, minWidth: 50 }}>
                    {timeAware.complete}/{timeAware.total} tasks
                  </span>
                </div>
                
                {/* Status Indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, flex: '0 0 auto' }}>
                  {overdueCount > 0 && (
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      background: C.warning[100], 
                      color: C.warning[700], 
                      borderRadius: 4,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      <AlertTriangle style={{ width: 10, height: 10 }} />
                      {overdueCount} overdue
                    </span>
                  )}
                  {isNearEOS && timeAware.progress < 100 && (
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      background: C.purple[100], 
                      color: C.purple[700], 
                      borderRadius: 4,
                      fontWeight: 500
                    }}>
                      EOS in {minutesToEOS}m
                    </span>
                  )}
                </div>
                
                {/* View button */}
                <button 
                  onClick={() => setActiveTab('plans')} 
                  style={{ 
                    padding: '4px 8px', 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    background: 'white', 
                    color: C.success[700], 
                    border: `1px solid ${C.success[300]}`, 
                    borderRadius: 4, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    flexShrink: 0
                  }}
                >
                  View <ChevronRight style={{ width: 12, height: 12 }} />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Masonry Container - responsive columns: 1 col < 1024px, 2 cols 1024-2199px, 3 cols ≥ 2200px */}
      <div style={{
        columnCount: columnCount,
        columnGap: sp.lg
      }}>
        {/* Warehouse Health card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Warehouse Health - with tri-temporal display and scenario support */}
      <Card style={{ background: 'white' }}>
        {/* Scenario Mode: Vertical stacked layout */}
        {scenarioMode ? (
          <div style={{ display: 'flex', gap: sp.md }}>
            {/* Left side: Compact stacked Baseline/Scenario */}
            <div style={{ flex: '0 0 auto', width: 200, borderRight: `1px solid ${C.neutral[200]}`, paddingRight: sp.md }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: sp.md, textAlign: 'center' }}>Warehouse Health</p>
              
              {/* BASELINE */}
              <div style={{ marginBottom: sp.md }}>
                <p style={{ fontSize: '9px', fontWeight: 600, color: C.neutral[400], marginBottom: sp.xs }}>BASELINE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <DonutChart value={health} size={64} stroke={6} color={scoreColor(endTimeHealthBaseline)} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '20px', fontWeight: 300 }}>{health}</span>
                      <span style={{ fontSize: '9px', color: C.neutral[500] }}>NOW</span>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      {isContextualDifferent && (
                        <div style={{ padding: '2px 8px', background: C.brand[100], borderRadius: 4 }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[700] }}>{contextualHealth}</span>
                          <sub style={{ fontSize: '8px', color: C.brand[600], marginLeft: 2 }}>@{contextualTime}</sub>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginLeft: 36 }}>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: scoreColor(endTimeHealthBaseline) }}>{endTimeHealthBaseline}</span>
                      <sub style={{ fontSize: '8px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                    </div>
                    <Badge status={scoreStatus(endTimeHealthBaseline)} label={endTimeHealthBaseline >= 85 ? 'Healthy' : 'Needs Attention'} />
                  </div>
                </div>
              </div>
              
              {/* SCENARIO */}
              <div>
                <p style={{ fontSize: '9px', fontWeight: 600, color: C.purple[500], marginBottom: sp.xs }}>SCENARIO</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ position: 'relative' }}>
                    <DonutChart value={endTimeHealthScenario} size={64} stroke={6} color={scoreColor(endTimeHealthScenario)} />
                    {endTimeHealthScenario > endTimeHealthBaseline && (
                      <div style={{ 
                        position: 'absolute', top: -2, right: -2, 
                        background: C.success[500], borderRadius: '50%', 
                        width: 18, height: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}>
                        <TrendingUp style={{ width: 10, height: 10, color: 'white' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '20px', fontWeight: 300 }}>{health}</span>
                      <span style={{ fontSize: '9px', color: C.neutral[500] }}>NOW</span>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      {isContextualDifferent && (
                        <div style={{ padding: '2px 8px', background: C.brand[100], borderRadius: 4 }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[700] }}>{contextualHealthScenario}</span>
                          <sub style={{ fontSize: '8px', color: C.brand[600], marginLeft: 2 }}>@{contextualTime}</sub>
                          {contextualHealthScenario > contextualHealth && (
                            <span style={{ fontSize: '10px', color: C.success[600], marginLeft: 4, fontWeight: 600 }}>+{contextualHealthScenario - contextualHealth}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginLeft: 36 }}>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: scoreColor(endTimeHealthScenario) }}>{endTimeHealthScenario}</span>
                      <sub style={{ fontSize: '8px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                      {endTimeHealthScenario > endTimeHealthBaseline && (
                        <span style={{ fontSize: '10px', color: C.success[600], fontWeight: 600 }}>+{endTimeHealthScenario - endTimeHealthBaseline}</span>
                      )}
                    </div>
                    <Badge status="success" label="On Track" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side: Chart with more breathing room */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 2 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Health Score Trajectory</h3>
                    <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                      isOpen: true, 
                      title: 'Health Score', 
                      data: healthScoreContributingFactors 
                    })} />
                  </div>
                  <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>Composite score from 5 Operational Categories</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[600] }}>Baseline: Dip @ 1300</span>
              </div>
              
              {/* Chart - Accessible version with distinct patterns and markers */}
              <div style={{ flex: 1, minHeight: 140, position: 'relative' }}>
                <svg 
                  width="100%" 
                  height="140" 
                  viewBox="0 0 450 120" 
                  preserveAspectRatio="xMidYMid meet" 
                  style={{ overflow: 'visible' }}
                  role="img"
                  aria-labelledby="chartTitle chartDesc"
                >
                  {/* Accessibility: Title and description for screen readers */}
                  <title id="chartTitle">Health Score Trajectory Chart</title>
                  <desc id="chartDesc">
                    Line chart comparing baseline and scenario predictions. 
                    Baseline prediction shows health score declining from 84 to 80 by end of day.
                    Scenario prediction shows health score improving from 84 to 88 by end of day.
                    Target threshold is 85.
                  </desc>
                  
                  <defs>
                    {/* Confidence band gradient - slightly more saturated for better contrast */}
                    <linearGradient id="confidenceBandAccessible" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.08" />
                    </linearGradient>
                    
                    {/* Diamond marker for scenario line */}
                    <marker id="diamondMarker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8">
                      <polygon points="5,0 10,5 5,10 0,5" fill={C.purple[500]} stroke="white" strokeWidth="1" />
                    </marker>
                    
                    {/* Circle marker for baseline line */}
                    <marker id="circleMarker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8">
                      <circle cx="5" cy="5" r="4" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                    </marker>
                  </defs>
                  
                  {/* Y-axis labels */}
                  <text x="15" y="15" fontSize="9" fill={C.neutral[400]} textAnchor="end">95</text>
                  <text x="15" y="40" fontSize="9" fill={C.success[600]} fontWeight="500" textAnchor="end">85</text>
                  <text x="15" y="70" fontSize="9" fill={C.neutral[400]} textAnchor="end">80</text>
                  <text x="15" y="100" fontSize="9" fill={C.neutral[400]} textAnchor="end">75</text>
                  
                  {/* Horizontal grid lines */}
                  <line x1="25" y1="12" x2="440" y2="12" stroke={C.neutral[200]} strokeWidth="1" />
                  <line x1="25" y1="37" x2="440" y2="37" stroke={C.neutral[200]} strokeWidth="1" />
                  <line x1="25" y1="67" x2="440" y2="67" stroke={C.neutral[200]} strokeWidth="1" />
                  <line x1="25" y1="97" x2="440" y2="97" stroke={C.neutral[200]} strokeWidth="1" />
                  
                  {/* Warning zone */}
                  <rect x="25" y="67" width="415" height="30" fill={C.warning[100]} opacity="0.4" />
                  
                  {/* Critical zone */}
                  <rect x="25" y="97" width="415" height="23" fill={C.error[100]} opacity="0.3" />
                  
                  {/* TARGET LINE - Long dash pattern (distinct from others) */}
                  <line 
                    x1="25" y1="37" x2="440" y2="37" 
                    stroke={C.success[500]} 
                    strokeWidth="2" 
                    strokeDasharray="12,6"
                    strokeLinecap="round"
                  />
                  {/* Direct label for target */}
                  <text x="442" y="40" fontSize="8" fill={C.success[600]} fontWeight="500">Target</text>
                  
                  {/* Confidence band - slightly more saturated purple */}
                  <path 
                    d="M 120 47 Q 180 55 240 52 Q 300 48 360 42 Q 400 38 440 35 
                       L 440 60 Q 400 65 360 68 Q 300 75 240 80 Q 180 85 120 75 Z" 
                    fill="url(#confidenceBandAccessible)"
                  />
                  
                  {/* BASELINE ACTUAL - Solid line with circle markers */}
                  <path 
                    d="M 25 32 L 70 35 L 120 42" 
                    fill="none" 
                    stroke={C.brand[600]} 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Circle markers for baseline actual */}
                  <circle cx="25" cy="32" r="4" fill={C.brand[600]} stroke="white" strokeWidth="1.5" />
                  <circle cx="70" cy="35" r="3" fill={C.brand[600]} stroke="white" strokeWidth="1" />
                  
                  {/* BASELINE PREDICTED - Short dash pattern with circle markers */}
                  <path 
                    d="M 120 42 Q 180 65 240 60 Q 300 55 360 50 Q 400 47 440 45" 
                    fill="none" 
                    stroke={C.brand[500]} 
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                  />
                  {/* Circle markers at key points for baseline */}
                  <circle cx="240" cy="60" r="3" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                  <circle cx="360" cy="50" r="3" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                  <circle cx="440" cy="45" r="4" fill={C.brand[500]} stroke="white" strokeWidth="1.5" />
                  {/* Direct label for baseline at end */}
                  <text x="442" y="52" fontSize="8" fill={C.brand[600]} fontWeight="500">Baseline</text>
                  
                  {/* SCENARIO PREDICTED - Dot-dash pattern with diamond markers */}
                  <path 
                    d="M 120 42 Q 180 35 240 28 Q 300 22 360 18 Q 400 15 440 12" 
                    fill="none" 
                    stroke={C.purple[500]} 
                    strokeWidth="2"
                    strokeDasharray="2,4,8,4"
                    strokeLinecap="round"
                  />
                  {/* Diamond markers at key points for scenario */}
                  <polygon points="240,28 244,32 240,36 236,32" fill={C.purple[500]} stroke="white" strokeWidth="1" />
                  <polygon points="360,18 364,22 360,26 356,22" fill={C.purple[500]} stroke="white" strokeWidth="1" />
                  <polygon points="440,12 445,17 440,22 435,17" fill={C.purple[500]} stroke="white" strokeWidth="1.5" />
                  {/* Direct label for scenario at end */}
                  <text x="442" y="8" fontSize="8" fill={C.purple[600]} fontWeight="500">Scenario</text>
                  
                  {/* NOW marker */}
                  <line x1="120" y1="5" x2="120" y2="105" stroke={C.neutral[700]} strokeWidth="1.5" />
                  <rect x="102" y="2" width="36" height="14" rx="3" fill={C.neutral[700]} />
                  <text x="120" y="12" fontSize="8" fill="white" textAnchor="middle" fontWeight="500">NOW</text>
                  {/* Current data point - shared by both lines */}
                  <circle cx="120" cy="42" r="5" fill={C.neutral[700]} stroke="white" strokeWidth="2" />
                  
                  {/* Contextual time marker */}
                  {isContextualDifferent && (() => {
                    // Calculate x position based on contextualTime
                    // Chart range: 06:00 (x=25) to 22:00 (x=440), so 16 hours total
                    // Chart width: 415 pixels (440 - 25)
                    const parseTimeToMinutes = (timeStr) => {
                      const [hours, minutes] = timeStr.split(':').map(Number);
                      return hours * 60 + minutes;
                    };
                    const chartStartMinutes = 6 * 60; // 06:00
                    const chartEndMinutes = 22 * 60; // 22:00
                    const chartRangeMinutes = chartEndMinutes - chartStartMinutes;
                    const contextualMinutes = parseTimeToMinutes(contextualTime);
                    const minutesFromStart = contextualMinutes - chartStartMinutes;
                    const xPos = 25 + (minutesFromStart / chartRangeMinutes) * 415;

                    return (
                      <>
                        <line x1={xPos} y1="5" x2={xPos} y2="105" stroke={C.brand[500]} strokeWidth="1.5" />
                        <rect x={xPos - 20} y="2" width="40" height="14" rx="3" fill={C.brand[500]} />
                        <text x={xPos} y="12" fontSize="8" fill="white" textAnchor="middle" fontWeight="500">{contextualTime}</text>
                        {/* Baseline point - circle (interpolate y position based on the curve) */}
                        <circle cx={xPos} cy={58} r="5" fill={C.brand[500]} stroke="white" strokeWidth="2" />
                        {/* Scenario point - diamond (interpolate y position based on the curve) */}
                        <polygon points={`${xPos},20 ${xPos+5},25 ${xPos},30 ${xPos-5},25`} fill={C.purple[500]} stroke="white" strokeWidth="2" />
                      </>
                    );
                  })()}
                </svg>
                
                {/* X-axis labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 10, marginTop: 2 }}>
                  {['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((t, i) => (
                    <span key={i} style={{ fontSize: '9px', color: C.neutral[400] }}>{t}</span>
                  ))}
                </div>
              </div>
              
              {/* Accessible legend - shows both line pattern AND marker shape */}
              <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Baseline with circle marker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="28" height="12" style={{ overflow: 'visible' }}>
                    <line x1="0" y1="6" x2="20" y2="6" stroke={C.brand[500]} strokeWidth="2" strokeDasharray="4,3" />
                    <circle cx="24" cy="6" r="4" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                  </svg>
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Baseline</span>
                </div>
                {/* Scenario with diamond marker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="28" height="12" style={{ overflow: 'visible' }}>
                    <line x1="0" y1="6" x2="18" y2="6" stroke={C.purple[500]} strokeWidth="2" strokeDasharray="2,3,6,3" />
                    <polygon points="24,6 28,10 24,14 20,10" transform="translate(0,-4)" fill={C.purple[500]} stroke="white" strokeWidth="1" />
                  </svg>
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Scenario</span>
                </div>
                {/* Confidence band */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 8, background: '#8B5CF6', opacity: 0.25, borderRadius: 1 }} />
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Confidence</span>
                </div>
                {/* Target with long dash */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="20" height="12">
                    <line x1="0" y1="6" x2="20" y2="6" stroke={C.success[500]} strokeWidth="2" strokeDasharray="8,4" />
                  </svg>
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Target</span>
                </div>
                {/* Warning zone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 8, background: C.warning[200], borderRadius: 1 }} />
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Warning</span>
                </div>
                {/* Critical zone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 8, background: C.error[200], borderRadius: 1 }} />
                  <span style={{ fontSize: '9px', color: C.neutral[600] }}>Critical</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Mode: Dual/Multi-Time Display */
          <>
            <div style={{ display: 'flex', gap: sp.md }}>
              {/* Left side: Compact health display */}
              <div style={{ flex: '0 0 auto', width: 200, borderRight: `1px solid ${C.neutral[200]}`, paddingRight: sp.md }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: sp.md, textAlign: 'center' }}>Warehouse Health</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <DonutChart value={health} size={64} stroke={6} color={scoreColor(health)} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '20px', fontWeight: 300 }}>{health}</span>
                      <span style={{ fontSize: '9px', color: C.neutral[500] }}>NOW</span>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      {isContextualDifferent && contextualHealth && (
                        <div style={{ padding: '2px 8px', background: C.brand[100], borderRadius: 4 }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[700] }}>{contextualHealth}</span>
                          <sub style={{ fontSize: '8px', color: C.brand[600], marginLeft: 2 }}>@{contextualTime}</sub>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginLeft: 36 }}>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: scoreColor(endTimeHealthBaseline) }}>{endTimeHealthBaseline}</span>
                      <sub style={{ fontSize: '8px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                    </div>
                    <Badge status={scoreStatus(health)} label={health >= 85 ? 'Healthy' : 'Needs Attention'} />
                  </div>
                </div>
              </div>
              
              {/* Right side: Chart - Accessible version */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 2 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Health Score Trajectory</h3>
                      <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                        isOpen: true, 
                        title: 'Health Score', 
                        data: healthScoreContributingFactors 
                      })} />
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>Composite score from 5 Operational Categories</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[600] }}>Dip @ 1300</span>
                </div>
                
                {/* Chart - Accessible version */}
                <div style={{ flex: 1, minHeight: 100, position: 'relative' }}>
                  <svg 
                    width="100%" 
                    height="100" 
                    viewBox="0 0 450 90" 
                    preserveAspectRatio="xMidYMid meet" 
                    style={{ overflow: 'visible' }}
                    role="img"
                    aria-labelledby="chartTitleStd chartDescStd"
                  >
                    {/* Accessibility: Title and description for screen readers */}
                    <title id="chartTitleStd">Health Score Trajectory Chart</title>
                    <desc id="chartDescStd">
                      Line chart showing health score prediction. 
                      Current score is 84, predicted to decline to 80 by end of day.
                      Target threshold is 85.
                    </desc>
                    
                    <defs>
                      <linearGradient id="confidenceBandSingleAccessible" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.08" />
                      </linearGradient>
                    </defs>
                    
                    {/* Y-axis labels */}
                    <text x="15" y="12" fontSize="9" fill={C.neutral[400]} textAnchor="end">95</text>
                    <text x="15" y="32" fontSize="9" fill={C.success[600]} fontWeight="500" textAnchor="end">85</text>
                    <text x="15" y="55" fontSize="9" fill={C.neutral[400]} textAnchor="end">80</text>
                    <text x="15" y="78" fontSize="9" fill={C.neutral[400]} textAnchor="end">75</text>
                    
                    {/* Grid lines */}
                    <line x1="25" y1="10" x2="440" y2="10" stroke={C.neutral[200]} strokeWidth="1" />
                    <line x1="25" y1="30" x2="440" y2="30" stroke={C.neutral[200]} strokeWidth="1" />
                    <line x1="25" y1="53" x2="440" y2="53" stroke={C.neutral[200]} strokeWidth="1" />
                    <line x1="25" y1="76" x2="440" y2="76" stroke={C.neutral[200]} strokeWidth="1" />
                    
                    {/* Warning zone */}
                    <rect x="25" y="53" width="415" height="23" fill={C.warning[100]} opacity="0.4" />
                    
                    {/* Critical zone */}
                    <rect x="25" y="76" width="415" height="14" fill={C.error[100]} opacity="0.3" />
                    
                    {/* TARGET LINE - Long dash pattern */}
                    <line x1="25" y1="30" x2="440" y2="30" stroke={C.success[500]} strokeWidth="2" strokeDasharray="12,6" strokeLinecap="round" />
                    <text x="442" y="33" fontSize="8" fill={C.success[600]} fontWeight="500">Target</text>
                    
                    {/* Confidence band - improved contrast */}
                    <path 
                      d="M 120 35 Q 180 42 240 40 Q 300 38 360 35 Q 400 32 440 30 
                         L 440 50 Q 400 55 360 58 Q 300 62 240 60 Q 180 58 120 50 Z" 
                      fill="url(#confidenceBandSingleAccessible)"
                    />
                    
                    {/* ACTUAL LINE - Solid with circle markers */}
                    <path 
                      d="M 25 25 L 70 28 L 120 32" 
                      fill="none" 
                      stroke={C.brand[600]} 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="25" cy="25" r="4" fill={C.brand[600]} stroke="white" strokeWidth="1.5" />
                    <circle cx="70" cy="28" r="3" fill={C.brand[600]} stroke="white" strokeWidth="1" />
                    
                    {/* PREDICTED LINE - Short dash with circle markers */}
                    <path 
                      d="M 120 32 Q 180 50 240 45 Q 300 40 360 37 Q 400 35 440 33" 
                      fill="none" 
                      stroke={C.brand[500]} 
                      strokeWidth="2"
                      strokeDasharray="6,4"
                      strokeLinecap="round"
                    />
                    {/* Circle markers at key points */}
                    <circle cx="240" cy="45" r="3" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                    <circle cx="360" cy="37" r="3" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                    <circle cx="440" cy="33" r="4" fill={C.brand[500]} stroke="white" strokeWidth="1.5" />
                    
                    {/* NOW marker */}
                    <line x1="120" y1="3" x2="120" y2="80" stroke={C.neutral[700]} strokeWidth="1.5" />
                    <rect x="102" y="0" width="36" height="14" rx="3" fill={C.neutral[700]} />
                    <text x="120" y="10" fontSize="8" fill="white" textAnchor="middle" fontWeight="500">NOW</text>
                    <circle cx="120" cy="32" r="5" fill={C.neutral[700]} stroke="white" strokeWidth="2" />
                    
                    {/* Contextual marker */}
                    {isContextualDifferent && (() => {
                      // Calculate x position based on contextualTime
                      // Chart range: 06:00 (x=25) to 22:00 (x=440), so 16 hours total
                      // Chart width: 415 pixels (440 - 25)
                      const parseTimeToMinutes = (timeStr) => {
                        const [hours, minutes] = timeStr.split(':').map(Number);
                        return hours * 60 + minutes;
                      };
                      const chartStartMinutes = 6 * 60; // 06:00
                      const chartEndMinutes = 22 * 60; // 22:00
                      const chartRangeMinutes = chartEndMinutes - chartStartMinutes;
                      const contextualMinutes = parseTimeToMinutes(contextualTime);
                      const minutesFromStart = contextualMinutes - chartStartMinutes;
                      const xPos = 25 + (minutesFromStart / chartRangeMinutes) * 415;

                      return (
                        <>
                          <line x1={xPos} y1="3" x2={xPos} y2="80" stroke={C.brand[500]} strokeWidth="1.5" />
                          <rect x={xPos - 20} y="0" width="40" height="14" rx="3" fill={C.brand[500]} />
                          <text x={xPos} y="10" fontSize="8" fill="white" textAnchor="middle" fontWeight="500">{contextualTime}</text>
                          <circle cx={xPos} cy="43" r="5" fill={C.brand[500]} stroke="white" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                  
                  {/* X-axis */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 10, marginTop: 2 }}>
                    {['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((t, i) => (
                      <span key={i} style={{ fontSize: '9px', color: C.neutral[400] }}>{t}</span>
                    ))}
                  </div>
                </div>
                
                {/* Legend - Accessible with markers */}
                <div style={{ display: 'flex', gap: sp.md, marginTop: sp.xs, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="24" height="12" style={{ overflow: 'visible' }}>
                      <line x1="0" y1="6" x2="16" y2="6" stroke={C.brand[600]} strokeWidth="2.5" />
                      <circle cx="20" cy="6" r="4" fill={C.brand[600]} stroke="white" strokeWidth="1" />
                    </svg>
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Actual</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="24" height="12" style={{ overflow: 'visible' }}>
                      <line x1="0" y1="6" x2="16" y2="6" stroke={C.brand[500]} strokeWidth="2" strokeDasharray="4,3" />
                      <circle cx="20" cy="6" r="3" fill={C.brand[500]} stroke="white" strokeWidth="1" />
                    </svg>
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Predicted</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 8, background: '#8B5CF6', opacity: 0.25, borderRadius: 1 }} />
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Confidence</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="20" height="12">
                      <line x1="0" y1="6" x2="20" y2="6" stroke={C.success[500]} strokeWidth="2" strokeDasharray="8,4" />
                    </svg>
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Target</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 8, background: C.warning[200], borderRadius: 1 }} />
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Warning</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 8, background: C.error[200], borderRadius: 1 }} />
                    <span style={{ fontSize: '9px', color: C.neutral[600] }}>Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
        </div>

        {/* Operational Categories card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Operational Categories - Navigation hub for human-driven exploration */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>
            Operational Categories 
            {scenarioMode && <span style={{ fontSize: '12px', color: C.purple[500], fontWeight: 400, marginLeft: sp.sm }}>(Baseline vs Scenario)</span>}
          </h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>
            Current {isContextualDifferent && <span style={{ color: C.brand[600] }}>→ @{contextualTime}</span>} → Predicted • Click to explore
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: sp.md
        }}>
          {cats.map((cat, i) => {
            const Icon = cat.icon;
            const improving = cat.pred > cat.score;
            const contextualScore = isContextualDifferent ? interpolateValue(cat.timeline, contextualTime) : null;
            
            // Scenario mode calculations
            const scenarioDelta = cat.predScenario - cat.pred;
            const scenarioImproving = scenarioDelta > 0;
            const scenarioNoChange = scenarioDelta === 0;
            const contextualScoreScenario = isContextualDifferent 
              ? Math.round(contextualScore + (cat.predScenario - cat.pred) * 0.5) 
              : null;
            
            // Get trend icon for scenario
            const getTrendIcon = (delta, size = 12) => {
              if (delta > 0) return <TrendingUp style={{ width: size, height: size, color: C.success[500] }} />;
              if (delta < 0) return <TrendingDown style={{ width: size, height: size, color: C.error[500] }} />;
              return <Minus style={{ width: size, height: size, color: C.neutral[400] }} />;
            };
            
            return (
              <div 
                key={i} 
                onClick={() => {
                  const tabMap = { staff: 'staff', zones: 'zones', work: 'work', sched: 'schedule', fin: 'dashboard' };
                  setActiveTab(tabMap[cat.id] || 'dashboard');
                }} 
                className="card-click" 
                style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderTop: `3px solid ${cat.color}`, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 14, height: 14, color: cat.color }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.label}</span>
                  </div>
                  {!scenarioMode && cat.alerts > 0 && <Badge status={scoreStatus(cat.score)} label={cat.alerts} />}
                </div>
                
                {scenarioMode ? (
                  /* Scenario Mode: Double donut layout */
                  <div>
                    {/* BASELINE ROW */}
                    <div style={{ marginBottom: sp.sm }}>
                      <p style={{ fontSize: '9px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', marginBottom: sp.xs }}>Baseline</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <DonutChart value={cat.score} size={44} stroke={4} color={scoreColor(cat.pred)} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          {isContextualDifferent && contextualScore !== null && (
                            <div style={{ padding: '2px 8px', background: C.brand[100], borderRadius: 4 }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, color: C.brand[700] }}>{contextualScore}</span>
                              <sub style={{ fontSize: '8px', color: C.brand[600], marginLeft: 2 }}>@{contextualTime}</sub>
                            </div>
                          )}
                          <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                          <span style={{ fontSize: '16px', fontWeight: 500, color: C.purple[600] }}>{cat.pred}</span>
                          <sub style={{ fontSize: '9px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                          {improving ? 
                            <ArrowUpRight style={{ width: 14, height: 14, color: C.success[500] }} /> : 
                            <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500] }} />
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* SCENARIO ROW */}
                    <div>
                      <p style={{ fontSize: '9px', fontWeight: 600, color: C.purple[500], textTransform: 'uppercase', marginBottom: sp.xs }}>Scenario</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <div style={{ position: 'relative' }}>
                          <DonutChart value={cat.predScenario} size={44} stroke={4} color={scoreColor(cat.predScenario)} />
                          {scenarioImproving && (
                            <div style={{ 
                              position: 'absolute', top: -2, right: -2, 
                              background: C.success[500], borderRadius: '50%', 
                              width: 16, height: 16,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                              <TrendingUp style={{ width: 9, height: 9, color: 'white' }} />
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                          {isContextualDifferent && contextualScoreScenario !== null && (
                            <div style={{ padding: '2px 8px', background: C.brand[100], borderRadius: 4 }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, color: C.brand[700] }}>{contextualScoreScenario}</span>
                              <sub style={{ fontSize: '8px', color: C.brand[600], marginLeft: 2 }}>@{contextualTime}</sub>
                              {contextualScoreScenario > contextualScore && (
                                <span style={{ fontSize: '9px', color: C.success[600], marginLeft: 4, fontWeight: 600 }}>+{contextualScoreScenario - contextualScore}</span>
                              )}
                            </div>
                          )}
                          <span style={{ fontSize: '12px', color: C.neutral[400] }}>→</span>
                          <span style={{ fontSize: '16px', fontWeight: 500, color: C.purple[600] }}>{cat.predScenario}</span>
                          <sub style={{ fontSize: '9px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                          {getTrendIcon(scenarioDelta, 14)}
                          {!scenarioNoChange && (
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: 600, 
                              color: scenarioImproving ? C.success[600] : C.error[600] 
                            }}>
                              {scenarioImproving ? '+' : ''}{scenarioDelta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <p style={{ fontSize: '10px', color: C.neutral[600], lineHeight: 1.3, marginTop: sp.sm }}>
                      {cat.sumScenario}
                    </p>
                  </div>
                ) : (
                  /* Standard Mode: Dual/Multi-Time Display */
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm }}>
                      <DonutChart value={cat.score} size={48} stroke={5} color={scoreColor(cat.score)} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{ fontSize: '20px', fontWeight: 500, color: scoreColor(cat.score) }}>{cat.score}</span>
                          <sub style={{ fontSize: '9px', color: C.neutral[500] }}>NOW</sub>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{ fontSize: '10px', color: C.neutral[400] }}>→</span>
                          <span style={{ fontSize: '16px', fontWeight: 500, color: C.purple[600] }}>{cat.pred}</span>
                          <sub style={{ fontSize: '8px', color: C.neutral[500] }}>@{endTimeLabel}</sub>
                          {improving ? <ArrowUpRight style={{ width: 12, height: 12, color: C.success[500] }} /> : <ArrowDownRight style={{ width: 12, height: 12, color: C.warning[500] }} />}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '10px', color: C.neutral[600], lineHeight: 1.3 }}>
                      {cat.sum}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: sp.xs }}>
                      <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Simple link to Analysis - categories ARE the navigation */}
        <div style={{ 
          marginTop: sp.md, 
          padding: sp.sm, 
          background: C.neutral[50], 
          borderRadius: 6,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Lightbulb style={{ width: 14, height: 14, color: C.purple[500] }} />
            <span style={{ fontSize: '12px', color: C.neutral[600] }}>
              {activePlans.length > 0 
                ? `Active plan addressing 2 root causes • ${alerts.filter(a => ['alert-1', 'alert-3'].includes(a.id)).length} alerts resolved`
                : `${[...new Set(alerts.filter(a => a.rootCause).map(a => a.rootCause.id))].length} root causes identified across categories`
              }
            </span>
          </div>
          <button
            onClick={() => {
              // Scroll to Analysis card
              const analysisCard = document.querySelector('[data-analysis-card]');
              if (analysisCard) {
                analysisCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              color: C.purple[600],
              background: 'white',
              border: `1px solid ${C.purple[200]}`,
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            View Analysis <ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </Card>
        </div>

        {/* Throughput Forecast card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Throughput Forecast - with contextual marker, scenario comparison, and alerts */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>
                Throughput Forecast
                {scenarioMode && <span style={{ fontSize: '12px', color: C.purple[500], fontWeight: 400, marginLeft: sp.sm }}>(Baseline vs Scenario)</span>}
              </h3>
              <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                isOpen: true, 
                title: 'Throughput Forecast', 
                data: getThroughputContributingFactors() 
              })} />
            </div>
            {!scenarioMode && <Badge status="success" label="On track" />}
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>
            {scenarioMode 
              ? 'Comparing baseline projection vs scenario with +4 FTE pickers • Target: 13,000 orders'
              : 'Cumulative orders processed today • Target: 13,000 orders by end of day'
            }
          </p>
        </div>
        
        {/* Chart - conditional on scenario mode */}
        {scenarioMode ? (
          <ScenarioPredictiveTimeline 
            data={throughputTimeline} 
            scenarioData={throughputTimelineScenario}
            height={160} 
            target={13000} 
            contextualTime={contextualTime} 
          />
        ) : (
          <PredictiveTimeline data={throughputTimeline} height={140} target={13000} contextualTime={contextualTime} />
        )}
        
        {/* Metrics row - below chart */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: sp.md,
          padding: sp.sm,
          background: C.neutral[50],
          borderRadius: 6
        }}>
          {/* Contextual time metric */}
          {isContextualDifferent && contextualThroughput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: '4px 10px', background: C.brand[100], borderRadius: 6 }}>
              <span style={{ fontSize: '13px', color: C.brand[600] }}>
                @{contextualTime}: <strong>{contextualThroughput.toLocaleString()}</strong> orders
                {isContextualPast && <span style={{ fontSize: '11px', color: C.brand[500], marginLeft: 4 }}>(past)</span>}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>Now:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>4,200</span>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>orders</span>
            </div>
          )}
          
          {/* EOD metric */}
          {scenarioMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>EOD:</span>
              <span style={{ fontSize: '12px', color: C.neutral[500], textDecoration: 'line-through' }}>12,850</span>
              <ArrowRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.purple[600] }}>13,850</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: C.success[600], background: C.success[50], padding: '2px 6px', borderRadius: 4 }}>+1,000</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>EOD:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.purple[600] }}>12,850</span>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>orders</span>
              <span style={{ fontSize: '11px', color: C.neutral[400] }}>/ Target: 13,000</span>
            </div>
          )}
        </div>
        
        {/* Alerts - Original InlineAlert style with state badges */}
        <Accordion 
          title="Alerts" 
          alerts={baselineAlerts}
          defaultOpen={false}
          customHeader={(
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[800] }}>Alerts</span>
                {activePlans.length > 0 ? (
                  <>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[50], padding: '2px 8px', borderRadius: 4 }}>
                      {baselineAlerts.filter(a => ['alert-1', 'alert-3'].includes(a.id)).length} resolved
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[700], background: C.brand[50], padding: '2px 8px', borderRadius: 4 }}>
                      {baselineAlerts.filter(a => a.id === 'alert-2').length} targeted
                    </span>
                  </>
                ) : scenarioMode ? (
                  <>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[50], padding: '2px 8px', borderRadius: 4 }}>
                      {scenarioAlerts.filter(a => a.state === 'mitigated').length} mitigated
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[50], padding: '2px 8px', borderRadius: 4 }}>
                      {scenarioAlerts.filter(a => a.state === 'persists').length} persist
                    </span>
                  </>
                ) : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                {baselineAlerts.filter(a => a.sev === 'critical').length > 0 && (
                  <span style={{ fontSize: '11px', fontWeight: 500, color: C.error[700], background: C.error[50], padding: '2px 8px', borderRadius: 4 }}>
                    {baselineAlerts.filter(a => a.sev === 'critical').length} critical
                  </span>
                )}
                {baselineAlerts.filter(a => a.sev === 'warning').length > 0 && (
                  <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[50], padding: '2px 8px', borderRadius: 4 }}>
                    {baselineAlerts.filter(a => a.sev === 'warning').length} warning
                  </span>
                )}
              </div>
            </div>
          )}
        >
          {(scenarioMode ? scenarioAlerts : baselineAlerts).map((alert, i) => {
            // Determine state for Live + Plan mode
            const getAlertState = () => {
              if (scenarioMode) return alert.state;
              if (activePlans.length === 0) return 'active';
              if (['alert-1', 'alert-3'].includes(alert.id)) return 'resolved';
              if (alert.id === 'alert-2') return 'targeted';
              return 'persists';
            };
            
            const alertState = getAlertState();
            const stateConfig = {
              resolved: { label: '✓ Resolved', bg: C.success[100], color: C.success[700] },
              mitigated: { label: '✓ Mitigated', bg: C.success[100], color: C.success[700] },
              targeted: { label: '◐ Targeted', bg: C.brand[100], color: C.brand[700] },
              persists: { label: 'Persists', bg: C.neutral[100], color: C.neutral[600] },
              active: { label: null, bg: null, color: null }
            };
            const config = stateConfig[alertState] || stateConfig.active;
            const isResolved = ['resolved', 'mitigated'].includes(alertState);
            
            // Color config based on severity
            const sevConfig = { 
              critical: [C.error[50], C.error[100], C.error[700], AlertOctagon], 
              warning: [C.warning[50], C.warning[100], C.warning[700], AlertTriangle], 
              info: [C.brand[50], C.brand[100], C.brand[600], Info] 
            };
            const [bg, bdr, txt, Icon] = sevConfig[alert.sev] || sevConfig.warning;
            
            return (
              <div 
                key={alert.id}
                onClick={() => navigateToAlert(alert.id, 'overall')}
                style={{ 
                  background: isResolved ? C.neutral[50] : bg, 
                  borderTop: `1px solid ${isResolved ? C.neutral[200] : bdr}`,
                  borderRight: `1px solid ${isResolved ? C.neutral[200] : bdr}`,
                  borderBottom: `1px solid ${isResolved ? C.neutral[200] : bdr}`,
                  borderLeft: `4px solid ${isResolved ? C.success[400] : txt}`,
                  borderRadius: '0 6px 6px 0', 
                  padding: `${sp.sm} ${sp.md}`,
                  marginBottom: sp.sm,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  opacity: isResolved ? 0.7 : 1
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', gap: sp.sm, alignItems: 'flex-start' }}>
                  <Icon style={{ width: 14, height: 14, color: isResolved ? C.neutral[400] : txt, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        color: isResolved ? C.neutral[400] : txt,
                        textDecoration: isResolved ? 'line-through' : 'none'
                      }}>{alert.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                        {alert.time && (
                          <span style={{ fontSize: '11px', color: isResolved ? C.neutral[400] : C.neutral[500] }}>{alert.time}</span>
                        )}
                        {config.label && (
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 600, 
                            padding: '2px 6px', 
                            background: config.bg, 
                            color: config.color, 
                            borderRadius: 3 
                          }}>
                            {config.label}
                          </span>
                        )}
                        <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                      </div>
                    </div>
                    <p style={{ 
                      fontSize: '12px', 
                      color: isResolved ? C.neutral[400] : C.neutral[600], 
                      margin: `${sp.xs} 0 0 0`,
                      textDecoration: isResolved ? 'line-through' : 'none'
                    }}>{alert.msg}</p>
                    {alert.conf && (
                      <p style={{ fontSize: '11px', color: isResolved ? C.neutral[300] : C.neutral[400], margin: `${sp.xs} 0 0 0` }}>
                        Confidence: {alert.conf}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Link to full Analysis */}
          <div style={{ 
            marginTop: sp.xs, 
            paddingTop: sp.sm, 
            borderTop: `1px solid ${C.neutral[200]}`,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                const analysisCard = document.querySelector('[data-analysis-card]');
                if (analysisCard) {
                  analysisCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 500,
                color: C.purple[600],
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              View root causes & actions <ChevronRight style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </Accordion>
      </Card>
        </div>

        {/* Key Metrics card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Key Metrics with Predictions - with tri-temporal display and scenario support */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Today's Performance</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>
                Current metrics → {isContextualDifferent && <span style={{ color: C.brand[600] }}>@{contextualTime} → </span>}end-of-day predictions
                {scenarioMode && <span style={{ color: C.purple[600], marginLeft: sp.sm }}>(Baseline vs Scenario)</span>}
              </p>
            </div>
            {scenarioMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: '4px 8px', background: C.purple[50], borderRadius: 6, border: `1px solid ${C.purple[200]}` }}>
                <span style={{ fontSize: '11px', color: C.purple[700] }}>Scenario: +4 FTEs</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
          {metrics.map((m, i) => {
            const contextualVal = isContextualDifferent ? interpolateValue(m.timeline, contextualTime) : null;
            // Scenario contextual value (slightly higher than baseline contextual)
            const contextualValScenario = contextualVal ? contextualVal * 1.02 + (m.l.includes('Cost') ? -0.15 : 0) : null;
            
            // Calculate deltas
            const eodDelta = m.predScenarioNum - m.predNum;
            const contextualDelta = contextualValScenario && contextualVal ? contextualValScenario - contextualVal : 0;
            
            // Format delta based on metric type
            const formatDelta = (delta, metric) => {
              if (metric.l.includes('%')) return (delta > 0 ? '+' : '') + delta.toFixed(1) + '%';
              if (metric.l.includes('$')) return (delta < 0 ? '-$' : '+$') + Math.abs(delta).toFixed(2);
              return (delta > 0 ? '+' : '') + Math.round(delta).toLocaleString();
            };
            
            const eodDeltaFormatted = formatDelta(eodDelta, m);
            const contextualDeltaFormatted = formatDelta(contextualDelta, m);
            
            // Target calculations
            const baselineDiff = m.predNum - m.tNum;
            const scenarioDiff = m.predScenarioNum - m.tNum;
            const baselineHits = m.higherIsBetter ? baselineDiff >= 0 : baselineDiff <= 0;
            const scenarioHits = m.higherIsBetter ? scenarioDiff >= 0 : scenarioDiff <= 0;
            
            const formatTargetDiff = (diff, metric) => {
              if (metric.l.includes('%')) return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
              if (metric.l.includes('$')) return (diff >= 0 ? '+$' : '-$') + Math.abs(diff).toFixed(2);
              return (diff >= 0 ? '+' : '') + Math.round(diff).toLocaleString();
            };
            
            return (
              <div 
                key={i} 
                onClick={() => setActiveTab(m.tab)}
                style={{ 
                  padding: sp.md, 
                  background: C.neutral[50], 
                  borderRadius: '8px', 
                  borderLeft: `3px solid ${m.ok ? C.success[500] : C.warning[500]}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = C.neutral[100]; 
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = C.neutral[50]; 
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[500], textTransform: 'uppercase' }}>{m.l}</p>
                  <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                </div>
                
                {/* Column headers - only in scenario mode */}
                {scenarioMode && (
                  <div style={{ display: 'flex', marginBottom: sp.xs }}>
                    <span style={{ width: 52 }}></span>
                    <span style={{ flex: 1, fontSize: '9px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase' }}>Baseline</span>
                    <span style={{ flex: 1, fontSize: '9px', fontWeight: 600, color: C.purple[600], textTransform: 'uppercase' }}>Scenario</span>
                    <span style={{ width: 44, fontSize: '9px', fontWeight: 600, color: C.neutral[400], textTransform: 'uppercase', textAlign: 'right' }}>Δ</span>
                  </div>
                )}
                
                {/* NOW row */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp.xs }}>
                  <span style={{ width: 52, fontSize: '11px', color: C.neutral[500], fontWeight: 500 }}>Now</span>
                  {scenarioMode ? (
                    <>
                      <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: C.neutral[800] }}>{m.v}</span>
                      <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: C.purple[600] }}>{m.v}</span>
                      <span style={{ width: 44, fontSize: '11px', color: C.neutral[400], textAlign: 'right' }}>—</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '20px', fontWeight: 400, color: C.neutral[800] }}>{m.v}</span>
                  )}
                </div>
                
                {/* Contextual row - only when scrubber moved */}
                {isContextualDifferent && contextualVal !== null && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: sp.xs,
                    padding: `${sp.xs} 0`,
                    background: C.brand[50],
                    borderRadius: 4,
                    marginLeft: -8,
                    marginRight: -8,
                    paddingLeft: 8,
                    paddingRight: 8
                  }}>
                    <span style={{ width: 52, fontSize: '11px', color: C.brand[600], fontWeight: 500 }}>@{contextualTime}</span>
                    {scenarioMode ? (
                      <>
                        <span style={{ flex: 1, fontSize: '13px', color: C.neutral[700] }}>{m.format(contextualVal)}</span>
                        <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: C.purple[600] }}>{m.format(contextualValScenario)}</span>
                        <span style={{ width: 44, fontSize: '11px', fontWeight: 600, color: C.success[600], textAlign: 'right' }}>{contextualDeltaFormatted}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[700] }}>{m.format(contextualVal)}</span>
                    )}
                  </div>
                )}
                
                {/* EOD row */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: sp.md }}>
                  <span style={{ width: 52, fontSize: '11px', color: C.neutral[500], fontWeight: 500 }}>EOD</span>
                  {scenarioMode ? (
                    <>
                      <span style={{ flex: 1, fontSize: '13px', color: C.neutral[600] }}>{m.pred}</span>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: C.purple[600] }}>{m.predScenario}</span>
                      <span style={{ 
                        width: 44, 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        color: C.success[600], 
                        textAlign: 'right' 
                      }}>{eodDeltaFormatted}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '14px', fontWeight: 500, color: C.purple[600] }}>{m.pred}</span>
                  )}
                </div>
                
                {/* Target comparison */}
                <div style={{ 
                  borderTop: `1px solid ${C.neutral[200]}`,
                  paddingTop: sp.sm
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 52, fontSize: '11px', color: C.neutral[500] }}>Target</span>
                    {scenarioMode ? (
                      <>
                        <span style={{ flex: 1, fontSize: '11px', color: C.neutral[500] }}>{m.t}</span>
                        <span style={{ flex: 1 }}></span>
                        <span style={{ width: 44 }}></span>
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: C.neutral[600] }}>{m.t}</span>
                    )}
                  </div>
                  {scenarioMode ? (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: sp.xs }}>
                      <span style={{ width: 52 }}></span>
                      <span style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: baselineHits ? C.success[600] : C.error[600] }}>
                        {baselineHits ? '✓' : '✗'} {formatTargetDiff(baselineDiff, m)}
                      </span>
                      <span style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: scenarioHits ? C.success[600] : C.error[600] }}>
                        {scenarioHits ? '✓' : '✗'} {formatTargetDiff(scenarioDiff, m)}
                      </span>
                      <span style={{ width: 44 }}></span>
                    </div>
                  ) : (
                    <div style={{ marginTop: sp.xs }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: baselineHits ? C.success[600] : C.error[600] }}>
                        {baselineHits ? '✓' : '✗'} {formatTargetDiff(baselineDiff, m)} vs target
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Shift Overview */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>
              Shift Overview
              {scenarioMode && <span style={{ fontSize: '12px', color: C.purple[500], fontWeight: 400, marginLeft: sp.sm }}>(Baseline vs Scenario)</span>}
            </h3>
            <Badge status="info" label="Day Active" dot />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>
            Cross-shift performance and predictions • Click to view details
            {isContextualDifferent && !scenarioMode && (
              <span style={{ marginLeft: sp.sm }}>
                • <span style={{ padding: '1px 6px', background: C.brand[100], color: C.brand[600], borderRadius: 3, fontSize: '11px' }}>Blue</span> = @{contextualTime}
              </span>
            )}
            {scenarioMode && (
              <span style={{ marginLeft: sp.sm }}>• Scenario: +4 FTE pickers</span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {shifts.map((s, i) => {
            const act = s.status === 'active', up = s.status === 'upcoming', done = s.status === 'completed';
            
            // Get contextual values for active shift only
            const ctxThroughput = act && isContextualDifferent && s.timelines ? interpolateValue(s.timelines.throughput, contextualTime) : null;
            const ctxCompletion = act && isContextualDifferent && s.timelines ? interpolateValue(s.timelines.completion, contextualTime) : null;
            const ctxStaffing = act && isContextualDifferent && s.timelines ? interpolateValue(s.timelines.staffing, contextualTime) : null;
            
            // Scenario deltas
            const tpDelta = s.tpPredScenario && s.tpPred ? s.tpPredScenario - s.tpPred : null;
            const compDelta = s.compPredScenario && s.compPred ? s.compPredScenario - s.compPred : null;
            const staffDelta = s.staffScenario && s.staff ? s.staffScenario - s.staff : null;
            const otDelta = s.otScenario && s.ot ? s.otScenario - s.ot : null;
            
            // Check if shift has any scenario impact
            const hasScenarioImpact = tpDelta || compDelta || staffDelta || otDelta;
            
            return (
              <div 
                key={i} 
                onClick={() => onShift(s.id)} 
                className="card-click" 
                style={{ 
                  padding: sp.md, 
                  background: act ? (scenarioMode ? C.purple[50] : C.brand[100]) : C.neutral[50], 
                  borderRadius: '8px', 
                  border: `1px solid ${act ? (scenarioMode ? C.purple[200] : C.brand[300]) : C.neutral[200]}`, 
                  cursor: 'pointer', 
                  transition: 'all 0.15s' 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Shift header row */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: scenarioMode && (act || up) ? sp.sm : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, minWidth: 140 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: act ? (scenarioMode ? C.purple[500] : C.brand[500]) : up ? C.purple[100] : C.success[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {act ? <Sun style={{ width: 18, height: 18, color: 'white' }} /> : up ? <Moon style={{ width: 18, height: 18, color: C.purple[600] }} /> : <CheckCircle style={{ width: 18, height: 18, color: C.success[600] }} />}
                    </div>
                    <div><p style={{ fontSize: '14px', fontWeight: 500 }}>{s.name}</p><p style={{ fontSize: '11px', color: C.neutral[500] }}>{s.time}</p></div>
                  </div>
                  <Badge status={act ? (scenarioMode ? 'purple' : 'info') : up ? 'purple' : 'success'} label={act ? 'LIVE' : up ? 'Next' : 'Done'} dot={act} />
                  
                  {/* Standard mode metrics OR completed shift metrics */}
                  {(!scenarioMode || done) && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, flex: 1, marginLeft: sp.lg }}>
                        {/* Throughput */}
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Throughput</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[900] }}>{s.tp ? `${(s.tp/1000).toFixed(1)}K` : '—'}</span>
                            {ctxThroughput !== null && (
                              <>
                                <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                                <span style={{ fontSize: '12px', fontWeight: 500, color: C.brand[600], padding: '1px 4px', background: C.brand[100], borderRadius: 3 }}>{(ctxThroughput/1000).toFixed(1)}K</span>
                              </>
                            )}
                            {s.tpPred && (
                              <>
                                <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                                <span style={{ fontSize: '12px', color: C.purple[600] }}>{(s.tpPred/1000).toFixed(1)}K</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Completion */}
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Completion</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[900] }}>{s.comp !== null ? `${s.comp}%` : '—'}</span>
                            {ctxCompletion !== null && (
                              <>
                                <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                                <span style={{ fontSize: '12px', fontWeight: 500, color: C.brand[600], padding: '1px 4px', background: C.brand[100], borderRadius: 3 }}>{ctxCompletion}%</span>
                              </>
                            )}
                            {s.compPred && (
                              <>
                                <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                                <span style={{ fontSize: '12px', color: C.purple[600] }}>{s.compPred}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Staffing */}
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Staffing</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: s.staff < 90 ? C.warning[600] : C.neutral[900] }}>{s.staff}%</span>
                            {ctxStaffing !== null && (
                              <>
                                <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                                <span style={{ fontSize: '12px', fontWeight: 500, color: C.brand[600], padding: '1px 4px', background: C.brand[100], borderRadius: 3 }}>{ctxStaffing}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* On-Time */}
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>On-Time</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[900] }}>{s.ot ? `${s.ot}%` : '—'}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
                    </>
                  )}
                  
                  {/* Scenario mode - just show chevron in header for active/upcoming */}
                  {scenarioMode && !done && (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <ChevronRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
                    </div>
                  )}
                </div>
                
                {/* Scenario Mode: Card-based metrics for active/upcoming shifts */}
                {scenarioMode && (act || up) && hasScenarioImpact && (
                  <div style={{ marginTop: sp.sm }}>
                    {/* Metric cards grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
                      {/* Throughput Card */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>Throughput</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: sp.md, marginBottom: sp.xs }}>
                          <span style={{ fontSize: '9px', color: C.neutral[400] }}>BASE</span>
                          <span style={{ fontSize: '9px', color: C.purple[500] }}>SCEN</span>
                        </div>
                        {/* Now row */}
                        {act && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>Now</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.tp ? `${(s.tp/1000).toFixed(1)}K` : '—'}</span>
                              <span style={{ fontSize: '11px', color: C.purple[600] }}>{s.tp ? `${(s.tp/1000).toFixed(1)}K` : '—'}</span>
                            </div>
                          </div>
                        )}
                        {/* Contextual row */}
                        {act && isContextualDifferent && ctxThroughput && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 4px`, background: C.brand[50], borderRadius: 3, margin: '2px -4px' }}>
                            <span style={{ fontSize: '10px', color: C.brand[600] }}>@{contextualTime}</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{`${(ctxThroughput/1000).toFixed(1)}K`}</span>
                              <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{`${((ctxThroughput * 1.08)/1000).toFixed(1)}K`}</span>
                            </div>
                          </div>
                        )}
                        {/* EOS row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>{act ? 'EOS' : 'Pred'}</span>
                          <div style={{ display: 'flex', gap: sp.sm }}>
                            <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.tpPred ? `${(s.tpPred/1000).toFixed(1)}K` : '—'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{s.tpPredScenario ? `${(s.tpPredScenario/1000).toFixed(1)}K` : '—'}</span>
                          </div>
                        </div>
                        {/* Delta */}
                        {tpDelta ? (
                          <div style={{ textAlign: 'center', marginTop: sp.xs }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[600], background: C.success[50], padding: '2px 8px', borderRadius: 3 }}>
                              +{(tpDelta/1000).toFixed(1)}K
                            </span>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Completion Card */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>Completion</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: sp.md, marginBottom: sp.xs }}>
                          <span style={{ fontSize: '9px', color: C.neutral[400] }}>BASE</span>
                          <span style={{ fontSize: '9px', color: C.purple[500] }}>SCEN</span>
                        </div>
                        {/* Now row */}
                        {act && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>Now</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.comp !== null ? `${s.comp}%` : '—'}</span>
                              <span style={{ fontSize: '11px', color: C.purple[600] }}>{s.comp !== null ? `${s.comp}%` : '—'}</span>
                            </div>
                          </div>
                        )}
                        {/* Contextual row */}
                        {act && isContextualDifferent && ctxCompletion && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 4px`, background: C.brand[50], borderRadius: 3, margin: '2px -4px' }}>
                            <span style={{ fontSize: '10px', color: C.brand[600] }}>@{contextualTime}</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{`${ctxCompletion}%`}</span>
                              <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{`${Math.min(ctxCompletion + 5, 100)}%`}</span>
                            </div>
                          </div>
                        )}
                        {/* EOS row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>{act ? 'EOS' : 'Pred'}</span>
                          <div style={{ display: 'flex', gap: sp.sm }}>
                            <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.compPred ? `${s.compPred}%` : '—'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{s.compPredScenario ? `${s.compPredScenario}%` : '—'}</span>
                          </div>
                        </div>
                        {/* Delta */}
                        {compDelta ? (
                          <div style={{ textAlign: 'center', marginTop: sp.xs }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[600], background: C.success[50], padding: '2px 8px', borderRadius: 3 }}>
                              +{compDelta}%
                            </span>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Staffing Card */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>Staffing</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: sp.md, marginBottom: sp.xs }}>
                          <span style={{ fontSize: '9px', color: C.neutral[400] }}>BASE</span>
                          <span style={{ fontSize: '9px', color: C.purple[500] }}>SCEN</span>
                        </div>
                        {/* Now row */}
                        {act && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>Now</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.staff}%</span>
                              <span style={{ fontSize: '11px', color: C.purple[600] }}>{s.staffScenario || s.staff}%</span>
                            </div>
                          </div>
                        )}
                        {/* Contextual row */}
                        {act && isContextualDifferent && ctxStaffing && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 4px`, background: C.brand[50], borderRadius: 3, margin: '2px -4px' }}>
                            <span style={{ fontSize: '10px', color: C.brand[600] }}>@{contextualTime}</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{`${ctxStaffing}%`}</span>
                              <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{`${ctxStaffing + 4}%`}</span>
                            </div>
                          </div>
                        )}
                        {/* EOS row - staffing doesn't have prediction */}
                        {!act && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>Planned</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.staff}%</span>
                              <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{s.staffScenario || s.staff}%</span>
                            </div>
                          </div>
                        )}
                        {/* Delta */}
                        {staffDelta ? (
                          <div style={{ textAlign: 'center', marginTop: sp.xs }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[600], background: C.success[50], padding: '2px 8px', borderRadius: 3 }}>
                              +{staffDelta}%
                            </span>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* On-Time Card */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <div style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>On-Time</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: sp.md, marginBottom: sp.xs }}>
                          <span style={{ fontSize: '9px', color: C.neutral[400] }}>BASE</span>
                          <span style={{ fontSize: '9px', color: C.purple[500] }}>SCEN</span>
                        </div>
                        {/* Now row */}
                        {act && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>Now</span>
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.ot ? `${s.ot}%` : '—'}</span>
                              <span style={{ fontSize: '11px', color: C.purple[600] }}>{s.ot ? `${s.ot}%` : '—'}</span>
                            </div>
                          </div>
                        )}
                        {/* EOS row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `3px 0`, borderTop: `1px solid ${C.neutral[100]}` }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>{act ? 'EOS' : 'Pred'}</span>
                          <div style={{ display: 'flex', gap: sp.sm }}>
                            <span style={{ fontSize: '11px', color: C.neutral[700] }}>{s.ot ? `${s.ot}%` : '—'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 500, color: C.purple[600] }}>{s.otScenario ? `${s.otScenario}%` : '—'}</span>
                          </div>
                        </div>
                        {/* Delta */}
                        {otDelta ? (
                          <div style={{ textAlign: 'center', marginTop: sp.xs }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[600], background: C.success[50], padding: '2px 8px', borderRadius: 3 }}>
                              +{otDelta}%
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    {/* Cascade note for upcoming shift */}
                    {up && (
                      <div style={{ marginTop: sp.sm, padding: sp.sm, background: C.purple[50], borderRadius: 4 }}>
                        <p style={{ fontSize: '11px', color: C.purple[700], margin: 0 }}>
                          <Info style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                          Projected improvement from reduced backlog carried over from Day shift
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Financial Health - Bottom line metrics with tri-temporal */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Financial Health</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>
                Labor costs and budget performance
                {isContextualDifferent && <span style={{ color: C.brand[600] }}> • @{contextualTime}</span>}
              </p>
            </div>
            <Badge status="warning" label="5.6% over" />
          </div>
        </div>
        {(() => {
          const financialMetrics = [
            { 
              label: 'Labor Cost', 
              unit: '$',
              prefix: true,
              target: 12400,
              timeline: [
                { time: '06:00', actual: 1200 },
                { time: '08:00', actual: 3800 },
                { time: '10:00', actual: 6420 },
                { time: '12:00', predicted: 9200 },
                { time: '14:00', predicted: 13100 }
              ]
            },
            { 
              label: 'Cost/Order', 
              unit: '$',
              prefix: true,
              decimals: 2,
              target: 1.50,
              timeline: [
                { time: '06:00', actual: 1.48 },
                { time: '08:00', actual: 1.51 },
                { time: '10:00', actual: 1.53 },
                { time: '12:00', predicted: 1.55 },
                { time: '14:00', predicted: 1.58 }
              ]
            },
            { 
              label: 'OT Hours', 
              unit: ' hrs',
              target: 40,
              timeline: [
                { time: '06:00', actual: 6 },
                { time: '08:00', actual: 14 },
                { time: '10:00', actual: 24 },
                { time: '12:00', predicted: 36 },
                { time: '14:00', predicted: 52 }
              ]
            },
            { 
              label: 'Temp Labor', 
              unit: ' FTE',
              target: 4,
              timeline: [
                { time: '06:00', actual: 2 },
                { time: '08:00', actual: 4 },
                { time: '10:00', actual: 4 },
                { time: '12:00', predicted: 5 },
                { time: '14:00', predicted: 6 }
              ]
            }
          ];
          
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
              {financialMetrics.map((metric, i) => {
                const currentVal = metric.timeline.find(t => t.time === '10:00')?.actual || 0;
                const contextualVal = isContextualDifferent ? interpolateValue(metric.timeline, contextualTime) : null;
                const predictedVal = metric.timeline[metric.timeline.length - 1]?.predicted || 0;
                
                const formatVal = (v) => {
                  const num = metric.decimals ? v.toFixed(metric.decimals) : Math.round(v).toLocaleString();
                  return metric.prefix ? `${metric.unit}${num}` : `${num}${metric.unit}`;
                };
                
                const evalVal = contextualVal !== null ? contextualVal : currentVal;
                const isOk = evalVal <= metric.target * 1.05; // within 5% of target
                
                return (
                  <div key={i} style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderLeft: `3px solid ${isOk ? C.success[500] : C.warning[500]}` }}>
                    <p style={{ fontSize: '11px', color: C.neutral[500], textTransform: 'uppercase', marginBottom: sp.xs }}>{metric.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, marginBottom: sp.xs, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px', fontWeight: 500 }}>{formatVal(currentVal)}</span>
                      {isContextualDifferent && contextualVal !== null && (
                        <>
                          <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[600], padding: '1px 4px', background: C.brand[100], borderRadius: 3 }}>
                            {formatVal(contextualVal)}
                          </span>
                        </>
                      )}
                      <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                      <span style={{ fontSize: '14px', color: C.purple[600] }}>{formatVal(predictedVal)}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>Target: {formatVal(metric.target)}</span>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <Accordion title="Analysis" alerts={[{ sev: 'warning', title: 'Labor over budget' }]} defaultOpen={true}>
          <InlineAlert 
            sev="warning" 
            title="Labor over budget" 
            msg="+5.6% predicted at shift end due to OT and temp labor" 
            time="+4hr" 
            conf={95} 
            state={activePlans.length > 0 ? 'persists' : 'active'}
            onClick={() => navigateToAlert('alert-4', 'overall', true)} 
          />
        </Accordion>
      </Card>
        </div>

        {/* Asset Health card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Asset Health - Equipment fleet status */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Asset Health</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>
                Equipment fleet availability and maintenance status
              </p>
            </div>
            <Badge status={93.8 >= 95 ? 'success' : 'warning'} label="93.8% Available" />
          </div>
        </div>
        
        {/* Fleet Summary Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginBottom: sp.md }}>
          {[
            { label: 'Active', value: 24, total: 32, color: C.success, icon: CheckCircle },
            { label: 'Maintenance', value: 2, total: 32, color: C.warning, icon: Wrench },
            { label: 'Charging', value: 2, total: 32, color: C.brand, icon: Zap },
            { label: 'Offline', value: 1, total: 32, color: C.error, icon: AlertTriangle }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ 
                padding: sp.sm, 
                background: item.color[50], 
                borderRadius: 8, 
                borderLeft: `3px solid ${item.color[500]}`,
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm
              }}>
                <Icon style={{ width: 16, height: 16, color: item.color[600] }} />
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 500, color: item.color[700], lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: '10px', color: item.color[600] }}>{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Equipment Type Breakdown - Mini version */}
        <div style={{ display: 'flex', gap: sp.sm, marginBottom: sp.md, flexWrap: 'wrap' }}>
          {[
            { type: 'Forklifts', active: 6, total: 8 },
            { type: 'Reach Trucks', active: 5, total: 6 },
            { type: 'Pallet Jacks', active: 8, total: 10 },
            { type: 'Order Pickers', active: 3, total: 4 },
            { type: 'Tuggers', active: 3, total: 4 }
          ].map((eq, i) => {
            const pct = Math.round((eq.active / eq.total) * 100);
            return (
              <div key={i} style={{ 
                flex: '1 1 auto',
                minWidth: 100,
                padding: sp.xs + ' ' + sp.sm, 
                background: C.neutral[50], 
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: sp.sm
              }}>
                <span style={{ fontSize: '11px', color: C.neutral[600] }}>{eq.type}</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 500, 
                  color: pct >= 90 ? C.success[600] : pct >= 75 ? C.warning[600] : C.error[600] 
                }}>
                  {eq.active}/{eq.total}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Link to Equipment Tab */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: sp.md }}>
          <button
            onClick={() => setActiveTab('equipment')}
            style={{
              padding: `${sp.sm} ${sp.md}`,
              fontSize: '13px',
              fontWeight: 500,
              color: C.neutral[600],
              background: C.neutral[50],
              border: `1px solid ${C.neutral[200]}`,
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: sp.sm
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.neutral[100]; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.neutral[50]; }}
          >
            View Full Fleet Status
            <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
        
        {/* Equipment Alerts */}
        <Accordion 
          title="Analysis" 
          alerts={[
            { sev: 'critical', title: 'FL-06 PM overdue' },
            { sev: 'critical', title: 'TT-03 offline' }
          ]} 
          defaultOpen={true}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            <InlineAlert 
              sev="critical" 
              title="FL-06 PM overdue" 
              msg="25 hours past scheduled maintenance - unit pulled from service" 
              time="Now" 
              conf={95} 
              state={activePlans.length > 0 ? 'persists' : 'active'}
              onClick={() => navigateToAlert('equip-pm-overdue', 'equipment', true)} 
            />
            <InlineAlert 
              sev="critical" 
              title="TT-03 offline" 
              msg="Tugger requires major repair - parts ETA 12/20" 
              time="Now" 
              conf={100}
              state={activePlans.length > 0 ? 'targeted' : 'active'}
              onClick={() => navigateToAlert('equip-tt03-offline', 'equipment', true)} 
            />
            <InlineAlert 
              sev="warning" 
              title="3 units low battery" 
              msg="RT-04, EPJ-06 charging; OP-02 needs rotation soon" 
              time="Now" 
              conf={90}
              state={activePlans.length > 0 ? 'resolved' : 'active'}
              onClick={() => navigateToAlert('equip-battery-low', 'equipment', true)} 
            />
          </div>
        </Accordion>
      </Card>
        </div>

        {/* Customer Impact card wrapper */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
      {/* Customer Impact - SLA and delivery performance with tri-temporal */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Customer Impact</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>
                SLA performance and delivery metrics
                {isContextualDifferent && <span style={{ color: C.brand[600] }}> • @{contextualTime}</span>}
              </p>
            </div>
            <Badge status="warning" label="1 SLA at risk" />
          </div>
        </div>
        {(() => {
          const customerMetrics = [
            { 
              label: 'On-Time Rate', 
              unit: '%',
              suffix: true,
              decimals: 1,
              target: 95,
              inverse: false, // higher is better
              timeline: [
                { time: '06:00', actual: 98.5 },
                { time: '08:00', actual: 96.2 },
                { time: '10:00', actual: 94.2 },
                { time: '12:00', predicted: 92.8 },
                { time: '14:00', predicted: 91.8 }
              ]
            },
            { 
              label: 'Orders at Risk', 
              unit: '',
              target: 0,
              inverse: true, // lower is better
              timeline: [
                { time: '06:00', actual: 0 },
                { time: '08:00', actual: 12 },
                { time: '10:00', actual: 40 },
                { time: '12:00', predicted: 52 },
                { time: '14:00', predicted: 65 }
              ]
            },
            { 
              label: 'Avg Ship Time', 
              unit: ' hrs',
              suffix: true,
              decimals: 1,
              target: 2.5,
              inverse: true, // lower is better
              timeline: [
                { time: '06:00', actual: 1.8 },
                { time: '08:00', actual: 2.1 },
                { time: '10:00', actual: 2.4 },
                { time: '12:00', predicted: 2.6 },
                { time: '14:00', predicted: 2.8 }
              ]
            },
            { 
              label: 'Perfect Orders', 
              unit: '%',
              suffix: true,
              decimals: 1,
              target: 98,
              inverse: false, // higher is better
              timeline: [
                { time: '06:00', actual: 99.2 },
                { time: '08:00', actual: 98.6 },
                { time: '10:00', actual: 98.1 },
                { time: '12:00', predicted: 97.8 },
                { time: '14:00', predicted: 97.6 }
              ]
            }
          ];
          
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
              {customerMetrics.map((metric, i) => {
                const currentVal = metric.timeline.find(t => t.time === '10:00')?.actual || 0;
                const contextualVal = isContextualDifferent ? interpolateValue(metric.timeline, contextualTime) : null;
                const predictedVal = metric.timeline[metric.timeline.length - 1]?.predicted || 0;
                
                const formatVal = (v) => {
                  const num = metric.decimals ? v.toFixed(metric.decimals) : Math.round(v);
                  return metric.suffix ? `${num}${metric.unit}` : `${metric.unit}${num}`;
                };
                
                const evalVal = contextualVal !== null ? contextualVal : currentVal;
                const isOk = metric.inverse 
                  ? evalVal <= metric.target * 1.1 
                  : evalVal >= metric.target * 0.95;
                
                return (
                  <div key={i} style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderLeft: `3px solid ${isOk ? C.success[500] : C.warning[500]}` }}>
                    <p style={{ fontSize: '11px', color: C.neutral[500], textTransform: 'uppercase', marginBottom: sp.xs }}>{metric.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, marginBottom: sp.xs, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px', fontWeight: 500 }}>{formatVal(currentVal)}</span>
                      {isContextualDifferent && contextualVal !== null && (
                        <>
                          <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.brand[600], padding: '1px 4px', background: C.brand[100], borderRadius: 3 }}>
                            {formatVal(contextualVal)}
                          </span>
                        </>
                      )}
                      <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                      <span style={{ fontSize: '14px', color: C.purple[600] }}>{formatVal(predictedVal)}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>Target: {formatVal(metric.target)}</span>
                  </div>
                );
              })}
            </div>
          );
        })()}
        <Accordion title="Analysis" alerts={[{ sev: 'critical', title: 'UPS cutoff at risk' }]} defaultOpen={true}>
          <InlineAlert 
            sev="critical" 
            title="UPS cutoff at risk" 
            msg="~40 orders may miss 15:30 cutoff based on current velocity" 
            time="+5.5hr" 
            conf={72}
            state={activePlans.length > 0 ? 'resolved' : 'active'}
            onClick={() => setActiveTab('insights')} 
          />
        </Accordion>
      </Card>
      
      {/* Analysis - Context-aware: Live, Live+Plan, or Scenario */}
      <Card>
        {(() => {
          // Determine context: live vs live+plan vs scenario
          const hasActivePlan = activePlans.length > 0;
          const isInScenario = scenarioMode;
          const context = isInScenario ? 'scenario' : hasActivePlan ? 'live-plan' : 'live';
          
          // Map alerts to active plan tasks for state determination
          const getAlertState = (alert) => {
            if (isInScenario) {
              if (alert.id === 'alert-1' || alert.id === 'alert-3') return { state: 'mitigated', task: null };
              if (alert.id === 'alert-4') return { state: 'new', task: null };
              return { state: 'persists', task: null };
            }
            
            if (hasActivePlan) {
              const activePlan = activePlans[0];
              
              if (alert.title.includes('UPS cutoff') || alert.title.includes('Picking') || alert.title.includes('picking')) {
                const task = activePlan.tasks?.find(t => t.status === 'done' && (t.title.includes('Reassign') || t.title.includes('FTE')));
                if (task) return { state: 'resolved', task: task.title };
              }
              
              if (alert.title.includes('capacity') || alert.title.includes('Zone Z')) {
                const task = activePlan.tasks?.find(t => t.status === 'in-progress' && (t.title.includes('Zone') || t.title.includes('overflow')));
                if (task) return { state: 'targeted', task: task.title };
              }
              
              if (alert.title.includes('Receiving') || alert.title.includes('inbound')) {
                return { state: 'tradeoff', task: 'Reassign 2 FTEs from Receiving' };
              }
              
              return { state: 'persists', task: null };
            }
            
            return { state: 'active', task: null };
          };
          
          const processedAlerts = alerts.map(a => ({ ...a, ...getAlertState(a) }));
          
          const sortedAlerts = [...processedAlerts].sort((a, b) => {
            const stateOrder = { targeted: 0, persists: 1, tradeoff: 2, active: 3, new: 4, resolved: 5, mitigated: 6 };
            const sevOrder = { critical: 0, warning: 1, info: 2 };
            const stateA = stateOrder[a.state] ?? 4;
            const stateB = stateOrder[b.state] ?? 4;
            if (stateA !== stateB) return stateA - stateB;
            return (sevOrder[a.sev] ?? 3) - (sevOrder[b.sev] ?? 3);
          });
          
          const resolvedCount = processedAlerts.filter(a => a.state === 'resolved' || a.state === 'mitigated').length;
          const targetedCount = processedAlerts.filter(a => a.state === 'targeted').length;
          const tradeoffCount = processedAlerts.filter(a => a.state === 'tradeoff' || a.state === 'new').length;
          const activeCount = processedAlerts.filter(a => !['resolved', 'mitigated'].includes(a.state)).length;
          const unmitigatedCount = processedAlerts.filter(a => ['active', 'persists'].includes(a.state)).length;
          const topAlerts = sortedAlerts.slice(0, 6);
          const remainingCount = alerts.length - 6;
          
          // Root causes summary
          const rootCauseIds = [...new Set(alerts.filter(a => a.rootCause).map(a => a.rootCause.id))];
          const rootCauseCount = rootCauseIds.length;
          
          return (
            <>
              <div style={{ marginBottom: sp.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>Analysis</h3>
                      {(hasActivePlan || isInScenario) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                          <span style={{ fontSize: '11px', padding: '2px 6px', background: C.neutral[100], color: C.neutral[600], borderRadius: 10, textDecoration: 'line-through' }}>{alerts.length}</span>
                          <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                          <span style={{ fontSize: '11px', padding: '2px 6px', background: activeCount > 0 ? C.warning[100] : C.success[100], color: activeCount > 0 ? C.warning[700] : C.success[700], borderRadius: 10, fontWeight: 600 }}>{activeCount} remaining</span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0 }}>
                      {hasActivePlan 
                        ? `${rootCauseCount} root causes • ${resolvedCount} resolved, ${targetedCount} in progress${tradeoffCount > 0 ? `, ${tradeoffCount} tradeoffs` : ''}`
                        : isInScenario 
                          ? `Projected impact: ${resolvedCount} would be mitigated, ${unmitigatedCount} persist` 
                          : `${rootCauseCount} root causes identified • ${alerts.length} predicted issues without intervention`}
                    </p>
                  </div>
                  {!hasActivePlan && !isInScenario && <SeverityPills alerts={alerts} />}
                </div>
                
                {/* No Plan Warning Banner */}
                {!hasActivePlan && !isInScenario && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: sp.sm, 
                    padding: sp.sm, 
                    background: C.warning[50], 
                    borderRadius: 6, 
                    marginTop: sp.md,
                    border: `1px solid ${C.warning[200]}`
                  }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />
                    <span style={{ fontSize: '12px', color: C.warning[700], flex: 1 }}>
                      <strong>No active interventions</strong> — All {alerts.length} predicted issues will occur without action
                    </span>
                    <button 
                      onClick={() => setActiveTab('insights')}
                      style={{ 
                        padding: '4px 10px', 
                        fontSize: '11px', 
                        fontWeight: 500, 
                        background: C.warning[500], 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 4, 
                        cursor: 'pointer' 
                      }}
                    >
                      View Recommendations
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: sp.md }}>
                {topAlerts.map((a, i) => (
                  (hasActivePlan || isInScenario) ? (
                    <ScenarioInlineAlert key={i} sev={a.sev} title={a.title} msg={a.msg} time={a.time} conf={a.conf} state={a.state} context={context} linkedTask={a.task} onClick={() => navigateToAlert(a.id, a.category, true)} />
                  ) : (
                    <Alert key={i} {...a} onClick={() => navigateToAlert(a.id, a.category, true)} />
                  )
                ))}
              </div>
              
              {remainingCount > 0 && (
                <div onClick={() => { setSelectedAlert(null); setInsightsSubTab('overall'); setActiveTab('insights'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }} style={{ padding: `${sp.sm} ${sp.md}`, background: C.neutral[50], borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs, cursor: 'pointer', color: C.neutral[600], fontSize: '13px', fontWeight: 500, marginBottom: sp.md, border: `1px solid ${C.neutral[200]}` }} onMouseEnter={(e) => { e.currentTarget.style.background = C.neutral[100]; e.currentTarget.style.color = C.neutral[800]; }} onMouseLeave={(e) => { e.currentTarget.style.background = C.neutral[50]; e.currentTarget.style.color = C.neutral[600]; }}>
                  View all {alerts.length} alerts <ChevronRight style={{ width: 14, height: 14 }} />
                </div>
              )}
            </>
          );
        })()}
        
        {/* Insights Summary */}
        <div style={{ borderTop: `1px solid ${C.neutral[200]}`, paddingTop: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: C.purple[700] }}>Insights</h4>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>{(() => {
                  const rootCauses = [...new Set(alerts.filter(a => a.rootCause).map(a => a.rootCause.id))];
                  return `${rootCauses.length} root causes identified from ${alerts.length} alerts`;
                })()}</p>
              </div>
            </div>
            <button
              onClick={() => { 
                setSelectedAlert(null); 
                setActiveTab('insights'); 
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
              }}
              style={{
                padding: `${sp.sm} ${sp.md}`,
                fontSize: '13px',
                fontWeight: 500,
                color: C.purple[600],
                background: C.purple[50],
                border: `1px solid ${C.purple[200]}`,
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: sp.xs
              }}
            >
              View Full Analysis
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </Card>
        </div>
      </div>
          </>
        )}
        
        {/* Plans Tab Content */}
        {isAtFacilityLevel && activeTab === 'plans' && (
          <PlansTabContent 
            onViewInsights={() => setActiveTab('insights')}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
            allPlans={allPlans}
            setAllPlans={setAllPlans}
          />
        )}
        
        {/* Financial Tab Content */}
        {isAtFacilityLevel && activeTab === 'financial' && (
          <FinancialTabContent 
            onViewInsights={() => { setInsightsSubTab('financial'); setActiveTab('insights'); }}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
            onNavigateToCostCategory={(category) => {
              // Future: Navigate to cost category detail view
              console.log('Navigate to cost category:', category);
            }}
          />
        )}
        
        {/* Zones Tab Content */}
        {isAtFacilityLevel && activeTab === 'zones' && (
          <ZonesTabContent 
            onZone={onZone} 
            onViewInsights={() => { setInsightsSubTab('zones'); setActiveTab('insights'); }} 
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
            onNavigateToZone={(zoneId, zoneName) => navigateTo('zone', zoneId, zoneName)}
          />
        )}
        
        {/* Staff Tab Content */}
        {isAtFacilityLevel && activeTab === 'staff' && (
          <StaffTabContent 
            onViewInsights={() => { setInsightsSubTab('staffing'); setActiveTab('insights'); }} 
            initialShiftFilter={staffShiftFilter}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
            onNavigateToStaff={(staffId, staffName) => navigateTo('staff', staffId, staffName)}
          />
        )}
        
        {/* Work Content Tab */}
        {isAtFacilityLevel && activeTab === 'work' && (
          <WorkTabContent 
            onNavigateToZones={(queueId, zones) => {
              // TODO: Wire up to Zones tab with filter state
              console.log('Navigate to zones:', queueId, zones);
              setActiveTab('zones');
            }} 
            onViewInsights={() => { setInsightsSubTab('work'); setActiveTab('insights'); }}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
          />
        )}
        
        {/* Schedule Tab Content */}
        {isAtFacilityLevel && activeTab === 'schedule' && (
          <ScheduleTabContent 
            onViewInsights={() => { setInsightsSubTab('schedules'); setActiveTab('insights'); }}
            onNavigateToStaff={(shiftId) => {
              setStaffShiftFilter(shiftId);
              setActiveTab('staff');
            }}
            onNavigateToWork={() => setActiveTab('work')}
            onNavigateToEquipment={() => setActiveTab('equipment')}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
          />
        )}
        
        {/* Equipment Tab Content */}
        {isAtFacilityLevel && activeTab === 'equipment' && (
          <EquipmentTabContent 
            onViewInsights={() => { setInsightsSubTab('equipment'); setActiveTab('insights'); }}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
            onSelectEquipment={(equipId, equipLabel) => navigateTo('equipment', equipId, equipLabel || equipId)}
          />
        )}
        
        {/* Insights Tab Content */}
        {isAtFacilityLevel && activeTab === 'insights' && (
          <div data-analysis-card>
            <Header icon={Lightbulb} title="Analysis" sub="AI-generated alerts, root cause analysis, and recommended actions" color={C.purple[500]} />
            
            {/* State-Aware Summary Panel */}
            {(() => {
              // Accordion header component
              const AccordionHeader = ({ title, isExpanded, onClick, icon = null, badge = null }) => (
                <div
                  onClick={onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: sp.sm,
                    background: C.neutral[50],
                    borderRadius: 4,
                    border: `1px solid ${C.neutral[200]}`,
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    {icon}
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: C.neutral[700] }}>
                      {title}
                    </span>
                    {badge}
                  </div>
                  <ChevronDown
                    style={{
                      width: 16,
                      height: 16,
                      color: C.neutral[500],
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
              );

              const hasActivePlan = activePlans.length > 0;
              const plan = activePlans[0];
              const tasksComplete = plan?.tasks?.filter(t => t.status === 'done').length || 0;
              const tasksTotal = plan?.tasks?.length || 0;

              return (
                <Card style={{ marginBottom: sp.md, background: hasActivePlan ? C.success[50] : C.neutral[50], border: `1px solid ${hasActivePlan ? C.success[200] : C.neutral[200]}` }}>
                  {hasActivePlan ? (
                    <>
                      {/* Active Plan Summary - with link to Plan */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                            <Zap style={{ width: 16, height: 16, color: C.success[600] }} />
                            <span style={{ fontSize: '14px', fontWeight: 500, color: C.success[700] }}>Active Plan: {plan.name}</span>
                            <span style={{ 
                              padding: '2px 6px', 
                              fontSize: '10px', 
                              fontWeight: 600, 
                              background: plan.priority === 'critical' ? C.error[100] : plan.priority === 'high' ? C.warning[100] : C.neutral[100], 
                              color: plan.priority === 'critical' ? C.error[700] : plan.priority === 'high' ? C.warning[700] : C.neutral[600], 
                              borderRadius: 4,
                              textTransform: 'uppercase'
                            }}>{plan.priority}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: C.neutral[600], margin: 0 }}>
                            {tasksComplete}/{tasksTotal} tasks complete • Target: {plan.targetCompletion}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                            <div style={{ width: 100, height: 6, background: C.success[100], borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${plan.progress}%`, background: C.success[500], borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: C.success[700] }}>{plan.progress}%</span>
                          </div>
                          <button
                            onClick={() => setActiveTab('plans')}
                            style={{
                              padding: '6px 12px',
                              fontSize: '11px',
                              fontWeight: 500,
                              color: C.success[700],
                              background: 'white',
                              border: `1px solid ${C.success[300]}`,
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            View Plan <ChevronRight style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>

                      {/* Accordion toggle for main content */}
                      <AccordionHeader
                        title="Plan Details & Analysis"
                        isExpanded={isActivePlanExpanded}
                        onClick={() => setIsActivePlanExpanded(!isActivePlanExpanded)}
                        badge={
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            background: C.neutral[100],
                            color: C.neutral[600],
                            borderRadius: 3
                          }}>
                            4 Root Causes • 6 Alerts • 1 Tradeoff
                          </span>
                        }
                      />

                      {isActivePlanExpanded && (
                        <>
                          {/* Stacked: Root Causes */}
                          <div style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}`, marginBottom: sp.sm, marginTop: sp.sm }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', margin: 0 }}>Root Causes</p>
                          <span style={{ fontSize: '10px', color: C.neutral[400] }}>4 identified</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.sm, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[100], padding: '2px 8px', borderRadius: 4 }}>1 Resolved</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[700], background: C.brand[100], padding: '2px 8px', borderRadius: 4 }}>1 Targeted</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[100], padding: '2px 8px', borderRadius: 4 }}>1 Tradeoff</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>1 Persists</span>
                        </div>
                      </div>
                      
                      {/* Stacked: Alerts */}
                      <div style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}`, marginBottom: sp.md }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', margin: 0 }}>Alerts</p>
                          <span style={{ fontSize: '10px', color: C.neutral[400] }}>{alerts.length} total</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.sm, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[100], padding: '2px 8px', borderRadius: 4 }}>2 Resolved</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[700], background: C.brand[100], padding: '2px 8px', borderRadius: 4 }}>1 Targeted</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[100], padding: '2px 8px', borderRadius: 4 }}>1 Tradeoff</span>
                          <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>2 Persist</span>
                        </div>
                      </div>
                      
                      {/* Emerging Tradeoffs Analysis - Grouped like Root Cause Analysis */}
                      <div style={{ marginBottom: sp.sm }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: C.warning[700], textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: sp.xs }}>
                            <AlertTriangle style={{ width: 12, height: 12 }} />
                            Emerging Tradeoffs Analysis
                          </p>
                          <span style={{ fontSize: '10px', color: C.neutral[400] }}>1 intervention • 3 issues</span>
                        </div>

                        {/* FTE Card Accordion */}
                        <AccordionHeader
                          title="FTE Reallocation Impact"
                          isExpanded={isFteCardExpanded}
                          onClick={() => setIsFteCardExpanded(!isFteCardExpanded)}
                          icon={<AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />}
                          badge={
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '2px 6px',
                              background: C.warning[100],
                              color: C.warning[700],
                              borderRadius: 3,
                              fontWeight: 600
                            }}>
                              TRADEOFF
                            </span>
                          }
                        />

                        {isFteCardExpanded && (
                          <div style={{ marginTop: sp.sm }}>
                            {/* Tradeoff Group Card - similar structure to Root Cause cards */}
                            <div style={{
                              background: 'white',
                              border: `1px solid ${C.warning[200]}`,
                              borderLeft: `4px solid ${C.warning[500]}`,
                              borderRadius: '0 8px 8px 0',
                              overflow: 'hidden'
                            }}>
                          {/* Group Header */}
                          <div style={{ 
                            padding: sp.md, 
                            background: C.warning[50],
                            borderBottom: `1px solid ${C.warning[200]}`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '14px', fontWeight: 600, color: C.warning[800] }}>FTE Reallocation Impact</span>
                                  <span style={{ 
                                    fontSize: '10px', 
                                    fontWeight: 600, 
                                    padding: '2px 6px', 
                                    background: C.warning[100], 
                                    color: C.warning[700], 
                                    borderRadius: 3,
                                    textTransform: 'uppercase'
                                  }}>
                                    Tradeoff
                                  </span>
                                </div>
                                <p style={{ fontSize: '12px', color: C.neutral[600], margin: 0 }}>
                                  From: <span style={{ fontWeight: 500 }}>"Reassign 2 FTEs from Receiving to Picking"</span>
                                </p>
                              </div>
                              <div style={{ 
                                padding: '4px 8px', 
                                background: C.success[100], 
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success[500] }} />
                                <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[700] }}>Within tolerance</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Narrative Sections */}
                          <div style={{ padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}` }}>
                            {/* What's Happening */}
                            <div style={{ marginBottom: sp.md }}>
                              <div
                                onClick={() => setExpandedSections(prev => ({ ...prev, whatsHappening: !prev.whatsHappening }))}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: sp.xs,
                                  cursor: 'pointer',
                                  marginBottom: sp.xs
                                }}
                              >
                                <ChevronDown
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: C.neutral[500],
                                    transform: expandedSections.whatsHappening ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s'
                                  }}
                                />
                                <p style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: C.neutral[500],
                                  textTransform: 'uppercase',
                                  margin: 0
                                }}>
                                  What's Happening
                                </p>
                              </div>

                              {expandedSections.whatsHappening && (
                                <p style={{ fontSize: '13px', color: C.neutral[700], margin: 0, lineHeight: 1.5 }}>
                                  Moving 2 FTEs from Receiving to Picking resolved the UPS cutoff risk but reduced inbound processing capacity. This was an expected tradeoff when the plan was created.
                                </p>
                              )}
                            </div>
                            
                            {/* Why It's Important */}
                            <div style={{ marginBottom: sp.md }}>
                              <div
                                onClick={() => setExpandedSections(prev => ({ ...prev, whyImportant: !prev.whyImportant }))}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: sp.xs,
                                  cursor: 'pointer',
                                  marginBottom: sp.xs
                                }}
                              >
                                <ChevronDown
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: C.neutral[500],
                                    transform: expandedSections.whyImportant ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s'
                                  }}
                                />
                                <p style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: C.neutral[500],
                                  textTransform: 'uppercase',
                                  margin: 0
                                }}>
                                  Why It's Important
                                </p>
                              </div>

                              {expandedSections.whyImportant && (
                                <p style={{ fontSize: '13px', color: C.neutral[700], margin: 0, lineHeight: 1.5 }}>
                                  Receiving is currently running 30 min behind target. If the delay exceeds 45 min, dock congestion will cascade into afternoon shifts and impact outbound capacity.
                                </p>
                              )}
                            </div>
                            
                            {/* Potential Outcome */}
                            <div style={{ 
                              padding: sp.sm, 
                              background: C.error[50], 
                              borderRadius: 6,
                              border: `1px solid ${C.error[200]}`
                            }}>
                              <p style={{ fontSize: '11px', fontWeight: 600, color: C.error[700], textTransform: 'uppercase', marginBottom: sp.xs }}>
                                Potential Outcome (if unaddressed)
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                                  <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                                  <span style={{ fontSize: '13px', color: C.error[700] }}>2 trucks delayed → <strong>$400 detention fees</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                                  <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                                  <span style={{ fontSize: '13px', color: C.error[700] }}>Putaway backlog spills into Shift 2</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                                  <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                                  <span style={{ fontSize: '13px', color: C.error[700] }}>Receiving SLA breach risk increases to 65%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contributing Issues - Alert card style */}
                          <div style={{ padding: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                            <div
                              onClick={() => setExpandedSections(prev => ({ ...prev, contributingIssues: !prev.contributingIssues }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                marginBottom: sp.sm
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                                <ChevronDown
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: C.neutral[500],
                                    transform: expandedSections.contributingIssues ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s'
                                  }}
                                />
                                <p style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  color: C.neutral[500],
                                  textTransform: 'uppercase',
                                  margin: 0
                                }}>
                                  Contributing Issues
                                </p>
                              </div>
                              <span style={{ fontSize: '10px', color: C.neutral[400] }}>(3)</span>
                            </div>

                            {expandedSections.contributingIssues && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginBottom: sp.md }}>
                              {/* Issue 1 - Warning severity */}
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: sp.sm,
                                padding: sp.sm,
                                background: C.warning[50], 
                                borderLeft: `3px solid ${C.warning[700]}`,
                                borderRadius: '0 6px 6px 0'
                              }}>
                                <AlertTriangle style={{ width: 14, height: 14, color: C.warning[700], flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: C.warning[700] }}>Receiving Throughput Degraded</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                                      <span style={{ fontSize: '11px', color: C.neutral[500] }}>+1.5hr</span>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                                    Inbound running 30 min behind target due to reduced staffing
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 78%</span>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: '10px', color: C.neutral[500] }}>30/45 min</span>
                                      <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ width: '66%', height: '100%', background: C.warning[400], borderRadius: 2 }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Issue 2 - Warning severity */}
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: sp.sm,
                                padding: sp.sm,
                                background: C.warning[50], 
                                borderLeft: `3px solid ${C.warning[700]}`,
                                borderRadius: '0 6px 6px 0'
                              }}>
                                <AlertTriangle style={{ width: 14, height: 14, color: C.warning[700], flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: C.warning[700] }}>Inbound Queue Building</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                                      <span style={{ fontSize: '11px', color: C.neutral[500] }}>+2hr</span>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                                    2 trucks waiting, dock turnaround slowing
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 82%</span>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: '10px', color: C.neutral[500] }}>2/4 trucks</span>
                                      <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ width: '50%', height: '100%', background: C.success[400], borderRadius: 2 }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Issue 3 - Info severity (lower concern) */}
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: sp.sm,
                                padding: sp.sm,
                                background: C.brand[50], 
                                borderLeft: `3px solid ${C.brand[600]}`,
                                borderRadius: '0 6px 6px 0'
                              }}>
                                <Info style={{ width: 14, height: 14, color: C.brand[600], flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: C.brand[600] }}>Putaway Backlog Growing</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                                      <span style={{ fontSize: '11px', color: C.neutral[500] }}>+1hr</span>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                                    Staged pallets waiting for storage assignment
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 65%</span>
                                    <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: '10px', color: C.neutral[500] }}>15/25 pallets</span>
                                      <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ width: '60%', height: '100%', background: C.warning[400], borderRadius: 2 }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              </div>
                            )}
                          </div>

                          {/* Suggested Resolution - Action Card style (matches Recommended Actions in Insights) */}
                          <div style={{ marginTop: sp.md, padding: sp.md }}>
                            <div
                              onClick={() => setExpandedSections(prev => ({ ...prev, suggestedResolution: !prev.suggestedResolution }))}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: sp.xs,
                                cursor: 'pointer',
                                marginBottom: sp.sm
                              }}
                            >
                              <ChevronDown
                                style={{
                                  width: 12,
                                  height: 12,
                                  color: C.neutral[500],
                                  transform: expandedSections.suggestedResolution ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s'
                                }}
                              />
                              <p style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: C.neutral[500],
                                textTransform: 'uppercase',
                                margin: 0
                              }}>
                                Suggested Resolution
                              </p>
                            </div>

                            {expandedSections.suggestedResolution && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginBottom: sp.md }}>
                              {/* Action 1 - Primary recommendation (green border = positive impact) */}
                              <div style={{ 
                                background: 'white', 
                                borderRadius: 6, 
                                border: `1px solid ${C.neutral[200]}`,
                                borderLeft: `4px solid ${C.success[500]}`,
                                padding: sp.md
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Add 1 temp worker to Receiving</span>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: C.neutral[600],
                                    background: C.neutral[100],
                                    padding: '4px 10px',
                                    borderRadius: 4
                                  }}>
                                    Shift Lead
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                                    <span style={{ color: C.success[600] }}>Addresses all 3 issues</span>
                                  </span>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                                    <span style={{ color: C.warning[600] }}>+$160 labor cost</span>
                                  </span>
                                </div>
                                <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 85%</span>
                              </div>
                              
                              {/* Action 2 - Alternative (orange border = has significant tradeoff) */}
                              <div style={{ 
                                background: 'white', 
                                borderRadius: 6, 
                                border: `1px solid ${C.neutral[200]}`,
                                borderLeft: `4px solid ${C.warning[500]}`,
                                padding: sp.md
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Pull 1 FTE back from Picking</span>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: C.neutral[600],
                                    background: C.neutral[100],
                                    padding: '4px 10px',
                                    borderRadius: 4
                                  }}>
                                    Shift Lead
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                                    <span style={{ color: C.success[600] }}>Immediate, no cost</span>
                                  </span>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                                    <span style={{ color: C.warning[600] }}>Reduces picking gains ~12%</span>
                                  </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 78%</span>
                                  <span style={{ fontSize: '12px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <AlertTriangle style={{ width: 12, height: 12 }} />
                                    Conflicts with original plan goal
                                  </span>
                                </div>
                              </div>
                              
                              {/* Action 3 - Alternative (gray border = partial/minor) */}
                              <div style={{ 
                                background: 'white', 
                                borderRadius: 6, 
                                border: `1px solid ${C.neutral[200]}`,
                                borderLeft: `4px solid ${C.neutral[400]}`,
                                padding: sp.md
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Delay low-priority putaway tasks</span>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: 500, 
                                    color: C.neutral[600],
                                    background: C.neutral[100],
                                    padding: '4px 10px',
                                    borderRadius: 4
                                  }}>
                                    Ops Manager
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                                    <span style={{ color: C.success[600] }}>Frees receiving capacity</span>
                                  </span>
                                  <span style={{ fontSize: '13px' }}>
                                    <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                                    <span style={{ color: C.warning[600] }}>Only addresses 1 of 3 issues</span>
                                  </span>
                                </div>
                                <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 91%</span>
                              </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: sp.sm }}>
                              <button style={{ 
                                flex: 1,
                                padding: `${sp.sm} ${sp.md}`, 
                                fontSize: '12px', 
                                fontWeight: 500, 
                                background: 'white', 
                                color: C.neutral[600], 
                                border: `1px solid ${C.neutral[300]}`, 
                                borderRadius: 6, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: sp.xs 
                              }}>
                                <Eye style={{ width: 14, height: 14 }} /> Monitor All
                              </button>
                              <button style={{ 
                                flex: 1,
                                padding: `${sp.sm} ${sp.md}`, 
                                fontSize: '12px', 
                                fontWeight: 500, 
                                background: C.success[500], 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: 6, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: sp.xs 
                              }}>
                                <Plus style={{ width: 14, height: 14 }} /> Add to Plan
                              </button>
                              <button style={{ 
                                flex: 1,
                                padding: `${sp.sm} ${sp.md}`, 
                                fontSize: '12px', 
                                fontWeight: 500, 
                                background: 'white', 
                                color: C.purple[600], 
                                border: `1px solid ${C.purple[300]}`, 
                                borderRadius: 6, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: sp.xs 
                              }}>
                                <Zap style={{ width: 14, height: 14 }} /> Create Plan
                              </button>
                            </div>
                          </div>
                            </div>
                          </div>
                        )}
                      </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* No Active Plan - Show summary of issues */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[700], marginBottom: sp.xs }}>No Active Plan</p>
                          <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0 }}>
                            2 root causes identified driving {alerts.length} alerts across categories
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('plans')}
                          style={{
                            padding: `${sp.xs} ${sp.sm}`,
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'white',
                            background: C.purple[500],
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Zap style={{ width: 12, height: 12 }} />
                          Create Plan
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: sp.sm }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: C.error[700], background: C.error[50], padding: '2px 8px', borderRadius: 4 }}>
                          {[...new Set(alerts.filter(a => a.rootCause).map(a => a.rootCause.id))].length} Root Causes
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[50], padding: '2px 8px', borderRadius: 4 }}>
                          {alerts.filter(a => a.sev === 'critical').length} Critical
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>
                          {alerts.filter(a => a.sev === 'warning').length} Warning
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })()}
            
            {/* Category Sub-tabs */}
            <div style={{ 
              display: 'flex', 
              gap: 0, 
              marginBottom: sp.md,
              borderBottom: `1px solid ${C.neutral[200]}`
            }}>
              {[
                { id: 'overall', label: 'Overall', count: alerts.length },
                { id: 'staffing', label: 'Staffing', count: alerts.filter(a => a.rootCause?.name?.toLowerCase().includes('staff') || a.title?.toLowerCase().includes('staff') || a.title?.toLowerCase().includes('fte') || a.title?.toLowerCase().includes('break') || a.title?.toLowerCase().includes('swing')).length },
                { id: 'work', label: 'Work Content', count: alerts.filter(a => a.title?.toLowerCase().includes('ups') || a.title?.toLowerCase().includes('fedex') || a.title?.toLowerCase().includes('queue') || a.title?.toLowerCase().includes('velocity')).length },
                { id: 'zones', label: 'Zones', count: alerts.filter(a => a.title?.toLowerCase().includes('zone') || a.title?.toLowerCase().includes('capacity') || a.title?.toLowerCase().includes('z0')).length },
                { id: 'equipment', label: 'Equipment', count: alerts.filter(a => a.category === 'equipment' || a.title?.toLowerCase().includes('pm') || a.title?.toLowerCase().includes('fl-') || a.title?.toLowerCase().includes('epj-') || a.title?.toLowerCase().includes('battery')).length },
                { id: 'schedules', label: 'Schedules', count: alerts.filter(a => a.title?.toLowerCase().includes('shift') || a.title?.toLowerCase().includes('cutoff') || a.title?.toLowerCase().includes('handoff')).length }
              ].map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => { setInsightsSubTab(tab.id); setSelectedAlert(null); }}
                  style={{
                    padding: `${sp.sm} ${sp.md}`,
                    fontSize: '13px',
                    fontWeight: 500,
                    color: insightsSubTab === tab.id ? C.neutral[900] : C.neutral[500],
                    borderBottom: insightsSubTab === tab.id ? `2px solid ${C.neutral[900]}` : '2px solid transparent',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: sp.xs
                  }}
                  onMouseEnter={(e) => { if (insightsSubTab !== tab.id) e.currentTarget.style.color = C.neutral[700]; }}
                  onMouseLeave={(e) => { if (insightsSubTab !== tab.id) e.currentTarget.style.color = C.neutral[500]; }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 10,
                      background: insightsSubTab === tab.id ? C.neutral[900] : C.neutral[200],
                      color: insightsSubTab === tab.id ? 'white' : C.neutral[600]
                    }}>
                      {tab.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Alert Detail View - shown when an alert is selected */}
            {selectedAlert ? (
              <Card>
                {/* Back navigation */}
                <div 
                  onClick={() => setSelectedAlert(null)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: sp.xs, 
                    cursor: 'pointer', 
                    marginBottom: sp.lg,
                    color: C.brand[600],
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                >
                  <ChevronLeft style={{ width: 16, height: 16 }} />
                  Back to {insightsSubTab === 'overall' ? 'All Alerts' : `${({ staffing: 'Staffing', work: 'Work Content', zones: 'Zones', equipment: 'Equipment', schedules: 'Schedules' })[insightsSubTab]} Alerts`}
                </div>
                
                {/* Alert Header */}
                {(() => {
                  const cfg = { 
                    critical: [C.error[50], C.error[100], C.error[700], AlertOctagon], 
                    warning: [C.warning[50], C.warning[100], C.warning[700], AlertTriangle], 
                    info: [C.brand[100], C.brand[100], C.brand[600], Info] 
                  };
                  const [bg, bdr, txt, Icon] = cfg[selectedAlert.sev] || cfg.info;
                  return (
                    <div style={{ 
                      background: bg, 
                      borderTop: `1px solid ${bdr}`,
                      borderRight: `1px solid ${bdr}`,
                      borderBottom: `1px solid ${bdr}`,
                      borderLeft: `4px solid ${txt}`,
                      borderRadius: '0 6px 6px 0', 
                      padding: `${sp.sm} ${sp.md}`,
                      marginBottom: sp.md 
                    }}>
                      <div style={{ display: 'flex', gap: sp.sm, alignItems: 'flex-start' }}>
                        <Icon style={{ width: 14, height: 14, color: txt, flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: txt }}>{selectedAlert.title}</span>
                            <span style={{ fontSize: '11px', color: txt, opacity: 0.8, marginLeft: sp.sm, flexShrink: 0 }}>{selectedAlert.sev} • {selectedAlert.time} • {selectedAlert.conf}% conf</span>
                          </div>
                          <p style={{ fontSize: '11px', color: txt, marginTop: '2px', opacity: 0.9 }}>{selectedAlert.msg}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Root Cause Context Link */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: sp.sm, 
                    background: C.purple[50], 
                    borderRadius: 6, 
                    marginBottom: sp.md,
                    border: `1px solid ${C.purple[200]}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedAlert(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
                    <span style={{ fontSize: '13px', color: C.purple[700] }}>
                      Part of: <strong>{selectedAlert.rootCause?.name || 'Unknown Root Cause'}</strong>
                    </span>
                    <Badge status={selectedAlert.rootCause?.alertCount > 2 ? 'error' : 'warning'} label={`${selectedAlert.rootCause?.alertCount || 1} alert${selectedAlert.rootCause?.alertCount > 1 ? 's' : ''} share this root cause`} />
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: C.purple[500] }} />
                </div>
                
                {/* What's Happening */}
                <Accordion title="What's Happening" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    {selectedAlert.whatsHappening || 'Details not available.'}
                  </p>
                  <AlertVisualization alertId={selectedAlert.id} type="whatsHappening" />
                </Accordion>
                
                {/* Why It Matters */}
                <Accordion title="Why It Matters" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    {selectedAlert.whyItMatters || 'Impact details not available.'}
                  </p>
                  <AlertVisualization alertId={selectedAlert.id} type="whyItMatters" />
                </Accordion>
                
                {/* Recommended Actions */}
                <Accordion title={`Recommended Actions (${selectedAlert.actions?.length || 0})`} defaultOpen={true}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                    {(selectedAlert.actions || []).map((item, i) => (
                      <div key={i} style={{ 
                        padding: sp.sm, 
                        background: 'white', 
                        borderRadius: 6, 
                        border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`,
                        borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                          <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                          <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                          <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                          {item.conflict && (
                            <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with another root cause
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>
                
                {/* Trade-offs */}
                <Accordion title="Trade-offs" defaultOpen={true}>
                  <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                    <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                      <strong>If recommended actions are applied:</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs, marginBottom: sp.md }}>
                      {(selectedAlert.actions || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                          <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500], flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: '12px', color: C.neutral[600] }}>{item.tradeoff}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Root Cause Scope Warning */}
                    {selectedAlert.rootCause?.alertCount > 1 && (
                      <div style={{ background: C.purple[50], borderRadius: 6, padding: sp.sm, border: `1px solid ${C.purple[200]}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                          <Lightbulb style={{ width: 14, height: 14, color: C.purple[600], flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <p style={{ fontSize: '12px', color: C.purple[700], lineHeight: 1.5 }}>
                              This alert shares a root cause with <strong>{selectedAlert.rootCause.alertCount - 1} other alert{selectedAlert.rootCause.alertCount > 2 ? 's' : ''}</strong>. 
                              Fixing this alert individually may leave related issues unresolved.
                            </p>
                            <button 
                              onClick={() => setSelectedAlert(null)}
                              style={{ 
                                marginTop: sp.xs, 
                                fontSize: '12px', 
                                fontWeight: 500, 
                                color: C.purple[600], 
                                background: 'none', 
                                border: 'none', 
                                padding: 0, 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              View Root Cause: {selectedAlert.rootCause.name} <ChevronRight style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Accordion>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.lg, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario Mode
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Users style={{ width: 14, height: 14 }} /> Delegate to Shift Lead
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify Staff
                  </button>
                </div>
              </Card>
            ) : (
            <>
            {/* All Alerts */}
            {(() => {
              // Filter alerts based on selected sub-tab
              const filterAlert = (a) => {
                if (insightsSubTab === 'overall') return true;
                if (insightsSubTab === 'staffing') {
                  return a.rootCause?.name?.toLowerCase().includes('staff') || 
                         a.title?.toLowerCase().includes('staff') || 
                         a.title?.toLowerCase().includes('fte') || 
                         a.title?.toLowerCase().includes('break') ||
                         a.title?.toLowerCase().includes('understaffed') ||
                         a.title?.toLowerCase().includes('swing');
                }
                if (insightsSubTab === 'work') {
                  return a.title?.toLowerCase().includes('ups') || 
                         a.title?.toLowerCase().includes('fedex') || 
                         a.title?.toLowerCase().includes('queue') ||
                         a.title?.toLowerCase().includes('velocity') ||
                         a.title?.toLowerCase().includes('carryover');
                }
                if (insightsSubTab === 'zones') {
                  return a.title?.toLowerCase().includes('zone') || 
                         a.title?.toLowerCase().includes('capacity') || 
                         a.title?.toLowerCase().includes('z0');
                }
                if (insightsSubTab === 'equipment') {
                  return a.category === 'equipment' ||
                         a.title?.toLowerCase().includes('pm ') || 
                         a.title?.toLowerCase().includes('fl-') ||
                         a.title?.toLowerCase().includes('epj-') ||
                         a.title?.toLowerCase().includes('rt-') ||
                         a.title?.toLowerCase().includes('tt-') ||
                         a.title?.toLowerCase().includes('battery') ||
                         a.title?.toLowerCase().includes('offline') ||
                         a.title?.toLowerCase().includes('repair');
                }
                if (insightsSubTab === 'schedules') {
                  return a.title?.toLowerCase().includes('shift') || 
                         a.title?.toLowerCase().includes('cutoff') ||
                         a.title?.toLowerCase().includes('handoff') ||
                         a.title?.toLowerCase().includes('break');
                }
                return true;
              };
              
              const filteredAlerts = alerts.filter(filterAlert);
              const subTabLabels = { overall: 'All', staffing: 'Staffing', work: 'Work Content', zones: 'Zones', equipment: 'Equipment', schedules: 'Schedules' };
              
              return (
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500 }}>
                      {insightsSubTab === 'overall' ? 'All Alerts' : `${subTabLabels[insightsSubTab]} Alerts`}
                    </h3>
                    <SeverityPills alerts={filteredAlerts} />
                  </div>
                  {filteredAlerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                      {filteredAlerts.map((a, i) => (
                        <Alert 
                          key={i} 
                          {...a} 
                          id={`insight-${a.id}`}
                          isHighlighted={highlightedAlert === a.id}
                          onClick={() => setSelectedAlert(a)} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: sp.lg, textAlign: 'center', color: C.neutral[500] }}>
                      <p style={{ fontSize: '13px' }}>No {subTabLabels[insightsSubTab].toLowerCase()} alerts at this time</p>
                    </div>
                  )}
                </Card>
              );
            })()}
            
            {/* Root Causes Section */}
            <Card id="root-cause-analysis">
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.lg }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb style={{ width: 18, height: 18, color: C.purple[600] }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Root Cause Analysis</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>2 root causes identified from 4 alerts</p>
                </div>
              </div>
              
              {/* Root Cause 1: Staffing-Capacity Mismatch */}
              <div style={{ background: C.neutral[50], borderRadius: 8, padding: sp.md, marginBottom: sp.md, border: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.error[500] }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Staffing-Capacity Mismatch</span>
                  </div>
                  <Badge status="error" label="Affects 3 alerts" />
                </div>
                
                <Accordion title="What's Happening" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Insufficient staffing in high-velocity zones (Z03 Picking, Z04 Storage) is creating capacity pressure. 
                    Z04 is at 83% and projected to hit 91% by 12:00. Meanwhile, picking velocity has dropped to 520/hr 
                    (target: 600/hr) due to 4 FTE gap in Day Shift.
                  </p>
                  <AlertVisualization alertId="alert-1" type="whatsHappening" />
                </Accordion>
                
                <Accordion title="Why It Matters" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    If unaddressed, this cascade will cause ~40 UPS orders to miss the 15:30 cutoff, resulting in 
                    <strong> $4,800 in SLA penalties</strong> and <strong>customer impact to 12 accounts</strong>. 
                    Z04 capacity breach will also block inbound receiving, creating upstream delays.
                  </p>
                  <AlertVisualization alertId="alert-2" type="whyItMatters" />
                </Accordion>
                
                <Accordion title="Recommended Actions (3)" defaultOpen={true}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                    {[
                      { action: 'Reassign 2 FTEs from Z02 Putaway → Z03 Picking', impact: '+18% pick velocity', tradeoff: 'Z02 putaway slows ~12%', confidence: 89, owner: 'Shift Lead' },
                      { action: 'Authorize 4 hrs OT for Pack team (2 FTEs)', impact: '+200 orders/hr capacity', tradeoff: '+$180 labor cost', confidence: 94, conflict: true, owner: 'Ops Manager' },
                      { action: 'Prioritize UPS orders in pick queue', impact: 'UPS on-time ↑15%', tradeoff: 'FedEx orders may slip 8%', confidence: 78, owner: 'System' }
                    ].map((item, i) => (
                      <div key={i} style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`, borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                          <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                          <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                          <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                          {item.conflict && (
                            <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with Root Cause 2
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>
                
                <Accordion title="Trade-offs Summary" defaultOpen={false}>
                  <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                    <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                      <strong>If all actions are applied:</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowUpRight style={{ width: 14, height: 14, color: C.success[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Pick velocity increases ~18%, UPS on-time improves 15%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Z02 putaway slows 12%, FedEx orders may slip 8%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <DollarSign style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>+$180 labor cost from OT authorization</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], marginTop: sp.sm, fontStyle: 'italic' }}>
                      Net impact: Protects $4,800 in SLA penalties at cost of $180 + temporary slowdowns
                    </p>
                  </div>
                </Accordion>
                
                {/* Root Cause 1 Action Buttons */}
                <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Users style={{ width: 14, height: 14 }} /> Delegate
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify
                  </button>
                </div>
              </div>
              
              {/* Root Cause 2: Labor Cost Overrun */}
              <div style={{ background: C.neutral[50], borderRadius: 8, padding: sp.md, marginBottom: sp.md, border: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.warning[500] }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Labor Cost Overrun</span>
                  </div>
                  <Badge status="warning" label="Affects 1 alert" />
                </div>
                
                <Accordion title="What's Happening" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Current labor spend is tracking 5.6% over budget ($6,420 actual vs $6,080 planned at this hour). 
                    OT hours are at 24 (target: 18 by this point) and temp labor is at 4 FTEs. 
                    Projected EOD spend is $13,100 vs $12,400 budget.
                  </p>
                  <AlertVisualization alertId="alert-4" type="whatsHappening" />
                </Accordion>
                
                <Accordion title="Why It Matters" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Continued trajectory will result in <strong>$700 budget overrun</strong> for the day. 
                    If pattern continues through week, monthly impact could reach <strong>$15,000+</strong>. 
                    Finance has flagged labor efficiency as a Q4 focus area.
                  </p>
                  <AlertVisualization alertId="alert-4" type="whyItMatters" />
                </Accordion>
                
                <Accordion title="Recommended Actions (2)" defaultOpen={true}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                    {[
                      { action: 'Reduce temp labor by 1 FTE after 12:00', impact: '-$95 labor cost', tradeoff: 'Slightly slower pack rate', confidence: 82, owner: 'Shift Lead' },
                      { action: 'Cap OT at 40 hrs total for shift', impact: 'Stay within budget', tradeoff: 'May need to deprioritize non-critical work', confidence: 91, conflict: true, owner: 'Ops Manager' }
                    ].map((item, i) => (
                      <div key={i} style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`, borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                          <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                          <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                          <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                          {item.conflict && (
                            <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with Root Cause 1
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>
                
                <Accordion title="Trade-offs Summary" defaultOpen={false}>
                  <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                    <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                      <strong>If all actions are applied:</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowUpRight style={{ width: 14, height: 14, color: C.success[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Labor cost reduced by ~$95, stays within budget ceiling</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Pack rate may slow, some non-critical work deprioritized</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], marginTop: sp.sm, fontStyle: 'italic' }}>
                      Net impact: Maintains budget compliance but may impact throughput capacity
                    </p>
                  </div>
                </Accordion>
                
                {/* Root Cause 2 Action Buttons */}
                <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Users style={{ width: 14, height: 14 }} /> Delegate
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify
                  </button>
                </div>
              </div>
              
              {/* Conflict Warning */}
              <div style={{ background: C.warning[50], border: `1px solid ${C.warning[200]}`, borderRadius: 8, padding: sp.md, marginBottom: sp.md, display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                <AlertTriangle style={{ width: 20, height: 20, color: C.warning[600], flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.warning[700], marginBottom: sp.xs }}>Conflict Detected Between Root Causes</p>
                  <p style={{ fontSize: '13px', color: C.warning[700], lineHeight: 1.5 }}>
                    "Authorize 4 hrs OT" (Root Cause 1) directly worsens "Labor Cost Overrun" (Root Cause 2). 
                    Consider prioritizing FTE reassignment before authorizing overtime, or accept the cost trade-off to protect SLAs.
                  </p>
                </div>
              </div>
              
              {/* Bulk Actions - Apply All */}
              <div style={{ background: C.purple[50], border: `1px solid ${C.purple[200]}`, borderRadius: 8, padding: sp.md }}>
                <div style={{ marginBottom: sp.sm }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.purple[700] }}>Bulk Actions</p>
                  <p style={{ fontSize: '12px', color: C.purple[600] }}>Apply all recommended solutions across both root causes (accepts all trade-offs and conflicts)</p>
                </div>
                <div style={{ display: 'flex', gap: sp.sm }}>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Zap style={{ width: 16, height: 16 }} /> Explore All in Scenario Mode
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: C.brand[600], background: 'white', border: `1px solid ${C.brand[300]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Users style={{ width: 16, height: 16 }} /> Delegate All to Shift Lead
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: C.success[700], background: C.success[100], border: `1px solid ${C.success[300]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <CheckCircle style={{ width: 16, height: 16 }} /> Apply All Now & Notify Staff
                  </button>
                </div>
              </div>
            </Card>
            </>
            )}
          </div>
        )}
        
        {/* Placeholder for other facility-level tabs */}
        {isAtFacilityLevel && !['dashboard', 'zones', 'staff', 'work', 'schedule', 'equipment', 'insights'].includes(activeTab) && (
          <div style={{ padding: sp.xl, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: sp.md }}>
              {React.createElement(facilityTabs.find(t => t.id === activeTab)?.icon || LayoutDashboard, { style: { width: 24, height: 24, color: C.neutral[400] } })}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[600], marginBottom: sp.sm }}>{facilityTabs.find(t => t.id === activeTab)?.label} Overview</h3>
            <p style={{ fontSize: '13px', color: C.neutral[400] }}>Facility-level {facilityTabs.find(t => t.id === activeTab)?.label.toLowerCase()} content will appear here</p>
          </div>
        )}
        
        {/* ===== ENTITY DETAIL VIEWS ===== */}
        
        {/* Equipment Detail View */}
        {currentView.type === 'equipment' && (
          <EquipmentDetailContent 
            equipmentId={currentView.id}
            activeTab={detailSubTab}
            onNavigateToStaff={(staffId, staffName) => navigateTo('staff', staffId, staffName)}
            onNavigateToZone={(zoneId, zoneName) => navigateTo('zone', zoneId, zoneName)}
            onNavigateToEquipment={(equipId, equipName) => navigateTo('equipment', equipId, equipName)}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
          />
        )}
        
        {/* Staff Detail View */}
        {currentView.type === 'staff' && (
          <StaffDetailContent 
            staffId={currentView.id}
            activeTab={detailSubTab}
            onNavigateToStaff={(staffId, staffName) => navigateTo('staff', staffId, staffName)}
            onNavigateToZone={(zoneId, zoneName) => navigateTo('zone', zoneId, zoneName)}
            onNavigateToEquipment={(equipId, equipName) => navigateTo('equipment', equipId, equipName)}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
          />
        )}
        
        {/* Zone Detail View */}
        {currentView.type === 'zone' && (
          <ZoneDetailContent
            zoneId={currentView.id}
            activeTab={detailSubTab}
            onNavigateToStaff={(staffId, staffName) => navigateTo('staff', staffId, staffName)}
            onNavigateToZone={(zoneId, zoneName) => navigateTo('zone', zoneId, zoneName)}
            onNavigateToEquipment={(equipId, equipName) => navigateTo('equipment', equipId, equipName)}
            onNavigateToAlert={(alertId, category, showDetail) => navigateToAlert(alertId, category, showDetail)}
          />
        )}
      </div>
    </>
  );
};

// ===== PLANS TAB CONTENT =====
// Plan Execution view with list/detail pattern, Kanban, activity feed, and shift handoff

export default Executive;
