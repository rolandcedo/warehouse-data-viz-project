import React from 'react';
import {
  Truck, Package, Users, Wrench, AlertTriangle, TrendingUp, TrendingDown,
  ChevronRight, Activity, Clock, CheckCircle, Fuel, Zap, Calendar, ArrowRight, Lightbulb
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Import design system
import { C, sp } from '../../styles/designSystem';

// Import context
import { useTimeContext } from '../../context/TimeContext';

// Import shared data
import { ALERTS_DATA } from '../../data/alertsData';

// Import UI components
import { Card, Badge, Alert, Header, DataGrid } from '../../components/UI';

// Equipment Tab Content - facility-level equipment overview
const EquipmentTabContent = ({ onViewInsights, onNavigateToAlert, onSelectEquipment }) => {
  // Fleet summary data
  const fleetSummary = {
    totalUnits: 32,
    active: 24,
    idle: 3,
    charging: 2,
    maintenance: 2,
    offline: 1,
    availability: 93.8,
    avgUtilization: 76,
    upcomingPM: 4,
    overduePM: 1
  };
  
  // Fleet by equipment type
  const fleetByType = [
    { 
      type: 'Sit-Down Forklift', 
      icon: Truck, 
      total: 8, 
      active: 6, 
      idle: 1, 
      charging: 0, 
      maintenance: 1, 
      offline: 0,
      avgUtil: 82,
      avgBattery: null, // IC powered
      isPoweredByBattery: false,
      mtbf: 420, // hours
      color: C.brand[500]
    },
    { 
      type: 'Reach Truck', 
      icon: Truck, 
      total: 6, 
      active: 5, 
      idle: 0, 
      charging: 1, 
      maintenance: 0, 
      offline: 0,
      avgUtil: 78,
      avgBattery: 68,
      isPoweredByBattery: true,
      mtbf: 380,
      color: C.purple[500]
    },
    { 
      type: 'Electric Pallet Jack', 
      icon: Package, 
      total: 10, 
      active: 7, 
      idle: 1, 
      charging: 1, 
      maintenance: 1, 
      offline: 0,
      avgUtil: 85,
      avgBattery: 72,
      isPoweredByBattery: true,
      mtbf: 520,
      color: C.orange[500]
    },
    { 
      type: 'Order Picker', 
      icon: Users, 
      total: 4, 
      active: 3, 
      idle: 1, 
      charging: 0, 
      maintenance: 0, 
      offline: 0,
      avgUtil: 71,
      avgBattery: 58,
      isPoweredByBattery: true,
      mtbf: 460,
      color: C.greenLight[500]
    },
    { 
      type: 'Tugger/Tow Tractor', 
      icon: Truck, 
      total: 4, 
      active: 3, 
      idle: 0, 
      charging: 0, 
      maintenance: 0, 
      offline: 1,
      avgUtil: 62,
      avgBattery: 81,
      isPoweredByBattery: true,
      mtbf: 490,
      color: C.blueLight[500]
    }
  ];
  
  // Individual equipment data
  const equipmentData = [
    { id: 'FL-01', type: 'Sit-Down Forklift', zone: 'Z04 Bulk Storage', status: 'Active', utilization: 85, operator: 'Mike Brown', battery: null, hoursToday: 6.2, hoursSincePM: 380, nextPM: '12/18', certified: true },
    { id: 'FL-02', type: 'Sit-Down Forklift', zone: 'Z01 Inbound', status: 'Active', utilization: 78, operator: 'Carlos Mendez', battery: null, hoursToday: 5.8, hoursSincePM: 395, nextPM: '12/17', certified: true },
    { id: 'FL-03', type: 'Sit-Down Forklift', zone: 'Z05 Reserve', status: 'Idle', utilization: 0, operator: null, battery: null, hoursToday: 2.1, hoursSincePM: 210, nextPM: '01/05', certified: true },
    { id: 'FL-04', type: 'Sit-Down Forklift', zone: 'Z02 Outbound', status: 'Active', utilization: 88, operator: 'James Wilson', battery: null, hoursToday: 6.5, hoursSincePM: 405, nextPM: '12/16', certified: true },
    { id: 'FL-05', type: 'Sit-Down Forklift', zone: 'Z04 Bulk Storage', status: 'Active', utilization: 72, operator: 'David Lee', battery: null, hoursToday: 5.4, hoursSincePM: 290, nextPM: '12/28', certified: true },
    { id: 'FL-06', type: 'Sit-Down Forklift', zone: 'Z01 Inbound', status: 'Maintenance', utilization: 0, operator: null, battery: null, hoursToday: 0, hoursSincePM: 425, nextPM: 'Overdue', certified: true },
    { id: 'FL-07', type: 'Sit-Down Forklift', zone: 'Z05 Reserve', status: 'Active', utilization: 81, operator: 'Robert Chen', battery: null, hoursToday: 6.0, hoursSincePM: 180, nextPM: '01/12', certified: true },
    { id: 'FL-08', type: 'Sit-Down Forklift', zone: 'Z02 Outbound', status: 'Active', utilization: 79, operator: 'Kevin Park', battery: null, hoursToday: 5.9, hoursSincePM: 320, nextPM: '12/22', certified: true },
    { id: 'RT-01', type: 'Reach Truck', zone: 'Z05 Reserve', status: 'Active', utilization: 82, operator: 'Maria Santos', battery: 72, hoursToday: 6.1, hoursSincePM: 340, nextPM: '12/20', certified: true },
    { id: 'RT-02', type: 'Reach Truck', zone: 'Z05 Reserve', status: 'Active', utilization: 76, operator: 'Chen Wei', battery: 65, hoursToday: 5.6, hoursSincePM: 290, nextPM: '12/26', certified: true },
    { id: 'RT-03', type: 'Reach Truck', zone: 'Z04 Bulk Storage', status: 'Active', utilization: 85, operator: 'Ana Rodriguez', battery: 58, hoursToday: 6.3, hoursSincePM: 360, nextPM: '12/19', certified: true },
    { id: 'RT-04', type: 'Reach Truck', zone: 'Z05 Reserve', status: 'Charging', utilization: 0, operator: null, battery: 35, hoursToday: 4.2, hoursSincePM: 280, nextPM: '12/27', certified: true },
    { id: 'RT-05', type: 'Reach Truck', zone: 'Z04 Bulk Storage', status: 'Active', utilization: 71, operator: 'Tom Harris', battery: 81, hoursToday: 5.2, hoursSincePM: 195, nextPM: '01/08', certified: true },
    { id: 'RT-06', type: 'Reach Truck', zone: 'Z05 Reserve', status: 'Active', utilization: 78, operator: 'Lisa Wang', battery: 69, hoursToday: 5.8, hoursSincePM: 310, nextPM: '12/23', certified: true },
    { id: 'EPJ-01', type: 'Electric Pallet Jack', zone: 'Z03 Forward Pick', status: 'Active', utilization: 92, operator: 'Sarah Johnson', battery: 68, hoursToday: 6.8, hoursSincePM: 480, nextPM: '12/18', certified: true },
    { id: 'EPJ-02', type: 'Electric Pallet Jack', zone: 'Z02 Pack Station', status: 'Active', utilization: 88, operator: 'Chris Taylor', battery: 74, hoursToday: 6.5, hoursSincePM: 420, nextPM: '12/21', certified: true },
    { id: 'EPJ-03', type: 'Electric Pallet Jack', zone: 'Z01 Inbound', status: 'Maintenance', utilization: 0, operator: null, battery: 45, hoursToday: 0, hoursSincePM: 510, nextPM: '12/14', certified: true },
    { id: 'EPJ-04', type: 'Electric Pallet Jack', zone: 'Z03 Forward Pick', status: 'Active', utilization: 85, operator: 'Amy Foster', battery: 62, hoursToday: 6.3, hoursSincePM: 390, nextPM: '12/24', certified: true },
    { id: 'EPJ-05', type: 'Electric Pallet Jack', zone: 'Z02 Outbound', status: 'Active', utilization: 79, operator: 'Mark Davis', battery: 88, hoursToday: 5.9, hoursSincePM: 250, nextPM: '01/02', certified: true },
    { id: 'EPJ-06', type: 'Electric Pallet Jack', zone: 'Z03 Forward Pick', status: 'Charging', utilization: 0, operator: null, battery: 28, hoursToday: 3.8, hoursSincePM: 440, nextPM: '12/19', certified: true },
    { id: 'EPJ-07', type: 'Electric Pallet Jack', zone: 'Z01 Inbound', status: 'Active', utilization: 86, operator: 'Nina Patel', battery: 71, hoursToday: 6.4, hoursSincePM: 365, nextPM: '12/25', certified: true },
    { id: 'EPJ-08', type: 'Electric Pallet Jack', zone: 'Z02 Pack Station', status: 'Active', utilization: 91, operator: 'Derek Kim', battery: 55, hoursToday: 6.7, hoursSincePM: 495, nextPM: '12/16', certified: true },
    { id: 'EPJ-09', type: 'Electric Pallet Jack', zone: 'Z03 Forward Pick', status: 'Idle', utilization: 0, operator: null, battery: 92, hoursToday: 1.5, hoursSincePM: 180, nextPM: '01/10', certified: true },
    { id: 'EPJ-10', type: 'Electric Pallet Jack', zone: 'Z02 Outbound', status: 'Active', utilization: 83, operator: 'Rachel Green', battery: 77, hoursToday: 6.1, hoursSincePM: 330, nextPM: '12/28', certified: true },
    { id: 'OP-01', type: 'Order Picker', zone: 'Z03 Forward Pick', status: 'Active', utilization: 78, operator: 'Jake Miller', battery: 64, hoursToday: 5.8, hoursSincePM: 410, nextPM: '12/20', certified: true },
    { id: 'OP-02', type: 'Order Picker', zone: 'Z03 Forward Pick', status: 'Active', utilization: 72, operator: 'Emily Clark', battery: 52, hoursToday: 5.3, hoursSincePM: 380, nextPM: '12/22', certified: true },
    { id: 'OP-03', type: 'Order Picker', zone: 'Z03 Forward Pick', status: 'Active', utilization: 65, operator: 'Brian Scott', battery: 58, hoursToday: 4.8, hoursSincePM: 290, nextPM: '01/04', certified: true },
    { id: 'OP-04', type: 'Order Picker', zone: 'Z03 Forward Pick', status: 'Idle', utilization: 0, operator: null, battery: 89, hoursToday: 2.0, hoursSincePM: 150, nextPM: '01/15', certified: true },
    { id: 'TT-01', type: 'Tugger/Tow Tractor', zone: 'Yard', status: 'Active', utilization: 68, operator: 'Steve Adams', battery: 85, hoursToday: 5.0, hoursSincePM: 440, nextPM: '12/18', certified: true },
    { id: 'TT-02', type: 'Tugger/Tow Tractor', zone: 'Z01-Z02 Corridor', status: 'Active', utilization: 72, operator: 'Paul Wright', battery: 79, hoursToday: 5.3, hoursSincePM: 390, nextPM: '12/23', certified: true },
    { id: 'TT-03', type: 'Tugger/Tow Tractor', zone: 'Yard', status: 'Offline', utilization: 0, operator: null, battery: 0, hoursToday: 0, hoursSincePM: 520, nextPM: 'Overdue', certified: false },
    { id: 'TT-04', type: 'Tugger/Tow Tractor', zone: 'Z02-Dock Corridor', status: 'Active', utilization: 58, operator: 'Tony Garcia', battery: 82, hoursToday: 4.3, hoursSincePM: 260, nextPM: '01/06', certified: true }
  ];
  
  // Equipment alerts
  const equipmentAlerts = [
    { id: 'equip-pm-overdue', sev: 'critical', title: 'FL-06 PM overdue', msg: '25 hours past scheduled maintenance', time: 'Now', conf: 95, category: 'equipment' },
    { id: 'equip-tt03-offline', sev: 'critical', title: 'TT-03 offline', msg: 'Unit requires major repair - out of service', time: 'Now', conf: 100, category: 'equipment' },
    { id: 'equip-epj03-repair', sev: 'warning', title: 'EPJ-03 in repair', msg: 'Expected return 14:00 today', time: '+4hr', conf: 85, category: 'equipment' },
    { id: 'equip-battery-low', sev: 'warning', title: '3 units low battery', msg: 'RT-04, EPJ-06 charging; OP-02 at 52%', time: 'Now', conf: 90, category: 'equipment' },
    { id: 'equip-pm-upcoming', sev: 'info', title: '4 PMs scheduled this week', msg: 'FL-04 today, FL-02 tomorrow, 2 more by Friday', time: '+1-5d', conf: 100, category: 'equipment' }
  ];
  
  // Maintenance schedule
  const maintenanceSchedule = [
    { id: 'FL-04', type: 'Sit-Down Forklift', pmType: 'Scheduled PM', date: 'Today', time: '14:00-15:00', status: 'scheduled', technician: 'Mike T.' },
    { id: 'FL-02', type: 'Sit-Down Forklift', pmType: 'Scheduled PM', date: 'Tomorrow', time: '08:00-09:00', status: 'scheduled', technician: 'Mike T.' },
    { id: 'EPJ-01', type: 'Electric Pallet Jack', pmType: 'Scheduled PM', date: '12/18', time: '06:00-06:45', status: 'scheduled', technician: 'Sarah L.' },
    { id: 'RT-03', type: 'Reach Truck', pmType: 'Scheduled PM', date: '12/19', time: '14:00-15:00', status: 'scheduled', technician: 'Mike T.' },
    { id: 'FL-06', type: 'Sit-Down Forklift', pmType: 'Corrective Repair', date: 'In Progress', time: 'Started 08:30', status: 'in-progress', technician: 'Mike T.' },
    { id: 'EPJ-03', type: 'Electric Pallet Jack', pmType: 'Corrective Repair', date: 'In Progress', time: 'ETA 14:00', status: 'in-progress', technician: 'Sarah L.' },
    { id: 'TT-03', type: 'Tugger/Tow Tractor', pmType: 'Major Repair', date: 'Pending Parts', time: 'ETA 12/20', status: 'pending', technician: 'External' }
  ];
  
  // Charging schedule for battery-powered equipment
  const chargingBays = [
    { bay: 'Bay 1', unit: 'RT-04', battery: 35, timeRemaining: '1hr 45min', status: 'charging' },
    { bay: 'Bay 2', unit: 'EPJ-06', battery: 28, timeRemaining: '2hr 10min', status: 'charging' },
    { bay: 'Bay 3', unit: null, battery: null, timeRemaining: null, status: 'available' },
    { bay: 'Bay 4', unit: null, battery: null, timeRemaining: null, status: 'available' }
  ];
  
  // Equipment columns for grid
  const equipColumns = [
    { key: 'id', label: 'Unit ID', render: (v, row) => (
      <span style={{ fontWeight: 500, color: row.status === 'Offline' ? C.error[600] : C.neutral[800] }}>{v}</span>
    )},
    { key: 'type', label: 'Type', render: (v) => (
      <span style={{ fontSize: '12px' }}>{v}</span>
    )},
    { key: 'zone', label: 'Location' },
    { key: 'status', label: 'Status', render: (v) => (
      <Badge 
        status={v === 'Active' ? 'success' : v === 'Idle' ? 'neutral' : v === 'Charging' ? 'info' : v === 'Maintenance' ? 'warning' : 'error'} 
        label={v} 
      />
    )},
    { key: 'battery', label: 'Battery', align: 'center', render: (v, row) => {
      if (v === null) return <span style={{ color: C.neutral[400], fontSize: '11px' }}>N/A</span>;
      const color = v > 60 ? C.success[500] : v > 30 ? C.warning[500] : C.error[500];
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 32, height: 8, background: C.neutral[200], borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: '11px', color }}>{v}%</span>
        </div>
      );
    }},
    { key: 'utilization', label: 'Util', align: 'right', render: (v) => v > 0 ? (
      <span style={{ color: v > 85 ? C.success[600] : v > 60 ? C.neutral[600] : C.warning[600] }}>{v}%</span>
    ) : '—' },
    { key: 'hoursToday', label: 'Hrs Today', align: 'right', render: (v) => v > 0 ? `${v.toFixed(1)}` : '—' },
    { key: 'nextPM', label: 'Next PM', render: (v) => (
      <span style={{ 
        color: v === 'Overdue' ? C.error[600] : v === 'Today' ? C.warning[600] : C.neutral[600],
        fontWeight: v === 'Overdue' ? 500 : 400
      }}>{v}</span>
    )},
    { key: 'operator', label: 'Operator', render: (v) => v || <span style={{ color: C.neutral[400] }}>—</span> }
  ];

  return (
    <>
      <Header icon={Wrench} title="Asset Health" sub="Material handling equipment fleet status and maintenance" color={C.neutral[500]} />
      
      {/* Fleet Availability Summary */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Fleet Availability</h3>
            <p style={{ fontSize: '12px', color: C.neutral[500] }}>{fleetSummary.totalUnits} total units across 5 equipment types</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '28px', fontWeight: 300, color: fleetSummary.availability >= 95 ? C.success[600] : fleetSummary.availability >= 90 ? C.warning[600] : C.error[600] }}>
                {fleetSummary.availability}%
              </span>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Availability Rate</p>
            </div>
            <div style={{ width: 1, height: 40, background: C.neutral[200] }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '28px', fontWeight: 300, color: C.brand[600] }}>{fleetSummary.avgUtilization}%</span>
              <p style={{ fontSize: '11px', color: C.neutral[500] }}>Avg Utilization</p>
            </div>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: sp.sm }}>
          {[
            { label: 'Active', value: fleetSummary.active, color: C.success, icon: CheckCircle },
            { label: 'Idle', value: fleetSummary.idle, color: C.neutral, icon: Clock },
            { label: 'Charging', value: fleetSummary.charging, color: C.brand, icon: Zap },
            { label: 'Maintenance', value: fleetSummary.maintenance, color: C.warning, icon: Wrench },
            { label: 'Offline', value: fleetSummary.offline, color: C.error, icon: AlertTriangle },
            { label: 'PM Due', value: fleetSummary.upcomingPM, color: C.blueLight, icon: Calendar }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ 
                padding: sp.sm, 
                background: item.color[50], 
                borderRadius: 8, 
                display: 'flex', 
                alignItems: 'center', 
                gap: sp.sm,
                border: `1px solid ${item.color[200]}`
              }}>
                <Icon style={{ width: 18, height: 18, color: item.color[600] }} />
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 500, color: item.color[700], lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: '10px', color: item.color[600] }}>{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Fleet by Type - Full Width */}
      <Card>
        <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Fleet by Equipment Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {fleetByType.map((fleet, i) => {
            const Icon = fleet.icon;
            const availableUnits = fleet.active + fleet.idle + fleet.charging;
            const availabilityPct = Math.round((availableUnits / fleet.total) * 100);
            return (
              <div key={i} style={{ 
                padding: sp.sm, 
                background: C.neutral[50], 
                borderRadius: 8,
                border: `1px solid ${C.neutral[200]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs, flexWrap: 'wrap', gap: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: fleet.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 14, height: 14, color: fleet.color }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{fleet.type}</span>
                      <span style={{ fontSize: '11px', color: C.neutral[500], marginLeft: sp.sm }}>{fleet.total} units</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md, flexWrap: 'wrap' }}>
                    {fleet.isPoweredByBattery && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap style={{ width: 12, height: 12, color: C.brand[500] }} />
                        <span style={{ fontSize: '11px', color: C.neutral[600] }}>{fleet.avgBattery}% avg</span>
                      </div>
                    )}
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 500,
                      color: availabilityPct >= 90 ? C.success[600] : availabilityPct >= 75 ? C.warning[600] : C.error[600]
                    }}>
                      {availabilityPct}% available
                    </span>
                  </div>
                </div>
                {/* Status bar */}
                <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: C.neutral[200] }}>
                  <div style={{ width: `${(fleet.active / fleet.total) * 100}%`, background: C.success[500] }} title={`${fleet.active} Active`} />
                  <div style={{ width: `${(fleet.idle / fleet.total) * 100}%`, background: C.neutral[400] }} title={`${fleet.idle} Idle`} />
                  <div style={{ width: `${(fleet.charging / fleet.total) * 100}%`, background: C.brand[500] }} title={`${fleet.charging} Charging`} />
                  <div style={{ width: `${(fleet.maintenance / fleet.total) * 100}%`, background: C.warning[500] }} title={`${fleet.maintenance} Maintenance`} />
                  <div style={{ width: `${(fleet.offline / fleet.total) * 100}%`, background: C.error[500] }} title={`${fleet.offline} Offline`} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: sp.xs, flexWrap: 'wrap', gap: sp.xs }}>
                  <div style={{ display: 'flex', gap: sp.sm, fontSize: '10px', color: C.neutral[500], flexWrap: 'wrap' }}>
                    <span><span style={{ color: C.success[600], fontWeight: 500 }}>{fleet.active}</span> active</span>
                    {fleet.idle > 0 && <span><span style={{ color: C.neutral[600], fontWeight: 500 }}>{fleet.idle}</span> idle</span>}
                    {fleet.charging > 0 && <span><span style={{ color: C.brand[600], fontWeight: 500 }}>{fleet.charging}</span> charging</span>}
                    {fleet.maintenance > 0 && <span><span style={{ color: C.warning[600], fontWeight: 500 }}>{fleet.maintenance}</span> maint</span>}
                    {fleet.offline > 0 && <span><span style={{ color: C.error[600], fontWeight: 500 }}>{fleet.offline}</span> offline</span>}
                  </div>
                  <span style={{ fontSize: '10px', color: C.neutral[500] }}>Util: {fleet.avgUtil}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Analysis - Full Width */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Lightbulb style={{ width: 16, height: 16, color: C.neutral[500] }} />
            <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Equipment Alerts</h3>
          </div>
          <Badge status="warning" label={`${equipmentAlerts.length} Active`} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {equipmentAlerts.map((alert, i) => (
            <Alert 
              key={i} 
              {...alert} 
              onClick={() => onNavigateToAlert && onNavigateToAlert(alert.id, 'equipment', true)}
            />
          ))}
        </div>
        <div 
          onClick={() => onViewInsights && onViewInsights()}
          style={{ 
            marginTop: sp.md, 
            paddingTop: sp.md, 
            borderTop: `1px solid ${C.neutral[200]}`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: sp.xs,
            cursor: 'pointer', 
            color: C.neutral[600], 
            fontSize: '13px', 
            fontWeight: 500
          }}
        >
          <span>View Full Analysis</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </div>
      </Card>
      
      {/* Maintenance Schedule - Full Width */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Calendar style={{ width: 16, height: 16, color: C.neutral[500] }} />
            <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Maintenance Schedule</h3>
          </div>
          <Badge status={fleetSummary.overduePM > 0 ? 'error' : 'info'} label={fleetSummary.overduePM > 0 ? `${fleetSummary.overduePM} Overdue` : `${fleetSummary.upcomingPM} Upcoming`} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
          {maintenanceSchedule.map((item, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: sp.sm, 
              background: item.status === 'in-progress' ? C.warning[50] : item.status === 'pending' ? C.error[50] : C.neutral[50], 
              borderRadius: 6,
              borderLeft: `3px solid ${item.status === 'in-progress' ? C.warning[500] : item.status === 'pending' ? C.error[500] : C.blueLight[500]}`,
              flexWrap: 'wrap',
              gap: sp.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <span style={{ fontSize: '13px', fontWeight: 500, minWidth: 50 }}>{item.id}</span>
                <div>
                  <p style={{ fontSize: '12px', color: C.neutral[700] }}>{item.pmType}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>{item.date} • {item.time}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge 
                  status={item.status === 'in-progress' ? 'warning' : item.status === 'pending' ? 'error' : 'info'} 
                  label={item.status === 'in-progress' ? 'In Progress' : item.status === 'pending' ? 'Pending' : 'Scheduled'} 
                />
                <p style={{ fontSize: '10px', color: C.neutral[500], marginTop: 2 }}>{item.technician}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Charging Status - Full Width */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: sp.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Zap style={{ width: 16, height: 16, color: C.brand[500] }} />
            <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Charging Stations</h3>
          </div>
          <span style={{ fontSize: '12px', color: C.neutral[500] }}>{chargingBays.filter(b => b.status === 'charging').length} of {chargingBays.length} in use</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: sp.sm }}>
          {chargingBays.map((bay, i) => (
            <div key={i} style={{ 
              padding: sp.md, 
              background: bay.status === 'charging' ? C.brand[50] : C.neutral[50], 
              borderRadius: 8,
              border: `1px solid ${bay.status === 'charging' ? C.brand[200] : C.neutral[200]}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{bay.bay}</span>
                <Badge status={bay.status === 'charging' ? 'info' : 'neutral'} label={bay.status === 'charging' ? 'In Use' : 'Available'} />
              </div>
              {bay.unit ? (
                <>
                  <p style={{ fontSize: '16px', fontWeight: 500, color: C.brand[700] }}>{bay.unit}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginTop: sp.xs }}>
                    <div style={{ flex: 1, height: 6, background: C.neutral[200], borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${bay.battery}%`, 
                        height: '100%', 
                        background: bay.battery > 60 ? C.success[500] : bay.battery > 30 ? C.warning[500] : C.error[500],
                        borderRadius: 3
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: C.neutral[600] }}>{bay.battery}%</span>
                  </div>
                  <p style={{ fontSize: '10px', color: C.neutral[500], marginTop: sp.xs }}>
                    <Clock style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />
                    {bay.timeRemaining} remaining
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '13px', color: C.neutral[400], marginTop: sp.sm }}>Ready for use</p>
              )}
            </div>
          ))}
        </div>
        {/* Low battery warnings */}
        <div style={{ marginTop: sp.md, padding: sp.sm, background: C.warning[50], borderRadius: 6, border: `1px solid ${C.warning[200]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.xs }}>
            <AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: C.warning[700] }}>Low Battery Units</span>
          </div>
          <p style={{ fontSize: '11px', color: C.warning[700] }}>
            OP-02 (52%), EPJ-08 (55%), RT-03 (58%) - Consider scheduling charging during next break
          </p>
        </div>
      </Card>
      
      {/* Equipment Inventory - Using DataGrid */}
      <DataGrid 
        title="Equipment Inventory" 
        subtitle="All MHE units" 
        columns={equipColumns} 
        data={equipmentData} 
        color={C.neutral[500]}
        entityType="equipment"
        filterOptions={[
          { key: 'type', label: 'Type', options: [...new Set(equipmentData.map(e => e.type))] },
          { key: 'status', label: 'Status', options: ['Active', 'Idle', 'Charging', 'Maintenance', 'Offline'] }
        ]}
        onAction={(action, row) => {
          if (action === 'view' && onSelectEquipment) {
            onSelectEquipment(row.id, `${row.id} — ${row.type}`);
          }
        }}
      />
    </>
  );
};

export default EquipmentTabContent;
