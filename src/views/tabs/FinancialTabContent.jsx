import React, { useState } from 'react';
import {
  Users, MapPin, Package, Truck, Settings, MoreHorizontal,
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import UI components
import { Card } from '../../components/UI';

// Financial Tab Content - Facility level financial overview
const FinancialTabContent = ({ onViewInsights, onNavigateToAlert, onNavigateToCostCategory }) => {
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
      { id: 'fin-1', type: 'warning', message: 'Labor costs 3.9% over budget', category: 'Direct Labor', amount: 14550 },
      { id: 'fin-2', type: 'info', message: 'Equipment maintenance trending up', category: 'Equipment', amount: 2750 },
      { id: 'fin-3', type: 'success', message: 'Materials costs under budget', category: 'Materials', amount: -675 }
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, marginBottom: sp.sm }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.success[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DollarSign style={{ width: 20, height: 20, color: C.success[600] }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Financial Overview</h2>
          <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0 }}>Operating costs, budget variance, and financial trends</p>
        </div>
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
        
        {/* Donut Chart + Legend */}
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
                onClick={() => onNavigateToCostCategory && onNavigateToCostCategory(item.category)}
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
            
            {/* Line chart */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Alerts & Insights</h3>
          <button
            onClick={() => onViewInsights && onViewInsights()}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              background: C.purple[50],
              color: C.purple[600],
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            View All Insights
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {financialData.alerts.map((alert, i) => (
            <div 
              key={i}
              onClick={() => onNavigateToAlert && onNavigateToAlert(alert.id, 'financial', true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: sp.sm,
                padding: sp.sm,
                background: alert.type === 'warning' ? C.warning[50] : alert.type === 'success' ? C.success[50] : C.brand[50],
                borderRadius: 6,
                borderLeft: `4px solid ${alert.type === 'warning' ? C.warning[500] : alert.type === 'success' ? C.success[500] : C.brand[500]}`,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
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
              <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
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

export default FinancialTabContent;
