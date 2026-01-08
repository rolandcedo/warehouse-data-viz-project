import React from 'react';
import {
  Users, TrendingUp, TrendingDown, AlertTriangle, ChevronRight,
  ArrowRight, Activity, Clock, UserCheck, UserX, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import shared data
import { ALERTS_DATA } from '../../data/alertsData';

// Import UI components
import { Card, Badge, Alert, Progress, Header, DataGrid, Accordion } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';

// Staff Tab Content - facility-level staff overview
const StaffTabContent = ({ onViewInsights, initialShiftFilter = null, onNavigateToAlert, onNavigateToStaff }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  
  // Composite score breakdown - these weights and values calculate the 78 shown on Exec dashboard
  const scoreComponents = [
    { label: 'Headcount vs Plan', value: 87, target: 100, weight: 25, detail: '42/48 FTE', status: 'warning' },
    { label: 'Attendance Rate', value: 88, target: 95, weight: 20, detail: '88% present', status: 'warning' },
    { label: 'UPLH vs Target', value: 94, target: 100, weight: 25, detail: 'Avg 128 vs 136 target', status: 'warning' },
    { label: 'Overtime Compliance', value: 67, target: 100, weight: 15, detail: '24 hrs vs 18 planned', status: 'error' },
    { label: 'Zone Coverage', value: 72, target: 100, weight: 15, detail: '2 zones understaffed', status: 'error' }
  ];
  const compositeScore = Math.round(scoreComponents.reduce((sum, c) => sum + (c.value * c.weight / 100), 0));
  
  // Staff alerts using shared data
  const staffAlerts = [
    ALERTS_DATA['staff-break-coverage'],
    ALERTS_DATA['staff-swing-understaffed'],
    ALERTS_DATA['staff-receiving-uplh'],
    ALERTS_DATA['staff-handoff-optimal']
  ];
  
  // UPLH by function
  const uplhByFunction = [
    { function: 'Picking', actual: 142, target: 150, fteCount: 12, trend: 'down' },
    { function: 'Packing', actual: 115, target: 110, fteCount: 8, trend: 'up' },
    { function: 'Receiving', actual: 94, target: 95, fteCount: 6, trend: 'down' },
    { function: 'Shipping', actual: 134, target: 130, fteCount: 8, trend: 'stable' },
    { function: 'Putaway', actual: 88, target: 100, fteCount: 5, trend: 'down' },
    { function: 'Replenishment', actual: 76, target: 80, fteCount: 3, trend: 'stable' }
  ];
  
  // Zone allocation data
  const zoneAllocation = [
    { code: 'IB-A', zone: 'Inbound A', planned: 4, actual: 4, pred: 4, status: 'ok' },
    { code: 'IB-B', zone: 'Inbound B', planned: 4, actual: 2, pred: 3, status: 'under' },
    { code: 'QA', zone: 'QA Station', planned: 2, actual: 2, pred: 2, status: 'ok' },
    { code: 'BLK', zone: 'Bulk Storage', planned: 4, actual: 3, pred: 4, status: 'under' },
    { code: 'FP-A', zone: 'Forward Pick A', planned: 5, actual: 5, pred: 5, status: 'ok' },
    { code: 'FP-B', zone: 'Forward Pick B', planned: 5, actual: 4, pred: 5, status: 'under' },
    { code: 'FP-C', zone: 'Forward Pick C', planned: 4, actual: 4, pred: 4, status: 'ok' },
    { code: 'PK-1', zone: 'Pack Station 1', planned: 4, actual: 5, pred: 5, status: 'over' },
    { code: 'PK-2', zone: 'Pack Station 2', planned: 4, actual: 4, pred: 4, status: 'ok' },
    { code: 'SH-A', zone: 'Shipping Dock A', planned: 4, actual: 4, pred: 4, status: 'ok' },
    { code: 'SH-B', zone: 'Shipping Dock B', planned: 5, actual: 2, pred: 3, status: 'under' },
    { code: 'RTN', zone: 'Returns', planned: 2, actual: 2, pred: 2, status: 'ok' }
  ];
  
  // Workforce composition
  const workforceComp = { permanent: 38, temp: 4, overtime: 6, total: 48 };
  
  const staffData = [
    // Day Shift
    { id: 'E001', name: 'Maria Santos', role: 'Picker', shift: 'day', zone: 'Forward Pick A', status: 'Active', uplh: 158, clockIn: '06:00', certs: ['forklift', 'hazmat'] },
    { id: 'E002', name: 'James Wilson', role: 'Picker', shift: 'day', zone: 'Forward Pick B', status: 'Active', uplh: 162, clockIn: '06:00', certs: [] },
    { id: 'E003', name: 'Chen Wei', role: 'Packer', shift: 'day', zone: 'Pack Station 1', status: 'Active', uplh: 112, clockIn: '06:00', certs: [] },
    { id: 'E004', name: 'Sarah Johnson', role: 'Receiver', shift: 'day', zone: 'Inbound A', status: 'Active', uplh: 94, clockIn: '06:00', certs: ['forklift'] },
    { id: 'E005', name: 'Mike Brown', role: 'Forklift Op', shift: 'day', zone: 'Bulk Storage', status: 'Active', uplh: 88, clockIn: '06:00', certs: ['forklift'] },
    { id: 'E006', name: 'Ana Garcia', role: 'Picker', shift: 'day', zone: 'Forward Pick C', status: 'Break', uplh: 145, clockIn: '06:00', certs: [] },
    { id: 'E007', name: 'David Lee', role: 'Shipper', shift: 'day', zone: 'Shipping Dock A', status: 'Active', uplh: 134, clockIn: '06:00', certs: ['forklift'] },
    { id: 'E008', name: 'Emily Chen', role: 'Packer', shift: 'day', zone: 'Pack Station 2', status: 'Active', uplh: 118, clockIn: '06:00', certs: [] },
    { id: 'E009', name: 'Robert Kim', role: 'Putaway', shift: 'day', zone: 'Bulk Storage', status: 'Active', uplh: 92, clockIn: '06:00', certs: ['forklift'] },
    { id: 'E010', name: 'Lisa Wang', role: 'QA', shift: 'day', zone: 'QA Station', status: 'Active', uplh: 45, clockIn: '06:00', certs: [] },
    // Swing Shift
    { id: 'E011', name: 'Carlos Ruiz', role: 'Picker', shift: 'swing', zone: 'Forward Pick A', status: 'Scheduled', uplh: null, clockIn: '14:00', certs: [] },
    { id: 'E012', name: 'Jennifer Adams', role: 'Packer', shift: 'swing', zone: 'Pack Station 1', status: 'Scheduled', uplh: null, clockIn: '14:00', certs: [] },
    { id: 'E013', name: 'Kevin Nguyen', role: 'Shipper', shift: 'swing', zone: 'Shipping Dock B', status: 'Scheduled', uplh: null, clockIn: '14:00', certs: ['forklift'] },
    { id: 'E014', name: 'Amanda Foster', role: 'Receiver', shift: 'swing', zone: 'Inbound B', status: 'Scheduled', uplh: null, clockIn: '14:00', certs: [] },
    { id: 'E015', name: 'Marcus Johnson', role: 'Forklift Op', shift: 'swing', zone: 'Bulk Storage', status: 'Scheduled', uplh: null, clockIn: '14:00', certs: ['forklift', 'hazmat'] },
    // Night Shift
    { id: 'E016', name: 'Tom Bradley', role: 'Receiver', shift: 'night', zone: 'Inbound A', status: 'Off', uplh: null, clockIn: '22:00', certs: ['forklift'] },
    { id: 'E017', name: 'Rachel Green', role: 'Putaway', shift: 'night', zone: 'Reserve 1', status: 'Off', uplh: null, clockIn: '22:00', certs: ['forklift'] },
    { id: 'E018', name: 'Steve Miller', role: 'Replen', shift: 'night', zone: 'Forward Pick A', status: 'Off', uplh: null, clockIn: '22:00', certs: [] },
    // Call-outs / Issues
    { id: 'E019', name: 'Diana Ross', role: 'Picker', shift: 'day', zone: 'Forward Pick B', status: 'Call-out', uplh: null, clockIn: null, certs: [] },
    { id: 'E020', name: 'Frank Torres', role: 'Packer', shift: 'day', zone: 'Pack Station 1', status: 'Late', uplh: 98, clockIn: '06:45', certs: [] }
  ];
  
  const staffColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'zone', label: 'Zone' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Active' ? 'success' : v === 'Break' ? 'info' : v === 'Call-out' ? 'error' : v === 'Late' ? 'warning' : 'purple'} label={v} /> },
    { key: 'uplh', label: 'UPLH', align: 'right', render: (v) => v ? <span style={{ color: v >= 100 ? C.success[600] : v >= 90 ? C.warning[600] : C.error[600] }}>{v}</span> : '—' },
    { key: 'clockIn', label: 'Clock In', render: (v) => v || '—' }
  ];
  
  const staffFilters = [
    { key: 'role', label: 'Role', options: ['Picker', 'Packer', 'Receiver', 'Shipper', 'Forklift Op', 'Lead', 'QC Inspector'] },
    { key: 'status', label: 'Status', options: ['Active', 'Break', 'Call-out', 'Late', 'Overtime'] }
  ];
  
  const staffTimeline = [
    { time: '06:00', actual: 45 }, { time: '07:00', actual: 46 }, { time: '08:00', actual: 44 },
    { time: '09:00', actual: 43 }, { time: '10:00', actual: 42, predicted: 42, now: true },
    { time: '11:00', predicted: 40, upper: 42, lower: 38 }, { time: '12:00', predicted: 38, upper: 41, lower: 35 },
    { time: '13:00', predicted: 41, upper: 44, lower: 38 }, { time: '14:00', predicted: 44, upper: 47, lower: 41 }
  ];

  return (
    <>
      <Header icon={Users} title="Staff Overview" sub="Labor capacity, productivity, allocation across facility" color={C.purple[500]} />
      
      {/* ===== COMPOSITE SCORE BREAKDOWN ===== */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.lg, marginBottom: sp.md }}>
          {/* Score Circle */}
          <div style={{ 
            width: 100, height: 100, borderRadius: '50%', 
            background: `conic-gradient(${compositeScore >= 85 ? C.success[500] : compositeScore >= 70 ? C.warning[500] : C.error[500]} ${compositeScore * 3.6}deg, ${C.neutral[100]} 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 600, color: compositeScore >= 85 ? C.success[600] : compositeScore >= 70 ? C.warning[600] : C.error[600] }}>{compositeScore}</span>
              <span style={{ fontSize: '10px', color: C.neutral[500] }}>STAFF SCORE</span>
            </div>
          </div>
          
          {/* Score Components */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Score Breakdown</h3>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>Weighted composite of 5 factors</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {scoreComponents.map((comp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <span style={{ fontSize: '12px', color: C.neutral[600], width: 130, flexShrink: 0 }}>{comp.label}</span>
                  <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${comp.value}%`, height: '100%', borderRadius: 4,
                      background: comp.status === 'error' ? C.error[500] : comp.status === 'warning' ? C.warning[500] : C.success[500]
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, width: 32, textAlign: 'right', color: comp.status === 'error' ? C.error[600] : comp.status === 'warning' ? C.warning[600] : C.success[600] }}>{comp.value}%</span>
                  <span style={{ fontSize: '10px', color: C.neutral[400], width: 16, textAlign: 'right' }}>{comp.weight}%</span>
                  <span style={{ fontSize: '11px', color: C.neutral[500], width: 110 }}>{comp.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lowest factors callout */}
        <div style={{ background: C.error[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
          <AlertTriangle style={{ width: 16, height: 16, color: C.error[600] }} />
          <span style={{ fontSize: '12px', color: C.error[700] }}>
            <strong>Lowest factors:</strong> Overtime Compliance (67%) and Zone Coverage (72%) are pulling the score down. 
            Address OT hours and Inbound B / Bulk Storage gaps to improve.
          </span>
        </div>
      </Card>
      
      {/* ===== UPLH BY FUNCTION ===== */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Productivity by Function (UPLH)</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Units per labor hour by job function • Higher is better</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
          {uplhByFunction.map((f, i) => {
            const pct = Math.round((f.actual / f.target) * 100);
            const status = pct >= 100 ? 'success' : pct >= 90 ? 'warning' : 'error';
            return (
              <div key={i} style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, border: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{f.function}</span>
                  <span style={{ fontSize: '10px', color: C.neutral[500] }}>{f.fteCount} FTE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, marginBottom: sp.xs }}>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: status === 'success' ? C.success[600] : status === 'warning' ? C.warning[600] : C.error[600] }}>{f.actual}</span>
                  <span style={{ fontSize: '12px', color: C.neutral[500] }}>/ {f.target} target</span>
                </div>
                <div style={{ height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: status === 'success' ? C.success[500] : status === 'warning' ? C.warning[500] : C.error[500] }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: sp.xs }}>
                  <span style={{ fontSize: '10px', color: status === 'success' ? C.success[600] : status === 'warning' ? C.warning[600] : C.error[600] }}>{pct}% of target</span>
                  {f.trend === 'down' && <span style={{ fontSize: '10px', color: C.error[500] }}>↓ declining</span>}
                  {f.trend === 'up' && <span style={{ fontSize: '10px', color: C.success[500] }}>↑ improving</span>}
                  {f.trend === 'stable' && <span style={{ fontSize: '10px', color: C.neutral[400] }}>→ stable</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* ===== ZONE ALLOCATION HEATMAP ===== */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Allocation Heatmap</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>FTE distribution by zone • Color indicates staffing coverage • Click on item to view details</p>
            </div>
            <div style={{ display: 'flex', gap: sp.md, fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: C.success[200] }} /> 100%+</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: C.warning[200] }} /> 80-99%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: C.orange[200] }} /> 60-79%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: C.error[200] }} /> &lt;60%</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
          {zoneAllocation.map((z, i) => {
            const ratio = z.actual / z.planned;
            const pct = Math.round(ratio * 100);
            const delta = z.pred - z.actual;
            
            // Color based on staffing ratio - using available color shades
            const getHeatColor = (r) => {
              if (r >= 1) return { bg: C.success[100], border: C.success[500], text: C.success[700] };
              if (r >= 0.8) return { bg: C.warning[100], border: C.warning[500], text: C.warning[600] };
              if (r >= 0.6) return { bg: C.orange[50], border: C.orange[500], text: C.orange[500] };
              return { bg: C.error[100], border: C.error[500], text: C.error[700] };
            };
            const heat = getHeatColor(ratio);
            
            return (
              <div 
                key={i} 
                style={{ 
                  padding: sp.md, 
                  borderRadius: 8, 
                  background: heat.bg,
                  borderLeft: `4px solid ${heat.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; 
                  e.currentTarget.style.transform = 'translateY(-2px)'; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = 'none'; 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                }}
              >
                {/* Header: Zone code + chevron */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: heat.text }}>{z.code}</span>
                  <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
                </div>
                
                {/* Percentage - scaled down */}
                <div style={{ marginBottom: sp.xs }}>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: heat.text }}>{pct}%</span>
                </div>
                
                {/* Actual/Planned with prediction delta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: sp.xs }}>
                  <span style={{ fontSize: '11px', color: C.neutral[600] }}>{z.actual}/{z.planned}</span>
                  <span style={{ fontSize: '10px', color: C.neutral[400] }}>→</span>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 500,
                    color: delta > 0 ? C.success[600] : delta < 0 ? C.error[600] : C.neutral[500]
                  }}>
                    {delta > 0 ? `+${delta}` : delta === 0 ? '+0' : delta}
                  </span>
                </div>
                
                {/* Zone name */}
                <p style={{ fontSize: '11px', color: C.neutral[600], lineHeight: 1.2 }}>{z.zone}</p>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* ===== WORKFORCE MIX + HEADCOUNT FORECAST (single full-width card) ===== */}
      <Card>
        <div style={{ display: 'flex', gap: sp.lg }}>
          {/* Workforce Mix - Left side */}
          <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${C.neutral[200]}`, paddingRight: sp.lg }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Workforce Mix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: C.neutral[600] }}>Permanent</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{workforceComp.permanent} <span style={{ fontSize: '10px', color: C.neutral[400] }}>({Math.round(workforceComp.permanent/workforceComp.total*100)}%)</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: C.neutral[600] }}>Temp Labor</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.warning[600] }}>{workforceComp.temp} <span style={{ fontSize: '10px', color: C.neutral[400] }}>({Math.round(workforceComp.temp/workforceComp.total*100)}%)</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: C.neutral[600] }}>On Overtime</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.error[600] }}>{workforceComp.overtime} <span style={{ fontSize: '10px', color: C.neutral[400] }}>({Math.round(workforceComp.overtime/workforceComp.total*100)}%)</span></span>
              </div>
              <div style={{ borderTop: `1px solid ${C.neutral[200]}`, paddingTop: sp.sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Total Scheduled</span>
                <span style={{ fontSize: '16px', fontWeight: 600 }}>{workforceComp.total}</span>
              </div>
            </div>
            <div style={{ marginTop: sp.sm, padding: sp.xs, background: C.error[50], borderRadius: 4 }}>
              <p style={{ fontSize: '10px', color: C.error[700] }}><strong>OT:</strong> 24 hrs vs 18 budget (+33%)</p>
            </div>
          </div>
          
          {/* Headcount Forecast - Right side */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <div style={{ marginBottom: sp.xs }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Headcount Forecast</h3>
                  {isContextualDifferent && interpolateValue(staffTimeline, contextualTime) && (
                    <span style={{ fontSize: '12px', padding: '2px 6px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                      @{contextualTime}: <strong>{interpolateValue(staffTimeline, contextualTime)} FTE</strong>
                    </span>
                  )}
                </div>
                <Badge status="warning" label="Gap 11-13:00" />
              </div>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Active FTEs on floor • Now: 42 → Pred: 44 @ 14:00 • Target: 48 FTE</p>
            </div>
            <div style={{ height: 100, overflow: 'hidden' }}>
              <PredictiveTimeline data={staffTimeline} height={100} target={48} warning={44} critical={40} contextualTime={contextualTime} />
            </div>
          </div>
        </div>
      </Card>
      
      {/* ===== STAFF ROSTER WITH ATTENDANCE FILTERS ===== */}
      {/* Staff Roster - Using DataGrid */}
      <DataGrid 
        title="Staff Roster" 
        subtitle="All employees • Filter by shift, role, or status" 
        columns={staffColumns} 
        data={staffData} 
        color={C.purple[500]} 
        entityType="staff"
        filterOptions={[
          { key: 'shift', label: 'Shift', options: ['day', 'swing', 'night'] },
          { key: 'role', label: 'Role', options: [...new Set(staffData.map(s => s.role))] },
          { key: 'status', label: 'Status', options: ['Active', 'Break', 'Call-out', 'Late', 'Scheduled', 'Off'] }
        ]}
        onAction={(action, row) => {
          if (action === 'view' && onNavigateToStaff) {
            onNavigateToStaff(row.id, row.name);
          }
        }}
      />
      
      {/* ===== PREDICTIVE ALERTS ===== */}
      <Card style={{ borderLeft: `4px solid ${C.purple[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.purple[600] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for staffing • Click for details</p></div>
          <Badge status="purple" label={`${staffAlerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {staffAlerts.map((a, i) => (
            <Alert 
              key={i} 
              {...a} 
              onClick={() => onNavigateToAlert && onNavigateToAlert(a.id, a.category, true)}
            />
          ))}
        </div>
        <div 
          onClick={() => onViewInsights && onViewInsights()}
          style={{ 
            marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs,
            cursor: 'pointer', color: C.purple[600], fontSize: '13px', fontWeight: 500
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = C.purple[700]}
          onMouseLeave={(e) => e.currentTarget.style.color = C.purple[600]}
        >
          View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
        </div>
      </Card>
    </>
  );
};

export default StaffTabContent;
