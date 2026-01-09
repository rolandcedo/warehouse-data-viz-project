import React from 'react';
import { Package, Truck, Users, Clock, Zap, Sun, Moon, ArrowRight, AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import { Card, Badge, Alert, Progress } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';
import { genTimelineData } from '../../utils/timelineData';

const DayShift = ({ onBack }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  
  // Timeline data for KPI interpolation
  const kpiTimelines = {
    ordersIn: [
      { time: '06:00', actual: 0 }, { time: '08:00', actual: 820 }, { time: '10:00', actual: 1847 },
      { time: '12:00', predicted: 3100 }, { time: '14:00', predicted: 4200 }
    ],
    ordersOut: [
      { time: '06:00', actual: 0 }, { time: '08:00', actual: 710 }, { time: '10:00', actual: 1634 },
      { time: '12:00', predicted: 2850 }, { time: '14:00', predicted: 4050 }
    ],
    activeStaff: [
      { time: '06:00', actual: 45 }, { time: '08:00', actual: 44 }, { time: '10:00', actual: 42 },
      { time: '12:00', predicted: 38 }, { time: '14:00', predicted: 44 }
    ],
    backlog: [
      { time: '06:00', actual: 385 }, { time: '08:00', actual: 310 }, { time: '10:00', actual: 213 },
      { time: '12:00', predicted: 165 }, { time: '14:00', predicted: 180 }
    ]
  };
  
  const live = [
    { l: 'Orders In', cur: 1847, pred: 4200, icon: Package, note: '+312/hr', timeline: kpiTimelines.ordersIn },
    { l: 'Orders Out', cur: 1634, pred: 4050, icon: Truck, note: '+298/hr', timeline: kpiTimelines.ordersOut },
    { l: 'Active Staff', cur: 42, pred: 44, icon: Users, note: '4 call-outs', timeline: kpiTimelines.activeStaff },
    { l: 'Backlog', cur: 213, pred: 180, icon: Clock, note: 'Clearing', timeline: kpiTimelines.backlog }
  ];
  
  // Timeline data for predictive charts
  const throughputData = genTimelineData(0, 4200, 0.08, 200);
  const staffingData = [
    { time: '06:00', actual: 45, predicted: null, upper: null, lower: null, target: 48 },
    { time: '07:00', actual: 46, predicted: null, upper: null, lower: null, target: 48 },
    { time: '08:00', actual: 44, predicted: null, upper: null, lower: null, target: 48 },
    { time: '09:00', actual: 43, predicted: null, upper: null, lower: null, target: 48 },
    { time: '10:00', actual: 42, predicted: 42, upper: null, lower: null, now: true, target: 48 },
    { time: '11:00', actual: null, predicted: 40, upper: 42, lower: 38, target: 48 },
    { time: '12:00', actual: null, predicted: 38, upper: 41, lower: 35, target: 48 },
    { time: '13:00', actual: null, predicted: 41, upper: 44, lower: 38, target: 48 },
    { time: '14:00', actual: null, predicted: 44, upper: 47, lower: 41, target: 48 }
  ];
  const zoneZ04Data = [
    { time: '06:00', actual: 62, predicted: null, upper: null, lower: null },
    { time: '07:00', actual: 68, predicted: null, upper: null, lower: null },
    { time: '08:00', actual: 74, predicted: null, upper: null, lower: null },
    { time: '09:00', actual: 79, predicted: null, upper: null, lower: null },
    { time: '10:00', actual: 83, predicted: 83, upper: null, lower: null, now: true },
    { time: '11:00', actual: null, predicted: 88, upper: 91, lower: 85 },
    { time: '12:00', actual: null, predicted: 91, upper: 95, lower: 87 },
    { time: '13:00', actual: null, predicted: 89, upper: 94, lower: 84 },
    { time: '14:00', actual: null, predicted: 85, upper: 91, lower: 79 }
  ];
  
  const carriers = [
    { name: 'FedEx Ground', cut: '14:00', cutHr: 14, tgt: 1850, cur: 1247, pred: 1920, ok: true, vel: 156 },
    { name: 'UPS', cut: '15:30', cutHr: 15.5, tgt: 1420, cur: 680, pred: 1380, ok: false, vel: 142 },
    { name: 'USPS', cut: '16:00', cutHr: 16, tgt: 680, cur: 245, pred: 710, ok: true, vel: 73 },
    { name: 'FedEx Express', cut: '18:00', cutHr: 18, tgt: 520, cur: 85, pred: 545, ok: true, vel: 55 }
  ];
  
  // Generate carrier burnup timeline
  const genCarrierTimeline = (c) => {
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const nowIdx = 4;
    return times.map((time, i) => {
      const hr = 6 + i;
      const isActual = i <= nowIdx;
      const progress = Math.min(1, (c.cur / c.tgt) + ((i - nowIdx) * (c.vel / c.tgt)));
      const value = isActual ? Math.round(c.cur * (i / nowIdx)) : Math.round(c.tgt * Math.min(1.1, progress));
      const confWidth = isActual ? 0 : (i - nowIdx) * c.tgt * 0.03;
      return {
        time,
        actual: isActual ? value : null,
        predicted: !isActual ? value : (i === nowIdx ? value : null),
        upper: !isActual ? Math.min(c.tgt * 1.15, value + confWidth) : null,
        lower: !isActual ? Math.max(0, value - confWidth) : null,
        now: i === nowIdx,
        cutoff: hr >= c.cutHr
      };
    });
  };

  const queues = [
    { name: 'Pick', total: 4200, done: 1890, pred: 4100, vel: 520 },
    { name: 'Pack', total: 3800, done: 1450, pred: 3600, vel: 480 },
    { name: 'Ship', total: 3200, done: 1634, pred: 3350, vel: 420 }
  ];
  
  // Generate burndown data for queues
  const genBurndownData = (q) => {
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
    const nowIdx = 4;
    const remaining = q.total - q.done;
    return times.map((time, i) => {
      const isActual = i <= nowIdx;
      const completedAtTime = isActual ? (q.done * (i / nowIdx)) : null;
      const remainingAtTime = isActual ? (q.total - completedAtTime) : null;
      const predRemaining = !isActual ? Math.max(0, remaining - ((i - nowIdx) * q.vel)) : null;
      const confWidth = !isActual ? (i - nowIdx) * 40 : 0;
      return {
        time,
        actual: remainingAtTime,
        predicted: i === nowIdx ? remaining : predRemaining,
        upper: predRemaining !== null ? predRemaining + confWidth : null,
        lower: predRemaining !== null ? Math.max(0, predRemaining - confWidth) : null,
        now: i === nowIdx
      };
    });
  };

  const alerts = [
    { sev: 'critical', title: 'Zone Z04 capacity breach', msg: 'Predicted 91% at 12:00 (critical threshold: 90%)', time: '+2hr', conf: 84 },
    { sev: 'critical', title: 'UPS cutoff at risk', msg: '~40 orders short at current velocity (142/hr needed: 185/hr)', time: '+5.5hr', conf: 72 },
    { sev: 'warning', title: 'Staffing gap 11:00-13:00', msg: 'Predicted 38 FTE vs 48 required (break coverage)', time: '+1hr', conf: 91 },
    { sev: 'warning', title: 'Pack queue carryover', msg: '~200 units predicted to carry to swing shift', time: '+4hr', conf: 68 }
  ];
  
  const handoff = { pick: 100, pack: 200, ship: 85, sched: 38, rec: 42, issues: ['Zone Z04 near capacity', 'Dock 7 maintenance until 15:00', 'UPS ~40 orders at risk'] };
  
  // Get contextual staffing value for the forecast card
  const ctxStaffing = isContextualDifferent ? interpolateValue(staffingData, contextualTime) : null;
  const ctxZoneZ04 = isContextualDifferent ? interpolateValue(zoneZ04Data, contextualTime) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md, padding: sp.md }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.neutral[900]} 0%, ${C.neutral[800]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}><Zap style={{ width: 28, height: 28, color: C.warning[500] }} /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>War Room</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, background: C.brand[500], padding: '6px 14px', borderRadius: 20 }}><Sun style={{ width: 16, height: 16 }} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Day Shift</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: C.success[500], animation: 'pulse 2s infinite' }} /><span style={{ fontSize: '13px', color: C.success[500], fontWeight: 500 }}>LIVE</span></div>
              </div>
              <p style={{ color: C.neutral[400], fontSize: '14px', marginTop: 4 }}>
                8-hour predictive window • 06:00 - 14:00
                {isContextualDifferent && (
                  <span style={{ marginLeft: sp.sm }}>
                    • <span style={{ padding: '2px 8px', background: C.brand[500], color: 'white', borderRadius: 4, fontSize: '12px' }}>Viewing @{contextualTime}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: C.neutral[400], fontSize: '12px' }}>Current Time</p>
            <p style={{ fontSize: '48px', fontWeight: 100, margin: 0 }}>10:00</p>
            <p style={{ color: C.neutral[400], fontSize: '11px', marginTop: sp.sm }}>Shift ends 14:00 • Swing starts 14:00</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
          {live.map((m, i) => {
            const Icon = m.icon;
            const ctxVal = isContextualDifferent ? interpolateValue(m.timeline, contextualTime) : null;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: sp.md, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}><span style={{ color: C.neutral[400], fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>{m.l}</span><Icon style={{ width: 18, height: 18, color: C.neutral[400] }} /></div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.xs, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '36px', fontWeight: 300 }}>{m.cur.toLocaleString()}</span>
                  {ctxVal !== null && (
                    <>
                      <ArrowRight style={{ width: 14, height: 14, color: C.neutral[500] }} />
                      <span style={{ fontSize: '18px', fontWeight: 500, color: C.brand[300], padding: '2px 8px', background: 'rgba(47, 114, 255, 0.3)', borderRadius: 4 }}>{ctxVal.toLocaleString()}</span>
                    </>
                  )}
                  <ArrowRight style={{ width: 14, height: 14, color: C.neutral[500] }} />
                  <span style={{ fontSize: '20px', color: C.purple[300] }}>{m.pred.toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[400], marginTop: sp.sm }}>{m.note}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Staffing Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>Staffing Forecast</h3>
              {ctxStaffing !== null && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{ctxStaffing} FTE</strong> {isContextualPast && '(past)'}
                </span>
              )}
            </div>
            <Badge status="warning" label="Gap 11:00-13:00" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Headcount vs required (48 FTE target) • Now: 42 → Predicted: 44 @ 14:00</p>
        </div>
        <PredictiveTimeline data={staffingData} height={160} target={48} warning={44} critical={40} contextualTime={contextualTime} />
        <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, padding: sp.sm, background: C.warning[50], borderRadius: 6 }}>
          <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600], flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: '12px', fontWeight: 500, color: C.warning[700] }}>Break coverage gap predicted</p>
            <p style={{ fontSize: '11px', color: C.warning[600] }}>38 FTE at 12:00 vs 48 required • Consider staggered breaks or overtime</p>
          </div>
        </div>
      </Card>
      
      {/* Zone Z04 Capacity */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>Zone Z04 Capacity</h3>
              {ctxZoneZ04 !== null && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{ctxZoneZ04}%</strong> {isContextualPast && '(past)'}
                </span>
              )}
            </div>
            <Badge status="error" label="Breach @ 12:00" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Bulk Storage utilization trajectory • Now: 83% → Predicted: 85% @ 14:00 • Critical threshold at 90%</p>
        </div>
        <PredictiveTimeline data={zoneZ04Data} height={160} warning={80} critical={90} showConfidence={true} contextualTime={contextualTime} />
        <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, padding: sp.sm, background: C.error[50], borderRadius: 6 }}>
          <AlertOctagon style={{ width: 14, height: 14, color: C.error[600], flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: '12px', fontWeight: 500, color: C.error[700] }}>Critical threshold breach imminent</p>
            <p style={{ fontSize: '11px', color: C.error[600] }}>91% predicted at 12:00 • Expedite putaway or redirect inbound to Z05</p>
          </div>
        </div>
      </Card>
      
      {/* Carrier Cutoff Trajectories */}
      {carriers.map((c, i) => {
        const timelineData = genCarrierTimeline(c);
        const ctxCarrier = isContextualDifferent ? interpolateValue(timelineData, contextualTime) : null;
        const diff = c.pred - c.tgt;
        const neededVel = Math.round((c.tgt - c.cur) / ((c.cutHr - 10)));
        return (
          <Card key={i}>
            <div style={{ marginBottom: sp.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>{c.name} — Cutoff {c.cut}</h3>
                  {ctxCarrier !== null && (
                    <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                      @{contextualTime}: <strong>{ctxCarrier.toLocaleString()}</strong>
                    </span>
                  )}
                </div>
                <Badge status={c.ok ? 'success' : 'warning'} label={c.ok ? 'Will meet cutoff' : 'At risk'} />
              </div>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Order completion trajectory toward carrier cutoff • Target: {c.tgt.toLocaleString()} orders</p>
            </div>
            <PredictiveTimeline data={timelineData} height={140} target={c.tgt} contextualTime={contextualTime} />
            <div style={{ display: 'flex', gap: sp.lg, marginTop: sp.md, padding: sp.md, background: c.ok ? C.success[50] : C.warning[50], borderRadius: 6 }}>
              <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Current</span><p style={{ fontSize: '16px', fontWeight: 500 }}>{c.cur.toLocaleString()}</p></div>
              <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Velocity</span><p style={{ fontSize: '16px', fontWeight: 500 }}>{c.vel}/hr</p></div>
              <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Predicted @ Cutoff</span><p style={{ fontSize: '16px', fontWeight: 500, color: c.ok ? C.success[600] : C.warning[600] }}>{c.pred.toLocaleString()}</p></div>
              {!c.ok && <div><span style={{ fontSize: '11px', color: C.neutral[500] }}>Need Velocity</span><p style={{ fontSize: '16px', fontWeight: 500, color: C.warning[600] }}>{neededVel}/hr</p></div>}
            </div>
          </Card>
        );
      })}
      
      {/* Work Queue Burndowns */}
      {queues.map((q, i) => {
        const burndownData = genBurndownData(q);
        const ctxQueue = isContextualDifferent ? interpolateValue(burndownData, contextualTime) : null;
        const ok = q.pred >= q.total;
        const over = Math.max(0, q.total - q.pred);
        return (
          <Card key={i}>
            <div style={{ marginBottom: sp.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>{q.name} Queue Burndown</h3>
                  {ctxQueue !== null && (
                    <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                      @{contextualTime}: <strong>{Math.round(ctxQueue).toLocaleString()} remaining</strong>
                    </span>
                  )}
                </div>
                <Badge status={ok ? 'success' : 'warning'} label={ok ? '✓ Will complete' : `~${over} carryover`} />
              </div>
              <p style={{ fontSize: '12px', color: C.neutral[500] }}>Remaining work vs time • Velocity: {q.vel}/hr • Est. {Math.round((q.total - q.done) / q.vel * 60)}min to clear</p>
            </div>
            <PredictiveTimeline data={burndownData} height={140} contextualTime={contextualTime} />
          </Card>
        );
      })}
      
      {/* Analysis */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3>
            <Badge status="error" label={`${alerts.filter(a => a.sev === 'critical').length} critical`} />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and predicted issues based on current trajectories • Click on item to view details</p>
        </div>
        {alerts.map((a, i) => <Alert key={i} {...a} />)}
      </Card>
      
      {/* Swing Shift Handoff */}
      <Card style={{ background: `linear-gradient(135deg, ${C.purple[700]} 0%, ${C.neutral[900]} 100%)`, color: 'white' }}>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
            <Moon style={{ width: 20, height: 20, color: C.purple[300] }} />
            <span style={{ fontWeight: 500, fontSize: '16px' }}>Swing Shift Handoff</span>
            <span style={{ fontSize: '12px', color: C.purple[300], marginLeft: 'auto' }}>@ 14:00 (+4hr)</span>
          </div>
          <p style={{ fontSize: '12px', color: C.purple[300] }}>Predicted state at shift transition • Carryover work and staffing recommendations</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md, marginBottom: sp.md }}>
          <div>
            <p style={{ fontSize: '12px', color: C.purple[300], marginBottom: sp.sm }}>Predicted Carryover</p>
            <div style={{ display: 'flex', gap: sp.sm }}>
              {[['Pick', handoff.pick], ['Pack', handoff.pack], ['Ship', handoff.ship]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: sp.md, textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500, color: v > 150 ? C.warning[300] : 'white' }}>{v}</p>
                  <p style={{ fontSize: '11px', color: C.purple[300] }}>{k}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: C.purple[300], marginBottom: sp.sm }}>Staffing</p>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: sp.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ fontSize: '11px', color: C.purple[300] }}>Scheduled / Recommended</p><p style={{ fontSize: '24px', fontWeight: 500 }}>{handoff.sched} / {handoff.rec}</p></div>
                <span style={{ background: 'rgba(249,144,9,0.3)', color: C.warning[300], padding: '6px 12px', borderRadius: 4, fontSize: '13px', fontWeight: 500 }}>{handoff.rec - handoff.sched} short</span>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: C.purple[300], marginBottom: sp.sm }}>Issues to Hand Off</p>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: sp.md }}>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {handoff.issues.map((iss, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.sm, fontSize: '12px', color: C.purple[100], marginBottom: i < handoff.issues.length - 1 ? 8 : 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.purple[400], flexShrink: 0 }} />{iss}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DayShift;
