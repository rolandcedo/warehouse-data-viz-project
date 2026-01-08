import React from 'react';
import { Users, UserCheck, UserX, Clock, UserPlus, Zap } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import TimeScrubber from '../../components/TimeScrubber';
import { Breadcrumb, Header, DataGrid, Card, Badge, Alert } from '../../components/UI';
import { PredictiveTimeline } from '../../components/Charts';

const StaffView = ({ onBack }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue } = useTimeContext();

  const alerts = [
    { sev: 'critical', title: 'Break Coverage Gap — 12:00', msg: '38 FTE predicted vs 48 required. Stagger breaks or authorize 2 overtime extensions.', time: '2hr out', conf: 87 },
    { sev: 'warning', title: 'Receiving UPLH Declining', msg: 'Productivity trending to 90 UPLH by 14:00 (target: 95). Consider rebalancing 2 pickers.', time: '4hr out', conf: 72 },
    { sev: 'info', title: 'Swing Shift Handoff Optimal', msg: 'Clean handoff predicted at 14:00 with no carryover labor gaps.', time: '4hr out', conf: 91 }
  ];

  // Staff roster data
  const staffData = [
    { id: 'E001', name: 'Maria Santos', role: 'Picker', shift: 'Day', zone: 'Forward Pick A', status: 'Active', uplh: 158, clockIn: '06:00' },
    { id: 'E002', name: 'James Wilson', role: 'Picker', shift: 'Day', zone: 'Forward Pick B', status: 'Active', uplh: 162, clockIn: '06:00' },
    { id: 'E003', name: 'Chen Wei', role: 'Packer', shift: 'Day', zone: 'Pack Station 1', status: 'Active', uplh: 112, clockIn: '06:00' },
    { id: 'E004', name: 'Sarah Johnson', role: 'Receiver', shift: 'Day', zone: 'Inbound A', status: 'Active', uplh: 94, clockIn: '06:00' },
    { id: 'E005', name: 'Mike Brown', role: 'Forklift Op', shift: 'Day', zone: 'Bulk Storage', status: 'Active', uplh: 88, clockIn: '06:00' },
    { id: 'E006', name: 'Ana Garcia', role: 'Picker', shift: 'Day', zone: 'Forward Pick C', status: 'Break', uplh: 145, clockIn: '06:00' },
    { id: 'E007', name: 'David Lee', role: 'Shipper', shift: 'Day', zone: 'Shipping Dock A', status: 'Active', uplh: 134, clockIn: '06:00' },
    { id: 'E008', name: 'Emily Chen', role: 'Packer', shift: 'Day', zone: 'Pack Station 2', status: 'Active', uplh: 118, clockIn: '06:00' },
    { id: 'E009', name: 'Robert Taylor', role: 'Receiver', shift: 'Day', zone: 'Inbound B', status: 'Active', uplh: 91, clockIn: '06:15' },
    { id: 'E010', name: 'Lisa Martinez', role: 'QC Inspector', shift: 'Day', zone: 'QA Station', status: 'Active', uplh: 42, clockIn: '06:00' },
    { id: 'E011', name: 'Tom Anderson', role: 'Picker', shift: 'Day', zone: 'Forward Pick A', status: 'Active', uplh: 149, clockIn: '06:00' },
    { id: 'E012', name: 'Jennifer White', role: 'Lead', shift: 'Day', zone: 'All', status: 'Active', uplh: null, clockIn: '05:45' },
    { id: 'E013', name: 'Chris Davis', role: 'Forklift Op', shift: 'Day', zone: 'Reserve 1', status: 'Call-out', uplh: null, clockIn: null },
    { id: 'E014', name: 'Amanda Clark', role: 'Picker', shift: 'Day', zone: 'Forward Pick B', status: 'Call-out', uplh: null, clockIn: null },
    { id: 'E015', name: 'Kevin Moore', role: 'Packer', shift: 'Day', zone: 'Pack Station 1', status: 'Late', uplh: 105, clockIn: '06:42' },
    { id: 'E016', name: 'Rachel Kim', role: 'Receiver', shift: 'Day', zone: 'Inbound A', status: 'Overtime', uplh: 96, clockIn: '05:00' },
  ];

  const staffColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'zone', label: 'Zone' },
    { key: 'status', label: 'Status', render: (v) => <Badge status={v === 'Active' ? 'success' : v === 'Break' ? 'info' : v === 'Call-out' ? 'error' : v === 'Late' ? 'warning' : 'purple'} label={v} /> },
    { key: 'uplh', label: 'UPLH', align: 'right', render: (v) => v ? <span style={{ color: v >= 100 ? C.success[600] : v >= 90 ? C.warning[600] : C.error[600] }}>{v}</span> : '—' },
    { key: 'clockIn', label: 'Clock In', render: (v) => v || '—' }
  ];

  const staffFilters = [
    { key: 'role', label: 'Role', options: ['Picker', 'Packer', 'Receiver', 'Shipper', 'Forklift Op', 'Lead', 'QC Inspector'] },
    { key: 'status', label: 'Status', options: ['Active', 'Break', 'Call-out', 'Late', 'Overtime'] }
  ];

  const staffTimeline = [
    { time: '06:00', actual: 45, predicted: null },
    { time: '07:00', actual: 46, predicted: null },
    { time: '08:00', actual: 44, predicted: null },
    { time: '09:00', actual: 43, predicted: null },
    { time: '10:00', actual: 42, predicted: 42, now: true },
    { time: '11:00', actual: null, predicted: 40, upper: 42, lower: 38 },
    { time: '12:00', actual: null, predicted: 38, upper: 41, lower: 35 },
    { time: '13:00', actual: null, predicted: 41, upper: 44, lower: 38 },
    { time: '14:00', actual: null, predicted: 44, upper: 47, lower: 41 }
  ];
  const productivityTimeline = [
    { time: '06:00', actual: 145, predicted: null },
    { time: '07:00', actual: 148, predicted: null },
    { time: '08:00', actual: 152, predicted: null },
    { time: '09:00', actual: 150, predicted: null },
    { time: '10:00', actual: 152, predicted: 152, now: true },
    { time: '11:00', actual: null, predicted: 148, upper: 155, lower: 141 },
    { time: '12:00', actual: null, predicted: 142, upper: 150, lower: 134 },
    { time: '13:00', actual: null, predicted: 145, upper: 153, lower: 137 },
    { time: '14:00', actual: null, predicted: 150, upper: 158, lower: 142 }
  ];
  const attendanceTimeline = [
    { time: '06:00', actual: 94, predicted: null },
    { time: '07:00', actual: 96, predicted: null },
    { time: '08:00', actual: 92, predicted: null },
    { time: '09:00', actual: 90, predicted: null },
    { time: '10:00', actual: 88, predicted: 88, now: true },
    { time: '11:00', actual: null, predicted: 83, upper: 88, lower: 79 },
    { time: '12:00', actual: null, predicted: 79, upper: 85, lower: 73 },
    { time: '13:00', actual: null, predicted: 85, upper: 92, lower: 79 },
    { time: '14:00', actual: null, predicted: 92, upper: 98, lower: 85 }
  ];
  const receivingUPLH = [
    { time: '06:00', actual: 88, predicted: null },
    { time: '08:00', actual: 90, predicted: null },
    { time: '10:00', actual: 92, predicted: 92, now: true },
    { time: '12:00', actual: null, predicted: 88, upper: 93, lower: 83 },
    { time: '14:00', actual: null, predicted: 90, upper: 96, lower: 84 }
  ];
  const pickingUPLH = [
    { time: '06:00', actual: 148, predicted: null },
    { time: '08:00', actual: 150, predicted: null },
    { time: '10:00', actual: 152, predicted: 152, now: true },
    { time: '12:00', actual: null, predicted: 145, upper: 155, lower: 135 },
    { time: '14:00', actual: null, predicted: 155, upper: 165, lower: 145 }
  ];
  const packingUPLH = [
    { time: '06:00', actual: 102, predicted: null },
    { time: '08:00', actual: 105, predicted: null },
    { time: '10:00', actual: 108, predicted: 108, now: true },
    { time: '12:00', actual: null, predicted: 100, upper: 110, lower: 90 },
    { time: '14:00', actual: null, predicted: 112, upper: 122, lower: 102 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.lg, background: 'white', margin: `-${sp.lg}`, padding: sp.lg, minHeight: '100vh' }}>
      {/* Time Scrubber */}
      <TimeScrubber />

      <Breadcrumb items={[{ label: 'Executive Summary', onClick: onBack }, { label: 'Staff' }]} />
      <Header icon={Users} title="Staff" sub="Labor capacity, productivity, allocation" color={C.purple[500]} />

      {/* Staff Roster Data Grid */}
      <DataGrid title="Staff Roster" subtitle="All employees assigned to current shift" columns={staffColumns} data={staffData} color={C.purple[500]} filterOptions={staffFilters} entityType="staff" />

      {/* Headcount Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Headcount Forecast</h3>
              {isContextualDifferent && interpolateValue(staffTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(staffTimeline, contextualTime)} FTE</strong> {isContextualPast && '(past)'}
                </span>
              )}
            </div>
            <Badge status="warning" label="Gap 11-13:00" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Active FTEs on floor over time • Now: 42 → Pred: 44 @ 14:00 • Target: 48 FTE</p>
        </div>
        <PredictiveTimeline data={staffTimeline} height={160} target={48} warning={44} critical={40} contextualTime={contextualTime} />
      </Card>

      {/* Attendance Coverage */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Attendance Coverage Forecast</h3>
              {isContextualDifferent && interpolateValue(attendanceTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(attendanceTimeline, contextualTime)}%</strong>
                </span>
              )}
            </div>
            <Badge status="warning" label="Below 85% @ 12:00" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Percentage of scheduled staff present • Now: 88% → Pred: 92% @ 14:00 • Target: 95%</p>
        </div>
        <PredictiveTimeline data={attendanceTimeline} height={160} target={95} warning={85} critical={80} contextualTime={contextualTime} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.md, marginTop: sp.md }}>
          <div style={{ padding: sp.md, background: C.success[50], borderRadius: 8, textAlign: 'center' }}><UserCheck style={{ width: 20, height: 20, color: C.success[600], margin: '0 auto 8px' }} /><p style={{ fontSize: '24px', fontWeight: 500, color: C.success[700] }}>42</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Present</p></div>
          <div style={{ padding: sp.md, background: C.error[50], borderRadius: 8, textAlign: 'center' }}><UserX style={{ width: 20, height: 20, color: C.error[600], margin: '0 auto 8px' }} /><p style={{ fontSize: '24px', fontWeight: 500, color: C.error[700] }}>4</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Call-outs</p></div>
          <div style={{ padding: sp.md, background: C.warning[50], borderRadius: 8, textAlign: 'center' }}><Clock style={{ width: 20, height: 20, color: C.warning[600], margin: '0 auto 8px' }} /><p style={{ fontSize: '24px', fontWeight: 500, color: C.warning[700] }}>2</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Late</p></div>
          <div style={{ padding: sp.md, background: C.brand[100], borderRadius: 8, textAlign: 'center' }}><UserPlus style={{ width: 20, height: 20, color: C.brand[600], margin: '0 auto 8px' }} /><p style={{ fontSize: '24px', fontWeight: 500, color: C.brand[700] }}>6</p><p style={{ fontSize: '12px', color: C.neutral[500] }}>Overtime</p></div>
        </div>
      </Card>

      {/* Productivity Forecast */}
      <Card>
        <div style={{ marginBottom: sp.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Overall Productivity (UPLH)</h3>
              {isContextualDifferent && interpolateValue(productivityTimeline, contextualTime) && (
                <span style={{ fontSize: '13px', padding: '2px 8px', background: C.brand[100], color: C.brand[600], borderRadius: 4 }}>
                  @{contextualTime}: <strong>{interpolateValue(productivityTimeline, contextualTime)} UPLH</strong>
                </span>
              )}
            </div>
            <Badge status="success" label="Above target" />
          </div>
          <p style={{ fontSize: '12px', color: C.neutral[500] }}>Units per labor hour • Now: 152 → Pred: 150 @ 14:00 • Target: 150 UPLH</p>
        </div>
        <PredictiveTimeline data={productivityTimeline} height={160} target={150} warning={140} critical={130} contextualTime={contextualTime} />
      </Card>

      {/* UPLH by Function */}
      <Card>
        <div style={{ marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Productivity by Function</h3>
            {isContextualDifferent && (
              <span style={{ fontSize: '12px', color: C.neutral[500] }}>
                • <span style={{ padding: '1px 6px', background: C.brand[100], color: C.brand[600], borderRadius: 3 }}>Blue</span> = @{contextualTime}
              </span>
            )}
          </div>
        </div>
        <div style={{ marginBottom: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Receiving</span>
            <span style={{ fontSize: '13px', color: C.neutral[500] }}>
              Now: 92
              {isContextualDifferent && interpolateValue(receivingUPLH, contextualTime) && (
                <span style={{ color: C.brand[600] }}> → {interpolateValue(receivingUPLH, contextualTime)}</span>
              )}
              → Pred: 90 (Target: 95)
            </span>
          </div>
          <PredictiveTimeline data={receivingUPLH} height={80} target={95} warning={90} contextualTime={contextualTime} />
        </div>
        <div style={{ marginBottom: sp.md, padding: sp.md, background: C.neutral[50], borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Picking</span>
            <span style={{ fontSize: '13px', color: C.neutral[500] }}>
              Now: 152
              {isContextualDifferent && interpolateValue(pickingUPLH, contextualTime) && (
                <span style={{ color: C.brand[600] }}> → {interpolateValue(pickingUPLH, contextualTime)}</span>
              )}
              → Pred: 155 (Target: 150)
            </span>
          </div>
          <PredictiveTimeline data={pickingUPLH} height={80} target={150} warning={140} contextualTime={contextualTime} />
        </div>
        <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp.sm }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Packing</span>
            <span style={{ fontSize: '13px', color: C.neutral[500] }}>
              Now: 108
              {isContextualDifferent && interpolateValue(packingUPLH, contextualTime) && (
                <span style={{ color: C.brand[600] }}> → {interpolateValue(packingUPLH, contextualTime)}</span>
              )}
              → Pred: 112 (Target: 115)
            </span>
          </div>
          <PredictiveTimeline data={packingUPLH} height={80} target={115} warning={105} contextualTime={contextualTime} />
        </div>
      </Card>

      {/* Analysis - BOTTOM */}
      <Card style={{ borderLeft: `4px solid ${C.purple[500]}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap style={{ width: 16, height: 16, color: C.purple[600] }} /></div>
          <div><h3 style={{ fontSize: '16px', fontWeight: 500 }}>Analysis</h3><p style={{ fontSize: '12px', color: C.neutral[500] }}>Root causes and recommendations for staffing</p></div>
          <Badge status="purple" label={`${alerts.length} Active`} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>{alerts.map((a, i) => <Alert key={i} {...a} />)}</div>
      </Card>
    </div>
  );
};

export default StaffView;
