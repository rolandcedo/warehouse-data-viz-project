import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ClipboardList, ChevronRight, Zap, ArrowRight } from 'lucide-react';

// Color constants
const C = {
  brand: { 50: '#EFF6FF', 100: '#D5EDFF', 200: '#BFDBFE', 500: '#2F72FF', 600: '#0037FF', 700: '#1D4ED8' },
  neutral: { 50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828' },
  success: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
  warning: { 50: '#FFFCF5', 100: '#FEF0C7', 200: '#FEDF89', 300: '#FEC84B', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
  error: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04443', 600: '#D92D20', 700: '#B42318' },
  purple: { 50: '#F4F3FF', 100: '#EBE9FE', 200: '#DDD6FE', 300: '#D9D6FE', 400: '#A78BFA', 500: '#7A5AF8', 600: '#6938EF', 700: '#5925DC', 900: '#2E1065' },
  orange: { 50: '#FFF6ED', 100: '#FFEDD5', 500: '#FB6514', 600: '#EA580C' }
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

const WorkView = ({ onBack }) => {
  // Queue burndown timelines - each queue gets its own prediction
  const pickTimeline = [
    { time: '06:00', actual: 4200, predicted: null },
    { time: '07:00', actual: 3680, predicted: null },
    { time: '08:00', actual: 3160, predicted: null },
    { time: '09:00', actual: 2640, predicted: null },
    { time: '10:00', actual: 2310, predicted: 2310, now: true },
    { time: '11:00', actual: null, predicted: 1790, upper: 1890, lower: 1690 },
    { time: '12:00', actual: null, predicted: 1270, upper: 1420, lower: 1120 },
    { time: '13:00', actual: null, predicted: 750, upper: 950, lower: 550 },
    { time: '14:00', actual: null, predicted: 100, upper: 350, lower: 0 }
  ];
  const packTimeline = [
    { time: '06:00', actual: 3800, predicted: null },
    { time: '07:00', actual: 3420, predicted: null },
    { time: '08:00', actual: 2940, predicted: null },
    { time: '09:00', actual: 2350, predicted: null },
    { time: '10:00', actual: 2350, predicted: 2350, now: true },
    { time: '11:00', actual: null, predicted: 1870, upper: 1970, lower: 1770 },
    { time: '12:00', actual: null, predicted: 1390, upper: 1540, lower: 1240 },
    { time: '13:00', actual: null, predicted: 910, upper: 1110, lower: 710 },
    { time: '14:00', actual: null, predicted: 200, upper: 450, lower: 0 }
  ];
  const shipTimeline = [
    { time: '06:00', actual: 3200, predicted: null },
    { time: '07:00', actual: 2880, predicted: null },
    { time: '08:00', actual: 2480, predicted: null },
    { time: '09:00', actual: 1960, predicted: null },
    { time: '10:00', actual: 1566, predicted: 1566, now: true },
    { time: '11:00', actual: null, predicted: 1146, upper: 1246, lower: 1046 },
    { time: '12:00', actual: null, predicted: 726, upper: 876, lower: 576 },
    { time: '13:00', actual: null, predicted: 306, upper: 506, lower: 106 },
    { time: '14:00', actual: null, predicted: 0, upper: 150, lower: 0 }
  ];

  // Carrier burnup timelines - orders completed toward cutoff target
  const fedexTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '07:00', actual: 312, predicted: null },
    { time: '08:00', actual: 624, predicted: null },
    { time: '09:00', actual: 936, predicted: null },
    { time: '10:00', actual: 1247, predicted: 1247, now: true },
    { time: '11:00', actual: null, predicted: 1403, upper: 1453, lower: 1353 },
    { time: '12:00', actual: null, predicted: 1559, upper: 1659, lower: 1459 },
    { time: '13:00', actual: null, predicted: 1715, upper: 1865, lower: 1565 },
    { time: '14:00', actual: null, predicted: 1920, upper: 2070, lower: 1770 }
  ];
  const upsTimeline = [
    { time: '06:00', actual: 0, predicted: null },
    { time: '07:00', actual: 142, predicted: null },
    { time: '08:00', actual: 284, predicted: null },
    { time: '09:00', actual: 426, predicted: null },
    { time: '10:00', actual: 680, predicted: 680, now: true },
    { time: '11:00', actual: null, predicted: 822, upper: 892, lower: 752 },
    { time: '12:00', actual: null, predicted: 964, upper: 1084, lower: 844 },
    { time: '13:00', actual: null, predicted: 1106, upper: 1276, lower: 936 },
    { time: '14:00', actual: null, predicted: 1248, upper: 1468, lower: 1028 },
    { time: '15:00', actual: null, predicted: 1380, upper: 1550, lower: 1210 }
  ];

  const ordersData = [
    { orderId: '0136637438', status: 'Released', shipTo: 'Bayer S.A.', country: 'AR', carrier: 'Expeditors Intl', units: 8, age: 74.95, type: 'LTL' },
    { orderId: '0137014596', status: 'Released', shipTo: 'Bayer S.A.', country: 'AR', carrier: 'Expeditors Ocean', units: 34150, age: 25.95, type: 'LTL' },
    { orderId: '0137148308', status: 'Released', shipTo: 'Bayer Philippines', country: 'PH', carrier: 'Expeditors Ocean', units: 21000, age: 7.95, type: 'LTL' },
    { orderId: '0137171270', status: 'Staged', shipTo: 'Bayer Medical Care BV', country: 'NL', carrier: 'Expeditors Ocean', units: 9, age: 6.95, type: 'LTL' },
    { orderId: '0137168981', status: 'In Packing', shipTo: 'Bayer Medical Care BV', country: 'NL', carrier: 'Expeditors Ocean', units: 385, age: 6.95, type: 'LTL' },
    { orderId: '0137173814', status: 'DC Allocated', shipTo: 'Imaxeon Pty Ltd', country: 'AU', carrier: 'Expeditors Ocean', units: 33000, age: 6.95, type: 'LTL' },
    { orderId: '0137170275', status: 'Staged', shipTo: 'SmartVision LTDA', country: 'CL', carrier: 'See Remarks', units: 26000, age: 6.95, type: 'LTL' },
    { orderId: '0137177939', status: 'DC Allocated', shipTo: 'SmartVision LTDA', country: 'CL', carrier: 'See Remarks', units: 33000, age: 5.95, type: 'LTL' },
    { orderId: '0137182456', status: 'Packed', shipTo: 'MedSupply Inc', country: 'US', carrier: 'FedEx Ground', units: 245, age: 1.25, type: 'Parcel' },
    { orderId: '0137183001', status: 'Weighed', shipTo: 'Healthcare Dist', country: 'US', carrier: 'UPS', units: 128, age: 0.95, type: 'Parcel' },
    { orderId: '0137183245', status: 'In Packing', shipTo: 'PharmaCo', country: 'CA', carrier: 'FedEx Express', units: 56, age: 0.75, type: 'Parcel' },
    { orderId: '0137183512', status: 'DC Allocated', shipTo: 'GlobalMed', country: 'US', carrier: 'USPS', units: 12, age: 0.50, type: 'Parcel' },
  ];
  const ordersColumns = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Staged' || v === 'Packed' || v === 'Weighed' ? 'success' : v === 'In Packing' ? 'info' : v === 'DC Allocated' ? 'warning' : 'neutral'} label={v} /> },
    { key: 'shipTo', label: 'Ship To' },
    { key: 'country', label: 'Country' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'units', label: 'Units', align: 'right', render: (v) => v.toLocaleString() },
    { key: 'age', label: 'Age (days)', align: 'right', render: (v) => <span style={{ color: v > 30 ? C.error[600] : v > 7 ? C.warning[600] : C.neutral[600] }}>{v}</span> },
    { key: 'type', label: 'Type' }
  ];
  const ordersFilters = [
    { key: 'status', label: 'Status', options: ['Released', 'DC Allocated', 'In Packing', 'Staged', 'Packed', 'Weighed'] },
    { key: 'type', label: 'Type', options: ['Parcel', 'LTL'] }
  ];
  const workAlerts = [
    { sev: 'warning', title: 'UPS Cutoff at Risk — 15:30', msg: '1,380 orders predicted vs 1,420 target. Need +30% velocity.', time: '5.5hr out', conf: 78 },
    { sev: 'warning', title: 'Pack Queue Carryover', msg: '~200 orders may carry to swing shift.', time: '4hr out', conf: 82 },
    { sev: 'success', title: 'FedEx Ground On Track', msg: '1,920 orders predicted by 14:00 cutoff (+70 buffer).', time: '4hr out', conf: 94 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      <Breadcrumb items={[{ label: 'Executive Summary', onClick: onBack }, { label: 'Work Content' }]} />
      <Header icon={ClipboardList} title="Work Content" sub="Task volume, queues, completion" color={C.orange[500]} />

      {/* Orders Data Grid */}
      <DataGrid title="Open Orders" subtitle="Distribution orders in pipeline" columns={ordersColumns} data={ordersData} color={C.orange[500]} filterOptions={ordersFilters} />

      {/* Pick Queue Burndown */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Pick Queue Burndown</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Remaining orders to pick • Now: 2,310 • Predicted @ 14:00: ~100 carryover</p></div>
          <Badge status="success" label="97% complete by shift end" />
        </div>
        <PredictiveTimeline data={pickTimeline} height={160} />
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>520/hr</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Time to Clear</span><p style={{ fontSize: '16px', fontWeight: 500 }}>~4.4 hrs</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted Carryover</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.success[600] }}>~100 orders</p></div>
        </div>
      </Card>

      {/* Pack Queue Burndown */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Pack Queue Burndown</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Remaining orders to pack • Now: 2,350 • Predicted @ 14:00: ~200 carryover</p></div>
          <Badge status="warning" label="95% complete by shift end" />
        </div>
        <PredictiveTimeline data={packTimeline} height={160} />
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>480/hr</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Time to Clear</span><p style={{ fontSize: '16px', fontWeight: 500 }}>~4.9 hrs</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted Carryover</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.warning[600] }}>~200 orders</p></div>
        </div>
      </Card>

      {/* Ship Queue Burndown */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Ship Queue Burndown</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Remaining orders to ship • Now: 1,566 • Predicted @ 14:00: 0 (clear)</p></div>
          <Badge status="success" label="100% complete by shift end" />
        </div>
        <PredictiveTimeline data={shipTimeline} height={160} />
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>420/hr</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Time to Clear</span><p style={{ fontSize: '16px', fontWeight: 500 }}>~3.7 hrs</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted Carryover</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.success[600] }}>0 orders ✓</p></div>
        </div>
      </Card>

      {/* FedEx Ground Cutoff */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>FedEx Ground — Cutoff 14:00</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Orders ready for pickup • Target: 1,850 • Predicted: 1,920 (+70 buffer)</p></div>
          <Badge status="success" label="Will meet cutoff" />
        </div>
        <PredictiveTimeline data={fedexTimeline} height={140} target={1850} />
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: C.success[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Current</span><p style={{ fontSize: '16px', fontWeight: 500 }}>1,247</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>156/hr</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted @ Cutoff</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.success[600] }}>1,920 ✓</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Buffer</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.success[600] }}>+70</p></div>
        </div>
      </Card>

      {/* UPS Cutoff - At Risk */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>UPS — Cutoff 15:30</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Orders ready for pickup • Target: 1,420 • Predicted: 1,380 (-40 short)</p></div>
          <Badge status="warning" label="At risk — need velocity boost" />
        </div>
        <PredictiveTimeline data={upsTimeline} height={140} target={1420} warning={1350} critical={1280} />
        <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: C.warning[50], borderRadius: 6 }}>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Current</span><p style={{ fontSize: '16px', fontWeight: 500 }}>680</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Current Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>142/hr</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted @ Cutoff</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.warning[600] }}>1,380</p></div>
          <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Need Velocity</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.warning[600] }}>185/hr (+30%)</p></div>
        </div>
      </Card>

      {/* Analysis - BOTTOM */}
      <Card style={{ borderLeft: `4px solid ${C.orange[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.orange[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.orange[500] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for throughput</p></div>
          <Badge status="warning" label={`${workAlerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>{workAlerts.map((a, i) => <Alert key={i} {...a} />)}</div>
      </Card>
    </div>
  );
};

export default WorkView;
