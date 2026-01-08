import React, { useState } from 'react';
import {
  Calendar, Users, Truck, Package, Wrench, Coffee, Clock,
  TrendingUp, TrendingDown, AlertTriangle, ChevronRight, ChevronDown,
  ArrowRight, Activity, MapPin, Zap, X, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import shared data
import { ALERTS_DATA } from '../../data/alertsData';

// Import UI components
import { Card, Badge, Alert, Header } from '../../components/UI';

// Schedule Tab Content - facility-level schedule overview
const ScheduleTabContent = ({ onViewInsights, onNavigateToStaff, onNavigateToWork, onNavigateToEquipment, onNavigateToAlert }) => {
  const { contextualTime, isContextualDifferent, interpolateValue } = useTimeContext();
  const [scheduleSubTab, setScheduleSubTab] = useState('staffing');
  const [expandedInboundDock, setExpandedInboundDock] = useState(null);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [expandedOutboundDock, setExpandedOutboundDock] = useState(null);
  const [expandedCarrierPickup, setExpandedCarrierPickup] = useState(null);
  
  // ===== STAFFING TAB DATA =====
  const staffingScoreComponents = [
    { label: 'Shift Coverage', value: 88, target: 100, weight: 30, detail: '42/48 FTE on Day Shift', status: 'warning' },
    { label: 'Cutoff Compliance', value: 75, target: 100, weight: 25, detail: '3 of 4 carriers on track', status: 'warning' },
    { label: 'Break Compliance', value: 92, target: 100, weight: 15, detail: 'All breaks within window', status: 'success' },
    { label: 'Handoff Efficiency', value: 95, target: 100, weight: 15, detail: 'Night→Day was clean', status: 'success' },
    { label: 'Schedule Adherence', value: 87, target: 100, weight: 15, detail: '3 late arrivals today', status: 'warning' }
  ];
  const staffingCompositeScore = Math.round(staffingScoreComponents.reduce((sum, c) => sum + (c.value * c.weight / 100), 0));
  
  // ===== SHIFT DATA =====
  const shifts = [
    { 
      id: 'day', name: 'Day Shift', time: '06:00 - 14:00', status: 'active',
      staffPlanned: 48, staffActual: 42, callOuts: 4, late: 2,
      progress: 50, hoursRemaining: 4,
      throughput: 4200, throughputTarget: 4560,
      color: C.brand[500]
    },
    { 
      id: 'swing', name: 'Swing Shift', time: '14:00 - 22:00', status: 'upcoming',
      staffPlanned: 42, staffActual: 38, callOuts: 2, late: 0,
      progress: 0, hoursRemaining: 8,
      throughput: null, throughputTarget: 3800,
      color: C.purple[500]
    },
    { 
      id: 'night', name: 'Night Shift', time: '22:00 - 06:00', status: 'completed',
      staffPlanned: 28, staffActual: 26, callOuts: 1, late: 1,
      progress: 100, hoursRemaining: 0,
      throughput: 3850, throughputTarget: 3600,
      color: C.neutral[600]
    }
  ];
  
  // ===== UPCOMING EVENTS =====
  const upcomingEvents = [
    { time: '10:30', type: 'break', label: 'Break Wave 1', detail: '12 FTE rotating', status: 'upcoming', icon: Coffee },
    { time: '12:00', type: 'break', label: 'Lunch Break', detail: '20 FTE — coverage may drop', status: 'warning', icon: Coffee },
    { time: '14:00', type: 'cutoff', label: 'FedEx Ground Cutoff', detail: '1,920 predicted / 1,850 target', status: 'success', icon: Truck },
    { time: '14:00', type: 'handoff', label: 'Day → Swing Handoff', detail: 'Clean transition expected', status: 'success', icon: Users },
    { time: '15:30', type: 'cutoff', label: 'UPS Cutoff', detail: '1,380 predicted / 1,420 target', status: 'warning', icon: Truck },
    { time: '16:00', type: 'cutoff', label: 'USPS Cutoff', detail: '910 predicted / 890 target', status: 'success', icon: Truck }
  ];
  
  // ===== CARRIER CUTOFFS =====
  const carrierCutoffs = [
    { carrier: 'FedEx Ground', cutoff: '14:00', hoursOut: 4, target: 1850, current: 1247, predicted: 1920, velocity: 168, velocityNeeded: 151, status: 'success' },
    { carrier: 'UPS', cutoff: '15:30', hoursOut: 5.5, target: 1420, current: 680, predicted: 1380, velocity: 127, velocityNeeded: 135, status: 'warning' },
    { carrier: 'USPS', cutoff: '16:00', hoursOut: 6, target: 890, current: 445, predicted: 910, velocity: 74, velocityNeeded: 74, status: 'success' },
    { carrier: 'FedEx Express', cutoff: '17:00', hoursOut: 7, target: 320, current: 124, predicted: 340, velocity: 46, velocityNeeded: 28, status: 'success' }
  ];
  
  // ===== BREAK SCHEDULE =====
  const breakSchedule = [
    { time: '10:30', wave: 'Wave 1', fteCount: 12, coverage: 30, coverageMin: 28, status: 'success' },
    { time: '12:00', wave: 'Lunch', fteCount: 20, coverage: 22, coverageMin: 24, status: 'warning', alert: 'Coverage may drop below minimum' },
    { time: '13:30', wave: 'Wave 2', fteCount: 10, coverage: 32, coverageMin: 28, status: 'success' }
  ];
  
  // ===== ALERTS =====
  // Staffing alerts using shared data
  const staffingAlerts = [
    { ...ALERTS_DATA['staffing-break-coverage'], title: 'Lunch Break Coverage Gap — 12:00', msg: '22 FTE predicted vs 24 minimum. Consider staggering 4 breaks or extending 2 Day Shift workers.' },
    ALERTS_DATA['staffing-ups-cutoff'],
    { ...ALERTS_DATA['staffing-swing-callout'], title: 'Day → Swing Handoff @ 14:00', sev: 'info', msg: 'Clean transition expected. Swing shift fully staffed for volume.' },
    ALERTS_DATA['outbound-fedex-ground-ok']
  ];

  return (
    <>
      <Header icon={Calendar} title="Schedule Overview" sub="Staffing, dock appointments, carrier pickups, and maintenance windows" color={C.greenLight[500]} />
      
      {/* Schedule Sub-tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 0, 
        marginBottom: sp.md,
        borderBottom: `1px solid ${C.neutral[200]}`
      }}>
        {[
          { id: 'staffing', label: 'Staffing', icon: Users, color: C.purple[500] },
          { id: 'inbound', label: 'Inbound', icon: Truck, color: C.blueLight[500] },
          { id: 'outbound', label: 'Outbound', icon: Package, color: C.orange[500] },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: C.neutral[600] }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              onClick={() => setScheduleSubTab(tab.id)}
              style={{
                padding: `${sp.sm} ${sp.md}`,
                fontSize: '13px',
                fontWeight: 500,
                color: scheduleSubTab === tab.id ? C.neutral[900] : C.neutral[500],
                borderBottom: scheduleSubTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                marginBottom: '-1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: sp.xs,
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => { if (scheduleSubTab !== tab.id) e.currentTarget.style.color = C.neutral[700]; }}
              onMouseLeave={(e) => { if (scheduleSubTab !== tab.id) e.currentTarget.style.color = C.neutral[500]; }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {tab.label}
            </div>
          );
        })}
      </div>
      
      {/* ===== STAFFING SUB-TAB ===== */}
      {scheduleSubTab === 'staffing' && (
        <>
        {/* Composite Score Breakdown */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.lg, marginBottom: sp.md }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: `conic-gradient(${staffingCompositeScore >= 85 ? C.success[500] : staffingCompositeScore >= 70 ? C.warning[500] : C.error[500]} ${staffingCompositeScore * 3.6}deg, ${C.neutral[100]} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 600, color: staffingCompositeScore >= 85 ? C.success[600] : staffingCompositeScore >= 70 ? C.warning[600] : C.error[600] }}>{staffingCompositeScore}</span>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>STAFFING</span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Score Breakdown</h3>
                <span style={{ fontSize: '12px', color: C.neutral[500] }}>Weighted composite of 5 factors</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {staffingScoreComponents.map((comp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <span style={{ fontSize: '12px', color: C.neutral[600], width: 120, flexShrink: 0 }}>{comp.label}</span>
                    <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${comp.value}%`, height: '100%', borderRadius: 4,
                        background: comp.status === 'error' ? C.error[500] : comp.status === 'warning' ? C.warning[500] : C.success[500]
                      }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, width: 32, textAlign: 'right', color: comp.status === 'error' ? C.error[600] : comp.status === 'warning' ? C.warning[600] : C.success[600] }}>{comp.value}%</span>
                    <span style={{ fontSize: '10px', color: C.neutral[400], width: 16, textAlign: 'right' }}>{comp.weight}%</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500], width: 140 }}>{comp.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ background: C.warning[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />
            <span style={{ fontSize: '12px', color: C.warning[700] }}>
              <strong>Watch:</strong> Cutoff Compliance (75%) at risk due to UPS trajectory. 
              Shift Coverage gap (6 FTE) contributing to velocity shortfall.
            </span>
          </div>
        </Card>
        
        {/* Today's Shifts */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Today's Shifts</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Shift progress, staffing, and throughput • Click to view staff</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {shifts.map((s, i) => {
            const staffPct = Math.round((s.staffActual / s.staffPlanned) * 100);
            const tpPct = s.throughput ? Math.round((s.throughput / s.throughputTarget) * 100) : null;
            return (
              <div 
                key={i} 
                onClick={() => onNavigateToStaff && onNavigateToStaff(s.id)}
                style={{ 
                  padding: sp.md, 
                  background: s.status === 'active' ? C.brand[50] : C.neutral[50], 
                  borderRadius: 8, 
                  border: `1px solid ${s.status === 'active' ? C.brand[200] : C.neutral[200]}`,
                  borderLeft: `4px solid ${s.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, marginBottom: s.status === 'active' ? sp.sm : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{s.name}</p>
                      <Badge status={s.status === 'active' ? 'success' : s.status === 'completed' ? 'neutral' : 'purple'} label={s.status === 'active' ? 'LIVE' : s.status === 'completed' ? 'Done' : 'Next'} dot={s.status === 'active'} />
                    </div>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>{s.time}</p>
                  </div>
                  
                  {/* Staffing */}
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Staffing</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: staffPct >= 90 ? C.success[600] : C.warning[600] }}>
                      {s.staffActual}/{s.staffPlanned}
                    </p>
                    {s.callOuts > 0 && <p style={{ fontSize: '10px', color: C.error[500] }}>{s.callOuts} call-outs</p>}
                  </div>
                  
                  {/* Throughput */}
                  <div style={{ textAlign: 'center', minWidth: 100 }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Throughput</p>
                    {s.throughput !== null ? (
                      <p style={{ fontSize: '14px', fontWeight: 500, color: tpPct >= 95 ? C.success[600] : tpPct >= 85 ? C.warning[600] : C.error[600] }}>
                        {s.throughput.toLocaleString()} <span style={{ fontSize: '10px', color: C.neutral[400] }}>({tpPct}%)</span>
                      </p>
                    ) : (
                      <p style={{ fontSize: '14px', color: C.neutral[400] }}>—</p>
                    )}
                  </div>
                  
                  {/* Progress/Time */}
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    {s.status === 'active' && (
                      <>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>{s.hoursRemaining}h remaining</p>
                        <p style={{ fontSize: '14px', fontWeight: 500 }}>{s.progress}%</p>
                      </>
                    )}
                    {s.status === 'completed' && <p style={{ fontSize: '12px', color: C.success[600] }}>✓ Complete</p>}
                    {s.status === 'upcoming' && <p style={{ fontSize: '12px', color: C.purple[600] }}>Starts in {s.hoursRemaining - 4}h</p>}
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                </div>
                
                {/* Progress bar for active shift */}
                {s.status === 'active' && (
                  <div style={{ height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${s.progress}%`, height: '100%', background: C.brand[500] }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* ===== UPCOMING EVENTS TIMELINE ===== */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Upcoming Events</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Breaks, cutoffs, and handoffs for next 6 hours • Click for details</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
          {upcomingEvents.map((event, i) => {
            const Icon = event.icon;
            const colors = {
              break: { bg: C.blueLight[100], icon: C.blueLight[600], border: C.blueLight[200] },
              cutoff: { bg: C.orange[50], icon: C.orange[500], border: C.orange[200] },
              handoff: { bg: C.purple[50], icon: C.purple[500], border: C.purple[200] }
            };
            const c = colors[event.type];
            return (
              <div 
                key={i} 
                onClick={() => {
                  // Navigate based on event type
                  if (event.type === 'break') {
                    onNavigateToStaff && onNavigateToStaff(null); // Go to Staff tab
                  } else if (event.type === 'cutoff') {
                    onNavigateToWork && onNavigateToWork(); // Go to Work Content
                  } else if (event.type === 'handoff') {
                    onNavigateToStaff && onNavigateToStaff(null); // Go to Staff tab
                  }
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: sp.md, 
                  padding: sp.sm,
                  background: event.status === 'warning' ? C.warning[50] : C.neutral[50],
                  borderRadius: 6,
                  border: `1px solid ${event.status === 'warning' ? C.warning[200] : C.neutral[200]}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.neutral[700], width: 50 }}>{event.time}</span>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 14, height: 14, color: c.icon }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{event.label}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>{event.detail}</p>
                </div>
                <Badge status={event.status === 'warning' ? 'warning' : event.status === 'success' ? 'success' : 'neutral'} label={event.status === 'warning' ? 'At Risk' : event.status === 'success' ? 'On Track' : 'Upcoming'} />
                <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* ===== CARRIER CUTOFFS ===== */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Carrier Cutoffs</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Progress and velocity toward pickup deadlines • Click for details</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {carrierCutoffs.map((c, i) => {
            const currentPct = Math.round((c.current / c.target) * 100);
            const willMeet = c.predicted >= c.target;
            return (
              <div 
                key={i} 
                onClick={() => onNavigateToWork && onNavigateToWork()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: sp.md,
                  padding: sp.md, 
                  background: c.status === 'warning' ? C.warning[50] : C.neutral[50], 
                  borderRadius: 8,
                  border: `1px solid ${c.status === 'warning' ? C.warning[200] : C.neutral[200]}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ width: 120, flexShrink: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{c.carrier}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>{c.cutoff} ({c.hoursOut}h out)</p>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '11px' }}>
                    <span style={{ color: C.neutral[500] }}>{c.current.toLocaleString()} done</span>
                    <span style={{ color: C.purple[600] }}>{c.predicted.toLocaleString()} pred</span>
                  </div>
                  <div style={{ height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${currentPct}%`, height: '100%', background: c.status === 'success' ? C.success[500] : C.warning[500] }} />
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Velocity</p>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: c.velocity >= c.velocityNeeded ? C.success[600] : C.warning[600] }}>
                    {c.velocity}/hr
                  </p>
                  <p style={{ fontSize: '10px', color: C.neutral[400] }}>need {c.velocityNeeded}</p>
                </div>
                
                <Badge status={willMeet ? 'success' : 'warning'} label={willMeet ? `+${c.predicted - c.target}` : `${c.predicted - c.target}`} />
                <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
              </div>
            );
          })}
        </div>
        
        {/* View All Work Content link */}
        <div style={{ marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}`, display: 'flex', justifyContent: 'flex-end' }}>
          <span
            onClick={() => onNavigateToWork && onNavigateToWork()}
            style={{ fontSize: '13px', fontWeight: 500, color: C.greenLight[600], cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.greenLight[700]}
            onMouseLeave={(e) => e.currentTarget.style.color = C.greenLight[600]}
          >
            View All Work Content <ChevronRight style={{ width: 14, height: 14 }} />
          </span>
        </div>
      </Card>
      
      {/* ===== BREAK SCHEDULE ===== */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Break Schedule</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Upcoming breaks and coverage impact</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
          {breakSchedule.map((b, i) => (
            <div key={i} style={{ 
              padding: sp.md, 
              background: b.status === 'warning' ? C.warning[50] : C.neutral[50], 
              borderRadius: 8,
              border: `1px solid ${b.status === 'warning' ? C.warning[200] : C.neutral[200]}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{b.time}</span>
                <Badge status={b.status} label={b.wave} />
              </div>
              <p style={{ fontSize: '12px', color: C.neutral[600], marginBottom: sp.xs }}>{b.fteCount} FTE on break</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: C.neutral[500] }}>Coverage:</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: b.coverage >= b.coverageMin ? C.success[600] : C.warning[600] }}>
                  {b.coverage} FTE <span style={{ fontSize: '10px', color: C.neutral[400] }}>(min {b.coverageMin})</span>
                </span>
              </div>
              {b.alert && <p style={{ fontSize: '10px', color: C.warning[600], marginTop: sp.xs }}>{b.alert}</p>}
            </div>
          ))}
        </div>
      </Card>
      
      {/* ===== PREDICTIVE ALERTS ===== */}
      <Card style={{ borderLeft: `4px solid ${C.greenLight[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.greenLight[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 16, height: 16, color: C.greenLight[600] }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for schedule • Click for details</p>
          </div>
          <Badge status="warning" label={`${staffingAlerts.filter(a => a.sev === 'warning' || a.sev === 'critical').length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {staffingAlerts.map((a, i) => (
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
            cursor: 'pointer', color: C.greenLight[600], fontSize: '13px', fontWeight: 500
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = C.greenLight[700]}
          onMouseLeave={(e) => e.currentTarget.style.color = C.greenLight[600]}
        >
          View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
        </div>
      </Card>
      </>
      )}
      
      {/* ===== INBOUND SUB-TAB ===== */}
      {scheduleSubTab === 'inbound' && (
        <>
        {/* Inbound Score Breakdown */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.lg, marginBottom: sp.md }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: `conic-gradient(${C.warning[500]} ${78 * 3.6}deg, ${C.neutral[100]} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 600, color: C.warning[600] }}>78</span>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>INBOUND</span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Inbound Score</h3>
                <span style={{ fontSize: '12px', color: C.neutral[500] }}>Dock utilization & receiving efficiency • Click factor for details</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {[
                  { label: 'On-Time Arrivals', value: 67, weight: 30, detail: '4 of 6 on schedule', status: 'warning', scrollTo: 'inbound-appointments' },
                  { label: 'Dock Utilization', value: 83, weight: 25, detail: '5 of 6 doors active', status: 'warning', scrollTo: 'inbound-docks' },
                  { label: 'Receiving Velocity', value: 88, weight: 25, detail: '94 units/hr vs 107 target', status: 'warning', scrollTo: 'inbound-appointments' },
                  { label: 'Dwell Time', value: 72, weight: 20, detail: 'Avg 48 min vs 35 target', status: 'warning', scrollTo: 'inbound-appointments' }
                ].map((comp, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      const el = document.getElementById(comp.scrollTo);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: sp.sm,
                      padding: `${sp.xs} ${sp.sm}`,
                      margin: `0 -${sp.sm}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[100]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '12px', color: C.neutral[600], width: 110, flexShrink: 0 }}>{comp.label}</span>
                    <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${comp.value}%`, height: '100%', borderRadius: 4, background: comp.status === 'warning' ? C.warning[500] : C.success[500] }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, width: 32, textAlign: 'right', color: comp.status === 'warning' ? C.warning[600] : C.success[600] }}>{comp.value}%</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500], width: 130 }}>{comp.detail}</span>
                    <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ background: C.warning[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />
            <span style={{ fontSize: '12px', color: C.warning[700] }}>
              <strong>Issue:</strong> Truck #T-1847 arrived 45 min early, competing for Dock 1 with scheduled arrival. 
              Truck #T-1852 running 30 min late — receiving crew idle at Dock 3.
            </span>
          </div>
        </Card>
        
        {/* Dock Door Status */}
        <Card id="inbound-docks">
          <div style={{ marginBottom: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Dock Door Status</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Real-time receiving dock availability and assignments • Click for details</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: sp.sm }}>
            {[
              { door: 1, status: 'occupied', truck: 'T-1847', since: '09:45', crew: 2, progress: 65, supplier: 'Acme Manufacturing', pallets: 32, unitsRemaining: 672, estComplete: '11:15' },
              { door: 2, status: 'available', truck: null, since: null, crew: 0, nextAppt: '11:30', nextSupplier: 'Global Parts Co', nextPallets: 22 },
              { door: 3, status: 'waiting', truck: 'T-1852', since: null, crew: 2, note: 'Crew waiting', supplier: 'BuildMaster', delayReason: 'Traffic on I-95', eta: '10:30' },
              { door: 4, status: 'available', truck: null, since: null, crew: 0, nextAppt: '13:00', nextSupplier: 'TechSupply Inc', nextPallets: 16 },
              { door: 5, status: 'available', truck: null, since: null, crew: 0, nextAppt: '14:30', nextSupplier: 'PackRight LLC', nextPallets: 14 },
              { door: 6, status: 'maintenance', truck: null, since: null, crew: 0, note: 'Door sensor repair', maintTech: 'R. Chen', estReturn: '12:00' }
            ].map((dock, i) => {
              const colors = {
                occupied: { bg: C.brand[100], border: C.brand[300], icon: C.brand[600] },
                available: { bg: C.success[50], border: C.success[200], icon: C.success[600] },
                waiting: { bg: C.warning[50], border: C.warning[200], icon: C.warning[600] },
                maintenance: { bg: C.neutral[100], border: C.neutral[300], icon: C.neutral[500] }
              };
              const c = colors[dock.status];
              const isExpanded = expandedInboundDock === dock.door;
              
              return (
                <div 
                  key={i} 
                  onClick={() => setExpandedInboundDock(isExpanded ? null : dock.door)}
                  style={{ 
                    padding: sp.md, 
                    background: c.bg, 
                    borderRadius: 8, 
                    border: `2px solid ${isExpanded ? c.icon : c.border}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isExpanded ? `0 4px 12px ${c.icon}30` : 'none'
                  }}
                  onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p style={{ fontSize: '20px', fontWeight: 600, color: c.icon }}>D{dock.door}</p>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: c.icon, textTransform: 'uppercase', marginBottom: sp.xs }}>
                    {dock.status}
                  </p>
                  
                  {dock.truck && (
                    <p style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[700] }}>{dock.truck}</p>
                  )}
                  {dock.since && (
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Since {dock.since}</p>
                  )}
                  {dock.progress && (
                    <div style={{ marginTop: sp.xs }}>
                      <div style={{ height: 4, background: C.neutral[200], borderRadius: 2 }}>
                        <div style={{ width: `${dock.progress}%`, height: '100%', background: C.brand[500], borderRadius: 2 }} />
                      </div>
                      <p style={{ fontSize: '10px', color: C.neutral[500], marginTop: 2 }}>{dock.progress}%</p>
                    </div>
                  )}
                  {dock.nextAppt && (
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Next: {dock.nextAppt}</p>
                  )}
                  {dock.note && (
                    <p style={{ fontSize: '10px', color: dock.status === 'waiting' ? C.warning[600] : C.neutral[500] }}>{dock.note}</p>
                  )}
                  {dock.crew > 0 && (
                    <p style={{ fontSize: '10px', color: C.neutral[600], marginTop: sp.xs }}>{dock.crew} FTE assigned</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Expanded Dock Detail */}
          {expandedInboundDock && (() => {
            const dockData = [
              { door: 1, status: 'occupied', truck: 'T-1847', since: '09:45', crew: 2, progress: 65, supplier: 'Acme Manufacturing', pallets: 32, unitsRemaining: 672, estComplete: '11:15', carrier: 'ABC Freight', po: 'PO-88450' },
              { door: 2, status: 'available', truck: null, since: null, crew: 0, nextAppt: '11:30', nextSupplier: 'Global Parts Co', nextPallets: 22, nextCarrier: 'FastHaul' },
              { door: 3, status: 'waiting', truck: 'T-1852', since: null, crew: 2, note: 'Crew waiting', supplier: 'BuildMaster', delayReason: 'Traffic on I-95', eta: '10:30', carrier: 'Continental Carriers', pallets: 28, po: 'PO-88455' },
              { door: 4, status: 'available', truck: null, since: null, crew: 0, nextAppt: '13:00', nextSupplier: 'TechSupply Inc', nextPallets: 16, nextCarrier: 'XPress Logistics' },
              { door: 5, status: 'available', truck: null, since: null, crew: 0, nextAppt: '14:30', nextSupplier: 'PackRight LLC', nextPallets: 14, nextCarrier: 'Regional Transport' },
              { door: 6, status: 'maintenance', truck: null, since: null, crew: 0, note: 'Door sensor repair', maintTech: 'R. Chen', estReturn: '12:00', workOrder: 'WO-2853' }
            ].find(d => d.door === expandedInboundDock);
            
            if (!dockData) return null;
            
            const colors = {
              occupied: { bg: C.brand[50], border: C.brand[200], accent: C.brand[600] },
              available: { bg: C.success[50], border: C.success[200], accent: C.success[600] },
              waiting: { bg: C.warning[50], border: C.warning[200], accent: C.warning[600] },
              maintenance: { bg: C.neutral[50], border: C.neutral[200], accent: C.neutral[600] }
            };
            const dc = colors[dockData.status];
            
            return (
              <div style={{ 
                marginTop: sp.md, 
                padding: sp.md, 
                background: dc.bg, 
                borderRadius: 8, 
                border: `1px solid ${dc.border}` 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: dc.accent }}>Dock {dockData.door} Details</h4>
                    <p style={{ fontSize: '12px', color: C.neutral[500], textTransform: 'capitalize' }}>{dockData.status}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedInboundDock(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <X style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </button>
                </div>
                
                {dockData.status === 'occupied' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Truck</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.truck}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.carrier}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Supplier</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.supplier}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.po}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Progress</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.progress}% complete</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.unitsRemaining} units left</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Est. Complete</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.estComplete}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.crew} FTE assigned</p>
                    </div>
                  </div>
                )}
                
                {dockData.status === 'available' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Next Appointment</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextAppt}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Supplier</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextSupplier}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.nextCarrier}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Expected Load</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextPallets} pallets</p>
                    </div>
                  </div>
                )}
                
                {dockData.status === 'waiting' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Truck</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.truck}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.carrier}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Supplier</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.supplier}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.po}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Delay Reason</p>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: C.warning[600] }}>{dockData.delayReason}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>ETA</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.eta}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.crew} FTE waiting</p>
                    </div>
                  </div>
                )}
                
                {dockData.status === 'maintenance' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Issue</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.note}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Technician</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.maintTech}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.workOrder}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Est. Return</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.estReturn}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
        
        {/* Today's Dock Appointments */}
        <Card id="inbound-appointments">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Today's Dock Appointments</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Scheduled inbound trucks and receiving status • Click for details</p>
            </div>
            <div style={{ display: 'flex', gap: sp.xs }}>
              <Badge status="success" label="4 Complete" />
              <Badge status="warning" label="2 In Progress" />
              <Badge status="neutral" label="3 Upcoming" />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {[
              { id: 'T-1842', carrier: 'ABC Freight', supplier: 'Acme Manufacturing', scheduled: '06:00', actual: '06:12', dock: 'Dock 1', status: 'complete', pallets: 24, units: 1440, po: 'PO-88421', unloadTime: 42, skus: 48, receivedBy: 'M. Santos', putawayZone: 'Bulk Storage' },
              { id: 'T-1844', carrier: 'FastHaul', supplier: 'Global Parts Co', scheduled: '07:30', actual: '07:28', dock: 'Dock 2', status: 'complete', pallets: 18, units: 864, po: 'PO-88435', unloadTime: 35, skus: 32, receivedBy: 'C. Mendez', putawayZone: 'Reserve 1' },
              { id: 'T-1845', carrier: 'XPress Logistics', supplier: 'TechSupply Inc', scheduled: '08:00', actual: '08:15', dock: 'Dock 4', status: 'complete', pallets: 12, units: 720, po: 'PO-88440', unloadTime: 28, skus: 24, receivedBy: 'J. Martinez', putawayZone: 'Forward Pick A' },
              { id: 'T-1846', carrier: 'Regional Transport', supplier: 'PackRight LLC', scheduled: '09:00', actual: '08:55', dock: 'Dock 5', status: 'complete', pallets: 20, units: 960, po: 'PO-88442', unloadTime: 38, skus: 36, receivedBy: 'D. Kim', putawayZone: 'Bulk Storage' },
              { id: 'T-1847', carrier: 'ABC Freight', supplier: 'Acme Manufacturing', scheduled: '10:30', actual: '09:45', dock: 'Dock 1', status: 'unloading', pallets: 32, units: 1920, po: 'PO-88450', unloadTime: null, issue: 'Arrived 45 min early — dock conflict', skus: 56, assignedCrew: ['M. Brown', 'L. Chen'], progress: 65, unitsRemaining: 672 },
              { id: 'T-1852', carrier: 'Continental Carriers', supplier: 'BuildMaster', scheduled: '10:00', actual: null, dock: 'Dock 3', status: 'delayed', pallets: 28, units: 1680, po: 'PO-88455', eta: '10:30', issue: 'Running 30 min late — traffic on I-95', skus: 42, assignedCrew: ['R. Patel', 'A. Garcia'], waitingSince: '09:45' },
              { id: 'T-1855', carrier: 'FastHaul', supplier: 'Global Parts Co', scheduled: '11:30', actual: null, dock: 'Dock 2', status: 'scheduled', pallets: 22, units: 1056, po: 'PO-88460', skus: 28 },
              { id: 'T-1858', carrier: 'XPress Logistics', supplier: 'TechSupply Inc', scheduled: '13:00', actual: null, dock: 'Dock 4', status: 'scheduled', pallets: 16, units: 960, po: 'PO-88465', skus: 20 },
              { id: 'T-1860', carrier: 'Regional Transport', supplier: 'PackRight LLC', scheduled: '14:30', actual: null, dock: 'Dock 6', status: 'scheduled', pallets: 14, units: 672, po: 'PO-88470', skus: 18 }
            ].map((appt, i) => {
              const statusColors = {
                complete: { bg: C.success[50], border: C.success[200], text: C.success[700], label: 'Complete' },
                unloading: { bg: C.brand[50], border: C.brand[200], text: C.brand[700], label: 'Unloading' },
                delayed: { bg: C.error[50], border: C.error[200], text: C.error[700], label: 'Delayed' },
                scheduled: { bg: C.neutral[50], border: C.neutral[200], text: C.neutral[600], label: 'Scheduled' }
              };
              const sc = statusColors[appt.status];
              const isExpanded = expandedAppointment === appt.id;
              
              return (
                <div key={i}>
                  <div 
                    onClick={() => setExpandedAppointment(isExpanded ? null : appt.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: sp.md, 
                      background: sc.bg, 
                      borderRadius: isExpanded ? '8px 8px 0 0' : 8,
                      border: `1px solid ${isExpanded ? sc.text : sc.border}`,
                      borderBottom: isExpanded ? 'none' : `1px solid ${sc.border}`,
                      gap: sp.md,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Time */}
                    <div style={{ width: 70, flexShrink: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{appt.scheduled}</p>
                      {appt.actual && appt.status !== 'scheduled' && (
                        <p style={{ fontSize: '10px', color: appt.actual !== appt.scheduled ? C.warning[600] : C.success[600] }}>
                          Actual: {appt.actual}
                        </p>
                      )}
                      {appt.eta && <p style={{ fontSize: '10px', color: C.error[600] }}>ETA: {appt.eta}</p>}
                    </div>
                    
                    {/* Truck & Supplier */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{appt.id}</span>
                        <span style={{ fontSize: '11px', color: C.neutral[500] }}>{appt.carrier}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: C.neutral[600] }}>{appt.supplier} • {appt.po}</p>
                      {appt.issue && (
                        <p style={{ fontSize: '11px', color: C.error[600], marginTop: 2 }}>⚠ {appt.issue}</p>
                      )}
                    </div>
                    
                    {/* Dock */}
                    <div style={{ textAlign: 'center', width: 60 }}>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Dock</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: C.blueLight[600] }}>{appt.dock.replace('Dock ', '')}</p>
                    </div>
                    
                    {/* Cargo */}
                    <div style={{ textAlign: 'center', width: 70 }}>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pallets</p>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{appt.pallets}</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', width: 70 }}>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Units</p>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{appt.units.toLocaleString()}</p>
                    </div>
                    
                    {/* Unload Time / Status */}
                    <div style={{ width: 90, textAlign: 'right' }}>
                      {appt.unloadTime && (
                        <p style={{ fontSize: '12px', color: C.neutral[600] }}>{appt.unloadTime} min</p>
                      )}
                      <Badge status={appt.status === 'complete' ? 'success' : appt.status === 'unloading' ? 'info' : appt.status === 'delayed' ? 'error' : 'neutral'} label={sc.label} />
                    </div>
                    
                    <ChevronRight style={{ 
                      width: 16, height: 16, color: C.neutral[400],
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s'
                    }} />
                  </div>
                  
                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div style={{ 
                      padding: sp.md, 
                      background: `${sc.bg}`, 
                      borderRadius: '0 0 8px 8px',
                      border: `1px solid ${sc.text}`,
                      borderTop: `1px dashed ${sc.border}`
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
                        <div>
                          <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>SKUs</p>
                          <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.skus} unique items</p>
                        </div>
                        
                        {appt.status === 'complete' && (
                          <>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Received By</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.receivedBy}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Putaway Zone</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.putawayZone}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Performance</p>
                              <p style={{ fontSize: '13px', fontWeight: 500, color: appt.unloadTime < 40 ? C.success[600] : C.neutral[600] }}>
                                {appt.unloadTime < 40 ? '✓ Under target' : 'On target'}
                              </p>
                            </div>
                          </>
                        )}
                        
                        {appt.status === 'unloading' && (
                          <>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Assigned Crew</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.assignedCrew?.join(', ')}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Progress</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                                <div style={{ flex: 1, height: 6, background: C.neutral[200], borderRadius: 3 }}>
                                  <div style={{ width: `${appt.progress}%`, height: '100%', background: C.brand[500], borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 500 }}>{appt.progress}%</span>
                              </div>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Units Remaining</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.unitsRemaining?.toLocaleString()}</p>
                            </div>
                          </>
                        )}
                        
                        {appt.status === 'delayed' && (
                          <>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Assigned Crew</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.assignedCrew?.join(', ')}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Waiting Since</p>
                              <p style={{ fontSize: '13px', fontWeight: 500, color: C.warning[600] }}>{appt.waitingSince}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Idle Time</p>
                              <p style={{ fontSize: '13px', fontWeight: 500, color: C.error[600] }}>~45 min</p>
                            </div>
                          </>
                        )}
                        
                        {appt.status === 'scheduled' && (
                          <>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Est. Unload Time</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{Math.round(appt.pallets * 1.8)} min</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Crew Needed</p>
                              <p style={{ fontSize: '13px', fontWeight: 500 }}>{appt.pallets > 20 ? 2 : 1} FTE</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Inbound Analysis */}
        <Card style={{ borderLeft: `4px solid ${C.blueLight[500]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.blueLight[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 16, height: 16, color: C.blueLight[600] }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for inbound operations • Click for details</p>
            </div>
            <Badge status="warning" label="2 Active" style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            <Alert 
              {...ALERTS_DATA['inbound-dock-congestion']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('inbound-dock-congestion', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['inbound-crew-gap']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('inbound-crew-gap', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['inbound-afternoon-light']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('inbound-afternoon-light', 'schedules', true)}
            />
          </div>
          <div 
            onClick={() => onViewInsights && onViewInsights()}
            style={{ 
              marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs,
              cursor: 'pointer', color: C.blueLight[600], fontSize: '13px', fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.blueLight[700]}
            onMouseLeave={(e) => e.currentTarget.style.color = C.blueLight[600]}
          >
            View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
          </div>
        </Card>
        </>
      )}
      
      {/* ===== OUTBOUND SUB-TAB ===== */}
      {scheduleSubTab === 'outbound' && (
        <>
        {/* Outbound Score Breakdown */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.lg, marginBottom: sp.md }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: `conic-gradient(${C.warning[500]} ${82 * 3.6}deg, ${C.neutral[100]} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 600, color: C.warning[600] }}>82</span>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>OUTBOUND</span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Outbound Score</h3>
                <span style={{ fontSize: '12px', color: C.neutral[500] }}>Shipping efficiency & carrier compliance • Click factor for details</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {[
                  { label: 'Cutoff Compliance', value: 75, weight: 35, detail: '3 of 4 carriers on track', status: 'warning', scrollTo: 'outbound-pickups' },
                  { label: 'Staging Readiness', value: 88, weight: 25, detail: '22 of 25 loads staged', status: 'warning', scrollTo: 'outbound-docks' },
                  { label: 'Dock Utilization', value: 92, weight: 20, detail: '5 of 6 doors active', status: 'success', scrollTo: 'outbound-docks' },
                  { label: 'Load Accuracy', value: 98, weight: 20, detail: '99.1% — 2 corrections today', status: 'success', scrollTo: 'outbound-pickups' }
                ].map((comp, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      const el = document.getElementById(comp.scrollTo);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: sp.sm,
                      padding: `${sp.xs} ${sp.sm}`,
                      margin: `0 -${sp.sm}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[100]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '12px', color: C.neutral[600], width: 110, flexShrink: 0 }}>{comp.label}</span>
                    <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${comp.value}%`, height: '100%', borderRadius: 4, background: comp.status === 'warning' ? C.warning[500] : C.success[500] }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, width: 32, textAlign: 'right', color: comp.status === 'warning' ? C.warning[600] : C.success[600] }}>{comp.value}%</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500], width: 140 }}>{comp.detail}</span>
                    <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ background: C.warning[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />
            <span style={{ fontSize: '12px', color: C.warning[700] }}>
              <strong>Risk:</strong> UPS cutoff (15:30) at risk — current velocity 127/hr vs 135/hr needed. 
              3 loads not yet staged for FedEx Express (17:00 cutoff).
            </span>
          </div>
        </Card>
        
        {/* Shipping Dock Status */}
        <Card id="outbound-docks">
          <div style={{ marginBottom: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Shipping Dock Status</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Outbound dock assignments and trailer status • Click for details</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: sp.sm }}>
            {[
              { door: 7, status: 'loading', carrier: 'FedEx Ground', trailer: 'TRL-4421', progress: 78, orders: 145, eta: '13:45', loaders: ['M. Santos', 'J. Park'], ordersLoaded: 113, pallets: 18, cubeUtil: 72 },
              { door: 8, status: 'loading', carrier: 'UPS', trailer: 'TRL-2287', progress: 42, orders: 89, eta: '14:30', loaders: ['C. Wei'], ordersLoaded: 37, pallets: 12, cubeUtil: 45, behindSchedule: true },
              { door: 9, status: 'staged', carrier: 'USPS', trailer: 'TRL-1156', progress: 100, orders: 112, pickup: '16:00', loaders: [], pallets: 14, cubeUtil: 88, sealNumber: 'USPS-44821' },
              { door: 10, status: 'available', carrier: null, trailer: null, nextCarrier: 'FedEx Express', nextTime: '16:30', nextOrders: 124 },
              { door: 11, status: 'loading', carrier: 'FedEx Ground', trailer: 'TRL-4422', progress: 91, orders: 98, eta: '13:30', loaders: ['R. Patel'], ordersLoaded: 89, pallets: 12, cubeUtil: 68 },
              { door: 12, status: 'available', carrier: null, trailer: null, nextCarrier: 'Regional', nextTime: '17:00', nextOrders: 45 }
            ].map((dock, i) => {
              const colors = {
                loading: { bg: C.orange[50], border: C.orange[200], icon: C.orange[600] },
                staged: { bg: C.success[50], border: C.success[200], icon: C.success[600] },
                available: { bg: C.neutral[50], border: C.neutral[200], icon: C.neutral[500] }
              };
              const c = colors[dock.status];
              const isExpanded = expandedOutboundDock === dock.door;
              
              return (
                <div 
                  key={i} 
                  onClick={() => setExpandedOutboundDock(isExpanded ? null : dock.door)}
                  style={{ 
                    padding: sp.md, 
                    background: c.bg, 
                    borderRadius: 8, 
                    border: `2px solid ${isExpanded ? c.icon : c.border}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isExpanded ? `0 4px 12px ${c.icon}30` : 'none'
                  }}
                  onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p style={{ fontSize: '20px', fontWeight: 600, color: c.icon }}>D{dock.door}</p>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: c.icon, textTransform: 'uppercase', marginBottom: sp.xs }}>
                    {dock.status}
                  </p>
                  
                  {dock.carrier && (
                    <p style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[700] }}>{dock.carrier}</p>
                  )}
                  {dock.trailer && (
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>{dock.trailer}</p>
                  )}
                  {dock.progress !== undefined && dock.progress < 100 && (
                    <div style={{ marginTop: sp.xs }}>
                      <div style={{ height: 4, background: C.neutral[200], borderRadius: 2 }}>
                        <div style={{ width: `${dock.progress}%`, height: '100%', background: C.orange[500], borderRadius: 2 }} />
                      </div>
                      <p style={{ fontSize: '10px', color: C.neutral[500], marginTop: 2 }}>{dock.progress}% • {dock.orders} orders</p>
                    </div>
                  )}
                  {dock.progress === 100 && (
                    <p style={{ fontSize: '10px', color: C.success[600] }}>Ready • {dock.orders} orders</p>
                  )}
                  {dock.eta && <p style={{ fontSize: '10px', color: C.neutral[500] }}>Complete: {dock.eta}</p>}
                  {dock.pickup && <p style={{ fontSize: '10px', color: C.success[600] }}>Pickup: {dock.pickup}</p>}
                  {dock.nextCarrier && (
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Next: {dock.nextCarrier} @ {dock.nextTime}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Expanded Outbound Dock Detail */}
          {expandedOutboundDock && (() => {
            const dockData = [
              { door: 7, status: 'loading', carrier: 'FedEx Ground', trailer: 'TRL-4421', progress: 78, orders: 145, eta: '13:45', loaders: ['M. Santos', 'J. Park'], ordersLoaded: 113, pallets: 18, cubeUtil: 72, startTime: '11:30' },
              { door: 8, status: 'loading', carrier: 'UPS', trailer: 'TRL-2287', progress: 42, orders: 89, eta: '14:30', loaders: ['C. Wei'], ordersLoaded: 37, pallets: 12, cubeUtil: 45, behindSchedule: true, startTime: '12:15', issue: 'Single loader — below target velocity' },
              { door: 9, status: 'staged', carrier: 'USPS', trailer: 'TRL-1156', progress: 100, orders: 112, pickup: '16:00', loaders: [], pallets: 14, cubeUtil: 88, sealNumber: 'USPS-44821', completedAt: '14:20' },
              { door: 10, status: 'available', carrier: null, trailer: null, nextCarrier: 'FedEx Express', nextTime: '16:30', nextOrders: 124, nextPallets: 16 },
              { door: 11, status: 'loading', carrier: 'FedEx Ground', trailer: 'TRL-4422', progress: 91, orders: 98, eta: '13:30', loaders: ['R. Patel'], ordersLoaded: 89, pallets: 12, cubeUtil: 68, startTime: '11:00' },
              { door: 12, status: 'available', carrier: null, trailer: null, nextCarrier: 'Regional', nextTime: '17:00', nextOrders: 45, nextPallets: 8 }
            ].find(d => d.door === expandedOutboundDock);
            
            if (!dockData) return null;
            
            const colors = {
              loading: { bg: C.orange[50], border: C.orange[200], accent: C.orange[600] },
              staged: { bg: C.success[50], border: C.success[200], accent: C.success[600] },
              available: { bg: C.neutral[50], border: C.neutral[200], accent: C.neutral[600] }
            };
            const dc = colors[dockData.status];
            
            return (
              <div style={{ 
                marginTop: sp.md, 
                padding: sp.md, 
                background: dc.bg, 
                borderRadius: 8, 
                border: `1px solid ${dc.border}` 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: dc.accent }}>Dock {dockData.door} Details</h4>
                    <p style={{ fontSize: '12px', color: C.neutral[500], textTransform: 'capitalize' }}>{dockData.status}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedOutboundDock(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <X style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </button>
                </div>
                
                {dockData.status === 'loading' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Carrier / Trailer</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.carrier}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.trailer}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Orders Loaded</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.ordersLoaded} / {dockData.orders}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.pallets} pallets</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Cube Utilization</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.cubeUtil}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Loaders</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.loaders.join(', ') || '—'}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>Started {dockData.startTime}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Est. Complete</p>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: dockData.behindSchedule ? C.warning[600] : C.neutral[700] }}>{dockData.eta}</p>
                      {dockData.behindSchedule && <p style={{ fontSize: '11px', color: C.warning[600] }}>Behind schedule</p>}
                    </div>
                  </div>
                )}
                
                {dockData.status === 'loading' && dockData.issue && (
                  <div style={{ marginTop: sp.sm, padding: sp.sm, background: C.warning[50], borderRadius: 6, display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />
                    <span style={{ fontSize: '12px', color: C.warning[700] }}>{dockData.issue}</span>
                  </div>
                )}
                
                {dockData.status === 'staged' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Carrier / Trailer</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.carrier}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.trailer}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Orders / Pallets</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.orders} orders</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{dockData.pallets} pallets • {dockData.cubeUtil}% cube</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Seal Number</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.sealNumber}</p>
                      <p style={{ fontSize: '11px', color: C.success[600] }}>✓ Sealed & ready</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pickup Time</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.pickup}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>Completed {dockData.completedAt}</p>
                    </div>
                  </div>
                )}
                
                {dockData.status === 'available' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Next Carrier</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextCarrier}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Staging Time</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextTime}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>Expected Load</p>
                      <p style={{ fontSize: '13px', fontWeight: 500 }}>{dockData.nextOrders} orders • {dockData.nextPallets} pallets</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
        
        {/* Carrier Pickup Schedule */}
        <Card id="outbound-pickups">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Carrier Pickup Schedule</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Today's carrier cutoffs and pickup appointments • Click for details</p>
            </div>
            <div style={{ display: 'flex', gap: sp.xs }}>
              <Badge status="success" label="2 On Track" />
              <Badge status="warning" label="1 At Risk" />
              <Badge status="neutral" label="1 Upcoming" />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {[
              { 
                carrier: 'FedEx Ground', cutoff: '14:00', pickup: '14:30', 
                target: 1850, current: 1247, predicted: 1920, velocity: 168, velocityNeeded: 151,
                status: 'on-track', docks: ['D7', 'D11'], loadsStaged: 2, loadsTotal: 2,
                // Extended data
                ordersRemaining: 603, avgOrderSize: 2.3, topSkus: ['SKU-4421', 'SKU-8832', 'SKU-1127'],
                velocityTrend: 'up', velocityHistory: [152, 158, 165, 168], buffer: 70,
                pickQueue: 245, packQueue: 180, shipQueue: 178
              },
              { 
                carrier: 'UPS', cutoff: '15:30', pickup: '16:00', 
                target: 1420, current: 680, predicted: 1380, velocity: 127, velocityNeeded: 135,
                status: 'at-risk', docks: ['D8'], loadsStaged: 0, loadsTotal: 1, issue: 'Velocity 8/hr below target',
                // Extended data
                ordersRemaining: 740, avgOrderSize: 1.8, topSkus: ['SKU-2287', 'SKU-9943', 'SKU-5521'],
                velocityTrend: 'down', velocityHistory: [142, 138, 131, 127], shortfall: 40,
                pickQueue: 412, packQueue: 198, shipQueue: 130,
                recommendation: 'Reassign 2 FTE from Pack Station 2'
              },
              { 
                carrier: 'USPS', cutoff: '16:00', pickup: '16:30', 
                target: 890, current: 445, predicted: 910, velocity: 74, velocityNeeded: 74,
                status: 'on-track', docks: ['D9'], loadsStaged: 1, loadsTotal: 1,
                // Extended data
                ordersRemaining: 445, avgOrderSize: 1.2, topSkus: ['SKU-1156', 'SKU-3378'],
                velocityTrend: 'stable', velocityHistory: [72, 74, 73, 74], buffer: 20,
                pickQueue: 198, packQueue: 147, shipQueue: 100
              },
              { 
                carrier: 'FedEx Express', cutoff: '17:00', pickup: '17:30', 
                target: 320, current: 124, predicted: 340, velocity: 46, velocityNeeded: 28,
                status: 'on-track', docks: ['D10'], loadsStaged: 0, loadsTotal: 1, note: 'Staging begins 16:00',
                // Extended data
                ordersRemaining: 196, avgOrderSize: 3.1, topSkus: ['SKU-7742', 'SKU-8891'],
                velocityTrend: 'up', velocityHistory: [38, 41, 44, 46], buffer: 20,
                pickQueue: 98, packQueue: 62, shipQueue: 36
              }
            ].map((c, i) => {
              const progressPct = Math.round((c.current / c.target) * 100);
              const statusColors = {
                'on-track': { bg: C.success[50], border: C.success[200], accent: C.success[600] },
                'at-risk': { bg: C.warning[50], border: C.warning[200], accent: C.warning[600] }
              };
              const sc = statusColors[c.status];
              const isExpanded = expandedCarrierPickup === c.carrier;
              
              return (
                <div key={i}>
                  <div 
                    onClick={() => setExpandedCarrierPickup(isExpanded ? null : c.carrier)}
                    style={{ 
                      padding: sp.md, 
                      background: sc.bg, 
                      borderRadius: isExpanded ? '8px 8px 0 0' : 8,
                      border: `1px solid ${isExpanded ? sc.accent : sc.border}`,
                      borderBottom: isExpanded ? 'none' : `1px solid ${sc.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                      {/* Carrier */}
                      <div style={{ width: 120, flexShrink: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.carrier}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[500] }}>Cutoff: {c.cutoff} • Pickup: {c.pickup}</p>
                      </div>
                      
                      {/* Progress */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '11px', color: C.neutral[600] }}>{c.current.toLocaleString()} / {c.target.toLocaleString()} orders</span>
                          <span style={{ fontSize: '11px', color: c.status === 'on-track' ? C.success[600] : C.warning[600] }}>
                            {c.predicted.toLocaleString()} predicted
                          </span>
                        </div>
                        <div style={{ height: 8, background: C.neutral[200], borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${progressPct}%`, 
                            height: '100%', 
                            background: c.status === 'on-track' ? C.success[500] : C.warning[500],
                            borderRadius: 4
                          }} />
                        </div>
                      </div>
                      
                      {/* Velocity */}
                      <div style={{ textAlign: 'center', width: 80 }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>Velocity</p>
                        <p style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: c.velocity >= c.velocityNeeded ? C.success[600] : C.warning[600] 
                        }}>
                          {c.velocity}/hr
                        </p>
                        <p style={{ fontSize: '10px', color: C.neutral[400] }}>need {c.velocityNeeded}</p>
                      </div>
                      
                      {/* Staging */}
                      <div style={{ textAlign: 'center', width: 70 }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>Staged</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: c.loadsStaged === c.loadsTotal ? C.success[600] : C.neutral[600] }}>
                          {c.loadsStaged}/{c.loadsTotal}
                        </p>
                      </div>
                      
                      {/* Docks */}
                      <div style={{ textAlign: 'center', width: 60 }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>Docks</p>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: C.orange[600] }}>{c.docks.join(', ')}</p>
                      </div>
                      
                      {/* Status */}
                      <Badge status={c.status === 'on-track' ? 'success' : 'warning'} label={c.status === 'on-track' ? 'On Track' : 'At Risk'} />
                      
                      <ChevronRight style={{ 
                        width: 16, height: 16, color: C.neutral[400],
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s'
                      }} />
                    </div>
                    
                    {(c.issue || c.note) && !isExpanded && (
                      <p style={{ fontSize: '11px', color: c.issue ? C.warning[600] : C.neutral[500], marginTop: sp.xs }}>
                        {c.issue ? `⚠ ${c.issue}` : `ℹ ${c.note}`}
                      </p>
                    )}
                  </div>
                  
                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div style={{ 
                      padding: sp.md, 
                      background: sc.bg, 
                      borderRadius: '0 0 8px 8px',
                      border: `1px solid ${sc.accent}`,
                      borderTop: `1px dashed ${sc.border}`
                    }}>
                      {/* Velocity Trend */}
                      <div style={{ display: 'flex', gap: sp.lg, marginBottom: sp.md }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: sp.xs }}>Velocity Trend (last 4 hours)</p>
                          <div style={{ display: 'flex', alignItems: 'end', gap: 4, height: 40 }}>
                            {c.velocityHistory.map((v, vi) => (
                              <div key={vi} style={{ 
                                flex: 1, 
                                background: vi === c.velocityHistory.length - 1 
                                  ? (c.status === 'on-track' ? C.success[500] : C.warning[500])
                                  : C.neutral[300],
                                height: `${(v / Math.max(...c.velocityHistory)) * 100}%`,
                                borderRadius: 2,
                                minHeight: 8
                              }} />
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: '10px', color: C.neutral[400] }}>-4hr</span>
                            <span style={{ fontSize: '10px', color: C.neutral[400] }}>Now</span>
                          </div>
                        </div>
                        
                        <div style={{ width: 120 }}>
                          <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: sp.xs }}>Trend</p>
                          <p style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: c.velocityTrend === 'up' ? C.success[600] : c.velocityTrend === 'down' ? C.error[600] : C.neutral[600] 
                          }}>
                            {c.velocityTrend === 'up' ? '↑ Increasing' : c.velocityTrend === 'down' ? '↓ Decreasing' : '→ Stable'}
                          </p>
                          {c.buffer && <p style={{ fontSize: '11px', color: C.success[600] }}>+{c.buffer} order buffer</p>}
                          {c.shortfall && <p style={{ fontSize: '11px', color: C.error[600] }}>~{c.shortfall} orders at risk</p>}
                        </div>
                      </div>
                      
                      {/* Queue Breakdown */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginBottom: sp.md }}>
                        <div>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Orders Remaining</p>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.ordersRemaining.toLocaleString()}</p>
                          <p style={{ fontSize: '10px', color: C.neutral[400] }}>Avg {c.avgOrderSize} items/order</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pick Queue</p>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.pickQueue}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Pack Queue</p>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.packQueue}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', color: C.neutral[500] }}>Ship Queue</p>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{c.shipQueue}</p>
                        </div>
                      </div>
                      
                      {/* Top SKUs */}
                      <div style={{ marginBottom: sp.md }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs }}>Top SKUs in Queue</p>
                        <div style={{ display: 'flex', gap: sp.xs }}>
                          {c.topSkus.map((sku, si) => (
                            <span key={si} style={{ 
                              fontSize: '11px', 
                              padding: '2px 8px', 
                              background: C.neutral[100], 
                              borderRadius: 4,
                              color: C.neutral[600]
                            }}>
                              {sku}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Issue/Note with Recommendation */}
                      {(c.issue || c.note) && (
                        <div style={{ 
                          padding: sp.sm, 
                          background: c.issue ? C.warning[100] : C.blueLight[50], 
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: sp.sm
                        }}>
                          {c.issue ? (
                            <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600], flexShrink: 0, marginTop: 2 }} />
                          ) : (
                            <Info style={{ width: 14, height: 14, color: C.blueLight[600], flexShrink: 0, marginTop: 2 }} />
                          )}
                          <div>
                            <p style={{ fontSize: '12px', color: c.issue ? C.warning[700] : C.blueLight[700] }}>
                              {c.issue || c.note}
                            </p>
                            {c.recommendation && (
                              <p style={{ fontSize: '12px', color: C.warning[600], fontWeight: 500, marginTop: 4 }}>
                                💡 Recommendation: {c.recommendation}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* View All Work Content link */}
          <div 
            onClick={() => onNavigateToWork && onNavigateToWork()}
            style={{ 
              marginTop: sp.md, 
              paddingTop: sp.md, 
              borderTop: `1px solid ${C.neutral[200]}`,
              display: 'flex', 
              justifyContent: 'flex-end'
            }}
          >
            <span
              style={{ 
                fontSize: '13px', 
                fontWeight: 500, 
                color: C.orange[600], 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: sp.xs
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = C.orange[700]}
              onMouseLeave={(e) => e.currentTarget.style.color = C.orange[600]}
            >
              View All Work Content <ChevronRight style={{ width: 14, height: 14 }} />
            </span>
          </div>
        </Card>
        
        {/* Outbound Analysis */}
        <Card style={{ borderLeft: `4px solid ${C.orange[500]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.orange[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 16, height: 16, color: C.orange[600] }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for outbound operations • Click for details</p>
            </div>
            <Badge status="warning" label="2 Active" style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            <Alert 
              {...ALERTS_DATA['outbound-ups-cutoff']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('outbound-ups-cutoff', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['outbound-fedex-staging']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('outbound-fedex-staging', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['outbound-fedex-ground-ok']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('outbound-fedex-ground-ok', 'schedules', true)}
            />
          </div>
          <div 
            onClick={() => onViewInsights && onViewInsights()}
            style={{ 
              marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs,
              cursor: 'pointer', color: C.orange[600], fontSize: '13px', fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.orange[700]}
            onMouseLeave={(e) => e.currentTarget.style.color = C.orange[600]}
          >
            View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
          </div>
        </Card>
        </>
      )}
      
      {/* ===== MAINTENANCE SUB-TAB ===== */}
      {scheduleSubTab === 'maintenance' && (
        <>
        {/* Maintenance Score Breakdown */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.lg, marginBottom: sp.md }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', 
              background: `conic-gradient(${C.success[500]} ${91 * 3.6}deg, ${C.neutral[100]} 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 600, color: C.success[600] }}>91</span>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>MAINT</span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Maintenance Score</h3>
                <span style={{ fontSize: '12px', color: C.neutral[500] }}>Equipment health & PM compliance • Click factor for details</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                {[
                  { label: 'PM Compliance', value: 94, weight: 30, detail: '32 of 34 on schedule', status: 'success', scrollTo: 'maint-pm-grid' },
                  { label: 'Equipment Uptime', value: 96, weight: 30, detail: '23 of 24 units operational', status: 'success', scrollTo: 'maint-pm-grid' },
                  { label: 'Work Order Backlog', value: 85, weight: 20, detail: '3 open orders (2 routine)', status: 'warning', scrollTo: 'maint-schedule' },
                  { label: 'Mean Time to Repair', value: 88, weight: 20, detail: 'Avg 45 min vs 40 target', status: 'warning', scrollTo: 'maint-schedule' }
                ].map((comp, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      const el = document.getElementById(comp.scrollTo);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: sp.sm,
                      padding: `${sp.xs} ${sp.sm}`,
                      margin: `0 -${sp.sm}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.neutral[100]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '12px', color: C.neutral[600], width: 120, flexShrink: 0 }}>{comp.label}</span>
                    <div style={{ flex: 1, height: 8, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${comp.value}%`, height: '100%', borderRadius: 4, background: comp.status === 'warning' ? C.warning[500] : C.success[500] }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, width: 32, textAlign: 'right', color: comp.status === 'warning' ? C.warning[600] : C.success[600] }}>{comp.value}%</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500], width: 140 }}>{comp.detail}</span>
                    <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ background: C.blueLight[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Info style={{ width: 16, height: 16, color: C.blueLight[600] }} />
            <span style={{ fontSize: '12px', color: C.blueLight[700] }}>
              <strong>Note:</strong> EPJ-03 currently down for hydraulic repair (Est. completion 11:30). 
              FL-02 PM scheduled for 14:00-15:00 — will reduce Inbound A capacity.
            </span>
          </div>
        </Card>
        
        {/* Today's Maintenance Schedule */}
        <Card id="maint-schedule">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Today's Maintenance Schedule</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Scheduled PM, repairs, and service windows</p>
            </div>
            <div style={{ display: 'flex', gap: sp.xs }}>
              <Badge status="success" label="2 Complete" />
              <Badge status="warning" label="1 In Progress" />
              <Badge status="neutral" label="3 Scheduled" />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {[
              { id: 'WO-2847', type: 'PM', equipment: 'FL-01', desc: '250-hour preventive maintenance', scheduled: '06:00-07:00', actual: '06:00-06:45', status: 'complete', tech: 'J. Martinez', zone: 'Bulk Storage', impact: 'None — completed before shift peak' },
              { id: 'WO-2848', type: 'PM', equipment: 'EPJ-04', desc: 'Battery inspection & terminal cleaning', scheduled: '06:30-07:00', actual: '06:30-06:50', status: 'complete', tech: 'J. Martinez', zone: 'Pack Station 2', impact: 'None' },
              { id: 'WO-2849', type: 'Repair', equipment: 'EPJ-03', desc: 'Hydraulic lift cylinder repair', scheduled: '08:00-11:30', actual: '08:15-', status: 'in-progress', tech: 'R. Chen', zone: 'Inbound A', impact: 'Reduced putaway capacity — rerouting to EPJ-01', progress: 70 },
              { id: 'WO-2850', type: 'PM', equipment: 'FL-02', desc: '250-hour preventive maintenance', scheduled: '14:00-15:00', actual: null, status: 'scheduled', tech: 'J. Martinez', zone: 'Inbound A', impact: 'Plan: Shift FL-03 to cover Inbound A' },
              { id: 'WO-2851', type: 'Inspection', equipment: 'CONV-01', desc: 'Weekly conveyor belt inspection', scheduled: '15:00-15:30', actual: null, status: 'scheduled', tech: 'R. Chen', zone: 'Pack Station 1', impact: 'Brief slowdown — divert to manual lanes' },
              { id: 'WO-2852', type: 'PM', equipment: 'FL-03', desc: 'Pre-shift inspection (idle unit)', scheduled: '13:30-14:00', actual: null, status: 'scheduled', tech: 'M. Torres', zone: 'Reserve 1', impact: 'None — unit currently idle' }
            ].map((wo, i) => {
              const statusColors = {
                complete: { bg: C.success[50], border: C.success[200], badge: 'success', label: 'Complete' },
                'in-progress': { bg: C.brand[50], border: C.brand[200], badge: 'info', label: 'In Progress' },
                scheduled: { bg: C.neutral[50], border: C.neutral[200], badge: 'neutral', label: 'Scheduled' }
              };
              const typeColors = {
                PM: C.success[600],
                Repair: C.warning[600],
                Inspection: C.blueLight[600]
              };
              const sc = statusColors[wo.status];
              
              return (
                <div key={i} style={{ 
                  padding: sp.md, 
                  background: sc.bg, 
                  borderRadius: 8,
                  border: `1px solid ${sc.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.md }}>
                    {/* Time */}
                    <div style={{ width: 90, flexShrink: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: C.neutral[800] }}>{wo.scheduled.split('-')[0]}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>{wo.scheduled}</p>
                      {wo.actual && wo.status === 'complete' && (
                        <p style={{ fontSize: '10px', color: C.success[600] }}>✓ {wo.actual}</p>
                      )}
                    </div>
                    
                    {/* Work Order Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[700] }}>{wo.id}</span>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 600, 
                          padding: '2px 6px', 
                          borderRadius: 4, 
                          background: `${typeColors[wo.type]}20`,
                          color: typeColors[wo.type]
                        }}>
                          {wo.type}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[800] }}>{wo.equipment}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: C.neutral[600], marginBottom: 4 }}>{wo.desc}</p>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>
                        <strong>Zone:</strong> {wo.zone} • <strong>Tech:</strong> {wo.tech}
                      </p>
                      {wo.impact && (
                        <p style={{ fontSize: '11px', color: wo.impact.includes('None') ? C.neutral[400] : C.warning[600], marginTop: 4 }}>
                          {wo.impact.includes('None') ? wo.impact : `⚠ ${wo.impact}`}
                        </p>
                      )}
                    </div>
                    
                    {/* Progress (for in-progress) */}
                    {wo.progress && (
                      <div style={{ width: 60, textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>Progress</p>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: C.brand[600] }}>{wo.progress}%</p>
                        <div style={{ height: 4, background: C.neutral[200], borderRadius: 2, marginTop: 4 }}>
                          <div style={{ width: `${wo.progress}%`, height: '100%', background: C.brand[500], borderRadius: 2 }} />
                        </div>
                      </div>
                    )}
                    
                    {/* Status */}
                    <Badge status={sc.badge} label={sc.label} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Equipment PM Status Grid */}
        <Card id="maint-pm-grid">
          <div style={{ marginBottom: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Equipment PM Status</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Preventive maintenance schedule by equipment • Click to view equipment</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { id: 'FL-01', type: 'Forklift', lastPM: 'Today', nextPM: '+250 hrs', hours: 12, status: 'current' },
              { id: 'FL-02', type: 'Forklift', lastPM: '12 days ago', nextPM: 'Today 14:00', hours: 248, status: 'due' },
              { id: 'FL-03', type: 'Forklift', lastPM: '8 days ago', nextPM: '+180 hrs', hours: 70, status: 'current' },
              { id: 'EPJ-01', type: 'Pallet Jack', lastPM: '5 days ago', nextPM: '+120 hrs', hours: 45, status: 'current' },
              { id: 'EPJ-02', type: 'Pallet Jack', lastPM: '3 days ago', nextPM: '+145 hrs', hours: 22, status: 'current' },
              { id: 'EPJ-03', type: 'Pallet Jack', lastPM: '—', nextPM: 'After repair', hours: 0, status: 'down' },
              { id: 'EPJ-04', type: 'Pallet Jack', lastPM: 'Today', nextPM: '+165 hrs', hours: 8, status: 'current' },
              { id: 'CONV-01', type: 'Conveyor', lastPM: '6 days ago', nextPM: 'Today 15:00', hours: null, status: 'due' }
            ].map((eq, i) => {
              const colors = {
                current: { bg: C.success[50], border: C.success[200], text: C.success[700] },
                due: { bg: C.warning[50], border: C.warning[200], text: C.warning[700] },
                overdue: { bg: C.error[50], border: C.error[200], text: C.error[700] },
                down: { bg: C.neutral[100], border: C.neutral[300], text: C.neutral[600] }
              };
              const c = colors[eq.status];
              
              return (
                <div 
                  key={i} 
                  onClick={() => onNavigateToEquipment && onNavigateToEquipment()}
                  style={{ 
                    padding: sp.md, 
                    background: c.bg, 
                    borderRadius: 8, 
                    border: `1px solid ${c.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: C.neutral[800] }}>{eq.id}</p>
                      <p style={{ fontSize: '10px', color: C.neutral[500] }}>{eq.type}</p>
                    </div>
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: 600, 
                      padding: '2px 6px', 
                      borderRadius: 4, 
                      background: c.border,
                      color: c.text,
                      textTransform: 'uppercase'
                    }}>
                      {eq.status === 'current' ? 'OK' : eq.status === 'due' ? 'Due' : eq.status === 'down' ? 'Down' : 'Overdue'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '11px', color: C.neutral[600] }}>
                    <p><strong>Last:</strong> {eq.lastPM}</p>
                    <p><strong>Next:</strong> {eq.nextPM}</p>
                    {eq.hours !== null && eq.hours > 0 && (
                      <p style={{ color: C.neutral[400], marginTop: 4 }}>{eq.hours} hrs since PM</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Maintenance Analysis */}
        <Card style={{ borderLeft: `4px solid ${C.neutral[500]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 16, height: 16, color: C.neutral[600] }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for maintenance • Click for details</p>
            </div>
            <Badge status="info" label="2 Active" style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            <Alert 
              {...ALERTS_DATA['maint-fl02-pm-peak']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('maint-fl02-pm-peak', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['maint-epj03-return']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('maint-epj03-return', 'schedules', true)}
            />
            <Alert 
              {...ALERTS_DATA['maint-fleet-health']} 
              onClick={() => onNavigateToAlert && onNavigateToAlert('maint-fleet-health', 'schedules', true)}
            />
          </div>
          <div 
            onClick={() => onViewInsights && onViewInsights()}
            style={{ 
              marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: sp.xs,
              cursor: 'pointer', color: C.neutral[600], fontSize: '13px', fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.neutral[700]}
            onMouseLeave={(e) => e.currentTarget.style.color = C.neutral[600]}
          >
            View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
          </div>
        </Card>
        </>
      )}
    </>
  );
};

export default ScheduleTabContent;
