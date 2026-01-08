import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign, ChevronRight, Zap, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Color constants
const C = {
  brand: { 50: '#EFF6FF', 100: '#D5EDFF', 200: '#BFDBFE', 500: '#2F72FF', 600: '#0037FF', 700: '#1D4ED8' },
  neutral: { 50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828' },
  success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
  warning: { 50: '#FFFCF5', 100: '#FEF0C7', 200: '#FEDF89', 300: '#FEC84B', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
  error: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04443', 600: '#D92D20', 700: '#B42318' },
  purple: { 50: '#F4F3FF', 100: '#EBE9FE', 200: '#DDD6FE', 300: '#D9D6FE', 400: '#A78BFA', 500: '#7A5AF8', 600: '#6938EF', 700: '#5925DC', 900: '#2E1065' }
};
const sp = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' };

// Card component
const Card = ({ children, style={} }) => (
  <div style={{ background: 'white', padding: sp.lg, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', ...style }}>{children}</div>
);

// Badge component
const Badge = ({ status, label }) => {
  const cfg = { success: [C.success[50], C.success[700]], warning: [C.warning[50], C.warning[700]], error: [C.error[50], C.error[700]], info: [C.brand[100], C.brand[600]], neutral: [C.neutral[100], C.neutral[600]] };
  const [bg, txt] = cfg[status] || cfg.neutral;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: bg, color: txt }}>{label}</span>;
};

// Alert component
const Alert = ({ sev, title, msg, time, conf }) => {
  const cfg = { critical: [C.error[50], C.error[100], C.error[700]], warning: [C.warning[50], C.warning[100], C.warning[700]], info: [C.brand[100], C.brand[100], C.brand[600]], success: [C.success[50], C.success[100], C.success[700]] };
  const [bg, bdr, txt] = cfg[sev] || cfg.info;
  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderLeft: `4px solid ${txt}`, borderRadius: 6, padding: `${sp.sm} ${sp.md}` }}>
      <div style={{ display: 'flex', gap: sp.sm, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: txt }}>{title}</span>
            <span style={{ fontSize: '11px', color: txt, opacity: 0.8 }}>{time}</span>
          </div>
          <p style={{ fontSize: '11px', color: txt, marginTop: '2px', opacity: 0.9 }}>{msg}</p>
          {conf && <p style={{ fontSize: '10px', color: txt, opacity: 0.7, marginTop: '3px' }}>Confidence: {conf}%</p>}
        </div>
      </div>
    </div>
  );
};

