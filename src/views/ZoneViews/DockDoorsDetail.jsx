import React, { useState, createContext, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Users, MapPin, ClipboardList, Calendar, DollarSign, ChevronRight, ChevronLeft, ChevronDown, Clock, Package, Truck, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight, Zap, Sun, Moon, Star, UserCheck, UserX, UserPlus, Wrench, CheckCircle, Info, AlertOctagon, LayoutDashboard, Radio, TrendingUp, TrendingDown, Search, Filter, X, RotateCcw, GripVertical, Grid3X3, BoxSelect, Lightbulb, Coffee, MoreVertical, MoreHorizontal, Eye, RefreshCw, MapPinIcon, Settings, Trash2, Navigation, Route, Activity, Minus, Fuel, Play, Circle, Plus } from 'lucide-react';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import components
import { Card, Badge, Progress, Alert, Header } from '../../components/UI';
import TimeScrubber from '../../components/TimeScrubber';

// ===== DOCK DOORS DETAIL (drill-down from Inbound Zone) =====
const DockDoorsDetail = ({ zoneId, locationId = 'D01', initialTab = 'dashboard', onBack, onBackToZones, onBackToExec }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  const [activeTab, setActiveTab] = useState(initialTab);

  const zoneName = zoneId === 'Z01' ? 'Inbound A' : 'Inbound B';
  const dockDoors = zoneId === 'Z01' ? ['D01', 'D02', 'D03', 'D04'] : ['D05', 'D06', 'D07', 'D08'];

  // Tab definitions
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'locations', icon: MapPin, label: 'Locations' },
    { id: 'work', icon: Package, label: 'Work Content' },
    { id: 'spaceUtil', icon: BoxSelect, label: 'Space Utilization' },
    { id: 'equipment', icon: Wrench, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Filter, label: 'Config' }
  ];

  // Get data for the selected location
  const locationData = {
    D01: { status: 'occupied', trailer: 'TRL-1000', carrier: 'FedEx Ground', arrived: '08:15', pallets: 18, unloaded: 15, progress: 83, utilization: 85, sqft: 600, capacity: 20 },
    D02: { status: 'occupied', trailer: 'TRL-1001', carrier: 'UPS Freight', arrived: '09:02', pallets: 24, unloaded: 10, progress: 42, utilization: 92, sqft: 600, capacity: 20 },
    D03: { status: 'occupied', trailer: 'TRL-1002', carrier: 'ABC Freight', arrived: '09:45', pallets: 32, unloaded: 5, progress: 16, utilization: 45, sqft: 600, capacity: 20 },
    D04: { status: 'available', trailer: null, carrier: null, arrived: null, pallets: 0, unloaded: 0, progress: 0, utilization: 0, sqft: 600, capacity: 20 }
  };
  const loc = locationData[locationId] || locationData.D01;

  // Summary metrics with timelines
  const summaryMetrics = {
    occupied: { cur: 3, pred: 4 },
    avgDwell: { cur: 52, pred: 65 },
    throughput: { cur: 74, pred: 120 },
    onTime: { cur: 85, pred: 78 }
  };

  const metricsTimelines = {
    occupied: [
      { time: '06:00', actual: 1 }, { time: '08:00', actual: 2 }, { time: '10:00', actual: 3 },
      { time: '12:00', predicted: 4 }, { time: '14:00', predicted: 4 }
    ],
    avgDwell: [
      { time: '06:00', actual: 35 }, { time: '08:00', actual: 42 }, { time: '10:00', actual: 52 },
      { time: '12:00', predicted: 58 }, { time: '14:00', predicted: 65 }
    ],
    throughput: [
      { time: '06:00', actual: 0 }, { time: '08:00', actual: 32 }, { time: '10:00', actual: 74 },
      { time: '12:00', predicted: 98 }, { time: '14:00', predicted: 120 }
    ],
    onTime: [
      { time: '06:00', actual: 100 }, { time: '08:00', actual: 92 }, { time: '10:00', actual: 85 },
      { time: '12:00', predicted: 80 }, { time: '14:00', predicted: 78 }
    ]
  };

  // Detailed dock door data
  const dockData = [
    { door: 'D01', status: 'occupied', trailer: 'TRL-1000', carrier: 'FedEx Ground', type: 'Inbound', arrived: '08:15', pallets: 18, unloaded: 15, progress: 83, eta: '10:30', dwellTime: 105, onTime: true },
    { door: 'D02', status: 'occupied', trailer: 'TRL-1001', carrier: 'UPS Freight', type: 'Inbound', arrived: '09:02', pallets: 24, unloaded: 10, progress: 42, eta: '11:15', dwellTime: 58, onTime: true },
    { door: 'D03', status: 'occupied', trailer: 'TRL-1002', carrier: 'ABC Freight', type: 'Inbound', arrived: '09:45', pallets: 32, unloaded: 5, progress: 16, eta: '12:00', dwellTime: 15, onTime: false },
    { door: 'D04', status: 'available', trailer: null, carrier: null, type: null, arrived: null, pallets: 0, unloaded: 0, progress: 0, eta: null, dwellTime: 0, onTime: null }
  ];

  // Timeline for dock utilization
  const dockUtilTimeline = [
    { time: '06:00', actual: 25, predicted: null },
    { time: '07:00', actual: 50, predicted: null },
    { time: '08:00', actual: 50, predicted: null },
    { time: '09:00', actual: 75, predicted: null },
    { time: '10:00', actual: 75, predicted: 75, now: true },
    { time: '11:00', actual: null, predicted: 100, upper: 100, lower: 75 },
    { time: '12:00', actual: null, predicted: 100, upper: 100, lower: 75 },
    { time: '13:00', actual: null, predicted: 75, upper: 100, lower: 50 },
    { time: '14:00', actual: null, predicted: 100, upper: 100, lower: 75 }
  ];

  // Upcoming arrivals
  const upcomingArrivals = [
    { trailer: 'TRL-1003', carrier: 'XPO Logistics', eta: '10:45', pallets: 28, door: 'D04' },
    { trailer: 'TRL-1004', carrier: 'FedEx Freight', eta: '11:30', pallets: 22, door: 'TBD' },
    { trailer: 'TRL-1005', carrier: 'SAIA', eta: '13:00', pallets: 36, door: 'TBD' }
  ];

  // Alerts
  const alerts = [
    { sev: 'warning', title: 'TRL-1002 running long', msg: 'ABC Freight trailer at D03 predicted to complete at 12:00 (45min over target)', time: '+2hr', conf: 72 },
    { sev: 'info', title: 'D04 assignment pending', msg: 'TRL-1003 (XPO) arriving 10:45, auto-assigned to D04', time: '+45min', conf: 95 }
  ];

  const columns = [
    { key: 'door', label: 'Door' },
    { key: 'status', label: 'Status', render: v => <Badge status={v === 'occupied' ? 'info' : 'success'} label={v} /> },
    { key: 'trailer', label: 'Trailer', render: v => v || '—' },
    { key: 'carrier', label: 'Carrier', render: v => v || '—' },
    { key: 'progress', label: 'Progress', align: 'right', render: (v, row) => row.status === 'occupied' ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
        <div style={{ width: 60 }}><Progress value={v} color={v > 70 ? C.success[500] : C.brand[500]} h={6} /></div>
        <span style={{ fontSize: '12px' }}>{v}%</span>
      </div>
    ) : '—' },
    { key: 'pallets', label: 'Pallets', align: 'right', render: (v, row) => row.status === 'occupied' ? `${row.unloaded}/${v}` : '—' },
    { key: 'eta', label: 'ETA Complete', render: v => v ? <span style={{ color: C.purple[600], fontWeight: 500 }}>{v}</span> : '—' },
    { key: 'onTime', label: 'On-Time', render: v => v === null ? '—' : v ? <Badge status="success" label="Yes" /> : <Badge status="warning" label="At risk" /> }
  ];

  const filters = [
    { key: 'status', label: 'Status', options: ['occupied', 'available'] }
  ];

  return (
    <div style={{ display: 'flex', background: 'white', margin: `-${sp.lg}`, minHeight: '100vh' }}>
      {/* Tab sidebar - LEFT SIDE */}
      <div style={{ width: 52, background: C.neutral[100], borderRight: `1px solid ${C.neutral[200]}`, display: 'flex', flexDirection: 'column', paddingTop: sp.md, flexShrink: 0 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              style={{
                width: 40,
                height: 40,
                margin: '0 auto',
                marginBottom: 4,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: isActive ? C.brand[100] : 'transparent',
                border: isActive ? `2px solid ${C.brand[500]}` : '2px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              <Icon style={{ width: 18, height: 18, color: isActive ? C.brand[600] : C.neutral[500] }} />
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: sp.lg, padding: sp.lg, overflow: 'auto', maxWidth: 708 }}>
        {/* Time Scrubber */}
        <TimeScrubber />

        {/* Breadcrumb - journey trail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, fontSize: '12px' }}>
          <span style={{ color: C.brand[600], cursor: 'pointer' }} onClick={onBackToExec}>🏠 {'{facilityName}'} Overview</span>
          <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
          <span style={{ color: C.brand[600], cursor: 'pointer' }} onClick={onBack}>{zoneId} {zoneName}</span>
          <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
          <span style={{ color: C.neutral[700], fontWeight: 500 }}>{locationId}</span>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${C.blueLight[500]} 0%, ${C.brand[600]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
                    <MapPin style={{ width: 28, height: 28 }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>{locationId}</h2>
                      <Badge status={loc.status === 'occupied' ? 'info' : 'neutral'} label={loc.status} />
                    </div>
                    <p style={{ opacity: 0.8, fontSize: '14px', marginTop: 4 }}>Dock Door • {zoneId} {zoneName}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ opacity: 0.7, fontSize: '12px' }}>Space Utilization</p>
                  <span style={{ fontSize: '42px', fontWeight: 300 }}>{loc.utilization}%</span>
                </div>
              </div>

              {/* KPI Grid */}
              {loc.status === 'occupied' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: sp.sm }}>
                    <p style={{ fontSize: '11px', opacity: 0.7 }}>Trailer</p>
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>{loc.trailer}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: sp.sm }}>
                    <p style={{ fontSize: '11px', opacity: 0.7 }}>Carrier</p>
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>{loc.carrier}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: sp.sm }}>
                    <p style={{ fontSize: '11px', opacity: 0.7 }}>Progress</p>
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>{loc.progress}%</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: sp.sm }}>
                    <p style={{ fontSize: '11px', opacity: 0.7 }}>Pallets</p>
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>{loc.unloaded}/{loc.pallets}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Alerts */}
            <Card style={{ borderLeft: `4px solid ${C.warning[500]}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
                <Zap style={{ width: 16, height: 16, color: C.warning[600] }} />
                <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Location Alerts</h3>
              </div>
              <Alert sev="warning" title="Extended dwell time" msg={`${locationId} has been occupied for 105 minutes (target: 90 min)`} time="Now" conf={95} />
            </Card>
          </>
        )}

        {/* Space Utilization Tab */}
        {activeTab === 'spaceUtil' && (
          <>
            <Header icon={BoxSelect} title={`${locationId} Space Utilization`} sub={`Capacity and utilization for this dock door`} color={C.greenLight[500]} />

            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Current Utilization</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Space consumption at this dock door</p>
                </div>
                <Badge status={loc.utilization >= 90 ? 'warning' : 'success'} label={loc.utilization >= 90 ? 'Near Capacity' : 'Healthy'} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xl, marginBottom: sp.md }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '48px', fontWeight: 300, color: loc.utilization >= 90 ? C.warning[600] : C.success[600] }}>{loc.utilization}%</p>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Current</p>
                </div>
                <div style={{ flex: 1 }}>
                  <Progress value={loc.utilization} max={100} color={loc.utilization >= 90 ? C.warning[500] : C.greenLight[500]} h={12} />
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.md }}>Location Dimensions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{loc.sqft}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Sq Ft</p>
                </div>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{loc.capacity}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Pallet Capacity</p>
                </div>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{loc.status === 'occupied' ? loc.unloaded : 0}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Pallets Staged</p>
                </div>
              </div>
            </Card>

            {loc.status === 'occupied' && (
              <Card>
                <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.md }}>Active Trailer</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: C.brand[50], borderRadius: 8 }}>
                  <Truck style={{ width: 24, height: 24, color: C.brand[600] }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{loc.trailer}</p>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>{loc.carrier} • Arrived {loc.arrived}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '16px', fontWeight: 500 }}>{loc.progress}%</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>unloaded</p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Placeholder for other tabs */}
        {!['dashboard', 'spaceUtil'].includes(activeTab) && (
          <div style={{ padding: sp.xl, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: sp.md }}>
              {React.createElement(tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard, { style: { width: 24, height: 24, color: C.neutral[400] } })}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[600], marginBottom: sp.sm }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p style={{ fontSize: '13px', color: C.neutral[400] }}>{locationId} {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} content will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DockDoorsDetail;
