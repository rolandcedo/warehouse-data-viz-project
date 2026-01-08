import React, { useState } from 'react';
import { Users, MapPin, ClipboardList, Calendar, DollarSign, ChevronRight, Clock, Package, Truck, AlertTriangle, ArrowRight, CheckCircle, Info, LayoutDashboard, TrendingUp, TrendingDown, Filter, Lightbulb, Wrench, Settings, MoreHorizontal } from 'lucide-react';

// Import shared components
import { Card, Badge, Progress } from '../../components/UI';

// Import design tokens
import { C, sp } from '../../styles/designSystem';

// Import time context hook (assumes it's available in a shared context)
import { useTimeContext } from '../../context/TimeContext';

const ZonePanel = ({ zoneId, zoneName, zoneType, onNavigate, onBack }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Zone data (would come from props/context in real app)
  const zoneData = {
    status: 'Active',
    dockDoors: 4,
    spaceUtil: { cur: 68, pred: 74, target: 80 },
    kpis: {
      palletsHr: { cur: 142, pred: 168, target: 180, timeline: [
        { time: '06:00', actual: 0 }, { time: '08:00', actual: 78 }, { time: '10:00', actual: 142 },
        { time: '12:00', predicted: 165 }, { time: '14:00', predicted: 168 }
      ]},
      avgDwell: { cur: 38, pred: 42, target: 45, warn: false, timeline: [
        { time: '06:00', actual: 32 }, { time: '08:00', actual: 35 }, { time: '10:00', actual: 38 },
        { time: '12:00', predicted: 44 }, { time: '14:00', predicted: 42 }
      ]},
      accuracy: { cur: 98.2, pred: 97.8, target: 99, format: v => `${v.toFixed(1)}%`, timeline: [
        { time: '06:00', actual: 99.1 }, { time: '08:00', actual: 98.8 }, { time: '10:00', actual: 98.2 },
        { time: '12:00', predicted: 97.9 }, { time: '14:00', predicted: 97.8 }
      ]},
      stagedPallets: { cur: 47, pred: 62, target: 80, timeline: [
        { time: '06:00', actual: 22 }, { time: '08:00', actual: 35 }, { time: '10:00', actual: 47 },
        { time: '12:00', predicted: 58 }, { time: '14:00', predicted: 62 }
      ]},
      dockUtil: { cur: 75, pred: 85, target: 90, format: v => `${Math.round(v)}%`, timeline: [
        { time: '06:00', actual: 50 }, { time: '08:00', actual: 75 }, { time: '10:00', actual: 75 },
        { time: '12:00', predicted: 100 }, { time: '14:00', predicted: 85 }
      ]}
    }
  };

  const alerts = [
    { sev: 'warning', title: 'Staged pallet congestion', msg: 'Predicted 62 pallets @ 12:00 (capacity: 80)', time: '+2hr', conf: 78 },
    { sev: 'info', title: 'Pallet jack in maintenance', msg: 'EPJ-03 scheduled maintenance until 11:30', time: 'Now', conf: 100 }
  ];

  const connections = {
    upstream: [
      { id: 'TRL-1000', type: 'Trailer', label: 'TRL-1000', metric: '42%', metricLabel: 'progress' },
      { id: 'recv-team', type: 'Staff', label: 'Recv Team', metric: '100%', metricLabel: 'staffed' }
    ],
    downstream: [
      { id: 'staging', type: 'Location', label: 'Staging', metric: '68%', metricLabel: 'capacity' },
      { id: 'Z04', type: 'Zone', label: 'Z04 Bulk', metric: '83%', metricLabel: 'capacity' }
    ]
  };

  // Work content data for Work Content tab
  const workContent = {
    stagedPallets: {
      current: 47, predicted: 62, capacity: 80,
      byStatus: [
        { status: 'Awaiting Putaway', count: 28, color: C.warning[500] },
        { status: 'QC Hold', count: 8, color: C.error[500] },
        { status: 'Ready for Putaway', count: 11, color: C.success[500] }
      ],
      timeline: [
        { time: '06:00', actual: 22 }, { time: '08:00', actual: 35 }, { time: '10:00', actual: 47 },
        { time: '12:00', predicted: 58 }, { time: '14:00', predicted: 62 }
      ]
    },
    asnData: [
      { asn: 'ASN-4521', po: 'PO-8834', vendor: 'Acme Corp', lines: 12, received: 10, status: 'in-progress' },
      { asn: 'ASN-4522', po: 'PO-8835', vendor: 'Global Supply', lines: 8, received: 8, status: 'complete' },
      { asn: 'ASN-4523', po: 'PO-8836', vendor: 'FastShip Inc', lines: 24, received: 5, status: 'in-progress' },
      { asn: 'ASN-4524', po: 'PO-8837', vendor: 'Prime Dist', lines: 6, received: 0, status: 'pending' }
    ],
    palletList: [
      { id: 'PLT-00847', status: 'Awaiting Putaway', source: 'TRL-1000', arrived: '08:32', dwell: 92, destination: 'Z04-A12' },
      { id: 'PLT-00848', status: 'QC Hold', source: 'TRL-1000', arrived: '08:35', dwell: 89, destination: 'QC Station' },
      { id: 'PLT-00849', status: 'Ready for Putaway', source: 'TRL-1001', arrived: '09:15', dwell: 45, destination: 'Z05-B03' },
      { id: 'PLT-00850', status: 'Awaiting Putaway', source: 'TRL-1001', arrived: '09:18', dwell: 42, destination: 'Z04-C08' },
      { id: 'PLT-00851', status: 'Awaiting Putaway', source: 'TRL-1002', arrived: '09:52', dwell: 8, destination: 'Z04-A15' }
    ]
  };

  // Tab definitions
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'financial', icon: DollarSign, label: 'Financial' },
    { id: 'staff', icon: Users, label: 'Staff' },
    { id: 'work', icon: Package, label: 'Work Content' },
    { id: 'space', icon: MapPin, label: 'Space' },
    { id: 'equipment', icon: Wrench, label: 'Equipment' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'config', icon: Filter, label: 'Config' }
  ];

  // KPI Card component (clickable to navigate to relevant tab)
  const KpiCard = ({ label, current, predicted, target, timeline, format, warn, targetTab, icon: Icon }) => {
    const ctxVal = isContextualDifferent && timeline ? interpolateValue(timeline, contextualTime) : null;
    const displayCtx = ctxVal !== null ? (format ? format(ctxVal) : Math.round(ctxVal)) : null;
    const displayCur = format ? format(current) : current;
    const displayPred = format ? format(predicted) : predicted;

    return (
      <div
        onClick={() => targetTab && setActiveTab(targetTab)}
        style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: sp.sm,
          cursor: targetTab ? 'pointer' : 'default',
          transition: 'background 0.15s'
        }}
        className={targetTab ? 'card-click' : ''}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: '11px', opacity: 0.8 }}>{label}</span>
          {Icon && <Icon style={{ width: 12, height: 12, opacity: 0.6 }} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '18px', fontWeight: 300 }}>{displayCur}</span>
          {displayCtx !== null && (
            <>
              <ArrowRight style={{ width: 8, height: 8, opacity: 0.5 }} />
              <span style={{ fontSize: '12px', fontWeight: 500, padding: '1px 4px', background: 'rgba(47,114,255,0.4)', borderRadius: 3 }}>{displayCtx}</span>
            </>
          )}
          <ArrowRight style={{ width: 8, height: 8, opacity: 0.5 }} />
          <span style={{ fontSize: '13px', opacity: 0.9, color: warn ? C.warning[200] : 'inherit' }}>{displayPred}</span>
        </div>
        <p style={{ fontSize: '9px', opacity: 0.5, marginTop: 2 }}>Target: {target}</p>
      </div>
    );
  };

  // Connection card component
  const ConnectionCard = ({ id, type, label, metric, metricLabel, direction }) => (
    <div
      onClick={() => onNavigate && onNavigate(type.toLowerCase(), id)}
      style={{
        background: C.neutral[100],
        borderRadius: 6,
        padding: sp.sm,
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: 70,
        border: `1px solid ${C.neutral[200]}`
      }}
      className="card-click"
    >
      <p style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[700], marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: '16px', fontWeight: 600, color: direction === 'upstream' ? C.brand[600] : C.purple[600] }}>{metric}</p>
      <p style={{ fontSize: '9px', color: C.neutral[500] }}>{metricLabel}</p>
    </div>
  );

  // Financial Tab State
  const [financialPeriod, setFinancialPeriod] = React.useState('mtd');
  const [financialComparison, setFinancialComparison] = React.useState('budget');

  // Financial Mock Data
  const financialData = {
    periods: {
      mtd: { label: 'Month to Date', days: 17, totalDays: 31 },
      qtd: { label: 'Quarter to Date', days: 78, totalDays: 92 },
      ytd: { label: 'Year to Date', days: 352, totalDays: 365 }
    },
    summary: {
      mtd: {
        totalOpEx: 847500,
        budget: 830000,
        priorPeriod: 812000,
        costPerOrder: 4.23,
        costPerOrderBudget: 4.00,
        costPerOrderPrior: 4.15,
        costPerUnit: 1.68,
        ordersProcessed: 200354,
        unitsHandled: 504464,
        laborCostPct: 58,
        fulfillmentPctRevenue: 12.4,
        forecast: 1540000,
        forecastBudget: 1500000
      },
      qtd: {
        totalOpEx: 2485000,
        budget: 2450000,
        priorPeriod: 2380000,
        costPerOrder: 4.18,
        costPerOrderBudget: 4.00,
        costPerOrderPrior: 4.10,
        costPerUnit: 1.65,
        ordersProcessed: 594498,
        unitsHandled: 1506061,
        laborCostPct: 57,
        fulfillmentPctRevenue: 12.2,
        forecast: 2920000,
        forecastBudget: 2900000
      },
      ytd: {
        totalOpEx: 9234000,
        budget: 9100000,
        priorPeriod: 8750000,
        costPerOrder: 4.12,
        costPerOrderBudget: 4.00,
        costPerOrderPrior: 4.05,
        costPerUnit: 1.62,
        ordersProcessed: 2241262,
        unitsHandled: 5699383,
        laborCostPct: 56,
        fulfillmentPctRevenue: 12.1,
        forecast: 9580000,
        forecastBudget: 9400000
      }
    },
    costBreakdown: {
      mtd: [
        { category: 'Direct Labor', amount: 389550, pct: 46, budget: 375000, prior: 368000, icon: Users },
        { category: 'Indirect Labor', amount: 101700, pct: 12, budget: 100000, prior: 97000, icon: Users },
        { category: 'Facility', amount: 169500, pct: 20, budget: 170000, prior: 168000, icon: MapPin },
        { category: 'Equipment', amount: 84750, pct: 10, budget: 82000, prior: 80000, icon: Truck },
        { category: 'Materials', amount: 59325, pct: 7, budget: 60000, prior: 58000, icon: Package },
        { category: 'Technology', amount: 25425, pct: 3, budget: 25000, prior: 24000, icon: Settings },
        { category: 'Other', amount: 17250, pct: 2, budget: 18000, prior: 17000, icon: MoreHorizontal }
      ]
    },
    monthlyTrend: [
      { month: 'Jul', actual: 795000, budget: 800000, prior: 760000 },
      { month: 'Aug', actual: 810000, budget: 810000, prior: 775000 },
      { month: 'Sep', actual: 825000, budget: 815000, prior: 790000 },
      { month: 'Oct', actual: 838000, budget: 820000, prior: 802000 },
      { month: 'Nov', actual: 855000, budget: 825000, prior: 815000 },
      { month: 'Dec', actual: 847500, budget: 830000, prior: 812000, current: true }
    ],
    alerts: [
      { type: 'warning', message: 'Labor costs 3.9% over budget', category: 'Direct Labor', amount: 14550 },
      { type: 'info', message: 'Equipment maintenance trending up', category: 'Equipment', amount: 2750 },
      { type: 'success', message: 'Materials costs under budget', category: 'Materials', amount: -675 }
    ],
    costPerOrderTrend: [
      { month: 'Jul', value: 4.05, budget: 4.00 },
      { month: 'Aug', value: 4.08, budget: 4.00 },
      { month: 'Sep', value: 4.12, budget: 4.00 },
      { month: 'Oct', value: 4.15, budget: 4.00 },
      { month: 'Nov', value: 4.20, budget: 4.00 },
      { month: 'Dec', value: 4.23, budget: 4.00, current: true }
    ]
  };

  // Render Financial Tab
  const renderFinancialTab = () => {
    const periodData = financialData.summary[financialPeriod];
    const periodInfo = financialData.periods[financialPeriod];
    const breakdown = financialData.costBreakdown.mtd;

    const getVariance = (actual, compare) => actual - compare;
    const getVariancePct = (actual, compare) => ((actual - compare) / compare * 100).toFixed(1);
    const formatCurrency = (val) => val >= 1000000 ? `$${(val/1000000).toFixed(2)}M` : `$${(val/1000).toFixed(0)}K`;

    const comparisonValue = financialComparison === 'budget' ? periodData.budget : periodData.priorPeriod;
    const comparisonLabel = financialComparison === 'budget' ? 'Budget' : 'Prior Period';
    const variance = getVariance(periodData.totalOpEx, comparisonValue);
    const variancePct = getVariancePct(periodData.totalOpEx, comparisonValue);
    const isUnfavorable = variance > 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
        {/* Header with Period Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Financial Overview</h2>
          <div style={{ display: 'flex', gap: sp.sm }}>
            {/* Time Period Selector */}
            <div style={{ display: 'flex', background: C.neutral[100], borderRadius: 6, padding: 2 }}>
              {['mtd', 'qtd', 'ytd'].map(period => (
                <button
                  key={period}
                  onClick={() => setFinancialPeriod(period)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: financialPeriod === period ? 'white' : 'transparent',
                    color: financialPeriod === period ? C.brand[600] : C.neutral[600],
                    boxShadow: financialPeriod === period ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
            {/* Comparison Selector */}
            <select
              value={financialComparison}
              onChange={(e) => setFinancialComparison(e.target.value)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                border: `1px solid ${C.neutral[300]}`,
                borderRadius: 6,
                background: 'white',
                color: C.neutral[700],
                cursor: 'pointer'
              }}
            >
              <option value="budget">vs Budget</option>
              <option value="prior">vs Prior Period</option>
            </select>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
          {/* Total OpEx */}
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Total Operating Costs</p>
            <p style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>{formatCurrency(periodData.totalOpEx)}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {isUnfavorable ?
                <TrendingUp style={{ width: 12, height: 12, color: C.error[500] }} /> :
                <TrendingDown style={{ width: 12, height: 12, color: C.success[500] }} />
              }
              <span style={{ fontSize: '11px', color: isUnfavorable ? C.error[600] : C.success[600] }}>
                {isUnfavorable ? '+' : ''}{variancePct}% vs {comparisonLabel.toLowerCase()}
              </span>
            </div>
          </Card>

          {/* Cost Per Order */}
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Cost Per Order</p>
            <p style={{ fontSize: '22px', fontWeight: 500, margin: 0, color: periodData.costPerOrder > periodData.costPerOrderBudget ? C.warning[600] : C.success[600] }}>
              ${periodData.costPerOrder.toFixed(2)}
            </p>
            <p style={{ fontSize: '10px', color: C.neutral[400] }}>Target: ${periodData.costPerOrderBudget.toFixed(2)}</p>
          </Card>

          {/* Budget Variance */}
          <Card style={{ borderLeft: `4px solid ${isUnfavorable ? C.error[500] : C.success[500]}` }}>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Budget Variance</p>
            <p style={{ fontSize: '22px', fontWeight: 500, margin: 0, color: isUnfavorable ? C.error[600] : C.success[600] }}>
              {isUnfavorable ? '+' : ''}{formatCurrency(Math.abs(variance))}
            </p>
            <p style={{ fontSize: '10px', color: isUnfavorable ? C.error[500] : C.success[500] }}>
              {isUnfavorable ? 'Over budget' : 'Under budget'}
            </p>
          </Card>

          {/* Forecast */}
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>EOM Forecast</p>
            <p style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>{formatCurrency(periodData.forecast)}</p>
            <p style={{ fontSize: '10px', color: periodData.forecast > periodData.forecastBudget ? C.warning[500] : C.success[500] }}>
              Budget: {formatCurrency(periodData.forecastBudget)}
            </p>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Cost Breakdown</h3>
            <span style={{ fontSize: '11px', color: C.neutral[500] }}>{periodInfo.label}</span>
          </div>

          {/* Donut Chart Visualization */}
          <div style={{ display: 'flex', gap: sp.lg, marginBottom: sp.md }}>
            <div style={{ width: 140, height: 140, position: 'relative' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                {(() => {
                  let cumulative = 0;
                  const colors = [C.purple[500], C.purple[300], C.brand[500], C.warning[500], C.success[500], C.blueLight[500], C.neutral[400]];
                  return breakdown.map((item, i) => {
                    const start = cumulative;
                    cumulative += item.pct;
                    const startAngle = (start / 100) * 360 - 90;
                    const endAngle = (cumulative / 100) * 360 - 90;
                    const largeArc = item.pct > 50 ? 1 : 0;
                    const startX = 70 + 50 * Math.cos(startAngle * Math.PI / 180);
                    const startY = 70 + 50 * Math.sin(startAngle * Math.PI / 180);
                    const endX = 70 + 50 * Math.cos(endAngle * Math.PI / 180);
                    const endY = 70 + 50 * Math.sin(endAngle * Math.PI / 180);
                    return (
                      <path
                        key={i}
                        d={`M 70 70 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`}
                        fill={colors[i % colors.length]}
                        style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                      />
                    );
                  });
                })()}
                <circle cx="70" cy="70" r="30" fill="white" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{formatCurrency(periodData.totalOpEx)}</p>
                <p style={{ fontSize: '9px', color: C.neutral[500] }}>Total</p>
              </div>
            </div>

            {/* Legend */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.xs }}>
              {(() => {
                const colors = [C.purple[500], C.purple[300], C.brand[500], C.warning[500], C.success[500], C.blueLight[500], C.neutral[400]];
                return breakdown.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length] }} />
                    <span style={{ fontSize: '11px', color: C.neutral[600] }}>{item.category} ({item.pct}%)</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Breakdown Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: sp.sm, padding: `${sp.xs} ${sp.sm}`, background: C.neutral[50], borderRadius: 4 }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: C.neutral[500] }}>CATEGORY</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: C.neutral[500], textAlign: 'right' }}>ACTUAL</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: C.neutral[500], textAlign: 'right' }}>{comparisonLabel.toUpperCase()}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: C.neutral[500], textAlign: 'right' }}>VARIANCE</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: C.neutral[500], textAlign: 'right' }}>VAR %</span>
            </div>
            {breakdown.map((item, i) => {
              const compareVal = financialComparison === 'budget' ? item.budget : item.prior;
              const itemVariance = item.amount - compareVal;
              const itemVariancePct = ((itemVariance / compareVal) * 100).toFixed(1);
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: sp.sm,
                    padding: sp.sm,
                    background: 'white',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.neutral[50];
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Icon style={{ width: 14, height: 14, color: C.neutral[400] }} />
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{item.category}</span>
                  </div>
                  <span style={{ fontSize: '12px', textAlign: 'right' }}>{formatCurrency(item.amount)}</span>
                  <span style={{ fontSize: '12px', textAlign: 'right', color: C.neutral[500] }}>{formatCurrency(compareVal)}</span>
                  <span style={{ fontSize: '12px', textAlign: 'right', color: itemVariance > 0 ? C.error[600] : C.success[600] }}>
                    {itemVariance > 0 ? '+' : ''}{formatCurrency(Math.abs(itemVariance))}
                  </span>
                  <span style={{ fontSize: '12px', textAlign: 'right', color: itemVariance > 0 ? C.error[600] : C.success[600] }}>
                    {itemVariance > 0 ? '+' : ''}{itemVariancePct}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost Trends */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sp.md }}>
          {/* Monthly OpEx Trend */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Monthly Operating Costs</h3>
            <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: sp.xs }}>
              {financialData.monthlyTrend.map((month, i) => {
                const maxVal = Math.max(...financialData.monthlyTrend.map(m => Math.max(m.actual, m.budget)));
                const actualHeight = (month.actual / maxVal) * 100;
                const budgetHeight = (month.budget / maxVal) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
                      <div style={{
                        width: '35%',
                        height: `${actualHeight}%`,
                        background: month.current ? C.brand[500] : C.brand[300],
                        borderRadius: '3px 3px 0 0'
                      }} />
                      <div style={{
                        width: '35%',
                        height: `${budgetHeight}%`,
                        background: C.neutral[300],
                        borderRadius: '3px 3px 0 0'
                      }} />
                    </div>
                    <span style={{ fontSize: '9px', color: C.neutral[500], marginTop: 4 }}>{month.month}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: C.brand[500], borderRadius: 2 }} />
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: C.neutral[300], borderRadius: 2 }} />
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>Budget</span>
              </div>
            </div>
          </Card>

          {/* Cost Per Order Trend */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Cost Per Order Trend</h3>
            <div style={{ height: 120, position: 'relative' }}>
              {/* Target line */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${100 - ((4.00 / 4.30) * 100)}%`,
                borderTop: `2px dashed ${C.success[400]}`,
                zIndex: 1
              }}>
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: -14,
                  fontSize: '9px',
                  color: C.success[600],
                  background: 'white',
                  padding: '0 4px'
                }}>
                  Target $4.00
                </span>
              </div>

              {/* Line chart area */}
              <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={C.brand[500]}
                  strokeWidth="2"
                  points={financialData.costPerOrderTrend.map((d, i) => {
                    const x = (i / (financialData.costPerOrderTrend.length - 1)) * 280 + 10;
                    const y = 100 - ((d.value - 3.90) / 0.40) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {financialData.costPerOrderTrend.map((d, i) => {
                  const x = (i / (financialData.costPerOrderTrend.length - 1)) * 280 + 10;
                  const y = 100 - ((d.value - 3.90) / 0.40) * 100;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={d.current ? 5 : 3}
                      fill={d.current ? C.brand[600] : C.brand[400]}
                    />
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {financialData.costPerOrderTrend.map((d, i) => (
                  <span key={i} style={{ fontSize: '9px', color: C.neutral[500] }}>{d.month}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Alerts */}
        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Alerts & Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {financialData.alerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.sm,
                  padding: sp.sm,
                  background: alert.type === 'warning' ? C.warning[50] : alert.type === 'success' ? C.success[50] : C.brand[50],
                  borderRadius: 6,
                  borderLeft: `4px solid ${alert.type === 'warning' ? C.warning[500] : alert.type === 'success' ? C.success[500] : C.brand[500]}`
                }}
              >
                {alert.type === 'warning' && <AlertTriangle style={{ width: 16, height: 16, color: C.warning[600] }} />}
                {alert.type === 'success' && <CheckCircle style={{ width: 16, height: 16, color: C.success[600] }} />}
                {alert.type === 'info' && <TrendingUp style={{ width: 16, height: 16, color: C.brand[600] }} />}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{alert.message}</p>
                  <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>{alert.category}</p>
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: alert.amount > 0 ? C.error[600] : C.success[600]
                }}>
                  {alert.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(alert.amount))}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Orders Processed</p>
            <p style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>{periodData.ordersProcessed.toLocaleString()}</p>
            <p style={{ fontSize: '10px', color: C.neutral[400] }}>{periodInfo.label}</p>
          </Card>
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Units Handled</p>
            <p style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>{periodData.unitsHandled.toLocaleString()}</p>
            <p style={{ fontSize: '10px', color: C.neutral[400] }}>{periodInfo.label}</p>
          </Card>
          <Card>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Fulfillment % of Revenue</p>
            <p style={{ fontSize: '20px', fontWeight: 500, margin: 0, color: periodData.fulfillmentPctRevenue > 14 ? C.warning[600] : C.success[600] }}>
              {periodData.fulfillmentPctRevenue}%
            </p>
            <p style={{ fontSize: '10px', color: C.neutral[400] }}>Target: &lt;14%</p>
          </Card>
        </div>
      </div>
    );
  };

  // Render Dashboard Tab
  const renderDashboardTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
      {/* Header Card with KPIs */}
      <div style={{ background: `linear-gradient(135deg, ${C.blueLight[500]} 0%, ${C.brand[600]} 100%)`, borderRadius: 10, padding: sp.md, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>{zoneId} — {zoneName}</span>
              <Badge status="success" label={zoneData.status} />
            </div>
            <p style={{ fontSize: '12px', opacity: 0.8, marginTop: 2 }}>{zoneType} • {zoneData.dockDoors} Dock Doors</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', opacity: 0.7 }}>Space Utilization</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '28px', fontWeight: 300 }}>{zoneData.spaceUtil.cur}%</span>
              <ArrowRight style={{ width: 12, height: 12, opacity: 0.6 }} />
              <span style={{ fontSize: '18px', fontWeight: 500 }}>{zoneData.spaceUtil.pred}%</span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: sp.sm }}>
          <KpiCard label="Pallets/Hr" icon={Package} current={zoneData.kpis.palletsHr.cur} predicted={zoneData.kpis.palletsHr.pred} target={zoneData.kpis.palletsHr.target} timeline={zoneData.kpis.palletsHr.timeline} targetTab="work" />
          <KpiCard label="Avg Dwell" icon={Clock} current={zoneData.kpis.avgDwell.cur} predicted={zoneData.kpis.avgDwell.pred} target={`≤${zoneData.kpis.avgDwell.target}`} timeline={zoneData.kpis.avgDwell.timeline} targetTab="work" />
          <KpiCard label="Accuracy" icon={CheckCircle} current={zoneData.kpis.accuracy.cur} predicted={zoneData.kpis.accuracy.pred} target={`${zoneData.kpis.accuracy.target}%`} timeline={zoneData.kpis.accuracy.timeline} format={v => `${v.toFixed(1)}%`} targetTab="work" />
          <KpiCard label="Staged" icon={Package} current={zoneData.kpis.stagedPallets.cur} predicted={zoneData.kpis.stagedPallets.pred} target={zoneData.kpis.stagedPallets.target} timeline={zoneData.kpis.stagedPallets.timeline} targetTab="work" />
          <KpiCard label="Dock Util" icon={MapPin} current={`${zoneData.kpis.dockUtil.cur}%`} predicted={`${zoneData.kpis.dockUtil.pred}%`} target={`${zoneData.kpis.dockUtil.target}%`} timeline={zoneData.kpis.dockUtil.timeline} format={v => `${Math.round(v)}%`} targetTab="space" />
        </div>
      </div>

      {/* Zone Alerts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
          <h4 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Zone Alerts</h4>
          <span style={{ fontSize: '12px', color: C.warning[600] }}>{alerts.length} active</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: sp.sm,
              padding: sp.sm,
              background: a.sev === 'warning' ? C.warning[50] : a.sev === 'critical' ? C.error[50] : C.brand[50],
              borderRadius: 6,
              borderLeft: `3px solid ${a.sev === 'warning' ? C.warning[500] : a.sev === 'critical' ? C.error[500] : C.brand[500]}`
            }}>
              {a.sev === 'warning' ? <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600], flexShrink: 0, marginTop: 1 }} /> : <Info style={{ width: 14, height: 14, color: C.brand[600], flexShrink: 0, marginTop: 1 }} />}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: a.sev === 'warning' ? C.warning[700] : C.brand[700] }}>{a.title}</p>
                <p style={{ fontSize: '11px', color: a.sev === 'warning' ? C.warning[600] : C.brand[600] }}>{a.msg}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: C.neutral[500] }}>{a.time}</span>
                <p style={{ fontSize: '9px', color: C.neutral[400] }}>{a.conf}% conf</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.sm }}>Connections</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
          {/* Upstream */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>← UPSTREAM</p>
            <div style={{ display: 'flex', gap: sp.xs, justifyContent: 'center' }}>
              {connections.upstream.map((c, i) => <ConnectionCard key={i} {...c} direction="upstream" />)}
            </div>
          </div>

          {/* Current entity */}
          <div style={{
            background: C.brand[500],
            color: 'white',
            borderRadius: 8,
            padding: sp.sm,
            textAlign: 'center',
            minWidth: 60
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600 }}>{zoneId}</p>
            <p style={{ fontSize: '14px', fontWeight: 500 }}>{zoneData.spaceUtil.cur}%</p>
          </div>

          {/* Downstream */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: sp.xs, textAlign: 'center' }}>DOWNSTREAM →</p>
            <div style={{ display: 'flex', gap: sp.xs, justifyContent: 'center' }}>
              {connections.downstream.map((c, i) => <ConnectionCard key={i} {...c} direction="downstream" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Work Content Tab
  const renderWorkContentTab = () => {
    const ctxPallets = isContextualDifferent ? interpolateValue(workContent.stagedPallets.timeline, contextualTime) : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
        {/* Staged Pallets Summary */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Staged Pallets</h4>
                {ctxPallets !== null && (
                  <span style={{ fontSize: '12px', padding: '2px 6px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                    @{contextualTime}: <strong>{ctxPallets}</strong>
                  </span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Now: {workContent.stagedPallets.current} → Pred: {workContent.stagedPallets.predicted} • Capacity: {workContent.stagedPallets.capacity}</p>
            </div>
            <Badge status={workContent.stagedPallets.predicted > workContent.stagedPallets.capacity * 0.85 ? 'warning' : 'success'} label={`${Math.round(workContent.stagedPallets.current / workContent.stagedPallets.capacity * 100)}%`} />
          </div>

          {/* By Status breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm, marginBottom: sp.sm }}>
            {workContent.stagedPallets.byStatus.map((s, i) => (
              <div key={i} style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6, borderLeft: `3px solid ${s.color}`, textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 500 }}>{s.count}</p>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>{s.status}</p>
              </div>
            ))}
          </div>

          <Progress value={workContent.stagedPallets.current} max={workContent.stagedPallets.capacity} pred={workContent.stagedPallets.predicted} color={C.brand[500]} h={6} />
        </Card>

        {/* ASN/PO Tracking */}
        <Card>
          <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.sm }}>ASN/PO Tracking</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
            {workContent.asnData.map((asn, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm,
                padding: sp.sm,
                background: C.neutral[50],
                borderRadius: 6,
                cursor: 'pointer'
              }} className="card-click">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{asn.asn}</span>
                    <span style={{ fontSize: '11px', color: C.neutral[500] }}>{asn.po}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: C.neutral[500] }}>{asn.vendor}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{asn.received}/{asn.lines}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>lines</p>
                </div>
                <Badge status={asn.status === 'complete' ? 'success' : asn.status === 'in-progress' ? 'info' : 'neutral'} label={asn.status} />
                <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              </div>
            ))}
          </div>
        </Card>

        {/* Pallet List */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
            <h4 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>All Pallets in Zone</h4>
            <span style={{ fontSize: '11px', color: C.neutral[500] }}>{workContent.palletList.length} items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
            {workContent.palletList.map((plt, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm,
                padding: sp.sm,
                background: C.neutral[50],
                borderRadius: 6,
                cursor: 'pointer'
              }} className="card-click" onClick={() => onNavigate && onNavigate('pallet', plt.id)}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: plt.status === 'Ready for Putaway' ? C.success[500] : plt.status === 'QC Hold' ? C.error[500] : C.warning[500]
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'monospace' }}>{plt.id}</span>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>{plt.source} → {plt.destination}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: plt.dwell > 60 ? C.warning[600] : C.neutral[600] }}>{plt.dwell}m</p>
                  <p style={{ fontSize: '9px', color: C.neutral[400] }}>dwell</p>
                </div>
                <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // Placeholder for other tabs
  const renderPlaceholderTab = (tabName) => (
    <div style={{ padding: sp.xl, textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: C.neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: sp.md }}>
        {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { style: { width: 24, height: 24, color: C.neutral[400] } })}
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, color: C.neutral[600], marginBottom: sp.sm }}>{tabName}</h3>
      <p style={{ fontSize: '13px', color: C.neutral[400] }}>Content for {zoneName}'s {tabName.toLowerCase()} will appear here</p>
    </div>
  );

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardTab();
      case 'financial': return renderFinancialTab();
      case 'work': return renderWorkContentTab();
      case 'staff': return renderPlaceholderTab('Staff');
      case 'space': return renderPlaceholderTab('Space & Locations');
      case 'equipment': return renderPlaceholderTab('Equipment');
      case 'schedule': return renderPlaceholderTab('Schedule');
      case 'insights': return renderPlaceholderTab('Insights');
      case 'config': return renderPlaceholderTab('Configuration');
      default: return renderDashboardTab();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Tab sidebar - LEFT SIDE */}
      <div style={{ width: 48, background: C.neutral[100], borderRight: `1px solid ${C.neutral[200]}`, display: 'flex', flexDirection: 'column', paddingTop: sp.sm }}>
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
                border: isActive ? `2px solid ${C.brand[500]}` : '2px solid transparent'
              }}
            >
              <Icon style={{ width: 18, height: 18, color: isActive ? C.brand[600] : C.neutral[500] }} />
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 708 }}>
        {/* Breadcrumb */}
        <div style={{ padding: `${sp.sm} ${sp.md}`, borderBottom: `1px solid ${C.neutral[200]}`, background: C.neutral[50] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, fontSize: '12px' }}>
            <span style={{ color: C.brand[600], cursor: 'pointer' }} onClick={onBack}>🏠 {'{facilityName}'} Overview</span>
            <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
            <span style={{ color: C.neutral[700], fontWeight: 500 }}>{zoneId} {zoneName}</span>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blueLight[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin style={{ width: 18, height: 18, color: C.blueLight[600] }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>{zoneId} {zoneName}</h2>
          </div>
          <button style={{
            padding: `${sp.sm} ${sp.md}`,
            background: C.brand[500],
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: sp.xs
          }}>
            LOCATION ACTIONS <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', padding: sp.md }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ZonePanel;
