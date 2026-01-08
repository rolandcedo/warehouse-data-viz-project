import React, { useState, createContext, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Users, MapPin, ClipboardList, Calendar, DollarSign, ChevronRight, ChevronLeft, ChevronDown, Clock, Package, Truck, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight, Zap, Sun, Moon, Star, UserCheck, UserX, UserPlus, Wrench, CheckCircle, Info, AlertOctagon, LayoutDashboard, Radio, TrendingUp, TrendingDown, Search, Filter, X, RotateCcw, GripVertical, Grid3X3, BoxSelect, Lightbulb, Coffee, MoreVertical, MoreHorizontal, Eye, RefreshCw, MapPinIcon, Settings, Trash2, Navigation, Route, Activity, Minus, Fuel, Play, Circle, Plus } from 'lucide-react';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import UI components
import { Card, Badge, Alert, Progress, DonutChart, Header, DataGrid } from '../../components/UI';
import TimeScrubber from '../../components/TimeScrubber';
import { PredictiveTimeline } from '../../components/Charts';

// ===== INBOUND ZONE DETAIL =====
const InboundZoneDetail = ({ zoneId, onBack, onBackToExec, onDockDetail }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Zone Overview Metrics
  const zoneMetrics = {
    spaceUtil: { cur: 68, pred: 74, target: 80 },
    throughput: { cur: 142, pred: 168, target: 180 },
    dwellTime: { cur: 38, pred: 42, target: 45 },
    accuracy: { cur: 98.2, pred: 97.8, target: 99 }
  };

  // KPI Timelines for header cards
  const kpiTimelines = {
    palletsHr: [
      { time: '06:00', actual: 0 }, { time: '08:00', actual: 78 }, { time: '10:00', actual: 142 },
      { time: '12:00', predicted: 165 }, { time: '14:00', predicted: 168 }
    ],
    dwellTime: [
      { time: '06:00', actual: 32 }, { time: '08:00', actual: 35 }, { time: '10:00', actual: 38 },
      { time: '12:00', predicted: 44 }, { time: '14:00', predicted: 42 }
    ],
    accuracy: [
      { time: '06:00', actual: 99.1 }, { time: '08:00', actual: 98.8 }, { time: '10:00', actual: 98.2 },
      { time: '12:00', predicted: 97.9 }, { time: '14:00', predicted: 97.8 }
    ],
    stagedPallets: [
      { time: '06:00', actual: 22 }, { time: '08:00', actual: 35 }, { time: '10:00', actual: 47 },
      { time: '12:00', predicted: 58 }, { time: '14:00', predicted: 62 }
    ],
    dockUtil: [
      { time: '06:00', actual: 50 }, { time: '08:00', actual: 75 }, { time: '10:00', actual: 75 },
      { time: '12:00', predicted: 100 }, { time: '14:00', predicted: 85 }
    ]
  };

  // Staffing Data
  const staff = [
    { role: 'Dock Workers', icon: Users, scheduled: 4, present: 4, productivity: 94 },
    { role: 'Forklift Operators', icon: Truck, scheduled: 3, present: 3, productivity: 102 },
    { role: 'Receiving Clerks', icon: ClipboardList, scheduled: 2, present: 2, productivity: 98 },
    { role: 'QC Inspectors', icon: CheckCircle, scheduled: 1, present: 1, productivity: 100 }
  ];

  // Equipment Status
  const equipment = [
    { type: 'Sit-Down Forklift', total: 3, active: 2, maint: 0, idle: 1, utilPred: 85 },
    { type: 'Electric Pallet Jack', total: 4, active: 3, maint: 1, idle: 0, utilPred: 92 },
    { type: 'Manual Pallet Jack', total: 6, active: 4, maint: 0, idle: 2, utilPred: 78 },
    { type: 'RF Scanner', total: 10, active: 8, maint: 0, idle: 2, utilPred: 88 },
    { type: 'Dock Leveler', total: 4, active: 3, maint: 0, idle: 1, utilPred: 82 }
  ];

  // Dock Door Status (Trailers)
  const dockStatus = dockDoors.map((door, i) => ({
    door,
    status: i < 3 ? 'occupied' : 'available',
    trailer: i < 3 ? `TRL-${1000 + i}` : null,
    carrier: i < 3 ? ['FedEx', 'UPS', 'ABC Freight'][i] : null,
    arrived: i < 3 ? ['08:15', '09:02', '09:45'][i] : null,
    progress: i < 3 ? [85, 42, 15][i] : 0,
    pallets: i < 3 ? [18, 24, 32][i] : 0,
    unloaded: i < 3 ? [15, 10, 5][i] : 0,
    eta: i < 3 ? ['10:30', '11:15', '12:00'][i] : null
  }));

  // Staged Pallets (Entities in zone)
  const stagedPallets = {
    current: 47,
    predicted: 62,
    capacity: 80,
    byStatus: [
      { status: 'Awaiting Putaway', count: 28, color: C.warning[500] },
      { status: 'QC Hold', count: 8, color: C.error[500] },
      { status: 'Ready for Putaway', count: 11, color: C.success[500] }
    ]
  };

  // ASN/PO Tracking
  const asnData = [
    { asn: 'ASN-4521', po: 'PO-8834', vendor: 'Acme Corp', lines: 12, received: 10, variance: 0, status: 'in-progress' },
    { asn: 'ASN-4522', po: 'PO-8835', vendor: 'Global Supply', lines: 8, received: 8, variance: 0, status: 'complete' },
    { asn: 'ASN-4523', po: 'PO-8836', vendor: 'FastShip Inc', lines: 24, received: 5, variance: 1, status: 'in-progress' },
    { asn: 'ASN-4524', po: 'PO-8837', vendor: 'Prime Dist', lines: 6, received: 0, variance: 0, status: 'pending' }
  ];

  // Predictive Timelines
  const throughputTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '07:00', actual: 35, predicted: null },
    { time: '08:00', actual: 78, predicted: null },
    { time: '09:00', actual: 112, predicted: null },
    { time: '10:00', actual: 142, predicted: 142, now: true },
    { time: '11:00', actual: null, predicted: 168, upper: 180, lower: 156 },
    { time: '12:00', actual: null, predicted: 195, upper: 210, lower: 180 },
    { time: '13:00', actual: null, predicted: 218, upper: 235, lower: 200 },
    { time: '14:00', actual: null, predicted: 238, upper: 260, lower: 216 }
  ];

  const spaceTimeline = [
    { time: '06:00', actual: 45, predicted: null },
    { time: '07:00', actual: 52, predicted: null },
    { time: '08:00', actual: 58, predicted: null },
    { time: '09:00', actual: 64, predicted: null },
    { time: '10:00', actual: 68, predicted: 68, now: true },
    { time: '11:00', actual: null, predicted: 72, upper: 76, lower: 68 },
    { time: '12:00', actual: null, predicted: 74, upper: 79, lower: 69 },
    { time: '13:00', actual: null, predicted: 71, upper: 77, lower: 65 },
    { time: '14:00', actual: null, predicted: 65, upper: 72, lower: 58 }
  ];

  // Categorized Alerts
  const alerts = {
    all: [
      { sev: 'warning', title: 'Staged pallet congestion', msg: `Predicted ${stagedPallets.predicted} pallets @ 12:00 (capacity: ${stagedPallets.capacity})`, time: '+2hr', conf: 78, category: 'space' },
      { sev: 'info', title: 'Pallet jack in maintenance', msg: 'EPJ-03 scheduled maintenance until 11:30', time: 'Now', conf: 100, category: 'equipment' },
      { sev: 'warning', title: 'Trailer TRL-1002 running long', msg: 'Predicted completion 12:00 (45min over target)', time: '+2hr', conf: 72, category: 'locations' },
      { sev: 'info', title: 'ASN variance detected', msg: 'ASN-4523 has 1 line variance from PO', time: 'Now', conf: 100, category: 'work' }
    ],
    staff: [],
    work: [],
    space: [],
    equipment: [],
    locations: []
  };
  // Distribute alerts to categories
  alerts.all.forEach(a => { if (alerts[a.category]) alerts[a.category].push(a); });

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, marginTop: sp.lg, marginBottom: sp.md }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>
      <h2 style={{ fontSize: '18px', fontWeight: 500, color: C.neutral[800], margin: 0 }}>{title}</h2>
    </div>
  );

  // Inline Alert Component (smaller, contextual)
  const InlineAlert = ({ sev, title, msg, time, conf }) => {
    const colors = { critical: C.error, warning: C.warning, info: C.brand };
    const c = colors[sev] || colors.info;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm, padding: sp.sm, background: c[50], borderRadius: 6, borderLeft: `3px solid ${c[500]}`, marginTop: sp.sm }}>
        <AlertTriangle style={{ width: 14, height: 14, color: c[600], flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', fontWeight: 500, color: c[700] }}>{title}</p>
          <p style={{ fontSize: '11px', color: c[600] }}>{msg}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: c[500] }}>{time}</span>
          {conf && <p style={{ fontSize: '10px', color: C.neutral[400] }}>{conf}% conf</p>}
        </div>
      </div>
    );
  };

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

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, fontSize: '12px' }}>
          <span style={{ color: C.brand[600], cursor: 'pointer' }} onClick={onBackToExec}>🏠 {'{facilityName}'} Overview</span>
          <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
          <span style={{ color: C.neutral[700], fontWeight: 500 }}>{zoneId} {zoneName}</span>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* ===== HEADER WITH KPIs ===== */}
            <div style={{ background: `linear-gradient(135deg, ${C.blueLight[500]} 0%, ${C.brand[600]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              <Truck style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>{zoneId} — {zoneName}</h2>
                <Badge status="success" label="Active" />
              </div>
              <p style={{ opacity: 0.8, fontSize: '14px', marginTop: 4 }}>Inbound Receiving Dock • {dockDoors.length} Dock Doors</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ opacity: 0.7, fontSize: '12px' }}>Space Utilization</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '42px', fontWeight: 300 }}>{zoneMetrics.spaceUtil.cur}%</span>
              {isContextualDifferent && interpolateValue(spaceTimeline, contextualTime) && (
                <>
                  <ArrowRight style={{ width: 14, height: 14, opacity: 0.7 }} />
                  <span style={{ fontSize: '20px', fontWeight: 500, padding: '2px 8px', background: 'rgba(47, 114, 255, 0.4)', borderRadius: 4 }}>
                    {interpolateValue(spaceTimeline, contextualTime)}%
                  </span>
                </>
              )}
              <ArrowRight style={{ width: 16, height: 16, opacity: 0.7 }} />
              <span style={{ fontSize: '24px', fontWeight: 500 }}>{zoneMetrics.spaceUtil.pred}%</span>
            </div>
            {isContextualDifferent && (
              <p style={{ opacity: 0.7, fontSize: '11px', marginTop: 4 }}>@{contextualTime} {isContextualPast && '(past)'}</p>
            )}
          </div>
        </div>

        {/* KPI Stats - includes Dwell Time */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: sp.md }}>
          {[
            { l: 'Pallets/Hr', v: zoneMetrics.throughput.cur, p: zoneMetrics.throughput.pred, t: zoneMetrics.throughput.target, icon: Package, timeline: kpiTimelines.palletsHr },
            { l: 'Avg Dwell (min)', v: zoneMetrics.dwellTime.cur, p: zoneMetrics.dwellTime.pred, t: `≤${zoneMetrics.dwellTime.target}`, icon: Clock, warn: zoneMetrics.dwellTime.pred > zoneMetrics.dwellTime.target, timeline: kpiTimelines.dwellTime },
            { l: 'Receiving Accuracy', v: `${zoneMetrics.accuracy.cur}%`, p: `${zoneMetrics.accuracy.pred}%`, t: `${zoneMetrics.accuracy.target}%`, icon: CheckCircle, timeline: kpiTimelines.accuracy, format: v => `${v.toFixed(1)}%` },
            { l: 'Staged Pallets', v: stagedPallets.current, p: stagedPallets.predicted, t: stagedPallets.capacity, icon: Package, timeline: kpiTimelines.stagedPallets },
            { l: 'Dock Utilization', v: `${Math.round(dockStatus.filter(d => d.status === 'occupied').length / dockDoors.length * 100)}%`, p: '85%', t: '90%', icon: MapPin, timeline: kpiTimelines.dockUtil, format: v => `${Math.round(v)}%` }
          ].map((m, i) => {
            const Icon = m.icon;
            const ctxVal = isContextualDifferent && m.timeline ? interpolateValue(m.timeline, contextualTime) : null;
            const displayCtx = ctxVal !== null ? (m.format ? m.format(ctxVal) : Math.round(ctxVal)) : null;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: sp.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
                  <span style={{ opacity: 0.8, fontSize: '11px' }}>{m.l}</span>
                  <Icon style={{ width: 14, height: 14, opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '20px', fontWeight: 300 }}>{m.v}</span>
                  {displayCtx !== null && (
                    <>
                      <ArrowRight style={{ width: 10, height: 10, opacity: 0.6 }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, padding: '1px 5px', background: 'rgba(47, 114, 255, 0.4)', borderRadius: 3 }}>{displayCtx}</span>
                    </>
                  )}
                  <ArrowRight style={{ width: 10, height: 10, opacity: 0.6 }} />
                  <span style={{ fontSize: '14px', opacity: 0.9, color: m.warn ? C.warning[200] : 'inherit' }}>{m.p}</span>
                </div>
                <p style={{ fontSize: '10px', opacity: 0.6, marginTop: 4 }}>Target: {m.t}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ALL ALERTS (Consolidated) ===== */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Alerts</h3>
          <Badge status={alerts.all.some(a => a.sev === 'critical') ? 'error' : alerts.all.some(a => a.sev === 'warning') ? 'warning' : 'success'} label={`${alerts.all.length} active`} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {alerts.all.map((a, i) => <Alert key={i} {...a} />)}
        </div>
      </Card>

      {/* ===== STAFF SECTION ===== */}
      <SectionHeader icon={Users} title="Staff" color={C.brand[500]} />

      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Staffing</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Personnel assigned to this zone • {staff.reduce((a, s) => a + s.present, 0)} active</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {staff.map((s, i) => {
            const Icon = s.icon;
            const gap = s.scheduled - s.present;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: gap > 0 ? C.warning[50] : C.neutral[50], borderRadius: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: C.brand[600] }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{s.role}</p>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>{s.present}/{s.scheduled} present</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>Productivity</p>
                    <p style={{ fontSize: '16px', fontWeight: 500, color: s.productivity >= 100 ? C.success[600] : s.productivity >= 90 ? C.neutral[700] : C.warning[600] }}>{s.productivity}%</p>
                  </div>
                  {gap > 0 && <Badge status="warning" label={`-${gap}`} />}
                </div>
              </div>
            );
          })}
        </div>
        {/* Staff Alerts */}
        {alerts.staff.length > 0 && alerts.staff.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== WORK CONTENT SECTION ===== */}
      <SectionHeader icon={ClipboardList} title="Work Content" color={C.orange[500]} />

      {/* ASN/PO Tracking */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>ASN / PO Tracking</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Inbound shipment documentation</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {asnData.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: a.variance > 0 ? C.warning[50] : C.neutral[50], borderRadius: 8 }}>
              <div style={{ minWidth: 100 }}>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{a.asn}</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>{a.po}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: C.neutral[700] }}>{a.vendor}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{a.received}/{a.lines}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>lines received</p>
                </div>
                {a.variance > 0 && <Badge status="warning" label={`${a.variance} variance`} />}
                <Badge
                  status={a.status === 'complete' ? 'success' : a.status === 'in-progress' ? 'info' : 'warning'}
                  label={a.status === 'complete' ? '✓ Complete' : a.status === 'in-progress' ? 'In Progress' : 'Pending'}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Receiving Throughput */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Receiving Throughput</h3>
              {isContextualDifferent && interpolateValue(throughputTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(throughputTimeline, contextualTime)} pallets</strong>
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Pallets received per hour • Now: 142 → Pred: 238 @ 14:00 • Target: 180/hr</p>
          </div>
          <Badge status="success" label="On track" />
        </div>
        <PredictiveTimeline data={throughputTimeline} height={160} target={180} contextualTime={contextualTime} />
      </Card>

      {/* Staged Pallets - Work Content View (by status) */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Work in Progress</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Staged pallets by processing status</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
          {stagedPallets.byStatus.map((s, i) => (
            <div key={i} style={{ padding: sp.lg, background: C.neutral[50], borderRadius: 8, borderLeft: `4px solid ${s.color}`, textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 500, color: C.neutral[800] }}>{s.count}</p>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>{s.status}</p>
            </div>
          ))}
        </div>
        {/* Work Alerts */}
        {alerts.work.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== SPACE SECTION ===== */}
      <SectionHeader icon={MapPin} title="Space" color={C.blueLight[500]} />

      {/* Space Utilization Forecast */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Space Utilization Forecast</h3>
              {isContextualDifferent && interpolateValue(spaceTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(spaceTimeline, contextualTime)}%</strong>
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Staging area capacity • Now: {zoneMetrics.spaceUtil.cur}% → Pred: 65% @ 14:00 • Peak: 74% @ 12:00</p>
          </div>
          <Badge status="success" label="Within capacity" />
        </div>
        <PredictiveTimeline data={spaceTimeline} height={160} warning={75} critical={85} contextualTime={contextualTime} />
      </Card>

      {/* Staged Pallets - Space View (capacity) */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Staging Capacity</h3>
              {isContextualDifferent && interpolateValue(kpiTimelines.stagedPallets, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{Math.round(interpolateValue(kpiTimelines.stagedPallets, contextualTime))} pallets</strong>
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Pallet positions • Now: {stagedPallets.current} → Pred: {stagedPallets.predicted} • Capacity: {stagedPallets.capacity}</p>
          </div>
          <Badge status={stagedPallets.predicted > stagedPallets.capacity * 0.85 ? 'warning' : 'success'} label={`${stagedPallets.current} → ${stagedPallets.predicted}`} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xl }}>
          <DonutChart value={Math.round(stagedPallets.current / stagedPallets.capacity * 100)} size={100} stroke={10} color={stagedPallets.current > stagedPallets.capacity * 0.75 ? C.warning[500] : C.success[500]} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.md, marginBottom: sp.sm, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Current</p>
                <p style={{ fontSize: '36px', fontWeight: 300 }}>{stagedPallets.current}</p>
              </div>
              {isContextualDifferent && interpolateValue(kpiTimelines.stagedPallets, contextualTime) && (
                <>
                  <ArrowRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
                  <div style={{ padding: sp.sm, background: C.brand[100], borderRadius: 8 }}>
                    <p style={{ fontSize: '11px', color: C.brand[600] }}>@{contextualTime}</p>
                    <p style={{ fontSize: '28px', fontWeight: 500, color: C.brand[600] }}>{Math.round(interpolateValue(kpiTimelines.stagedPallets, contextualTime))}</p>
                  </div>
                </>
              )}
              <ArrowRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
              <div>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted @ 14:00</p>
                <p style={{ fontSize: '36px', fontWeight: 300, color: C.purple[600] }}>{stagedPallets.predicted}</p>
              </div>
              <div style={{ marginLeft: sp.lg }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Capacity</p>
                <p style={{ fontSize: '36px', fontWeight: 300, color: C.neutral[400] }}>{stagedPallets.capacity}</p>
              </div>
            </div>
            <Progress value={stagedPallets.current} max={stagedPallets.capacity} pred={stagedPallets.predicted} color={C.brand[500]} h={8} />
          </div>
        </div>
        {/* Space Alerts */}
        {alerts.space.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== EQUIPMENT SECTION ===== */}
      <SectionHeader icon={Truck} title="Equipment" color={C.purple[500]} />

      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Equipment Status</h3>
            {isContextualDifferent && (
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>
                • <span style={{ padding: '1px 6px', background: C.brand[100], color: C.brand[600], borderRadius: 3 }}>Blue</span> = predicted @{contextualTime}
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Material handling equipment in zone • Utilization predictions update with timeline</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {equipment.map((e, i) => {
            // Simple contextual interpolation for utilization
            const ctxUtil = isContextualDifferent ? Math.round(e.utilPred * (0.85 + Math.random() * 0.15)) : null;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: e.maint > 0 ? C.warning[50] : C.neutral[50], borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{e.type}</p>
                  <div style={{ display: 'flex', gap: sp.md, marginTop: 4 }}>
                    <span style={{ fontSize: '12px', color: C.success[600] }}>● {e.active} active</span>
                    {e.idle > 0 && <span style={{ fontSize: '12px', color: C.neutral[500] }}>○ {e.idle} idle</span>}
                    {e.maint > 0 && <span style={{ fontSize: '12px', color: C.warning[600] }}>⚠ {e.maint} maintenance</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Util. {ctxUtil !== null ? `@${contextualTime}` : 'Pred.'}</p>
                  <p style={{ fontSize: '16px', fontWeight: 500, color: (ctxUtil || e.utilPred) >= 90 ? C.warning[600] : C.success[600], padding: ctxUtil !== null ? '2px 6px' : 0, background: ctxUtil !== null ? C.brand[100] : 'transparent', borderRadius: 4 }}>
                    {ctxUtil !== null ? ctxUtil : e.utilPred}%
                  </p>
                </div>
                <div style={{ width: 60, textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 500 }}>{e.active}/{e.total}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Equipment Alerts */}
        {alerts.equipment.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== LOCATIONS SECTION ===== */}
      <SectionHeader icon={MapPin} title="Locations" color={C.success[500]} />

      <Card
          className="card-click"
          onClick={() => onDockDetail && onDockDetail()}
          style={{ cursor: onDockDetail ? 'pointer' : 'default' }}
        >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Dock Door Status</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Trailers at dock • {dockStatus.filter(d => d.status === 'occupied').length}/{dockDoors.length} occupied</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Badge status="info" label="Click for details" />
            <ChevronRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {dockStatus.map(d => (
            <div key={d.door} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: d.status === 'occupied' ? C.brand[100] : C.neutral[50], borderRadius: 8, borderLeft: `4px solid ${d.status === 'occupied' ? C.brand[500] : C.neutral[300]}` }}>
              <div style={{ minWidth: 60 }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: C.neutral[800] }}>{d.door}</p>
                <p style={{ fontSize: '11px', color: d.status === 'occupied' ? C.brand[600] : C.neutral[500] }}>{d.status === 'occupied' ? 'Occupied' : 'Available'}</p>
              </div>
              {d.status === 'occupied' ? (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{d.trailer}</span>
                      <span style={{ fontSize: '12px', color: C.neutral[500] }}>• {d.carrier}</span>
                      <span style={{ fontSize: '11px', color: C.neutral[400] }}>Arrived {d.arrived}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                      <div style={{ flex: 1 }}><Progress value={d.progress} color={d.progress > 70 ? C.success[500] : C.brand[500]} h={6} /></div>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[600] }}>{d.progress}%</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{d.unloaded}/{d.pallets}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>pallets</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>ETA Complete</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: C.purple[600] }}>{d.eta}</p>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '13px', color: C.neutral[400] }}>No trailer assigned</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Locations Alerts */}
        {alerts.locations.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>
          </>
        )}

        {/* Staff Tab Content - Zone Scoped */}
        {activeTab === 'staff' && (
          <>
            <Header icon={Users} title={`${zoneId} Staff`} sub={`Personnel assigned to ${zoneName}`} color={C.purple[500]} />
            <Card>
              <div style={{ marginBottom: sp.md }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Staffing</h3>
                <p style={{ fontSize: '12px', color: C.neutral[500] }}>Personnel assigned to this zone</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginBottom: sp.md }}>
                <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.success[700] }}>8</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Present</p></div>
                <div style={{ padding: sp.md, background: C.neutral[100], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.neutral[600] }}>10</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Scheduled</p></div>
                <div style={{ padding: sp.md, background: C.warning[50], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.warning[700] }}>2</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Gap</p></div>
                <div style={{ padding: sp.md, background: C.brand[100], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.brand[700] }}>94%</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Productivity</p></div>
              </div>
              <DataGrid
                title="Staff Roster"
                subtitle="Employees assigned to this zone"
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Active' ? 'success' : v === 'Break' ? 'info' : 'warning'} label={v} /> },
                  { key: 'uplh', label: 'UPLH', align: 'right' }
                ]}
                data={[
                  { name: 'Sarah Johnson', role: 'Receiver', status: 'Active', uplh: 94 },
                  { name: 'Carlos Mendez', role: 'Forklift Op', status: 'Active', uplh: 88 },
                  { name: 'Rachel Kim', role: 'Receiver', status: 'Active', uplh: 96 },
                  { name: 'Tom Wilson', role: 'Receiver', status: 'Break', uplh: 91 }
                ]}
                color={C.purple[500]}
                entityType="staff"
              />
            </Card>
          </>
        )}

        {/* Work Content Tab - Zone Scoped */}
        {activeTab === 'work' && (
          <>
            <Header icon={Package} title={`${zoneId} Work Content`} sub={`Tasks and inventory in ${zoneName}`} color={C.orange[500]} />
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Staged Pallets</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Now: 47 → Pred: 62 • Capacity: 80</p>
                </div>
                <Badge status="warning" label="78% capacity @ 12:00" />
              </div>
              <Progress value={47} max={80} pred={62} color={C.orange[500]} h={8} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md, marginTop: sp.md }}>
                <div style={{ padding: sp.md, background: C.warning[50], borderRadius: 8, textAlign: 'center', borderLeft: `3px solid ${C.warning[500]}` }}><p style={{ fontSize: '20px', fontWeight: 500 }}>28</p><p style={{ fontSize: '11px', color: C.neutral[500] }}>Awaiting Putaway</p></div>
                <div style={{ padding: sp.md, background: C.error[50], borderRadius: 8, textAlign: 'center', borderLeft: `3px solid ${C.error[500]}` }}><p style={{ fontSize: '20px', fontWeight: 500 }}>8</p><p style={{ fontSize: '11px', color: C.neutral[500] }}>QC Hold</p></div>
                <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8, textAlign: 'center', borderLeft: `3px solid ${C.success[500]}` }}><p style={{ fontSize: '20px', fontWeight: 500 }}>11</p><p style={{ fontSize: '11px', color: C.neutral[500] }}>Ready</p></div>
              </div>
            </Card>
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.sm }}>ASN/PO Tracking</h3>
              <DataGrid
                columns={[
                  { key: 'asn', label: 'ASN' },
                  { key: 'vendor', label: 'Vendor' },
                  { key: 'lines', label: 'Lines', align: 'right' },
                  { key: 'received', label: 'Received', align: 'right' },
                  { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'complete' ? 'success' : v === 'in-progress' ? 'info' : 'neutral'} label={v} /> }
                ]}
                data={[
                  { asn: 'ASN-4521', vendor: 'Acme Corp', lines: 12, received: 10, status: 'in-progress' },
                  { asn: 'ASN-4522', vendor: 'Global Supply', lines: 8, received: 8, status: 'complete' },
                  { asn: 'ASN-4523', vendor: 'FastShip Inc', lines: 24, received: 5, status: 'in-progress' }
                ]}
                color={C.orange[500]}
              />
            </Card>
          </>
        )}

        {/* Locations Tab - Child entities (Dock Doors) */}
        {activeTab === 'locations' && (
          <>
            <Header icon={MapPin} title={`${zoneId} Locations`} sub={`Dock doors and staging areas in ${zoneName}`} color={C.blueLight[500]} />

            {/* Cross-reference: Zone Utilization Summary */}
            <Card style={{ background: `linear-gradient(135deg, ${C.blueLight[50]} 0%, ${C.brand[50]} 100%)`, border: `1px solid ${C.blueLight[200]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '12px', color: C.neutral[500], marginBottom: 4 }}>Combined Space Utilization</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm }}>
                    <span style={{ fontSize: '28px', fontWeight: 300 }}>68%</span>
                    <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                    <span style={{ fontSize: '18px', fontWeight: 500, color: C.purple[600] }}>74%</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>@ 14:00</span>
                  </div>
                  <p style={{ fontSize: '11px', color: C.neutral[500], marginTop: 4 }}>Based on 4 locations below</p>
                </div>
                <div style={{ width: 120 }}>
                  <Progress value={68} max={100} pred={74} color={C.blueLight[500]} h={6} />
                </div>
              </div>
            </Card>

            {/* Primary: Location List */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Dock Doors</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>4 doors • 3 occupied • Click to view details</p>
                </div>
                <Badge status="success" label="Healthy" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {[
                  { id: 'D01', status: 'occupied', trailer: 'TRL-1000', progress: 30, utilization: 85 },
                  { id: 'D02', status: 'occupied', trailer: 'TRL-1001', progress: 50, utilization: 92 },
                  { id: 'D03', status: 'occupied', trailer: 'TRL-1002', progress: 70, utilization: 45 },
                  { id: 'D04', status: 'available', trailer: null, progress: 0, utilization: 0 }
                ].map((door) => (
                  <div
                    key={door.id}
                    onClick={() => onDockDetail && onDockDetail()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sp.md,
                      padding: sp.md,
                      background: door.status === 'occupied' ? C.brand[50] : C.neutral[50],
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: `1px solid ${door.status === 'occupied' ? C.brand[200] : C.neutral[200]}`
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: door.status === 'occupied' ? C.brand[100] : C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin style={{ width: 20, height: 20, color: door.status === 'occupied' ? C.brand[600] : C.neutral[400] }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{door.id}</span>
                        <Badge status={door.status === 'occupied' ? 'info' : 'neutral'} label={door.status === 'occupied' ? 'Occupied' : 'Available'} />
                      </div>
                      {door.trailer && <p style={{ fontSize: '11px', color: C.neutral[500] }}>{door.trailer} • {door.progress}% unloaded</p>}
                    </div>
                    {door.status === 'occupied' && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: door.utilization > 80 ? C.warning[600] : C.success[600] }}>{door.utilization}%</p>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>utilization</p>
                      </div>
                    )}
                    <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Space Utilization Tab - Capacity and utilization trends */}
        {activeTab === 'spaceUtil' && (
          <>
            <Header icon={BoxSelect} title={`${zoneId} Space Utilization`} sub={`Capacity and utilization trends for ${zoneName}`} color={C.greenLight[500]} />
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Space Utilization Forecast</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Now: 68% → Pred: 74% @ 14:00 • Target: ≤80%</p>
                </div>
                <Badge status="success" label="Healthy" />
              </div>
              <PredictiveTimeline data={spaceTimeline} height={160} target={80} warning={75} critical={90} contextualTime={contextualTime} />
            </Card>
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.md }}>Staging Capacity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.md }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '32px', fontWeight: 300 }}>47</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Current</p>
                </div>
                <ArrowRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: C.purple[600] }}>62</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted</p>
                </div>
                <ArrowRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 300, color: C.neutral[400] }}>80</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Capacity</p>
                </div>
              </div>
              <Progress value={47} max={80} pred={62} color={C.greenLight[500]} h={8} />
            </Card>
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: sp.md }}>Zone Dimensions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 500 }}>2,400</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Sq Ft</p>
                </div>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 500 }}>4</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Dock Doors</p>
                </div>
                <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 500 }}>80</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>Pallet Capacity</p>
                </div>
              </div>
            </Card>

            {/* Cross-reference: Utilization by Location */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Utilization by Location</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>Which locations are driving utilization • Click to view details</p>
                </div>
                <span style={{ fontSize: '11px', color: C.brand[600], cursor: 'pointer' }} onClick={() => setActiveTab('locations')}>View all locations →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {[
                  { id: 'D01', utilization: 85, status: 'occupied', trend: 'rising', pallets: 18 },
                  { id: 'D02', utilization: 92, status: 'occupied', trend: 'stable', pallets: 22 },
                  { id: 'D03', utilization: 45, status: 'occupied', trend: 'falling', pallets: 7 },
                  { id: 'D04', utilization: 0, status: 'available', trend: 'stable', pallets: 0 }
                ].map((loc) => {
                  const utilColor = loc.utilization >= 90 ? C.error[500] : loc.utilization >= 75 ? C.warning[500] : loc.utilization > 0 ? C.success[500] : C.neutral[300];
                  return (
                    <div
                      key={loc.id}
                      onClick={() => onDockDetail && onDockDetail(loc.id, 'spaceUtil')}
                      style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.sm, background: C.neutral[50], borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[100]}
                      onMouseLeave={(e) => e.currentTarget.style.background = C.neutral[50]}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: utilColor }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, width: 40 }}>{loc.id}</span>
                      <div style={{ flex: 1 }}>
                        <Progress value={loc.utilization} max={100} color={utilColor} h={6} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 500, width: 45, textAlign: 'right' }}>{loc.utilization}%</span>
                      <span style={{ fontSize: '11px', color: C.neutral[500], width: 60 }}>{loc.pallets} pallets</span>
                      {loc.trend === 'rising' && <ArrowUpRight style={{ width: 14, height: 14, color: C.warning[500] }} />}
                      {loc.trend === 'falling' && <ArrowDownRight style={{ width: 14, height: 14, color: C.success[500] }} />}
                      {loc.trend === 'stable' && <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />}
                      <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* Equipment Tab - Zone Scoped */}
        {activeTab === 'equipment' && (
          <>
            <Header icon={Wrench} title={`${zoneId} Equipment`} sub={`Material handling equipment in ${zoneName}`} color={C.brand[500]} />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginBottom: sp.md }}>
                <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.success[700] }}>4</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Active</p></div>
                <div style={{ padding: sp.md, background: C.neutral[100], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.neutral[600] }}>1</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Idle</p></div>
                <div style={{ padding: sp.md, background: C.warning[50], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.warning[700] }}>1</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Maintenance</p></div>
                <div style={{ padding: sp.md, background: C.brand[100], borderRadius: 8, textAlign: 'center' }}><p style={{ fontSize: '24px', fontWeight: 500, color: C.brand[700] }}>78%</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Avg Util</p></div>
              </div>
              <DataGrid
                title="Zone Equipment"
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'type', label: 'Type' },
                  { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Active' ? 'success' : v === 'Idle' ? 'neutral' : 'warning'} label={v} /> },
                  { key: 'util', label: 'Util %', align: 'right', render: (v) => v > 0 ? `${v}%` : '—' },
                  { key: 'operator', label: 'Operator', render: (v) => v || '—' }
                ]}
                data={[
                  { id: 'FL-02', type: 'Sit-Down Forklift', status: 'Active', util: 78, operator: 'Carlos Mendez' },
                  { id: 'EPJ-01', type: 'Electric Pallet Jack', status: 'Active', util: 85, operator: 'Sarah Johnson' },
                  { id: 'EPJ-03', type: 'Electric Pallet Jack', status: 'Maintenance', util: 0, operator: null },
                  { id: 'RF-12', type: 'RF Scanner', status: 'Active', util: 92, operator: 'Rachel Kim' },
                  { id: 'RF-13', type: 'RF Scanner', status: 'Active', util: 88, operator: 'Tom Wilson' }
                ]}
                color={C.brand[500]}
              />
            </Card>
          </>
        )}

        {/* Placeholder for other tabs */}
        {!['dashboard', 'staff', 'locations', 'work', 'spaceUtil', 'equipment'].includes(activeTab) && (
          <div style={{ padding: sp.xl, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: sp.md }}>
              {React.createElement(tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard, { style: { width: 24, height: 24, color: C.neutral[400] } })}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[600], marginBottom: sp.sm }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p style={{ fontSize: '13px', color: C.neutral[400] }}>{zoneId} {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} content will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboundZoneDetail;
