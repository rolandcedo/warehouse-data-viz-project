import React from 'react';
import { Moon, Star, Sun, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import { Card, Badge } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';

const NightShift = ({ onBack }) => {
  const { contextualTime, isContextualDifferent, interpolateValue } = useTimeContext();
  
  const sum = { tp: 3850, comp: 96, ot: 91, staff: 94 };
  const handoff = { pick: 45, pack: 32, ship: 18, total: 95, zone: 'All zones below 70%' };
  const hl = [{ t: 'success', txt: 'Cleared UPS backlog (+40 orders)' }, { t: 'success', txt: 'Zone Z04 reduced to 62%' }, { t: 'warning', txt: 'Regional LTL 5 orders short' }, { t: 'info', txt: 'Dock 7 maintenance completed' }];
  
  // Actual vs predicted data for completed shift review
  const throughputActual = [
    { time: '22:00', actual: 0, predicted: 0 },
    { time: '23:00', actual: 420, predicted: 400, upper: 450, lower: 350 },
    { time: '00:00', actual: 890, predicted: 850, upper: 950, lower: 750 },
    { time: '01:00', actual: 1450, predicted: 1400, upper: 1550, lower: 1250 },
    { time: '02:00', actual: 2100, predicted: 2000, upper: 2200, lower: 1800 },
    { time: '03:00', actual: 2680, predicted: 2600, upper: 2850, lower: 2350 },
    { time: '04:00', actual: 3200, predicted: 3100, upper: 3400, lower: 2800 },
    { time: '05:00', actual: 3580, predicted: 3500, upper: 3850, lower: 3150 },
    { time: '06:00', actual: 3850, predicted: 3750, upper: 4100, lower: 3400 }
  ];
  const staffingActual = [
    { time: '22:00', actual: 28, predicted: 28 },
    { time: '23:00', actual: 27, predicted: 28, upper: 29, lower: 27 },
    { time: '00:00', actual: 26, predicted: 27, upper: 28, lower: 26 },
    { time: '01:00', actual: 25, predicted: 26, upper: 27, lower: 25 },
    { time: '02:00', actual: 24, predicted: 25, upper: 26, lower: 24 },
    { time: '03:00', actual: 24, predicted: 24, upper: 25, lower: 23 },
    { time: '04:00', actual: 26, predicted: 26, upper: 27, lower: 25 },
    { time: '05:00', actual: 27, predicted: 27, upper: 28, lower: 26 },
    { time: '06:00', actual: 28, predicted: 28, upper: 29, lower: 27 }
  ];
  const zoneActual = [
    { time: '22:00', actual: 85, predicted: 85 },
    { time: '23:00', actual: 82, predicted: 83, upper: 86, lower: 80 },
    { time: '00:00', actual: 78, predicted: 80, upper: 84, lower: 76 },
    { time: '01:00', actual: 74, predicted: 76, upper: 80, lower: 72 },
    { time: '02:00', actual: 70, predicted: 72, upper: 76, lower: 68 },
    { time: '03:00', actual: 66, predicted: 68, upper: 72, lower: 64 },
    { time: '04:00', actual: 64, predicted: 65, upper: 69, lower: 61 },
    { time: '05:00', actual: 62, predicted: 63, upper: 67, lower: 59 },
    { time: '06:00', actual: 62, predicted: 62, upper: 66, lower: 58 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
      <div style={{ background: `linear-gradient(135deg, ${C.neutral[800]} 0%, ${C.neutral[900]} 100%)`, borderRadius: 12, padding: sp.lg, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <div style={{ padding: sp.sm, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}><Star style={{ width: 28, height: 28, color: C.warning[500] }} /></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>War Room</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, background: C.neutral[600], padding: '6px 14px', borderRadius: 20 }}><Moon style={{ width: 16, height: 16 }} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Night Shift</span></div>
                <span style={{ fontSize: '12px', color: C.success[500], background: 'rgba(18,183,106,0.2)', padding: '4px 8px', borderRadius: 4 }}>COMPLETED</span>
              </div>
              <p style={{ color: C.neutral[400], fontSize: '14px', marginTop: 4 }}>Actual vs Predicted review • 22:00 - 06:00</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}><p style={{ color: C.neutral[400], fontSize: '12px' }}>Shift Ended</p><p style={{ fontSize: '48px', fontWeight: 100, margin: 0 }}>06:00</p></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md }}>
          {[['Throughput', sum.tp.toLocaleString(), '+100 vs pred', true], ['Completion', `${sum.comp}%`, '+1% vs pred', true], ['On-Time', `${sum.ot}%`, '-2% vs pred', false], ['Staffing', `${sum.staff}%`, 'On target', true]].map(([l, v, vs, ok], i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: sp.md, borderLeft: `3px solid ${ok ? C.success[500] : C.warning[500]}` }}><p style={{ color: C.neutral[400], fontSize: '12px', marginBottom: sp.sm }}>{l}</p><p style={{ fontSize: '32px', fontWeight: 300 }}>{v}</p><p style={{ fontSize: '11px', color: ok ? C.success[300] : C.warning[300] }}>{vs}</p></div>
          ))}
        </div>
      </div>
      
      {/* Throughput: Actual vs Predicted */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Throughput: Actual vs Predicted</h3>
            <Badge status="success" label="+2.7% vs pred" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Comparison of actual performance vs model predictions • Validates forecast accuracy</p>
        </div>
        <PredictiveTimeline data={throughputActual} height={160} contextualTime={contextualTime} />
      </Card>
      
      {/* Staffing: Actual vs Predicted */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Staffing: Actual vs Predicted</h3>
            <Badge status="success" label="On target" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Headcount throughout shift • Target: 28 FTE maintained</p>
        </div>
        <PredictiveTimeline data={staffingActual} height={160} target={28} contextualTime={contextualTime} />
      </Card>
      
      {/* Zone Z04: Actual vs Predicted */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.xs }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Zone Z04: Actual vs Predicted</h3>
            <Badge status="success" label="Cleared" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Bulk Storage capacity reduction • Started 94%, ended 62%</p>
        </div>
        <PredictiveTimeline data={zoneActual} height={160} warning={80} critical={90} contextualTime={contextualTime} />
      </Card>
      
      {/* Shift Highlights */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Shift Highlights</h3>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Key accomplishments and issues from the completed shift</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {hl.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: sp.md, padding: sp.md, background: h.t === 'success' ? C.success[50] : h.t === 'warning' ? C.warning[50] : C.brand[100], borderRadius: 6 }}>
              {h.t === 'success' ? <CheckCircle style={{ width: 18, height: 18, color: C.success[600] }} /> : h.t === 'warning' ? <AlertTriangle style={{ width: 18, height: 18, color: C.warning[600] }} /> : <Info style={{ width: 18, height: 18, color: C.brand[600] }} />}
              <span style={{ fontSize: '14px', color: h.t === 'success' ? C.success[700] : h.t === 'warning' ? C.warning[700] : C.brand[600] }}>{h.txt}</span>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Day Shift Handoff */}
      <Card style={{ background: `linear-gradient(135deg, ${C.brand[600]} 0%, ${C.brand[700]} 100%)`, color: 'white' }}>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
            <Sun style={{ width: 20, height: 20, color: C.brand[100] }} />
            <span style={{ fontWeight: 500, fontSize: '16px' }}>Day Shift Handoff</span>
          </div>
          <p style={{ fontSize: '12px', color: C.brand[200] }}>Work and status handed off to incoming day shift</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
          <div>
            <p style={{ fontSize: '12px', color: C.brand[100], marginBottom: sp.sm }}>Carryover by Queue</p>
            <div style={{ display: 'flex', gap: sp.sm }}>
              {[['Pick', handoff.pick], ['Pack', handoff.pack], ['Ship', handoff.ship]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: sp.md, textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 500 }}>{v}</p>
                  <p style={{ fontSize: '11px', color: C.brand[100] }}>{k}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: C.brand[100], marginBottom: sp.sm }}>Total Carryover</p>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: sp.md, textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 500 }}>{handoff.total}</p>
              <p style={{ fontSize: '12px', color: C.brand[100] }}>orders total</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: C.brand[100], marginBottom: sp.sm }}>Zone Status</p>
            <div style={{ background: 'rgba(18,183,106,0.2)', borderRadius: 6, padding: sp.md, display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <CheckCircle style={{ width: 20, height: 20, color: C.success[300] }} />
              <span style={{ fontSize: '14px', color: C.success[100] }}>{handoff.zone}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NightShift;
