import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronRight, Zap, Truck, Users, Wrench } from 'lucide-react';

// Color constants
const C = {
  brand: { 50: '#EFF6FF', 100: '#D5EDFF', 200: '#BFDBFE', 500: '#2F72FF', 600: '#0037FF', 700: '#1D4ED8' },
  neutral: { 50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828' },
  success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
  warning: { 50: '#FFFCF5', 100: '#FEF0C7', 200: '#FEDF89', 300: '#FEC84B', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
  error: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04443', 600: '#D92D20', 700: '#B42318' },
  purple: { 50: '#F4F3FF', 100: '#EBE9FE', 200: '#DDD6FE', 300: '#D9D6FE', 400: '#A78BFA', 500: '#7A5AF8', 600: '#6938EF', 700: '#5925DC', 900: '#2E1065' },
  greenLight: { 50: '#F3FEE7', 100: '#ECFCCB', 500: '#66C61C', 600: '#65A30D' }
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

const SchedView = ({ onBack }) => {
  const inb = [{ id: 'TRL-2241', carrier: 'FedEx', type: 'Live', eta: '10:30', dock: 'Door 3', ok: true }, { id: 'TRL-2242', carrier: 'UPS', type: 'Drop', eta: '11:00', dock: 'Door 5', ok: true }, { id: 'TRL-2243', carrier: 'DHL', type: 'Live', eta: '11:45', dock: 'Door 7', ok: false }];
  const out = [{ carrier: 'FedEx Ground', window: '14:00-14:30', doors: '1, 2, 3', pred: 95 }, { carrier: 'UPS', window: '15:30-16:00', doors: '4, 5', pred: 72 }, { carrier: 'USPS', window: '16:00-16:30', doors: '6', pred: 100 }];
  const changes = [{ time: '09:45', title: 'TRL-2243 delayed', desc: 'ETA +30m', icon: Truck, color: C.warning[500] }, { time: '09:30', title: 'Maria S. reassigned', desc: 'Putaway → Picking', icon: Users, color: C.brand[500] }, { time: '09:15', title: 'Dock 8 maintenance', desc: 'Until 12:00', icon: Wrench, color: C.error[500] }];
  const schedData = [
    { id: 'TRL-2241', type: 'Inbound', carrier: 'FedEx', eta: '10:30', dock: 'Door 3', pallets: 24, status: 'On Time' },
    { id: 'TRL-2242', type: 'Inbound', carrier: 'UPS', eta: '11:00', dock: 'Door 5', pallets: 32, status: 'On Time' },
    { id: 'TRL-2243', type: 'Inbound', carrier: 'DHL', eta: '11:45', dock: 'Door 7', pallets: 18, status: 'Delayed' },
    { id: 'TRL-2244', type: 'Inbound', carrier: 'ABC Freight', eta: '12:30', dock: 'Door 2', pallets: 40, status: 'On Time' },
    { id: 'OUT-001', type: 'Outbound', carrier: 'FedEx Ground', window: '14:00-14:30', dock: 'Doors 1-3', orders: 1850, status: 'Ready' },
    { id: 'OUT-002', type: 'Outbound', carrier: 'UPS', window: '15:30-16:00', dock: 'Doors 4-5', orders: 1420, status: 'At Risk' },
    { id: 'OUT-003', type: 'Outbound', carrier: 'USPS', window: '16:00-16:30', dock: 'Door 6', orders: 680, status: 'Ready' },
    { id: 'OUT-004', type: 'Outbound', carrier: 'FedEx Express', window: '18:00-18:30', dock: 'Door 8', orders: 520, status: 'Ready' },
  ];
  const schedColumns = [
    { key: 'id', label: 'ID' },
    { key: 'type', label: 'Type' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'eta', label: 'ETA/Window', render: (v, row) => row.window || v },
    { key: 'dock', label: 'Dock' },
    { key: 'pallets', label: 'Pallets/Orders', align: 'right', render: (v, row) => row.orders || v },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'On Time' || v === 'Ready' ? 'success' : v === 'Delayed' || v === 'At Risk' ? 'warning' : 'neutral'} label={v} /> }
  ];
  const schedFilters = [
    { key: 'type', label: 'Type', options: ['Inbound', 'Outbound'] },
    { key: 'status', label: 'Status', options: ['On Time', 'Delayed', 'Ready', 'At Risk'] }
  ];
  const schedAlerts = [
    { sev: 'warning', title: 'Dock Saturation — 11:00 & 14:00', msg: 'All 12 docks predicted active at peak. Plan for TRL-2243 delay cascade.', time: '1hr out', conf: 85 },
    { sev: 'warning', title: 'UPS Pickup Readiness Low', msg: '72% ready at 15:30 window. Prioritize UPS orders.', time: '5.5hr out', conf: 76 },
    { sev: 'success', title: 'Inbound Clearing by 14:00', msg: 'All inbound trailers complete before shift change.', time: '4hr out', conf: 92 }
  ];


  // Dock utilization forecast
  const dockTimeline = [
    { time: '06:00', actual: 4, predicted: null },
    { time: '07:00', actual: 6, predicted: null },
    { time: '08:00', actual: 8, predicted: null },
    { time: '09:00', actual: 10, predicted: null },
    { time: '10:00', actual: 11, predicted: 11, now: true },
    { time: '11:00', actual: null, predicted: 12, upper: 12, lower: 11 },
    { time: '12:00', actual: null, predicted: 10, upper: 11, lower: 9 },
    { time: '13:00', actual: null, predicted: 8, upper: 9, lower: 7 },
    { time: '14:00', actual: null, predicted: 12, upper: 12, lower: 11 }
  ];
  const inboundTimeline = [
    { time: '06:00', actual: 2, predicted: null },
    { time: '07:00', actual: 3, predicted: null },
    { time: '08:00', actual: 4, predicted: null },
    { time: '09:00', actual: 3, predicted: null },
    { time: '10:00', actual: 3, predicted: 3, now: true },
    { time: '11:00', actual: null, predicted: 4, upper: 5, lower: 3 },
    { time: '12:00', actual: null, predicted: 2, upper: 3, lower: 1 },
    { time: '13:00', actual: null, predicted: 1, upper: 2, lower: 0 },
    { time: '14:00', actual: null, predicted: 0, upper: 1, lower: 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      <Breadcrumb items={[{ label: 'Executive Summary', onClick: onBack }, { label: 'Schedules' }]} />
      <Header icon={Calendar} title="Schedules" sub="Inbound, outbound, changes" color={C.greenLight[500]} />

      {/* Schedules Data Grid */}
      <DataGrid title="Scheduled Events" subtitle="Inbound trailers and outbound pickups" columns={schedColumns} data={schedData} color={C.greenLight[500]} filterOptions={schedFilters} />

      {/* Dock Utilization */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Dock Utilization</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Active docks (12 total) • All 12 docks active at 11:00 & 14:00 • Plan for outbound surge</p></div>
          <Badge status="warning" label="Peak @ 11:00" />
        </div>
        <PredictiveTimeline data={dockTimeline} height={160} target={12} warning={10} critical={12} />
      </Card>

      {/* Inbound Arrivals */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Inbound Arrivals</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Trailers per hour • Peak receiving 11:00 • Clearing by 14:00</p></div>
          <Badge status="success" label="Clearing" />
        </div>
        <PredictiveTimeline data={inboundTimeline} height={160} />
      </Card>

      {/* Inbound Trailers */}
      <Card>
        <div style={{ marginBottom: sp.md }}><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Inbound Trailers</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {inb.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sp.md, background: C.neutral[50], borderRadius: 6, borderLeft: `3px solid ${t.ok ? C.success[500] : C.warning[500]}` }}>
              <div><p style={{ fontSize: '14px', fontWeight: 500 }}>{t.id}</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>{t.carrier} • {t.type}</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: '16px', fontWeight: 500 }}>{t.eta}</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>{t.dock}</p></div>
              <Badge status={t.ok ? 'success' : 'warning'} label={t.ok ? 'On Time' : 'Delayed'} />
            </div>
          ))}
        </div>
      </Card>

      {/* Outbound Pickups */}
      <Card>
        <div style={{ marginBottom: sp.md }}><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Outbound Pickups</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {out.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sp.md, background: C.neutral[50], borderRadius: 6 }}>
              <div><p style={{ fontSize: '14px', fontWeight: 500 }}>{p.carrier}</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Doors: {p.doors}</p></div>
              <div style={{ textAlign: 'right' }}><p style={{ fontSize: '16px', fontWeight: 500 }}>{p.window}</p><Badge status={p.pred >= 95 ? 'success' : p.pred >= 80 ? 'warning' : 'error'} label={`${p.pred}% ready`} /></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule Change Log */}
      <Card>
        <div style={{ marginBottom: sp.md }}><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Schedule Change Log</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {changes.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: sp.sm, padding: sp.sm, borderBottom: i < changes.length - 1 ? `1px solid ${C.neutral[200]}` : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><c.icon style={{ width: 16, height: 16, color: c.color }} /></div>
              <div style={{ flex: 1 }}><p style={{ fontSize: '14px', fontWeight: 500 }}>{c.title}</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>{c.desc}</p></div>
              <span style={{ fontSize: '13px', color: C.neutral[500] }}>{c.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Analysis - BOTTOM */}
      <Card style={{ borderLeft: `4px solid ${C.greenLight[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.greenLight[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.greenLight[500] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>AI-generated schedule predictions</p></div>
          <Badge status="warning" label={`${schedAlerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>{schedAlerts.map((a, i) => <Alert key={i} {...a} />)}</div>
      </Card>
    </div>
  );
};

export default SchedView;
