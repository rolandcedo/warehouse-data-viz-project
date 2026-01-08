import React from 'react';
import { Users, MapPin, ClipboardList, Clock, Package, Truck, AlertTriangle, ArrowRight, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';

// Import shared components
import { Card, Badge, Progress, DonutChart, Alert, Breadcrumb } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';

// Import design tokens
import { C, sp } from '../../styles/designSystem';

const StorageZoneDetail = ({ zoneId, onBack, onBackToExec, onNavigate }) => {
  const zoneName = 'Bulk Storage';

  // Clickable Item Component - for drilling into nouns
  const ClickableItem = ({ type, id, label, children, showChevron = true, style = {} }) => (
    <div
      onClick={() => onNavigate && onNavigate(type, id)}
      className="card-click"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sp.xs,
        cursor: 'pointer',
        borderRadius: 4,
        padding: '2px 4px',
        margin: '-2px -4px',
        transition: 'background 0.15s',
        ...style
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = C.brand[100]}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {children || <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px' }}>{label}</span>}
      {showChevron && <ChevronRight style={{ width: 12, height: 12, color: C.brand[500], flexShrink: 0 }} />}
    </div>
  );

  // Zone Overview Metrics
  const zoneMetrics = {
    spaceUtil: { cur: 83, pred: 91, target: 85 },
    cubeUtil: { cur: 72, pred: 78, target: 80 },
    invAccuracy: { cur: 99.2, pred: 99.1, target: 99.5 },
    putawayTime: { cur: 4.2, pred: 4.5, target: 4.0 }
  };

  // Location Structure - Aisles
  const aisles = [
    { id: 'A02', type: 'Selective Rack', bays: 24, levels: 5, positions: 2, totalSlots: 240, occupied: 198, reserved: 12 },
    { id: 'A04', type: 'Selective Rack', bays: 24, levels: 5, positions: 2, totalSlots: 240, occupied: 221, reserved: 8 },
    { id: 'A06', type: 'Selective Rack', bays: 24, levels: 5, positions: 2, totalSlots: 240, occupied: 189, reserved: 15 },
    { id: 'A08', type: 'VNA Rack', bays: 32, levels: 6, positions: 2, totalSlots: 384, occupied: 342, reserved: 20 },
    { id: 'F01', type: 'Floor Storage', bays: 16, levels: 1, positions: 4, totalSlots: 64, occupied: 58, reserved: 4 }
  ];

  // Slot utilization by level
  const levelUtilization = [
    { level: 'A (Floor)', total: 288, occupied: 261, pct: 91 },
    { level: 'B', total: 288, occupied: 254, pct: 88 },
    { level: 'C', total: 288, occupied: 242, pct: 84 },
    { level: 'D', total: 288, occupied: 198, pct: 69 },
    { level: 'E', total: 288, occupied: 165, pct: 57 },
    { level: 'F (Top)', total: 128, occupied: 88, pct: 69 }
  ];

  // SKU Velocity Distribution
  const skuVelocity = [
    { class: 'A (Fast)', skus: 45, pct: 15, picks: 68, color: C.success[500], id: 'velocity-a' },
    { class: 'B (Medium)', skus: 120, pct: 40, picks: 25, color: C.warning[500], id: 'velocity-b' },
    { class: 'C (Slow)', skus: 135, pct: 45, picks: 7, color: C.neutral[400], id: 'velocity-c' }
  ];

  // Staffing Data
  const staff = [
    { id: 'staff-reach', role: 'Reach Truck Operators', icon: Truck, scheduled: 3, present: 3, productivity: 98 },
    { id: 'staff-vna', role: 'VNA/Turret Operators', icon: Truck, scheduled: 2, present: 2, productivity: 105 },
    { id: 'staff-picker', role: 'Order Pickers', icon: Users, scheduled: 2, present: 1, productivity: 92 },
    { id: 'staff-inv', role: 'Inventory Control', icon: ClipboardList, scheduled: 1, present: 1, productivity: 100 }
  ];

  // Equipment Status (Complex)
  const equipment = [
    { id: 'equip-reach', type: 'Reach Truck', total: 4, active: 3, maint: 0, idle: 1, utilPred: 88, maxHeight: '30 ft' },
    { id: 'equip-vna', type: 'VNA Turret Truck', total: 2, active: 2, maint: 0, idle: 0, utilPred: 95, maxHeight: '50 ft' },
    { id: 'equip-picker', type: 'Order Picker (Man-Up)', total: 3, active: 2, maint: 1, idle: 0, utilPred: 78, maxHeight: '25 ft' },
    { id: 'equip-rf', type: 'RF Scanner', total: 12, active: 9, maint: 0, idle: 3, utilPred: 82, maxHeight: '-' },
    { id: 'equip-wire', type: 'Wire Guidance System', total: 2, active: 2, maint: 0, idle: 0, utilPred: 100, maxHeight: '-' }
  ];

  // Work Content - Active Tasks
  const workContent = {
    putaway: { id: 'task-putaway', pending: 47, inProgress: 12, completed: 89, rate: 18 },
    replenishment: { id: 'task-replen', pending: 23, inProgress: 5, completed: 34, rate: 8 },
    cycleCounts: { id: 'task-cycle', pending: 15, inProgress: 2, completed: 28, rate: 6 }
  };

  // Inventory Stats
  const inventory = {
    totalSKUs: 300,
    totalPallets: 1208,
    avgDaysOnHand: 18,
    turnoverRate: 4.2,
    aging: [
      { id: 'age-0-30', range: '0-30 days', count: 842, pct: 70, color: C.success[500] },
      { id: 'age-31-60', range: '31-60 days', count: 265, pct: 22, color: C.warning[500] },
      { id: 'age-61-90', range: '61-90 days', count: 72, pct: 6, color: C.orange[500] },
      { id: 'age-90+', range: '90+ days', count: 29, pct: 2, color: C.error[500] }
    ]
  };

  // Sample Location Details (for Locations section)
  const sampleLocations = [
    { loc: 'Z04-A02-B12-LC-P1', sku: 'SKU-4521', qty: 48, status: 'occupied', lastActivity: '09:45' },
    { loc: 'Z04-A02-B12-LC-P2', sku: null, qty: 0, status: 'empty', lastActivity: '-' },
    { loc: 'Z04-A04-B08-LD-P1', sku: 'SKU-2287', qty: 36, status: 'reserved', lastActivity: '10:02' },
    { loc: 'Z04-A08-B22-LE-P1', sku: 'SKU-8834', qty: 24, status: 'cycle-count', lastActivity: '10:15' },
    { loc: 'Z04-F01-B04-LA-P2', sku: 'SKU-1122', qty: 120, status: 'occupied', lastActivity: '08:30' }
  ];

  // Predictive Timelines
  const spaceTimeline = [
    { time: '06:00', actual: 78, predicted: null },
    { time: '07:00', actual: 79, predicted: null },
    { time: '08:00', actual: 81, predicted: null },
    { time: '09:00', actual: 82, predicted: null },
    { time: '10:00', actual: 83, predicted: 83, now: true },
    { time: '11:00', actual: null, predicted: 87, upper: 89, lower: 85 },
    { time: '12:00', actual: null, predicted: 91, upper: 94, lower: 88 },
    { time: '13:00', actual: null, predicted: 89, upper: 92, lower: 86 },
    { time: '14:00', actual: null, predicted: 86, upper: 89, lower: 83 }
  ];

  const putawayBacklogTimeline = [
    { time: '06:00', actual: 28, predicted: null },
    { time: '07:00', actual: 35, predicted: null },
    { time: '08:00', actual: 42, predicted: null },
    { time: '09:00', actual: 45, predicted: null },
    { time: '10:00', actual: 47, predicted: 47, now: true },
    { time: '11:00', actual: null, predicted: 52, upper: 58, lower: 46 },
    { time: '12:00', actual: null, predicted: 48, upper: 55, lower: 41 },
    { time: '13:00', actual: null, predicted: 38, upper: 46, lower: 30 },
    { time: '14:00', actual: null, predicted: 25, upper: 35, lower: 15 }
  ];

  const replenishmentTimeline = [
    { time: '06:00', actual: 12, predicted: null },
    { time: '07:00', actual: 18, predicted: null },
    { time: '08:00', actual: 22, predicted: null },
    { time: '09:00', actual: 21, predicted: null },
    { time: '10:00', actual: 23, predicted: 23, now: true },
    { time: '11:00', actual: null, predicted: 28, upper: 32, lower: 24 },
    { time: '12:00', actual: null, predicted: 35, upper: 40, lower: 30 },
    { time: '13:00', actual: null, predicted: 30, upper: 36, lower: 24 },
    { time: '14:00', actual: null, predicted: 22, upper: 28, lower: 16 }
  ];

  // Categorized Alerts
  const alerts = {
    all: [
      { sev: 'error', title: 'Capacity breach predicted', msg: 'Zone reaching 91% @ 12:00 (target: 85%)', time: '+2hr', conf: 82, category: 'space' },
      { sev: 'warning', title: 'Putaway backlog building', msg: '52 pallets predicted in queue @ 11:00', time: '+1hr', conf: 75, category: 'work' },
      { sev: 'warning', title: 'VNA Turret at max utilization', msg: 'Both units at 95% predicted utilization', time: '+1hr', conf: 88, category: 'equipment' },
      { sev: 'info', title: 'Order Picker in maintenance', msg: 'OP-02 scheduled maintenance until 11:30', time: 'Now', conf: 100, category: 'equipment' },
      { sev: 'warning', title: 'Replenishment demand spike', msg: 'Forward pick zones requesting 35 replenishments @ 12:00', time: '+2hr', conf: 70, category: 'work' },
      { sev: 'info', title: 'Cycle count scheduled', msg: 'Aisle A08 cycle count starting 13:00', time: '+3hr', conf: 100, category: 'work' }
    ],
    staff: [],
    work: [],
    space: [],
    equipment: [],
    locations: []
  };
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

  // Inline Alert Component
  const InlineAlert = ({ sev, title, msg, time, conf }) => {
    const colors = { critical: C.error, error: C.error, warning: C.warning, info: C.brand };
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

  const totalSlots = aisles.reduce((a, aisle) => a + aisle.totalSlots, 0);
  const occupiedSlots = aisles.reduce((a, aisle) => a + aisle.occupied, 0);
  const reservedSlots = aisles.reduce((a, aisle) => a + aisle.reserved, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Executive Summary', onClick: onBackToExec },
        { label: 'Zones', onClick: onBack },
        { label: `${zoneId} - ${zoneName}` }
      ]} />

      {/* ===== HEADER WITH KPIs ===== */}
      <div style={{ background: `linear-gradient(135deg, ${C.warning[500]} 0%, ${C.error[500]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
              <Package style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>{zoneId} — {zoneName}</h2>
                <Badge status="warning" label="Near Capacity" />
              </div>
              <p style={{ opacity: 0.8, fontSize: '14px', marginTop: 4 }}>Mixed Racking & Floor Storage • {aisles.length} Aisles • {totalSlots.toLocaleString()} Slots</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ opacity: 0.7, fontSize: '12px' }}>Space Utilization</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm }}>
              <span style={{ fontSize: '42px', fontWeight: 300 }}>{zoneMetrics.spaceUtil.cur}%</span>
              <ArrowRight style={{ width: 16, height: 16, opacity: 0.7 }} />
              <span style={{ fontSize: '24px', fontWeight: 500, color: zoneMetrics.spaceUtil.pred > zoneMetrics.spaceUtil.target ? C.error[200] : 'inherit' }}>{zoneMetrics.spaceUtil.pred}%</span>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: sp.md }}>
          {[
            { l: 'Cube Utilization', v: `${zoneMetrics.cubeUtil.cur}%`, p: `${zoneMetrics.cubeUtil.pred}%`, t: `${zoneMetrics.cubeUtil.target}%`, icon: Package },
            { l: 'Inventory Accuracy', v: `${zoneMetrics.invAccuracy.cur}%`, p: `${zoneMetrics.invAccuracy.pred}%`, t: `${zoneMetrics.invAccuracy.target}%`, icon: CheckCircle },
            { l: 'Avg Putaway (min)', v: zoneMetrics.putawayTime.cur, p: zoneMetrics.putawayTime.pred, t: `≤${zoneMetrics.putawayTime.target}`, icon: Clock, warn: zoneMetrics.putawayTime.pred > zoneMetrics.putawayTime.target },
            { l: 'Putaway Backlog', v: workContent.putaway.pending, p: '52', t: '≤30', icon: Package, warn: true },
            { l: 'Replen Pending', v: workContent.replenishment.pending, p: '35', t: '≤20', icon: TrendingUp, warn: true }
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: sp.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
                  <span style={{ opacity: 0.8, fontSize: '11px' }}>{m.l}</span>
                  <Icon style={{ width: 14, height: 14, opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs }}>
                  <span style={{ fontSize: '20px', fontWeight: 300 }}>{m.v}</span>
                  <ArrowRight style={{ width: 12, height: 12, opacity: 0.6 }} />
                  <span style={{ fontSize: '14px', opacity: 0.9, color: m.warn ? C.error[200] : 'inherit' }}>{m.p}</span>
                </div>
                <p style={{ fontSize: '10px', opacity: 0.6, marginTop: 4 }}>Target: {m.t}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ALL ALERTS ===== */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Alerts</h3>
          <Badge status={alerts.all.some(a => a.sev === 'error') ? 'error' : alerts.all.some(a => a.sev === 'warning') ? 'warning' : 'success'} label={`${alerts.all.length} active`} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {alerts.all.map((a, i) => (
            <div
              key={i}
              onClick={() => onNavigate && onNavigate('alert', `alert-${i}`)}
              className="card-click"
              style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <Alert {...a} />
            </div>
          ))}
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
                  <ClickableItem type="staff-role" id={s.id} label={s.role} style={{ fontSize: '14px', fontWeight: 500 }} />
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>{s.present}/{s.scheduled} present</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>Productivity</p>
                    <p style={{ fontSize: '16px', fontWeight: 500, color: s.productivity >= 100 ? C.success[600] : s.productivity >= 90 ? C.neutral[700] : C.warning[600] }}>{s.productivity}%</p>
                  </div>
                  {gap > 0 && <Badge status="warning" label={`-${gap}`} />}
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                </div>
              </div>
            );
          })}
        </div>
        {alerts.staff.length > 0 && alerts.staff.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== WORK CONTENT SECTION ===== */}
      <SectionHeader icon={ClipboardList} title="Work Content" color={C.orange[500]} />

      {/* Active Tasks Summary */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Active Tasks</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Work in progress across all task types</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
          {[
            { name: 'Putaway', ...workContent.putaway, color: C.brand[500] },
            { name: 'Replenishment', ...workContent.replenishment, color: C.purple[500] },
            { name: 'Cycle Counts', ...workContent.cycleCounts, color: C.success[500] }
          ].map((task, i) => (
            <div
              key={i}
              onClick={() => onNavigate && onNavigate('task-type', task.id)}
              className="card-click"
              style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderTop: `3px solid ${task.color}`, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.brand[50]; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.neutral[50]; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{task.name}</p>
                <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: task.pending > 30 ? C.warning[600] : C.neutral[700] }}>{task.pending}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pending</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: C.brand[600] }}>{task.inProgress}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>In Progress</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: C.success[600] }}>{task.completed}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Completed</p>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Rate: {task.rate}/hr</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Putaway Backlog Forecast */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Putaway Backlog Forecast</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Pallets awaiting putaway • Target: ≤30 • Peak: 52 @ 11:00</p>
          </div>
          <Badge status="warning" label="Backlog building" />
        </div>
        <PredictiveTimeline data={putawayBacklogTimeline} height={160} target={30} warning={40} critical={50} />
      </Card>

      {/* Replenishment Demand */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Replenishment Demand</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Requests from forward pick zones • Peak: 35 @ 12:00</p>
          </div>
          <Badge status="warning" label="Spike @ 12:00" />
        </div>
        <PredictiveTimeline data={replenishmentTimeline} height={160} target={20} warning={30} />
      </Card>

      {/* Inventory Stats */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Inventory Profile</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>
            <ClickableItem type="inventory" id="all-skus" label={`${inventory.totalSKUs} SKUs`} showChevron={false} /> • {inventory.totalPallets.toLocaleString()} pallets • {inventory.turnoverRate}x turnover
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp.lg }}>
          {/* SKU Velocity */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: sp.sm }}>SKU Velocity Distribution</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {skuVelocity.map((v, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate && onNavigate('sku-velocity', v.id)}
                  className="card-click"
                  style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.xs, borderRadius: 4, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.brand[50]}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: v.color }} />
                  <span style={{ fontSize: '13px', flex: 1 }}>{v.class}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{v.skus} SKUs</span>
                  <span style={{ fontSize: '11px', color: C.neutral[500] }}>({v.picks}% picks)</span>
                  <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                </div>
              ))}
            </div>
          </div>
          {/* Aging */}
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: sp.sm }}>Inventory Aging</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {inventory.aging.map((a, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate && onNavigate('inventory-aging', a.id)}
                  className="card-click"
                  style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.xs, borderRadius: 4, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.brand[50]}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: a.color }} />
                  <span style={{ fontSize: '13px', flex: 1 }}>{a.range}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{a.count}</span>
                  <span style={{ fontSize: '11px', color: C.neutral[500] }}>({a.pct}%)</span>
                  <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {alerts.work.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== SPACE SECTION ===== */}
      <SectionHeader icon={MapPin} title="Space" color={C.blueLight[500]} />

      {/* Space Utilization Forecast */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Space Utilization Forecast</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Slot occupancy • Target: ≤85% • Peak: 91% @ 12:00</p>
          </div>
          <Badge status="error" label="Breach @ 12:00" />
        </div>
        <PredictiveTimeline data={spaceTimeline} height={160} target={85} warning={85} critical={90} />
      </Card>

      {/* Slot Summary */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Slot Capacity</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>{totalSlots.toLocaleString()} total slots across {aisles.length} aisles</p>
          </div>
          <Badge status={occupiedSlots / totalSlots > 0.85 ? 'warning' : 'success'} label={`${occupiedSlots} / ${totalSlots}`} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xl, marginBottom: sp.md }}>
          <DonutChart value={Math.round(occupiedSlots / totalSlots * 100)} size={100} stroke={10} color={occupiedSlots / totalSlots > 0.85 ? C.warning[500] : C.success[500]} />
          <div style={{ display: 'flex', gap: sp.lg }}>
            <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8, borderLeft: `4px solid ${C.success[500]}` }}>
              <p style={{ fontSize: '28px', fontWeight: 500, color: C.success[600] }}>{occupiedSlots}</p>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Occupied</p>
            </div>
            <div style={{ padding: sp.md, background: C.brand[50], borderRadius: 8, borderLeft: `4px solid ${C.brand[500]}` }}>
              <p style={{ fontSize: '28px', fontWeight: 500, color: C.brand[600] }}>{reservedSlots}</p>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Reserved</p>
            </div>
            <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderLeft: `4px solid ${C.neutral[400]}` }}>
              <p style={{ fontSize: '28px', fontWeight: 500, color: C.neutral[600] }}>{totalSlots - occupiedSlots - reservedSlots}</p>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Available</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Utilization by Level */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Utilization by Level</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Vertical space distribution</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {levelUtilization.map((lvl, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <span style={{ fontSize: '13px', fontWeight: 500, minWidth: 80 }}>{lvl.level}</span>
              <div style={{ flex: 1 }}><Progress value={lvl.pct} color={lvl.pct > 85 ? C.warning[500] : C.success[500]} h={8} /></div>
              <span style={{ fontSize: '13px', fontWeight: 500, minWidth: 40, textAlign: 'right' }}>{lvl.pct}%</span>
              <span style={{ fontSize: '11px', color: C.neutral[500], minWidth: 80 }}>{lvl.occupied}/{lvl.total}</span>
            </div>
          ))}
        </div>
        {alerts.space.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== EQUIPMENT SECTION ===== */}
      <SectionHeader icon={Truck} title="Equipment" color={C.purple[500]} />

      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Equipment Status</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Material handling equipment in zone</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {equipment.map((e, i) => (
            <div
              key={i}
              onClick={() => onNavigate && onNavigate('equipment', e.id)}
              className="card-click"
              style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: e.maint > 0 ? C.warning[50] : e.utilPred >= 90 ? C.brand[50] : C.neutral[50], borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{e.type}</p>
                <div style={{ display: 'flex', gap: sp.md, marginTop: 4 }}>
                  <span style={{ fontSize: '12px', color: C.success[600] }}>● {e.active} active</span>
                  {e.idle > 0 && <span style={{ fontSize: '12px', color: C.neutral[500] }}>○ {e.idle} idle</span>}
                  {e.maint > 0 && <span style={{ fontSize: '12px', color: C.warning[600] }}>⚠ {e.maint} maintenance</span>}
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>Max Height</p>
                <p style={{ fontSize: '12px', fontWeight: 500 }}>{e.maxHeight}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted Util.</p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: e.utilPred >= 90 ? C.warning[600] : C.success[600] }}>{e.utilPred}%</p>
              </div>
              <div style={{ width: 60, textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 500 }}>{e.active}/{e.total}</p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
            </div>
          ))}
        </div>
        {alerts.equipment.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>

      {/* ===== LOCATIONS SECTION ===== */}
      <SectionHeader icon={MapPin} title="Locations" color={C.success[500]} />

      {/* Aisle Summary */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Aisle Structure</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Location hierarchy: Zone → Aisle → Bay → Level → Position</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {aisles.map((aisle, i) => {
            const pct = Math.round(aisle.occupied / aisle.totalSlots * 100);
            return (
              <div
                key={i}
                onClick={() => onNavigate && onNavigate('aisle', aisle.id)}
                className="card-click"
                style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: pct > 90 ? C.warning[50] : C.neutral[50], borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{ minWidth: 60 }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: C.neutral[800] }}>{aisle.id}</p>
                  <ClickableItem type="rack-type" id={aisle.type} label={aisle.type} showChevron={false} style={{ fontSize: '11px', color: C.neutral[500] }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: sp.lg, marginBottom: 4 }}>
                    <span style={{ fontSize: '12px', color: C.neutral[500] }}>{aisle.bays} bays</span>
                    <span style={{ fontSize: '12px', color: C.neutral[500] }}>{aisle.levels} levels</span>
                    <span style={{ fontSize: '12px', color: C.neutral[500] }}>{aisle.positions} pos/bay</span>
                  </div>
                  <Progress value={pct} color={pct > 90 ? C.warning[500] : C.success[500]} h={6} />
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{aisle.occupied}/{aisle.totalSlots}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>{pct}%</p>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Sample Locations */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Location Activity</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Recent location status changes</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {sampleLocations.map((loc, i) => {
            const statusColors = {
              occupied: { bg: C.success[50], border: C.success[500], label: 'Occupied' },
              empty: { bg: C.neutral[50], border: C.neutral[300], label: 'Empty' },
              reserved: { bg: C.brand[50], border: C.brand[500], label: 'Reserved' },
              'cycle-count': { bg: C.purple[50], border: C.purple[500], label: 'Cycle Count' }
            };
            const s = statusColors[loc.status];
            return (
              <div
                key={i}
                onClick={() => onNavigate && onNavigate('location', loc.loc)}
                className="card-click"
                style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.sm, background: s.bg, borderRadius: 6, borderLeft: `3px solid ${s.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <code style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace', color: C.brand[600], minWidth: 180, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px' }}>{loc.loc}</code>
                <div style={{ flex: 1 }}>
                  {loc.sku ? (
                    <span style={{ fontSize: '13px' }}>
                      <ClickableItem type="sku" id={loc.sku} label={loc.sku} showChevron={false} style={{ fontWeight: 500 }} />
                      <span style={{ color: C.neutral[500] }}> • Qty: {loc.qty}</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: '13px', color: C.neutral[400] }}>—</span>
                  )}
                </div>
                <Badge status={loc.status === 'occupied' ? 'success' : loc.status === 'empty' ? 'info' : loc.status === 'reserved' ? 'info' : 'warning'} label={s.label} />
                <span style={{ fontSize: '11px', color: C.neutral[500], minWidth: 50 }}>{loc.lastActivity}</span>
                <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              </div>
            );
          })}
        </div>
        {alerts.locations.length > 0 && alerts.locations.map((a, i) => <InlineAlert key={i} {...a} />)}
      </Card>
    </div>
  );
};

export default StorageZoneDetail;
