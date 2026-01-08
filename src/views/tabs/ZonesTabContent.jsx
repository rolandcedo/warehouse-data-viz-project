import React from 'react';
import {
  Package, Truck, Grid3X3, ClipboardList, MapPin, AlertTriangle,
  TrendingUp, TrendingDown, ChevronRight, ArrowRight, Activity, CheckCircle,
  ArrowUpRight, ArrowDownRight, Zap
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
import { PredictiveTimeline } from '../../components/Charts';

// Zones Tab Content - extracted from ZonesView for use in Executive tabs
const ZonesTabContent = ({ onZone, onViewInsights, onNavigateToAlert }) => {
  const { contextualTime, isContextualDifferent, interpolateValue } = useTimeContext();
  
  // ===== COMPOSITE SCORE DATA =====
  // These weights and values calculate the 82 shown on Exec dashboard Zones card
  const scoreComponents = [
    { label: 'Space Utilization', value: 78, target: 100, weight: 30, detail: '71% avg (target 70-85%)', status: 'success' },
    { label: 'Throughput per Zone', value: 85, target: 100, weight: 25, detail: '14 of 16 zones on target', status: 'warning' },
    { label: 'Congestion Index', value: 72, target: 100, weight: 20, detail: '2 zones >85% capacity', status: 'warning' },
    { label: 'Dock Utilization', value: 88, target: 100, weight: 15, detail: '7 of 8 docks active', status: 'success' },
    { label: 'Pick Path Efficiency', value: 91, target: 100, weight: 10, detail: 'Avg 12.3 min/route', status: 'success' }
  ];
  const compositeScore = Math.round(scoreComponents.reduce((sum, c) => sum + (c.value * c.weight / 100), 0));
  
  // ===== ZONE DATA BY CATEGORY =====
  // Scenario: Inbound A is over-encumbered, Shipping Dock B has slack
  const zoneCategories = [
    {
      id: 'receiving',
      name: 'Receiving',
      icon: Package,
      color: C.blueLight[500],
      status: 'warning',
      zones: [
        { id: 'Z01', name: 'Inbound A', capacity: 87, capacityTrend: 'up', staffActual: 4, staffPlanned: 6, throughput: 82, throughputTarget: 100, status: 'critical', hotspot: true, alert: 'Putaway backlog building — 45 pallets staged' },
        { id: 'Z02', name: 'Inbound B', capacity: 68, capacityTrend: 'stable', staffActual: 3, staffPlanned: 3, throughput: 95, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z03', name: 'QA Station', capacity: 54, capacityTrend: 'stable', staffActual: 2, staffPlanned: 2, throughput: 100, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z04', name: 'Dock Staging', capacity: 76, capacityTrend: 'up', staffActual: 2, staffPlanned: 2, throughput: 88, throughputTarget: 100, status: 'warning', hotspot: false }
      ]
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: Grid3X3,
      color: C.purple[500],
      status: 'warning',
      zones: [
        { id: 'Z05', name: 'Bulk Storage', capacity: 83, capacityTrend: 'up', staffActual: 3, staffPlanned: 4, throughput: 78, throughputTarget: 100, status: 'warning', hotspot: true, alert: 'Approaching 85% threshold — overflow risk' },
        { id: 'Z06', name: 'Reserve 1', capacity: 72, capacityTrend: 'stable', staffActual: 2, staffPlanned: 2, throughput: 94, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z07', name: 'Reserve 2', capacity: 58, capacityTrend: 'down', staffActual: 1, staffPlanned: 1, throughput: 100, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z08', name: 'Cold Storage', capacity: 65, capacityTrend: 'stable', staffActual: 2, staffPlanned: 2, throughput: 96, throughputTarget: 100, status: 'success', hotspot: false }
      ]
    },
    {
      id: 'picking',
      name: 'Picking',
      icon: ClipboardList,
      color: C.orange[500],
      status: 'success',
      zones: [
        { id: 'Z09', name: 'Forward Pick A', capacity: 71, capacityTrend: 'stable', staffActual: 5, staffPlanned: 5, throughput: 95, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z10', name: 'Forward Pick B', capacity: 68, capacityTrend: 'stable', staffActual: 4, staffPlanned: 5, throughput: 92, throughputTarget: 100, status: 'warning', hotspot: false },
        { id: 'Z11', name: 'Forward Pick C', capacity: 74, capacityTrend: 'up', staffActual: 4, staffPlanned: 4, throughput: 98, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z12', name: 'Replen Staging', capacity: 62, capacityTrend: 'down', staffActual: 2, staffPlanned: 2, throughput: 100, throughputTarget: 100, status: 'success', hotspot: false }
      ]
    },
    {
      id: 'outbound',
      name: 'Outbound',
      icon: Truck,
      color: C.success[500],
      status: 'success',
      zones: [
        { id: 'Z13', name: 'Pack Station 1', capacity: 78, capacityTrend: 'stable', staffActual: 5, staffPlanned: 4, throughput: 105, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z14', name: 'Pack Station 2', capacity: 72, capacityTrend: 'stable', staffActual: 4, staffPlanned: 4, throughput: 98, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z15', name: 'Shipping Dock A', capacity: 69, capacityTrend: 'stable', staffActual: 4, staffPlanned: 4, throughput: 102, throughputTarget: 100, status: 'success', hotspot: false },
        { id: 'Z16', name: 'Shipping Dock B', capacity: 45, capacityTrend: 'down', staffActual: 5, staffPlanned: 3, throughput: 115, throughputTarget: 100, status: 'success', hotspot: false, slack: true, slackNote: '+2 FTE available — ahead of schedule' }
      ]
    }
  ];
  
  // ===== ON-TIME SHIPPING DATA =====
  const shippingPerformance = {
    onTimeRate: 94.2,
    onTimeRatePredicted: 93.8,
    target: 95,
    ordersShipped: 1566,
    ordersRemaining: 2914,
    carriers: [
      { name: 'FedEx Ground', cutoff: '14:00', progress: 67, predicted: 104, status: 'success' },
      { name: 'UPS', cutoff: '15:30', progress: 48, predicted: 97, status: 'warning' },
      { name: 'USPS', cutoff: '16:00', progress: 50, predicted: 102, status: 'success' },
      { name: 'FedEx Express', cutoff: '17:00', progress: 39, predicted: 106, status: 'success' }
    ]
  };
  
  // ===== CAPACITY TIMELINE =====
  const capacityTimeline = [
    { time: '06:00', actual: 58 },
    { time: '08:00', actual: 65 },
    { time: '10:00', actual: 71, predicted: 71, now: true },
    { time: '12:00', predicted: 76, upper: 80, lower: 72 },
    { time: '14:00', predicted: 72, upper: 76, lower: 68 }
  ];
  
  // ===== ALERTS =====
  const zoneAlerts = [
    { sev: 'critical', title: 'Inbound A capacity critical — 87%', msg: 'Putaway backlog at 45 pallets. Staffing gap: 4/6 FTE. Recommend reassigning 2 FTE from Outbound.', time: '+2hr', conf: 91 },
    { sev: 'warning', title: 'Bulk Storage approaching threshold', msg: 'Projected 91% by 12:00 if Inbound A backlog not cleared. Overflow to Reserve 2 available.', time: '+2hr', conf: 84 },
    { sev: 'info', title: 'Shipping Dock B under-utilized', msg: 'Ahead of schedule with +2 FTE slack. Maria Santos (forklift cert, putaway exp) available for reassignment.', time: 'Now', conf: 95 },
    { sev: 'success', title: 'Pick zones healthy', msg: 'All forward pick zones operating at 92-98% efficiency. No action needed.', time: 'Now', conf: 98 }
  ];

  const getCapacityColor = (cap) => {
    if (cap >= 85) return { bg: C.error[500], text: 'white' };
    if (cap >= 75) return { bg: C.warning[500], text: 'white' };
    if (cap >= 60) return { bg: C.warning[100], text: C.warning[700] };
    return { bg: C.success[100], text: C.success[700] };
  };

  return (
    <>
      <Header icon={MapPin} title="Zones Overview" sub="Physical space utilization, capacity, and throughput across facility" color={C.blueLight[500]} />
      
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
              <span style={{ fontSize: '10px', color: C.neutral[500] }}>ZONES SCORE</span>
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
                  <span style={{ fontSize: '11px', color: C.neutral[500], width: 140 }}>{comp.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lowest factors callout */}
        <div style={{ background: C.warning[50], borderRadius: 6, padding: sp.sm, display: 'flex', alignItems: 'center', gap: sp.sm }}>
          <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />
          <span style={{ fontSize: '12px', color: C.warning[700] }}>
            <strong>Watch:</strong> Congestion Index (72%) pulled down by Inbound A and Bulk Storage. 
            Address staffing gap in Receiving to improve flow.
          </span>
        </div>
      </Card>
      
      {/* ===== ZONE CATEGORIES ===== */}
      {zoneCategories.map((cat, catIdx) => (
        <Card key={cat.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <cat.icon style={{ width: 16, height: 16, color: cat.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>{cat.name}</h3>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>{cat.zones.length} zones</p>
            </div>
            <Badge status={cat.status} label={cat.status === 'success' ? 'Healthy' : cat.status === 'warning' ? 'Attention' : 'Critical'} />
          </div>
          
          {/* Zone rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {cat.zones.map((zone, zIdx) => {
              const capColor = getCapacityColor(zone.capacity);
              const staffStatus = zone.staffActual >= zone.staffPlanned ? 'success' : zone.staffActual >= zone.staffPlanned - 1 ? 'warning' : 'error';
              const tpPct = Math.round((zone.throughput / zone.throughputTarget) * 100);
              
              return (
                <div 
                  key={zone.id}
                  onClick={() => onZone && onZone(zone.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: sp.md, 
                    background: zone.hotspot ? C.error[50] : zone.slack ? C.success[50] : C.neutral[50], 
                    borderRadius: 8,
                    border: `1px solid ${zone.hotspot ? C.error[200] : zone.slack ? C.success[200] : C.neutral[200]}`,
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
                  {/* Zone ID + Name */}
                  <div style={{ width: 130, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: C.neutral[500] }}>{zone.id}</span>
                      {zone.hotspot && <AlertTriangle style={{ width: 12, height: 12, color: C.error[500] }} />}
                      {zone.slack && <CheckCircle style={{ width: 12, height: 12, color: C.success[500] }} />}
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{zone.name}</p>
                  </div>
                  
                  {/* Capacity */}
                  <div style={{ width: 80, textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Capacity</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span style={{ 
                        fontSize: '16px', fontWeight: 600, 
                        padding: '2px 6px', borderRadius: 4,
                        background: capColor.bg, color: capColor.text
                      }}>{zone.capacity}%</span>
                      {zone.capacityTrend === 'up' && <ArrowUpRight style={{ width: 12, height: 12, color: C.error[500] }} />}
                      {zone.capacityTrend === 'down' && <ArrowDownRight style={{ width: 12, height: 12, color: C.success[500] }} />}
                    </div>
                  </div>
                  
                  {/* Staffing */}
                  <div style={{ width: 80, textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Staffing</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: staffStatus === 'error' ? C.error[600] : staffStatus === 'warning' ? C.warning[600] : C.neutral[700] }}>
                      {zone.staffActual}/{zone.staffPlanned} <span style={{ fontSize: '10px', color: C.neutral[400] }}>FTE</span>
                    </p>
                  </div>
                  
                  {/* Throughput */}
                  <div style={{ width: 90, textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500] }}>Throughput</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: tpPct >= 95 ? C.success[600] : tpPct >= 85 ? C.warning[600] : C.error[600] }}>
                      {tpPct}% <span style={{ fontSize: '10px', color: C.neutral[400] }}>of target</span>
                    </p>
                  </div>
                  
                  {/* Alert/Note */}
                  <div style={{ flex: 1, paddingLeft: sp.md }}>
                    {zone.alert && (
                      <p style={{ fontSize: '11px', color: C.error[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle style={{ width: 10, height: 10 }} /> {zone.alert}
                      </p>
                    )}
                    {zone.slackNote && (
                      <p style={{ fontSize: '11px', color: C.success[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle style={{ width: 10, height: 10 }} /> {zone.slackNote}
                      </p>
                    )}
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                </div>
              );
            })}
          </div>
        </Card>
      ))}
      
      {/* ===== ON-TIME SHIPPING PERFORMANCE ===== */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>On-Time Shipping Performance</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Outbound zone efficiency and carrier cutoff progress</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs }}>
              <span style={{ fontSize: '24px', fontWeight: 300 }}>{shippingPerformance.onTimeRate}%</span>
              <ArrowRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
              <span style={{ fontSize: '16px', fontWeight: 500, color: C.purple[600] }}>{shippingPerformance.onTimeRatePredicted}%</span>
            </div>
            <p style={{ fontSize: '11px', color: C.neutral[500] }}>Target: {shippingPerformance.target}%</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
          {shippingPerformance.carriers.map((carrier, i) => (
            <div key={i} style={{ 
              padding: sp.md, 
              background: carrier.status === 'warning' ? C.warning[50] : C.neutral[50], 
              borderRadius: 8,
              border: `1px solid ${carrier.status === 'warning' ? C.warning[200] : C.neutral[200]}`
            }}>
              <p style={{ fontSize: '12px', fontWeight: 500, marginBottom: sp.xs }}>{carrier.name}</p>
              <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.sm }}>Cutoff: {carrier.cutoff}</p>
              <div style={{ height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden', marginBottom: sp.xs }}>
                <div style={{ 
                  width: `${carrier.progress}%`, 
                  height: '100%', 
                  background: carrier.status === 'success' ? C.success[500] : C.warning[500] 
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>{carrier.progress}% complete</span>
                <span style={{ fontSize: '10px', color: carrier.predicted >= 100 ? C.success[600] : C.warning[600] }}>
                  Pred: {carrier.predicted}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* ===== CAPACITY TREND ===== */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Overall Capacity Trend</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Average utilization across all 16 zones</p>
          </div>
          <Badge status="success" label="71% avg — Healthy" />
        </div>
        <div style={{ height: 140, overflow: 'hidden' }}>
          <PredictiveTimeline data={capacityTimeline} height={140} warning={75} critical={85} />
        </div>
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.sm, padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Current</span><p style={{ fontSize: '14px', fontWeight: 500 }}>71%</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Peak Today</span><p style={{ fontSize: '14px', fontWeight: 500 }}>76% @ 12:00</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Shift End</span><p style={{ fontSize: '14px', fontWeight: 500, color: C.success[600] }}>72%</p></div>
        </div>
      </Card>
      
      {/* ===== PREDICTIVE ALERTS ===== */}
      <Card style={{ borderLeft: `4px solid ${C.blueLight[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.blueLight[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 16, height: 16, color: C.blueLight[600] }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for zone capacity and flow</p>
          </div>
          <Badge status="warning" label={`${zoneAlerts.filter(a => a.sev === 'critical' || a.sev === 'warning').length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {zoneAlerts.map((a, i) => <Alert key={i} {...a} />)}
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
  );
};

export default ZonesTabContent;