// Breadcrumb component
const Breadcrumb = ({ items }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.lg, fontSize: '13px' }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight style={{ width: 14, height: 14, color: C.neutral[400] }} />}
        {item.onClick ? (
          <button onClick={item.onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '13px', color: C.brand[600], fontWeight: 500 }}>
            {item.label}
          </button>
        ) : (
          <span style={{ color: C.neutral[500], fontWeight: 400 }}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// Header component
const Header = ({ icon: Icon, title, sub, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.lg }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon style={{ width: 22, height: 22, color }} /></div>
      <div><h2 style={{ fontSize: '20px', fontWeight: 400, margin: 0 }}>{title}</h2>{sub && <p style={{ fontSize: '13px', color: C.neutral[500], marginTop: 2 }}>{sub}</p>}</div>
    </div>
  </div>
);

// DataGrid component (simplified for this extraction)
const DataGrid = ({ title, subtitle, columns, data, color, filterOptions = [] }) => {
  return (
    <Card>
      <div style={{ marginBottom: sp.md }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500 }}>{title}</h3>
        <p style={{ fontSize: '12px', color: C.neutral[500] }}>{subtitle}</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: C.neutral[50] }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '10px 12px', textAlign: col.align || 'left', fontWeight: 500, color: C.neutral[600], borderBottom: `2px solid ${C.neutral[200]}` }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.neutral[100]}` }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '10px 12px', textAlign: col.align || 'left', color: C.neutral[800] }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// PredictiveTimeline component
const PredictiveTimeline = ({ data, height = 120, target, warning, critical }) => {
  const nowIndex = data.findIndex(d => d.now);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple[500]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={C.purple[500]} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brand[500]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.brand[500]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={30} domain={['auto', 'auto']} />
            {critical && <Area type="monotone" dataKey={() => critical} stroke="none" fill={C.error[100]} fillOpacity={0.5} />}
            {warning && <Area type="monotone" dataKey={() => warning} stroke="none" fill={C.warning[100]} fillOpacity={0.3} />}
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confBand)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="url(#confBand)" />
            <Area type="monotone" dataKey="actual" stroke={C.brand[500]} strokeWidth={2} fill="url(#actualFill)" dot={false} />
            <Area type="monotone" dataKey="predicted" stroke={C.purple[500]} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} />
            {target && <Area type="monotone" dataKey={() => target} stroke={C.success[500]} strokeWidth={1} strokeDasharray="4 4" fill="none" />}
          </AreaChart>
        </ResponsiveContainer>
        {nowIndex >= 0 && (
          <div style={{ position: 'absolute', top: 10, bottom: 5, left: `${(nowIndex / (data.length - 1)) * 100}%`, width: 2, background: C.neutral[900], zIndex: 10 }}>
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C.neutral[900], color: 'white', padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 600 }}>NOW</div>
          </div>
        )}
      </div>
    </div>
  );
};

const FinView = ({ onBack }) => {
  const metrics = [{ l: 'Cost per Order', v: '$4.82', tr: '-2.4%', ok: true }, { l: 'Cost per Unit', v: '$0.42', tr: '-3.1%', ok: true }, { l: 'Labor Cost Today', v: '$12,450', tr: '+5.2%', ok: false }, { l: 'Overtime Cost', v: '$1,840', tr: '+8.1%', ok: false }];
  const budget = [{ fn: 'Receiving', act: 2100, bud: 2000, pred: 2250 }, { fn: 'Putaway', act: 1800, bud: 2200, pred: 2100 }, { fn: 'Picking', act: 4200, bud: 4000, pred: 4400 }, { fn: 'Packing', act: 2800, bud: 2600, pred: 2950 }, { fn: 'Shipping', act: 1550, bud: 1600, pred: 1620 }];
  const finData = [
    { fn: 'Receiving', budgeted: 2000, actual: 2100, predicted: 2250, variance: '+12.5%', rate: 18.50 },
    { fn: 'Putaway', budgeted: 2200, actual: 1800, predicted: 2100, variance: '-4.5%', rate: 17.25 },
    { fn: 'Picking', budgeted: 4000, actual: 4200, predicted: 4400, variance: '+10.0%', rate: 19.00 },
    { fn: 'Packing', budgeted: 2600, actual: 2800, predicted: 2950, variance: '+13.5%', rate: 18.00 },
    { fn: 'Shipping', budgeted: 1600, actual: 1550, predicted: 1620, variance: '+1.3%', rate: 17.50 },
    { fn: 'QC/Returns', budgeted: 800, actual: 720, predicted: 780, variance: '-2.5%', rate: 16.75 },
    { fn: 'Supervision', budgeted: 1200, actual: 1180, predicted: 1200, variance: '0.0%', rate: 28.00 },
  ];
  const finColumns = [
    { key: 'fn', label: 'Function' },
    { key: 'budgeted', label: 'Budget', align: 'right', render: (v) => '$' + v.toLocaleString() },
    { key: 'actual', label: 'Actual', align: 'right', render: (v) => '$' + v.toLocaleString() },
    { key: 'predicted', label: 'Predicted', align: 'right', render: (v) => '$' + v.toLocaleString() },
    { key: 'variance', label: 'Variance', align: 'right', render: (v) => <span style={{ color: v.startsWith('+') && parseFloat(v) > 5 ? C.error[600] : v.startsWith('-') ? C.success[600] : C.neutral[600] }}>{v}</span> },
    { key: 'rate', label: '$/hr', align: 'right', render: (v) => '$' + v.toFixed(2) }
  ];
  const finFilters = [];
  const finAlerts = [
    { sev: 'warning', title: 'Labor Budget Overage — $700', msg: '$13,100 predicted vs $12,400 budget (+5.6%).', time: 'EOD', conf: 88 },
    { sev: 'warning', title: 'Overtime Exceeding Cap', msg: '$1,920 predicted vs $1,600 budget (+20%).', time: 'EOD', conf: 84 },
    { sev: 'success', title: 'Cost per Unit Improving', msg: '$0.42 today vs $0.43 target (-3.1%).', time: 'Current', conf: 96 }
  ];


  // Cost forecast timeline
  const costTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '07:00', actual: 1520, predicted: null },
    { time: '08:00', actual: 3180, predicted: null },
    { time: '09:00', actual: 4920, predicted: null },
    { time: '10:00', actual: 6450, predicted: 6450, now: true },
    { time: '11:00', actual: null, predicted: 8100, upper: 8400, lower: 7800 },
    { time: '12:00', actual: null, predicted: 9800, upper: 10200, lower: 9400 },
    { time: '13:00', actual: null, predicted: 11400, upper: 11900, lower: 10900 },
    { time: '14:00', actual: null, predicted: 13100, upper: 13800, lower: 12400 }
  ];
  const overtimeTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '07:00', actual: 180, predicted: null },
    { time: '08:00', actual: 420, predicted: null },
    { time: '09:00', actual: 720, predicted: null },
    { time: '10:00', actual: 920, predicted: 920, now: true },
    { time: '11:00', actual: null, predicted: 1180, upper: 1280, lower: 1080 },
    { time: '12:00', actual: null, predicted: 1450, upper: 1600, lower: 1300 },
    { time: '13:00', actual: null, predicted: 1680, upper: 1880, lower: 1480 },
    { time: '14:00', actual: null, predicted: 1920, upper: 2200, lower: 1640 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      <Breadcrumb items={[{ label: 'Executive Summary', onClick: onBack }, { label: 'Financials' }]} />
      <Header icon={DollarSign} title="Financials" sub="Cost tracking, budget variance" color={C.success[500]} />

      {/* Financials Data Grid */}
      <DataGrid title="Labor Cost by Function" subtitle="Budget vs actual vs predicted" columns={finColumns} data={finData} color={C.success[500]} filterOptions={finFilters} />

      {/* Labor Cost Forecast */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Labor Cost Forecast</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Budget: $12,400 • Predicted: $13,100 • 5.6% over budget</p></div>
          <Badge status="warning" label="+$700 over" />
        </div>
        <PredictiveTimeline data={costTimeline} height={160} target={12400} />
      </Card>

      {/* Overtime Cost Forecast */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Overtime Cost Forecast</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Budget: $1,600 • Current: $920 • Predicted: $1,920 (+20% over budget)</p></div>
          <Badge status="warning" label="+$320 over" />
        </div>
        <PredictiveTimeline data={overtimeTimeline} height={160} target={1600} warning={1400} critical={1800} />
      </Card>

      {/* Key Metrics */}
      <Card>
        <div style={{ marginBottom: sp.md }}><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Cost Metrics</h3></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ padding: sp.lg, background: C.neutral[50], borderRadius: 8, borderLeft: `3px solid ${m.ok ? C.success[500] : C.warning[500]}` }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[500], marginBottom: sp.sm, textTransform: 'uppercase' }}>{m.l}</p>
              <p style={{ fontSize: '32px', fontWeight: 300, marginBottom: sp.sm }}>{m.v}</p>
              <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '14px', fontWeight: 500, color: m.ok ? C.success[600] : C.warning[600] }}>
                {m.tr.startsWith('-') ? <ArrowDownRight style={{ width: 16, height: 16 }} /> : <ArrowUpRight style={{ width: 16, height: 16 }} />}{m.tr}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Labor Cost by Function */}
      <Card>
        <div style={{ marginBottom: sp.md }}><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Labor Cost by Function (Current → Predicted)</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
          {budget.map((b, i) => {
            const overNow = b.act > b.bud;
            const overPred = b.pred > b.bud;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <span style={{ fontSize: '14px', fontWeight: 500, minWidth: 100 }}>{b.fn}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative', height: 28, background: C.neutral[100], borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', height: '100%', width: `${(b.pred / Math.max(b.pred, b.bud) * 100)}%`, background: overPred ? C.purple[200] : C.purple[100] }} />
                    <div style={{ position: 'absolute', height: '100%', width: `${(b.act / Math.max(b.pred, b.bud)) * 100}%`, background: overNow ? C.warning[500] : C.success[500] }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(b.bud / Math.max(b.pred, b.bud)) * 100}%`, width: 2, background: C.neutral[800] }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: sp.sm, minWidth: 220, fontSize: '13px' }}>
                  <span style={{ color: overNow ? C.warning[600] : C.success[600] }}>${b.act.toLocaleString()}</span>
                  <ArrowRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                  <span style={{ color: C.purple[600] }}>${b.pred.toLocaleString()}</span>
                  <span style={{ color: C.neutral[500] }}>/ ${b.bud.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Analysis - BOTTOM */}
      <Card style={{ borderLeft: `4px solid ${C.success[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.success[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.success[600] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>AI-generated financial predictions</p></div>
          <Badge status="warning" label={`${finAlerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>{finAlerts.map((a, i) => <Alert key={i} {...a} />)}</div>
      </Card>
    </div>
  );
};

export default FinView;
