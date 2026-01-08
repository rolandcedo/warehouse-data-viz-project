import React from 'react';
import { MapPin, AlertTriangle, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import TimeScrubber from '../../components/TimeScrubber';
import { Card, Badge, Breadcrumb, Header, Alert, DataGrid } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';
import { ALERTS_DATA } from '../../data/alertsData';

const ZonesView = ({ onBack, onZone, onNavigateToAlert, onViewInsights }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();

  const zones = ['Inbound A', 'Inbound B', 'QA Station', 'Bulk Storage', 'Reserve 1', 'Reserve 2', 'Forward Pick A', 'Forward Pick B', 'Forward Pick C', 'Pack Station 1', 'Pack Station 2', 'Shipping Dock A', 'Shipping Dock B', 'Returns', 'Hazmat', 'Cold Storage'].map((name, i) => {
    const cur = 35 + Math.floor(Math.random() * 45), delta = Math.floor(Math.random() * 20), pred = Math.min(98, cur + delta);
    const zoneId = `Z${(i + 1).toString().padStart(2, '0')}`;
    return { id: zoneId, name, cur, pred, clickable: name.startsWith('Inbound') || zoneId === 'Z04' };
  });
  const zoneColor = p => p >= 90 ? { bg: C.error[500], txt: 'white' } : p >= 80 ? { bg: C.warning[500], txt: 'white' } : p >= 65 ? { bg: C.warning[100], txt: C.warning[700] } : { bg: C.success[100], txt: C.success[700] };

  // Predictive timeline for critical zone Z04
  const z04Timeline = [
    { time: '06:00', actual: 62, predicted: null },
    { time: '07:00', actual: 68, predicted: null },
    { time: '08:00', actual: 74, predicted: null },
    { time: '09:00', actual: 79, predicted: null },
    { time: '10:00', actual: 83, predicted: 83, now: true },
    { time: '11:00', actual: null, predicted: 88, upper: 91, lower: 85 },
    { time: '12:00', actual: null, predicted: 91, upper: 95, lower: 87 },
    { time: '13:00', actual: null, predicted: 89, upper: 94, lower: 84 },
    { time: '14:00', actual: null, predicted: 85, upper: 91, lower: 79 }
  ];
  const overallTimeline = [
    { time: '06:00', actual: 58, predicted: null },
    { time: '07:00', actual: 62, predicted: null },
    { time: '08:00', actual: 65, predicted: null },
    { time: '09:00', actual: 68, predicted: null },
    { time: '10:00', actual: 71, predicted: 71, now: true },
    { time: '11:00', actual: null, predicted: 74, upper: 77, lower: 71 },
    { time: '12:00', actual: null, predicted: 76, upper: 80, lower: 72 },
    { time: '13:00', actual: null, predicted: 74, upper: 78, lower: 70 },
    { time: '14:00', actual: null, predicted: 72, upper: 76, lower: 68 }
  ];

  const zonesData = [
    { id: 'Z01', name: 'Inbound A', type: 'Receiving', locations: 48, occupied: 32, utilization: 67, status: 'Normal' },
    { id: 'Z02', name: 'Inbound B', type: 'Receiving', locations: 48, occupied: 38, utilization: 79, status: 'Normal' },
    { id: 'Z03', name: 'QA Station', type: 'Quality', locations: 24, occupied: 18, utilization: 75, status: 'Normal' },
    { id: 'Z04', name: 'Bulk Storage', type: 'Reserve', locations: 2400, occupied: 1992, utilization: 83, status: 'Warning' },
    { id: 'Z05', name: 'Reserve 1', type: 'Reserve', locations: 1800, occupied: 1260, utilization: 70, status: 'Normal' },
    { id: 'Z06', name: 'Reserve 2', type: 'Reserve', locations: 1800, occupied: 1134, utilization: 63, status: 'Normal' },
    { id: 'Z07', name: 'Forward Pick A', type: 'Active', locations: 800, occupied: 768, utilization: 96, status: 'Critical' },
    { id: 'Z08', name: 'Forward Pick B', type: 'Active', locations: 800, occupied: 704, utilization: 88, status: 'Warning' },
    { id: 'Z09', name: 'Forward Pick C', type: 'Active', locations: 800, occupied: 640, utilization: 80, status: 'Warning' },
    { id: 'Z10', name: 'Pack Station 1', type: 'Packing', locations: 32, occupied: 24, utilization: 75, status: 'Normal' },
    { id: 'Z11', name: 'Pack Station 2', type: 'Packing', locations: 32, occupied: 28, utilization: 88, status: 'Warning' },
    { id: 'Z12', name: 'Shipping Dock A', type: 'Shipping', locations: 12, occupied: 8, utilization: 67, status: 'Normal' },
    { id: 'Z13', name: 'Shipping Dock B', type: 'Shipping', locations: 12, occupied: 10, utilization: 83, status: 'Warning' },
    { id: 'Z14', name: 'Returns', type: 'Returns', locations: 200, occupied: 94, utilization: 47, status: 'Normal' },
    { id: 'Z15', name: 'Hazmat', type: 'Hazmat', locations: 100, occupied: 62, utilization: 62, status: 'Normal' },
    { id: 'Z16', name: 'Cold Storage', type: 'Cold', locations: 400, occupied: 296, utilization: 74, status: 'Normal' },
  ];
  const zonesColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'locations', label: 'Locations', align: 'right' },
    { key: 'utilization', label: 'Util %', align: 'right', render: (v) => <span style={{ color: v >= 90 ? C.error[600] : v >= 80 ? C.warning[600] : C.success[600] }}>{v}%</span> },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Normal' ? 'success' : v === 'Warning' ? 'warning' : 'error'} label={v} /> }
  ];
  const zonesFilters = [
    { key: 'type', label: 'Type', options: ['Receiving', 'Reserve', 'Active', 'Packing', 'Shipping'] },
    { key: 'status', label: 'Status', options: ['Normal', 'Warning', 'Critical'] }
  ];
  // Zones alerts using shared data
  const zonesAlerts = [
    ALERTS_DATA['zones-z04-capacity'],
    ALERTS_DATA['zones-z02-underutilized'],
    ALERTS_DATA['zones-z01-pick-congestion'],
    ALERTS_DATA['zones-z03-replen-needed']
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      {/* Time Scrubber */}
      <TimeScrubber />

      <Breadcrumb items={[{ label: 'Executive Summary', onClick: onBack }, { label: 'Zones' }]} />
      <Header icon={MapPin} title="Zones" sub="Physical space utilization" color={C.blueLight[500]} />

      {/* Zones Data Grid */}
      <DataGrid title="Zone Inventory" subtitle="All warehouse zones and capacity" columns={zonesColumns} data={zonesData} color={C.blueLight[500]} filterOptions={zonesFilters} />

      {/* Zone Z04 Critical */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Z04 (Bulk Storage)</h3>
              {isContextualDifferent && interpolateValue(z04Timeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(z04Timeline, contextualTime)}%</strong> {isContextualPast && '(past)'}
                </span>
              )}
            </div>
            <Badge status="error" label="Breach @ 12:00" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Critical zone capacity forecast • Now: 83% → Pred: 85% @ 14:00 • Threshold: 90%</p>
        </div>
        <PredictiveTimeline data={z04Timeline} height={160} warning={80} critical={90} contextualTime={contextualTime} />
        <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, padding: sp.sm, background: C.error[50], borderRadius: 6 }}>
          <AlertTriangle style={{ width: 14, height: 14, color: C.error[600], flexShrink: 0 }} />
          <p style={{ fontSize: '11px', color: C.error[700] }}>91% predicted at 12:00 • Expedite putaway or redirect to Z05</p>
        </div>
      </Card>

      {/* Overall Utilization */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Overall Utilization</h3>
              {isContextualDifferent && interpolateValue(overallTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(overallTimeline, contextualTime)}%</strong>
                </span>
              )}
            </div>
            <Badge status="success" label="Healthy" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Average space utilization across all 16 zones • Now: 71% → Pred: 72% @ 14:00</p>
        </div>
        <PredictiveTimeline data={overallTimeline} height={160} warning={75} critical={85} contextualTime={contextualTime} />
      </Card>

      {/* Zone Heatmap */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Utilization Heatmap</h3>
            <div style={{ display: 'flex', gap: sp.sm }}>{[['<65%', C.success[100]], ['65-79%', C.warning[100]], ['80-89%', C.warning[500]], ['≥90%', C.error[500]]].map(([l, c], i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: C.neutral[500] }}><span style={{ width: 12, height: 12, borderRadius: 2, background: c }} />{l}</span>)}</div>
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Predicted space utilization by zone • Color indicates capacity status • Click on item to view details</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
          {zones.map(z => {
            const { bg, txt } = zoneColor(z.pred);
            return (
              <div
                key={z.id}
                onClick={() => z.clickable && onZone && onZone(z.id)}
                className={z.clickable ? 'card-click' : ''}
                style={{ background: bg, color: txt, borderRadius: 8, padding: sp.md, cursor: z.clickable ? 'pointer' : 'default', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { if (z.clickable) { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
                onMouseLeave={(e) => { if (z.clickable) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85 }}>{z.id}</span>
                  {z.pred >= 90 && <AlertTriangle style={{ width: 12, height: 12 }} />}
                  {z.clickable && <ChevronRight style={{ width: 12, height: 12, opacity: 0.7 }} />}
                </div>
                <p style={{ fontSize: '20px', fontWeight: 500 }}>{z.pred}%</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', opacity: 0.85 }}><span>{z.cur}%</span><ArrowRight style={{ width: 10, height: 10 }} /><span>+{z.pred - z.cur}%</span></div>
                <p style={{ fontSize: '10px', opacity: 0.7, marginTop: 4 }}>{z.name}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Analysis - BOTTOM */}
      <Card style={{ borderLeft: `4px solid ${C.blueLight[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.blueLight[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.blueLight[500] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for zones • Click for details</p></div>
          <Badge status="info" label={`${zonesAlerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {zonesAlerts.map((a, i) => (
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
            cursor: 'pointer', color: C.blueLight[600], fontSize: '13px', fontWeight: 500
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = C.blueLight[700]}
          onMouseLeave={(e) => e.currentTarget.style.color = C.blueLight[600]}
        >
          View Full Analysis <ChevronRight style={{ width: 16, height: 16 }} />
        </div>
      </Card>
    </div>
  );
};

export default ZonesView;
