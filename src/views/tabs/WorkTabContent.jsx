import React, { useState, useRef, useEffect } from 'react';
import {
  Package, Truck, ClipboardList, TrendingUp, TrendingDown, AlertTriangle,
  ChevronRight, ChevronDown, ArrowRight, Activity, Clock, Zap, CheckCircle,
  Minus, ArrowUpRight, ArrowDownRight
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

// Work Content Tab - facility-level work overview
const WorkTabContent = ({ onNavigateToZones, onViewInsights, onNavigateToAlert }) => {
  const { contextualTime, isContextualDifferent, interpolateValue } = useTimeContext();
  const [expandedCarrier, setExpandedCarrier] = useState(null);

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
  const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);

  // ===== COMPOSITE SCORE DATA =====
  // These weights and values calculate the 88 shown on Exec dashboard Work Content card
  const scoreComponents = [
    { label: 'Throughput vs Plan', value: 92, target: 100, weight: 30, detail: '4,200/4,560 units', status: 'warning' },
    { label: 'Queue Health', value: 85, target: 100, weight: 25, detail: '~300 carryover predicted', status: 'warning' },
    { label: 'Pick Accuracy', value: 99, target: 99, weight: 20, detail: '99.2% (12 errors today)', status: 'success' },
    { label: 'Order Cycle Time', value: 88, target: 100, weight: 15, detail: '2.4 hrs avg vs 2.1 target', status: 'warning' },
    { label: 'Carryover Rate', value: 78, target: 100, weight: 10, detail: '~5% may carry to swing', status: 'warning' }
  ];
  const compositeScore = Math.round(scoreComponents.reduce((sum, c) => sum + (c.value * c.weight / 100), 0));
  
  // ===== ORDERS & UNITS DATA =====
  const ordersData = {
    current: 12450,
    predicted: 12850,
    target: 13000,
    pctOfTarget: 96,
    trend: '+4.2%',
    trendUp: true
  };
  
  const unitsData = {
    current: 48200,
    predicted: 51400,
    target: 52000,
    pctOfTarget: 93,
    trend: '+2.8%',
    trendUp: true
  };
  
  // ===== QUEUE HEALTH DATA =====
  const queueHealth = [
    { 
      id: 'pick', 
      name: 'Pick Queue', 
      zones: ['Forward Pick A', 'Forward Pick B', 'Forward Pick C'],
      current: 2310, 
      velocity: 520, 
      velocityTarget: 560,
      timeToClear: 4.4, 
      carryover: 100, 
      carryoverPct: 3,
      status: 'success',
      statusLabel: '97% by shift end'
    },
    { 
      id: 'pack', 
      name: 'Pack Queue', 
      zones: ['Pack Station 1', 'Pack Station 2'],
      current: 2350, 
      velocity: 480, 
      velocityTarget: 520,
      timeToClear: 4.9, 
      carryover: 200, 
      carryoverPct: 5,
      status: 'warning',
      statusLabel: '95% by shift end'
    },
    { 
      id: 'ship', 
      name: 'Ship Queue', 
      zones: ['Shipping Dock A', 'Shipping Dock B'],
      current: 1566, 
      velocity: 420, 
      velocityTarget: 400,
      timeToClear: 3.7, 
      carryover: 0, 
      carryoverPct: 0,
      status: 'success',
      statusLabel: '100% by shift end'
    }
  ];
  
  // ===== THROUGHPUT BY FUNCTION =====
  const throughputByFunction = [
    { function: 'Receiving', actual: 245, target: 260, unit: 'pallets/hr', fteCount: 6, status: 'warning', trend: 'stable' },
    { function: 'Putaway', actual: 198, target: 220, unit: 'pallets/hr', fteCount: 5, status: 'warning', trend: 'down' },
    { function: 'Picking', actual: 520, target: 560, unit: 'orders/hr', fteCount: 12, status: 'warning', trend: 'up' },
    { function: 'Packing', actual: 480, target: 520, unit: 'orders/hr', fteCount: 8, status: 'warning', trend: 'stable' },
    { function: 'Shipping', actual: 420, target: 400, unit: 'orders/hr', fteCount: 8, status: 'success', trend: 'up' }
  ];
  
  // ===== CARRIER CUTOFFS =====
  const carrierCutoffs = [
    { 
      id: 'fedex-ground',
      carrier: 'FedEx Ground', cutoff: '14:00', hoursOut: 4, target: 1850, current: 1247, predicted: 1920, status: 'success',
      velocity: { current: 168, needed: 151, trend: 'up' },
      queueBreakdown: { pick: 420, pack: 180, ship: 3 },
      atRiskOrders: [],
      factors: ['Strong pick velocity', 'Pack station fully staffed'],
      hourlyTrend: [140, 152, 158, 168]
    },
    { 
      id: 'ups',
      carrier: 'UPS', cutoff: '15:30', hoursOut: 5.5, target: 1420, current: 680, predicted: 1380, status: 'warning',
      velocity: { current: 127, needed: 135, trend: 'down' },
      queueBreakdown: { pick: 380, pack: 240, ship: 120 },
      atRiskOrders: [
        { order: 'ORD-4821', customer: 'Acme Corp', sla: 'Express', units: 12 },
        { order: 'ORD-4835', customer: 'TechStart Inc', sla: 'Priority', units: 8 },
        { order: 'ORD-4847', customer: 'Global Supplies', sla: 'Express', units: 24 }
      ],
      factors: ['Pack queue backlog (+40 orders)', 'Z03 Picking understaffed', 'High unit-count orders slowing pack'],
      hourlyTrend: [145, 138, 132, 127]
    },
    { 
      id: 'usps',
      carrier: 'USPS', cutoff: '16:00', hoursOut: 6, target: 890, current: 445, predicted: 910, status: 'success',
      velocity: { current: 74, needed: 74, trend: 'stable' },
      queueBreakdown: { pick: 180, pack: 145, ship: 120 },
      atRiskOrders: [],
      factors: ['On pace', 'Lightweight items processing quickly'],
      hourlyTrend: [70, 72, 73, 74]
    },
    { 
      id: 'fedex-express',
      carrier: 'FedEx Express', cutoff: '17:00', hoursOut: 7, target: 320, current: 124, predicted: 340, status: 'success',
      velocity: { current: 46, needed: 28, trend: 'up' },
      queueBreakdown: { pick: 85, pack: 71, ship: 40 },
      atRiskOrders: [],
      factors: ['Well ahead of schedule', 'Priority lane clear'],
      hourlyTrend: [38, 42, 44, 46]
    }
  ];
  
  // ===== ALERTS =====
  // Work alerts using shared data
  const workAlerts = [
    ALERTS_DATA['work-ups-velocity'],
    ALERTS_DATA['work-pick-queue-growing'],
    ALERTS_DATA['work-fedex-express-priority'],
    ALERTS_DATA['work-pack-station-balanced']
  ];

  return (
    <>
      <Header icon={ClipboardList} title="Work Content Overview" sub="Task volume, queues, completion across facility" color={C.orange[500]} />

      {/* Masonry Container - responsive columns */}
      <div ref={containerRef} style={{
        columnCount: columnCount,
        columnGap: sp.lg
      }}>

        {/* ===== COMPOSITE SCORE BREAKDOWN ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
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
              <span style={{ fontSize: '10px', color: C.neutral[500] }}>WORK SCORE</span>
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
            <strong>Watch:</strong> Carryover Rate (78%) and Queue Health (85%) are the lowest factors. 
            Pack queue velocity needs +8% to clear by shift end.
          </span>
        </div>
      </Card>
        </div>

        {/* ===== ORDERS & UNITS SUMMARY ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Today's Volume</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Order and unit throughput • Current → End-of-day prediction</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp.lg }}>
          {/* Orders */}
          <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderLeft: `3px solid ${ordersData.pctOfTarget >= 95 ? C.success[500] : C.warning[500]}` }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[500], marginBottom: sp.sm, textTransform: 'uppercase' }}>Orders Today</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm, marginBottom: sp.xs }}>
              <span style={{ fontSize: '28px', fontWeight: 300 }}>{ordersData.current.toLocaleString()}</span>
              <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              <span style={{ fontSize: '18px', fontWeight: 500, color: C.purple[600] }}>{ordersData.predicted.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>Target: {ordersData.target.toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 500, color: ordersData.trendUp ? C.success[600] : C.warning[600] }}>
                {ordersData.trendUp ? <ArrowUpRight style={{ width: 14, height: 14 }} /> : <ArrowDownRight style={{ width: 14, height: 14 }} />}
                {ordersData.trend} vs yesterday
              </span>
            </div>
          </div>
          
          {/* Units */}
          <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, borderLeft: `3px solid ${unitsData.pctOfTarget >= 95 ? C.success[500] : C.warning[500]}` }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[500], marginBottom: sp.sm, textTransform: 'uppercase' }}>Units Processed</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm, marginBottom: sp.xs }}>
              <span style={{ fontSize: '28px', fontWeight: 300 }}>{unitsData.current.toLocaleString()}</span>
              <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              <span style={{ fontSize: '18px', fontWeight: 500, color: C.purple[600] }}>{unitsData.predicted.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>Target: {unitsData.target.toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 500, color: unitsData.trendUp ? C.success[600] : C.warning[600] }}>
                {unitsData.trendUp ? <ArrowUpRight style={{ width: 14, height: 14 }} /> : <ArrowDownRight style={{ width: 14, height: 14 }} />}
                {unitsData.trend} vs yesterday
              </span>
            </div>
          </div>
        </div>
      </Card>
        </div>

        {/* ===== QUEUE HEALTH SUMMARY ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Queue Health</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Current depth, velocity, and predicted carryover by function</p>
          </div>
          <div style={{ display: 'flex', gap: sp.md, fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.success[500] }} /> On track</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.warning[500] }} /> At risk</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {queueHealth.map((q, i) => {
            const velocityPct = Math.round((q.velocity / q.velocityTarget) * 100);
            return (
              <div 
                key={i}
                onClick={() => onNavigateToZones && onNavigateToZones(q.id, q.zones)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: sp.md, 
                  background: q.status === 'warning' ? C.warning[50] : C.neutral[50], 
                  borderRadius: 8,
                  border: `1px solid ${q.status === 'warning' ? C.warning[200] : C.neutral[200]}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = q.status === 'warning' ? C.warning[100] : C.neutral[100];
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = q.status === 'warning' ? C.warning[50] : C.neutral[50];
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Queue Name */}
                <div style={{ width: 120, flexShrink: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{q.name}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>{q.zones.length} zones</p>
                </div>
                
                {/* Current Depth */}
                <div style={{ width: 90, textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Depth</p>
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>{q.current.toLocaleString()}</p>
                </div>
                
                {/* Velocity */}
                <div style={{ width: 100, textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Velocity</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: velocityPct >= 95 ? C.success[600] : C.warning[600] }}>
                    {q.velocity}/hr <span style={{ fontSize: '10px', color: C.neutral[400] }}>({velocityPct}%)</span>
                  </p>
                </div>
                
                {/* Time to Clear */}
                <div style={{ width: 80, textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Clear in</p>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{q.timeToClear}h</p>
                </div>
                
                {/* Carryover */}
                <div style={{ width: 90, textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>Carryover</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: q.carryover > 0 ? (q.carryoverPct > 3 ? C.warning[600] : C.neutral[600]) : C.success[600] }}>
                    {q.carryover > 0 ? `~${q.carryover}` : '0'} <span style={{ fontSize: '10px' }}>({q.carryoverPct}%)</span>
                  </p>
                </div>
                
                {/* Status + Chevron */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: sp.sm }}>
                  <Badge status={q.status} label={q.statusLabel} />
                  <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
        </div>

        {/* ===== THROUGHPUT BY FUNCTION - Deviation Chart ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Throughput by Function</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Deviation from target velocity • Left = under, Right = over</p>
        </div>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: sp.lg, marginBottom: sp.md, justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: C.neutral[600] }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.error[500] }} /> Under target
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: C.neutral[600] }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.success[500] }} /> At/Over target
          </span>
        </div>
        
        {/* Deviation Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {throughputByFunction.map((f, i) => {
            const deviation = f.actual - f.target;
            const deviationPct = Math.round((deviation / f.target) * 100);
            const isOver = deviation >= 0;
            const maxDeviation = 30; // Max % deviation for scale
            const barWidth = Math.min(Math.abs(deviationPct), maxDeviation) / maxDeviation * 50; // 50% max width each side
            
            return (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: `${sp.sm} ${sp.md}`,
                background: C.neutral[50],
                borderRadius: 8,
                gap: sp.md
              }}>
                {/* Function name - fixed width */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{f.function}</span>
                  <p style={{ fontSize: '9px', color: C.neutral[500] }}>{f.fteCount} FTE</p>
                </div>
                
                {/* Actual/Target values */}
                <div style={{ width: 70, flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isOver ? C.success[600] : C.error[600] }}>{f.actual}</span>
                  <span style={{ fontSize: '11px', color: C.neutral[400] }}>/{f.target}</span>
                </div>
                
                {/* Deviation bar chart */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', height: 32 }}>
                  {/* Center line (target) */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: 0, 
                    bottom: 0, 
                    width: 2, 
                    background: C.neutral[300],
                    zIndex: 1
                  }} />
                  
                  {/* Background track */}
                  <div style={{ 
                    position: 'absolute',
                    left: '10%',
                    right: '10%',
                    height: 8,
                    background: C.neutral[200],
                    borderRadius: 4
                  }} />
                  
                  {/* Deviation bar */}
                  <div style={{ 
                    position: 'absolute',
                    left: isOver ? '50%' : `${50 - barWidth}%`,
                    width: `${barWidth}%`,
                    height: 8,
                    background: isOver ? C.success[500] : C.error[500],
                    borderRadius: 4,
                    transition: 'all 0.3s ease'
                  }} />
                  
                  {/* Dot indicator */}
                  <div style={{ 
                    position: 'absolute',
                    left: `calc(${50 + (isOver ? barWidth : -barWidth)}% - 6px)`,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: isOver ? C.success[500] : C.error[500],
                    border: '2px solid white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                  }} />
                </div>
                
                {/* Deviation value */}
                <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: isOver ? C.success[600] : C.error[600] 
                  }}>
                    {isOver ? '+' : ''}{deviation}
                  </span>
                  <p style={{ fontSize: '9px', color: C.neutral[500] }}>{isOver ? '+' : ''}{deviationPct}%</p>
                </div>
                
                {/* Trend indicator */}
                <div style={{ width: 20, flexShrink: 0, textAlign: 'center' }}>
                  {f.trend === 'up' && <TrendingUp style={{ width: 14, height: 14, color: C.success[500] }} />}
                  {f.trend === 'down' && <TrendingDown style={{ width: 14, height: 14, color: C.error[500] }} />}
                  {f.trend === 'stable' && <Minus style={{ width: 14, height: 14, color: C.neutral[400] }} />}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scale labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: sp.sm, paddingLeft: 150, paddingRight: 80 }}>
          <span style={{ fontSize: '9px', color: C.neutral[400] }}>-30%</span>
          <span style={{ fontSize: '9px', color: C.neutral[500], fontWeight: 500 }}>Target</span>
          <span style={{ fontSize: '9px', color: C.neutral[400] }}>+30%</span>
        </div>
      </Card>
        </div>

        {/* ===== CARRIER CUTOFF TRACKER ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Carrier Cutoffs</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Progress toward carrier pickup deadlines • Click to expand details</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {carrierCutoffs.map((c, i) => {
            const currentPct = Math.round((c.current / c.target) * 100);
            const predictedPct = Math.round((c.predicted / c.target) * 100);
            const willMeet = c.predicted >= c.target;
            const isExpanded = expandedCarrier === c.id;
            
            return (
              <div key={i} style={{ 
                background: c.status === 'warning' ? C.warning[50] : C.neutral[50], 
                borderRadius: 8,
                border: `1px solid ${c.status === 'warning' ? C.warning[200] : C.neutral[200]}`,
                overflow: 'hidden'
              }}>
                {/* Main Row - Clickable */}
                <div 
                  onClick={() => setExpandedCarrier(isExpanded ? null : c.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: sp.md,
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = c.status === 'warning' ? C.warning[100] : C.neutral[100]}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Expand/Collapse Icon */}
                  <ChevronRight style={{ 
                    width: 16, height: 16, 
                    color: C.neutral[400], 
                    marginRight: sp.sm,
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} />
                  
                  {/* Carrier Info */}
                  <div style={{ width: 130, flexShrink: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{c.carrier}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>Cutoff: {c.cutoff} ({c.hoursOut}h out)</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ flex: 1, marginRight: sp.lg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '11px', color: C.neutral[500] }}>{c.current.toLocaleString()} now</span>
                      <span style={{ fontSize: '11px', color: C.purple[600] }}>{c.predicted.toLocaleString()} predicted</span>
                      <span style={{ fontSize: '11px', color: C.neutral[500] }}>{c.target.toLocaleString()} target</span>
                    </div>
                    <div style={{ height: 8, background: C.neutral[200], borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                      {/* Current progress */}
                      <div style={{ 
                        width: `${Math.min(currentPct, 100)}%`, 
                        height: '100%', 
                        background: c.status === 'success' ? C.success[500] : C.warning[500],
                        position: 'absolute',
                        left: 0,
                        top: 0
                      }} />
                      {/* Predicted marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(predictedPct, 100)}%`,
                        top: -2,
                        bottom: -2,
                        width: 3,
                        background: C.purple[500],
                        borderRadius: 2
                      }} />
                      {/* Target line */}
                      <div style={{
                        position: 'absolute',
                        left: '100%',
                        top: -4,
                        bottom: -4,
                        width: 2,
                        background: C.neutral[400],
                        marginLeft: -1
                      }} />
                    </div>
                  </div>
                  
                  {/* Status */}
                  <Badge 
                    status={willMeet ? 'success' : 'warning'} 
                    label={willMeet ? `+${c.predicted - c.target} buffer` : `-${c.target - c.predicted} short`} 
                  />
                </div>
                
                {/* Expanded Detail Section */}
                {isExpanded && (
                  <div style={{ 
                    padding: sp.md, 
                    paddingTop: 0,
                    borderTop: `1px solid ${c.status === 'warning' ? C.warning[200] : C.neutral[200]}`,
                    background: c.status === 'warning' ? C.warning[25] : C.neutral[25]
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: sp.md, marginTop: sp.md }}>
                      
                      {/* Velocity */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs }}>VELOCITY</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs }}>
                          <span style={{ 
                            fontSize: '20px', 
                            fontWeight: 600, 
                            color: c.velocity.current >= c.velocity.needed ? C.success[600] : C.warning[600] 
                          }}>
                            {c.velocity.current}
                          </span>
                          <span style={{ fontSize: '12px', color: C.neutral[500] }}>/hr</span>
                          {c.velocity.trend === 'up' && <TrendingUp style={{ width: 14, height: 14, color: C.success[500] }} />}
                          {c.velocity.trend === 'down' && <TrendingDown style={{ width: 14, height: 14, color: C.error[500] }} />}
                        </div>
                        <p style={{ fontSize: '11px', color: C.neutral[500] }}>Need {c.velocity.needed}/hr to meet cutoff</p>
                        
                        {/* Mini trend */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, marginTop: sp.xs, height: 24 }}>
                          {c.hourlyTrend.map((v, idx) => (
                            <div key={idx} style={{ 
                              flex: 1, 
                              height: `${(v / Math.max(...c.hourlyTrend)) * 100}%`,
                              background: idx === c.hourlyTrend.length - 1 
                                ? (c.velocity.current >= c.velocity.needed ? C.success[500] : C.warning[500])
                                : C.neutral[300],
                              borderRadius: 2
                            }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '9px', color: C.neutral[400], marginTop: 2 }}>Last 4 hours</p>
                      </div>
                      
                      {/* Queue Breakdown */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs }}>QUEUE BREAKDOWN</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                          {[
                            { label: 'Pick', value: c.queueBreakdown.pick, color: C.blueLight[500] },
                            { label: 'Pack', value: c.queueBreakdown.pack, color: C.orange[500] },
                            { label: 'Ship', value: c.queueBreakdown.ship, color: C.success[500] }
                          ].map((q, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                              <span style={{ fontSize: '11px', color: C.neutral[600], width: 32 }}>{q.label}</span>
                              <div style={{ flex: 1, height: 6, background: C.neutral[100], borderRadius: 3 }}>
                                <div style={{ 
                                  width: `${(q.value / c.target) * 100}%`, 
                                  height: '100%', 
                                  background: q.color,
                                  borderRadius: 3
                                }} />
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 500, width: 36, textAlign: 'right' }}>{q.value}</span>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: '10px', color: C.neutral[500], marginTop: sp.xs }}>
                          {c.queueBreakdown.pick + c.queueBreakdown.pack + c.queueBreakdown.ship} orders in pipeline
                        </p>
                      </div>
                      
                      {/* Contributing Factors */}
                      <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                        <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs }}>
                          {c.status === 'warning' ? 'CONTRIBUTING FACTORS' : 'STATUS FACTORS'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                          {c.factors.map((f, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: sp.xs }}>
                              {c.status === 'warning' 
                                ? <AlertTriangle style={{ width: 12, height: 12, color: C.warning[500], flexShrink: 0, marginTop: 1 }} />
                                : <CheckCircle style={{ width: 12, height: 12, color: C.success[500], flexShrink: 0, marginTop: 1 }} />
                              }
                              <span style={{ fontSize: '11px', color: C.neutral[600] }}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* At-Risk Orders - only show if there are any */}
                    {c.atRiskOrders.length > 0 && (
                      <div style={{ marginTop: sp.md, background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.warning[200]}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.sm }}>
                          <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: C.warning[700] }}>At-Risk Orders ({c.atRiskOrders.length})</span>
                        </div>
                        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${C.neutral[200]}` }}>
                              <th style={{ textAlign: 'left', padding: '4px 8px', color: C.neutral[500], fontWeight: 500 }}>Order</th>
                              <th style={{ textAlign: 'left', padding: '4px 8px', color: C.neutral[500], fontWeight: 500 }}>Customer</th>
                              <th style={{ textAlign: 'left', padding: '4px 8px', color: C.neutral[500], fontWeight: 500 }}>SLA</th>
                              <th style={{ textAlign: 'right', padding: '4px 8px', color: C.neutral[500], fontWeight: 500 }}>Units</th>
                            </tr>
                          </thead>
                          <tbody>
                            {c.atRiskOrders.map((order, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < c.atRiskOrders.length - 1 ? `1px solid ${C.neutral[100]}` : 'none' }}>
                                <td style={{ padding: '6px 8px', fontWeight: 500, color: C.brand[600] }}>{order.order}</td>
                                <td style={{ padding: '6px 8px', color: C.neutral[700] }}>{order.customer}</td>
                                <td style={{ padding: '6px 8px' }}>
                                  <Badge status={order.sla === 'Express' ? 'error' : 'warning'} label={order.sla} />
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', color: C.neutral[600] }}>{order.units}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
        </div>

        {/* ===== PREDICTIVE ALERTS ===== */}
        <div style={{
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          WebkitColumnBreakInside: 'avoid',
          marginBottom: sp.lg,
          display: 'inline-block',
          width: '100%'
        }}>
          <Card style={{ borderLeft: `4px solid ${C.orange[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.orange[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 16, height: 16, color: C.orange[500] }} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for work content • Click for details</p>
          </div>
          <Badge status="warning" label={`${workAlerts.filter(a => a.sev !== 'success').length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {workAlerts.map((a, i) => (
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
            cursor: 'pointer', color: C.orange[600], fontSize: '13px', fontWeight: 500
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = C.orange[700]}
          onMouseLeave={(e) => e.currentTarget.style.color = C.orange[600]}
        >
          View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
        </div>
      </Card>
        </div>

      </div>
    </>
  );
};

export default WorkTabContent;
