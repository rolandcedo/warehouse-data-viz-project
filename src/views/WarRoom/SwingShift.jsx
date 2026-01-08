import React from 'react';
import { Moon, Radio } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import { Card, Badge, Alert, Progress } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';

const SwingShift = ({ onBack }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();
  
  const exp = { pick: 100, pack: 200, ship: 85, orders: 3200, staff: 38, rec: 42 };
  const work = [{ name: 'Inherited Backlog', orders: 385, prio: 'high' }, { name: 'Wave 4', orders: 290, prio: 'normal' }, { name: 'Wave 5', orders: 320, prio: 'normal' }, { name: 'Express/Hot', orders: 45, prio: 'critical' }];
  const staff = [{ fn: 'Receiving', p: 4, a: 4 }, { fn: 'Putaway', p: 5, a: 4 }, { fn: 'Picking', p: 14, a: 12 }, { fn: 'Packing', p: 10, a: 9 }, { fn: 'Shipping', p: 5, a: 5 }];
  const issues = [{ sev: 'warning', title: 'Zone Z04 at 94%', msg: 'Clear bulk storage early', time: 'Inherited' }, { sev: 'warning', title: 'Dock 7 maintenance', msg: 'Returns at 15:00', time: 'Until 15:00' }, { sev: 'info', title: 'UPS carryover', msg: '~40 orders from day', time: 'Priority' }];
  
  // Predictive data for swing shift planning (forecasting 14:00-22:00)
  const staffForecast = [
    { time: '14:00', predicted: 38, upper: 38, lower: 38 },
    { time: '15:00', predicted: 37, upper: 39, lower: 35 },
    { time: '16:00', predicted: 36, upper: 39, lower: 33 },
    { time: '17:00', predicted: 38, upper: 41, lower: 35 },
    { time: '18:00', predicted: 35, upper: 38, lower: 32 },
    { time: '19:00', predicted: 36, upper: 40, lower: 32 },
    { time: '20:00', predicted: 38, upper: 42, lower: 34 },
    { time: '21:00', predicted: 40, upper: 44, lower: 36 },
    { time: '22:00', predicted: 38, upper: 42, lower: 34 }
  ];
  const throughputForecast = [
    { time: '14:00', predicted: 385, upper: 400, lower: 370 },
    { time: '15:00', predicted: 820, upper: 880, lower: 760 },
    { time: '16:00', predicted: 1350, upper: 1450, lower: 1250 },
    { time: '17:00', predicted: 1900, upper: 2050, lower: 1750 },
    { time: '18:00', predicted: 2400, upper: 2600, lower: 2200 },
    { time: '19:00', predicted: 2850, upper: 3100, lower: 2600 },
    { time: '20:00', predicted: 3200, upper: 3500, lower: 2900 },
    { time: '21:00', predicted: 3450, upper: 3800, lower: 3100 },
    { time: '22:00', predicted: 3585, upper: 3950, lower: 3220 }
  ];
  const zoneForecast = [
    { time: '14:00', predicted: 85, upper: 88, lower: 82 },
    { time: '15:00', predicted: 78, upper: 82, lower: 74 },
    { time: '16:00', predicted: 72, upper: 77, lower: 67 },
    { time: '17:00', predicted: 68, upper: 74, lower: 62 },
    { time: '18:00', predicted: 65, upper: 72, lower: 58 },
    { time: '19:00', predicted: 60, upper: 68, lower: 52 },
    { time: '20:00', predicted: 55, upper: 64, lower: 46 },
    { time: '21:00', predicted: 52, upper: 62, lower: 42 },
    { time: '22:00', predicted: 48, upper: 58, lower: 38 }
  ];
  
  // Get contextual values
  const ctxStaff = isContextualDifferent ? interpolateValue(staffForecast, contextualTime, 'predicted') : null;
  const ctxThroughput = isContextualDifferent ? interpolateValue(throughputForecast, contextualTime, 'predicted') : null;
  const ctxZone = isContextualDifferent ? interpolateValue(zoneForecast, contextualTime, 'predicted') : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
      <div style={{ background: `linear-gradient(135deg, ${C.purple[700]} 0%, ${C.purple[900]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}><Radio style={{ width: 28, height: 28, color: C.purple[300] }} /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>War Room</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, background: C.purple[500], padding: '6px 14px', borderRadius: 20 }}><Moon style={{ width: 16, height: 16 }} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Swing Shift</span></div>
                <span style={{ fontSize: '12px', color: C.purple[300], background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4 }}>PLANNING</span>
              </div>
              <p style={{ color: C.purple[300], fontSize: '14px', marginTop: 4 }}>
                8-hour forecast • 14:00 - 22:00
                {isContextualDifferent && (
                  <span style={{ marginLeft: sp.sm, padding: '2px 8px', background: 'rgba(47, 114, 255, 0.4)', borderRadius: 4, fontSize: '12px' }}>Viewing @{contextualTime}</span>
                )}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}><p style={{ color: C.purple[300], fontSize: '12px' }}>Shift Starts In</p><p style={{ fontSize: '48px', fontWeight: 100, margin: 0 }}>4:00</p><p style={{ color: C.purple[300], fontSize: '11px', marginTop: 4 }}>hrs from now</p></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
          {[['Inherited Carryover', exp.pick + exp.pack + exp.ship, 'from day shift', false], ['Planned Volume', exp.orders.toLocaleString(), 'total orders', false], ['Staff Scheduled', exp.staff, `rec: ${exp.rec}`, true], ['Carrier Cutoffs', '4', '1 at risk (UPS)', true]].map(([l, v, sub, warn], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: sp.md }}><p style={{ color: C.purple[300], fontSize: '12px', marginBottom: sp.sm }}>{l}</p><p style={{ fontSize: '32px', fontWeight: 300 }}>{v}</p><p style={{ fontSize: '11px', color: warn ? C.warning[300] : C.purple[300] }}>{sub}</p></div>
          ))}
        </div>
      </div>
      
      {/* Staffing Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Staffing Forecast</h3>
              {ctxStaff !== null && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{ctxStaff} FTE</strong>
                </span>
              )}
            </div>
            <Badge status="warning" label="-4 gap" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Predicted headcount vs required throughout shift • Target: 42 FTE</p>
        </div>
        <PredictiveTimeline data={staffForecast} height={160} target={42} warning={38} critical={34} contextualTime={contextualTime} />
      </Card>
      
      {/* Throughput Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Throughput Forecast</h3>
              {ctxThroughput !== null && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{ctxThroughput.toLocaleString()} orders</strong>
                </span>
              )}
            </div>
            <Badge status="success" label="On track" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Cumulative orders processed during shift • Target: 3,200 orders</p>
        </div>
        <PredictiveTimeline data={throughputForecast} height={160} target={3200} contextualTime={contextualTime} />
      </Card>
      
      {/* Zone Z04 Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Z04 Forecast</h3>
              {ctxZone !== null && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{ctxZone}%</strong>
                </span>
              )}
            </div>
            <Badge status="success" label="Clearing" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Bulk Storage capacity trajectory • Inherited at 94% from day shift</p>
        </div>
        <PredictiveTimeline data={zoneForecast} height={160} warning={80} critical={90} contextualTime={contextualTime} />
      </Card>
      
      {/* Planned Work */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Planned Work</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Work items scheduled for this shift • Priority indicated by color</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {work.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: sp.md, background: w.prio === 'critical' ? C.error[50] : w.prio === 'high' ? C.warning[50] : C.neutral[50], borderRadius: 6, borderLeft: `3px solid ${w.prio === 'critical' ? C.error[500] : w.prio === 'high' ? C.warning[500] : C.neutral[300]}` }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{w.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}><span style={{ fontSize: '16px', fontWeight: 500 }}>{w.orders} orders</span>{w.prio !== 'normal' && <Badge status={w.prio === 'critical' ? 'error' : 'warning'} label={w.prio} />}</div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Staffing Plan */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Staffing Plan</h3>
            <Badge status="warning" label="4 gap total" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Scheduled vs required headcount by function • Click on item to view details</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {staff.map((s, i) => {
            const gap = s.p - s.a;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: gap > 0 ? C.warning[50] : C.neutral[50], borderRadius: 6 }}>
                <span style={{ fontSize: '14px', fontWeight: 500, minWidth: 100 }}>{s.fn}</span>
                <div style={{ flex: 1 }}><Progress value={s.a} max={s.p} color={gap > 0 ? C.warning[500] : C.success[500]} h={8} /></div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: gap > 0 ? C.warning[600] : C.success[600] }}>{s.a}/{s.p}</span>
                {gap > 0 && <Badge status="warning" label={`-${gap}`} />}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Inherited Issues */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Inherited Issues from Day Shift</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Active alerts and issues requiring attention this shift</p>
        </div>
        {issues.map((a, i) => <Alert key={i} {...a} />)}
      </Card>
    </div>
  );
};

export default SwingShift;
