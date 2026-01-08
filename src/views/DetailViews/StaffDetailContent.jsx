import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, MapPin, ClipboardList, Calendar, Truck, ChevronRight, ArrowRight, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb, Eye, Settings, Activity, Clock, Coffee, Minus } from 'lucide-react';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';
import { Card, Badge, Progress, Alert, ContributingFactorsModal, ContributingFactorsLink } from '../../components/UI';

const StaffDetailContent = ({ staffId, staffName, activeTab, onNavigateToStaff, onNavigateToZone, onNavigateToEquipment, onNavigateToAlert }) => {
  const { contextualTime, isContextualDifferent, isContextualPast, interpolateValue, endTime, endTimeLabel, useEOD, scenarioMode, activeScenario } = useTimeContext();
  
  // Contributing Factors Modal state
  const [contributingFactorsModal, setContributingFactorsModal] = useState({ isOpen: false, title: '', data: null });
  
  // Specific staff data - Mike Brown as canonical example
  const specificStaff = {
    'E005': {
      id: 'E005',
      name: 'Mike Brown',
      role: 'Senior Forklift Operator',
      department: 'Warehouse Operations',
      shift: 'Day Shift',
      shiftTime: '6:00 AM - 2:00 PM',
      hireDate: '2019-08-12',
      yearsOfService: 5.4,
      status: 'Active',
      supervisor: 'Sarah Chen',
      supervisorId: 'E102',
      phone: '(555) 867-5309',
      email: 'm.brown@warehouse.com',
      
      // Current shift info
      currentShift: {
        status: 'On Shift',
        clockedIn: '5:55 AM',
        hoursToday: 4.1,
        breaksTaken: 1,
        breaksRemaining: 1,
        zone: 'Z04 - Bulk Storage',
        zoneId: 'Z04',
        equipment: 'FL-01',
        equipmentId: 'FL-01',
        nextBreak: '12:00 PM'
      },
      
      // Performance metrics with tri-temporal
      performance: {
        uph: { current: 52, predicted: 51, target: 45 },
        pickAccuracy: { current: 99.4, predicted: 99.3, target: 99.0 },
        efficiency: { current: 94, predicted: 93, target: 85 },
        palletsToday: { 
          current: 86, 
          predicted: 156,
          target: 140,
          timeline: [
            { time: '06:00', actual: 0 },
            { time: '07:00', actual: 18 },
            { time: '08:00', actual: 38 },
            { time: '09:00', actual: 62 },
            { time: '10:00', actual: 86, predicted: 86 },
            { time: '11:00', predicted: 108 },
            { time: '12:00', predicted: 128 },
            { time: '13:00', predicted: 144 },
            { time: '14:00', predicted: 156 }
          ]
        },
        hoursWorked: {
          current: 4.1,
          predicted: 8.0,
          target: 8.0,
          timeline: [
            { time: '06:00', actual: 0 },
            { time: '08:00', actual: 2.0 },
            { time: '10:00', actual: 4.1, predicted: 4.1 },
            { time: '12:00', predicted: 5.8 },
            { time: '14:00', predicted: 8.0 }
          ]
        },
        tasksCompleted: {
          current: 42,
          predicted: 78,
          target: 70,
          timeline: [
            { time: '06:00', actual: 0 },
            { time: '08:00', actual: 16 },
            { time: '10:00', actual: 42, predicted: 42 },
            { time: '12:00', predicted: 58 },
            { time: '14:00', predicted: 78 }
          ]
        },
        idleTime: { current: 6, predicted: 8, target: 12 },
        avgCycleTime: 1.9,
        directLaborPct: 89,
        ranking: 2,
        rankingTotal: 28,
        rankingTrend: '+3'
      },
      
      // Break tracking with predictions
      breaks: {
        taken: [
          { type: '15 min', startTime: '08:30', endTime: '08:45', status: 'completed' }
        ],
        scheduled: [
          { type: '30 min lunch', scheduledTime: '12:00', status: 'upcoming' }
        ],
        remaining: { 
          breakMinutes: 30,
          timeline: [
            { time: '06:00', actual: 45 },
            { time: '08:45', actual: 30, predicted: 30 },
            { time: '10:00', actual: 30, predicted: 30 },
            { time: '12:30', predicted: 0 },
            { time: '14:00', predicted: 0 }
          ]
        },
        compliance: 100
      },
      
      // Fatigue/Safety score (predictive)
      fatigueScore: {
        current: 92,
        predicted: 78,
        target: 80,
        risk: 'low',
        predictedRisk: 'medium',
        timeline: [
          { time: '06:00', actual: 100 },
          { time: '08:00', actual: 96 },
          { time: '10:00', actual: 92, predicted: 92 },
          { time: '12:00', predicted: 84 },
          { time: '14:00', predicted: 78 }
        ],
        factors: ['Consecutive work hours', 'Break timing', 'Task intensity']
      },
      
      // Equipment certifications
      certifiedEquipment: [
        { id: 'FL-01', type: 'Sit-Down Forklift', certDate: '2022-03-15', expiry: '2025-03-15', hours: 2840, status: 'Active' },
        { id: 'FL-02', type: 'Sit-Down Forklift', certDate: '2022-03-15', expiry: '2025-03-15', hours: 1620, status: 'Active' },
        { id: 'RT-01', type: 'Reach Truck', certDate: '2023-01-20', expiry: '2026-01-20', hours: 890, status: 'Active' },
        { id: 'EPJ-04', type: 'Electric Pallet Jack', certDate: '2023-06-10', expiry: '2026-06-10', hours: 340, status: 'Active' }
      ],
      
      // All certifications
      certifications: [
        { name: 'Forklift Operator License', issuer: 'OSHA', issued: '2022-03-15', expiry: '2025-03-15', status: 'expiring', daysUntilExpiry: 87 },
        { name: 'Reach Truck Certification', issuer: 'OSHA', issued: '2023-01-20', expiry: '2026-01-20', status: 'active' },
        { name: 'Hazmat Handling Level 2', issuer: 'DOT', issued: '2023-05-01', expiry: '2026-05-01', status: 'active' },
        { name: 'CPR/First Aid', issuer: 'Red Cross', issued: '2024-02-15', expiry: '2026-02-15', status: 'active' },
        { name: 'Confined Space Entry', issuer: 'Internal', issued: '2024-08-20', expiry: '2025-08-20', status: 'active' }
      ],
      
      // Training history
      trainingHistory: [
        { course: 'Annual Safety Refresher', date: '2024-11-15', score: 98, status: 'passed' },
        { course: 'New WMS System Training', date: '2024-09-20', score: 92, status: 'passed' },
        { course: 'Hazmat Level 2 Certification', date: '2024-05-01', score: 96, status: 'passed' },
        { course: 'Forklift Advanced Operations', date: '2023-12-10', score: 100, status: 'passed' },
        { course: 'Ergonomics & Injury Prevention', date: '2023-08-15', score: 94, status: 'passed' }
      ],
      
      // Safety record
      safety: {
        daysSinceIncident: 412,
        totalIncidents: 0,
        nearMissReports: 3,
        safetyObservations: 18,
        safetyScore: { current: 98, predicted: 97, target: 90 },
        streak: 'Longest incident-free streak in department'
      },
      
      // Attendance
      attendance: {
        rate: 98.6,
        punctuality: 99.2,
        scheduledDays: 220,
        daysWorked: 217,
        lateArrivals: 2,
        unplannedAbsences: 1,
        ptoBalance: 14,
        ptoUsed: 6,
        sickDaysUsed: 2
      },
      
      // Schedule
      schedule: {
        currentWeek: [
          { day: 'Mon', date: 'Dec 16', shift: 'Day', time: '6AM-2PM', status: 'worked', hours: 8.2 },
          { day: 'Tue', date: 'Dec 17', shift: 'Day', time: '6AM-2PM', status: 'worked', hours: 8.0 },
          { day: 'Wed', date: 'Dec 18', shift: 'Day', time: '6AM-2PM', status: 'current', hours: 4.1 },
          { day: 'Thu', date: 'Dec 19', shift: 'Day', time: '6AM-2PM', status: 'scheduled' },
          { day: 'Fri', date: 'Dec 20', shift: 'Day', time: '6AM-2PM', status: 'scheduled' },
          { day: 'Sat', date: 'Dec 21', shift: 'Off', time: '-', status: 'off' },
          { day: 'Sun', date: 'Dec 22', shift: 'Off', time: '-', status: 'off' }
        ],
        overtimeHours: 0.2,
        overtimeLimit: 10,
        weeklyHours: { current: 20.3, predicted: 40.2, target: 40 }
      },
      
      // Predictive alerts - issues requiring intervention
      predictiveAlerts: [
        {
          id: 'mike-cert',
          sev: 'warning',
          title: 'Certification expiring',
          msg: 'Forklift Operator License expires in 87 days. Schedule recertification training.',
          time: '87 days',
          conf: 100,
          insightAvailable: true
        },
        {
          id: 'mike-fatigue',
          sev: 'info',
          title: 'Fatigue score declining',
          msg: 'Predicted to drop below 80% threshold by 13:30 if lunch break is delayed.',
          time: '+3.5 hrs',
          conf: 76,
          insightAvailable: true
        }
      ],
      
      // Upcoming events
      upcomingEvents: [
        { id: 'ev-break', type: 'break', title: 'Lunch break', time: '12:00 PM', desc: '30 min scheduled', icon: 'coffee' },
        { id: 'ev-handoff', type: 'handoff', title: 'Shift end', time: '2:00 PM', desc: 'Hand off FL-01 to Carlos Mendez', icon: 'users' },
        { id: 'ev-training', type: 'training', title: 'Safety refresher', time: 'Dec 20', desc: 'Annual safety training due', icon: 'clipboard' }
      ],
      
      // Scenario impacts
      scenarioImpacts: {
        'scenario-1': { // +2 FTEs
          tasksReduction: -15,
          fatigueImprovement: +8,
          breakOnTime: true,
          workloadPct: 85
        },
        'scenario-2': { // Stagger breaks
          breakTimeShift: '+15 min',
          fatigueImprovement: +4,
          coverageImproved: true
        }
      }
    }
  };
  
  // Generate generic staff data for other IDs
  const generateStaffData = (id, name) => ({
    id: id || 'EMP-0000',
    name: name || 'Staff Member',
    role: 'Warehouse Associate',
    department: 'Warehouse Operations',
    shift: 'Day Shift',
    shiftTime: '6:00 AM - 2:00 PM',
    hireDate: '2022-01-15',
    yearsOfService: 2.9,
    status: 'Active',
    supervisor: 'Sarah Chen',
    supervisorId: 'E102',
    currentShift: {
      status: 'On Shift',
      clockedIn: '6:00 AM',
      hoursToday: 4.0,
      zone: 'Z01 - Inbound',
      zoneId: 'Z01',
      equipment: null,
      equipmentId: null
    },
    performance: {
      uph: { current: 42, predicted: 41, target: 40 },
      pickAccuracy: { current: 98.5, predicted: 98.4, target: 98.0 },
      efficiency: { current: 88, predicted: 87, target: 85 },
      palletsToday: { current: 64, predicted: 120, target: 110 },
      hoursWorked: { current: 4.0, predicted: 8.0, target: 8.0 },
      tasksCompleted: { current: 32, predicted: 62, target: 55 },
      idleTime: { current: 10, predicted: 12, target: 15 },
      ranking: 12,
      rankingTotal: 28
    },
    fatigueScore: { current: 90, predicted: 82, target: 80 },
    certifications: [],
    certifiedEquipment: [],
    safety: { daysSinceIncident: 180, safetyScore: { current: 92, predicted: 91, target: 90 } },
    attendance: { rate: 96.5, punctuality: 97.0 },
    predictiveAlerts: [],
    upcomingEvents: []
  });
  
  // Get staff data
  const staff = specificStaff[staffId] || generateStaffData(staffId, staffName);
  
  // Helper to safely get nested values
  const safeGet = (obj, path, defaultVal) => {
    try {
      return path.split('.').reduce((o, k) => o?.[k], obj) ?? defaultVal;
    } catch { return defaultVal; }
  };
  
  // Contributing Factors data for person metrics
  const contributingFactorsData = {
    productivity: {
      whatsHappening: `${staff.name} has completed ${safeGet(staff, 'performance.tasksCompleted.current', 42)} tasks today, tracking toward the daily target. Productivity rate is ${safeGet(staff, 'performance.uph.current', 52)} units/hour.`,
      whyImportant: 'Strong productivity indicates effective task assignment and operator skill. Maintaining this pace will exceed daily targets, contributing to zone throughput goals.',
      contributors: [
        { label: 'Equipment Assignment', weight: 35, direction: 'up', detail: 'FL-01 is high-efficiency unit', onClick: () => {} },
        { label: 'Zone Familiarity', weight: 30, direction: 'up', detail: 'Z04 is primary assignment', onClick: () => {} },
        { label: 'Task Sequencing', weight: 20, direction: 'neutral', detail: 'Route optimization applied', onClick: () => {} },
        { label: 'Experience Level', weight: 15, direction: 'up', detail: '5.4 years, senior operator', onClick: () => {} }
      ],
      calculation: {
        formula: 'Tasks/Hour = Completed Tasks / Active Work Hours',
        dataSources: ['WMS task completions', 'Time clock data', 'Equipment telemetry'],
        refreshRate: 'Real-time',
        confidence: 96
      },
      actions: [
        { label: 'View Task History', onClick: () => {} },
        { label: 'Compare to Team', onClick: () => {} }
      ]
    },
    fatigue: {
      whatsHappening: `Fatigue score is currently ${safeGet(staff, 'fatigueScore.current', 92)}%, predicted to decline to ${safeGet(staff, 'fatigueScore.predicted', 78)}% by end of shift.`,
      whyImportant: 'Fatigue scores below 80% correlate with 2.3x increase in safety incidents. Timely breaks and workload balancing can prevent the decline.',
      contributors: [
        { label: 'Continuous Work Time', weight: 40, direction: 'down', detail: '2.5 hrs since last break', onClick: () => {} },
        { label: 'Task Intensity', weight: 30, direction: 'down', detail: 'Heavy lifting in Z04', onClick: () => {} },
        { label: 'Environmental Factors', weight: 20, direction: 'neutral', detail: 'Temperature normal', onClick: () => {} },
        { label: 'Shift Progress', weight: 10, direction: 'down', detail: '51% through shift', onClick: () => {} }
      ],
      calculation: {
        formula: 'Fatigue = 100 - (Work Hours × 3) - (Intensity Factor) + (Break Recovery)',
        dataSources: ['Time clock', 'Task intensity weights', 'Break logs', 'Historical patterns'],
        refreshRate: 'Every 15 minutes',
        confidence: 76
      },
      actions: [
        { label: 'View Break Schedule', onClick: () => {} },
        { label: 'Adjust Workload', onClick: () => {} }
      ]
    },
    efficiency: {
      whatsHappening: `Operating at ${staff.performance.efficiency?.current || 94}% efficiency with only ${staff.performance.idleTime?.current || 6}% idle time. This ranks #${staff.performance.ranking || 2} among ${staff.performance.rankingTotal || 28} operators.`,
      whyImportant: 'High efficiency indicates optimal operator-equipment-zone matching. This performance level sets the benchmark for training other operators.',
      contributors: [
        { label: 'Route Efficiency', weight: 35, direction: 'up', detail: 'Minimal dead travel', onClick: () => {} },
        { label: 'Equipment Uptime', weight: 25, direction: 'up', detail: 'FL-01 at 97% availability', onClick: () => {} },
        { label: 'Task Batching', weight: 25, direction: 'up', detail: 'Optimal pickup sequences', onClick: () => {} },
        { label: 'Idle Minimization', weight: 15, direction: 'up', detail: 'Quick task transitions', onClick: () => {} }
      ],
      calculation: {
        formula: 'Efficiency = (Productive Time / Available Time) × Quality Factor',
        dataSources: ['Equipment telemetry', 'Task timestamps', 'WMS logs'],
        refreshRate: 'Real-time',
        confidence: 94
      },
      actions: [
        { label: 'View Time Breakdown', onClick: () => {} },
        { label: 'Compare to Fleet', onClick: () => {} }
      ]
    }
  };

  const statusColor = staff.status === 'Active' ? C.success : staff.status === 'On Break' ? C.warning : C.neutral;

  return (
    <>
      {/* Contributing Factors Modal */}
      <ContributingFactorsModal 
        isOpen={contributingFactorsModal.isOpen}
        onClose={() => setContributingFactorsModal({ isOpen: false, title: '', data: null })}
        title={contributingFactorsModal.title}
        data={contributingFactorsModal.data}
      />
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Hero Card - Consolidated with Performance Summary */}
          <Card style={{ borderLeft: `4px solid ${C.purple[500]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: sp.md, marginBottom: sp.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${C.purple[100]} 0%, ${C.purple[200]} 100%)`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `3px solid ${C.purple[500]}`,
                  boxShadow: `0 0 0 4px ${C.purple[100]}`
                }}>
                  <Users style={{ width: 32, height: 32, color: C.purple[600] }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>{staff.name}</h2>
                    <Badge status="success" label={staff.currentShift?.status || 'On Shift'} dot />
                  </div>
                  <p style={{ fontSize: '14px', color: C.neutral[600], margin: 0, marginTop: 2 }}>{staff.role} • {staff.yearsOfService} yrs</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.sm, flexWrap: 'wrap' }}>
                    {staff.currentShift?.equipment && (
                      <span 
                        onClick={() => onNavigateToEquipment && onNavigateToEquipment(staff.currentShift.equipmentId, staff.currentShift.equipment)}
                        style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '12px', padding: '4px 10px', 
                          background: C.brand[50], borderRadius: 16, 
                          color: C.brand[700], cursor: 'pointer',
                          border: `1px solid ${C.brand[200]}`
                        }}
                      >
                        <Truck style={{ width: 12, height: 12 }} />
                        {staff.currentShift.equipment}
                        <ChevronRight style={{ width: 12, height: 12, color: C.brand[400] }} />
                      </span>
                    )}
                    <span 
                      onClick={() => onNavigateToZone && onNavigateToZone(staff.currentShift?.zoneId, staff.currentShift?.zone)}
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: '12px', padding: '4px 10px', 
                        background: C.neutral[100], borderRadius: 16, 
                        color: C.neutral[700], cursor: 'pointer',
                        border: `1px solid ${C.neutral[200]}`
                      }}
                    >
                      <MapPin style={{ width: 12, height: 12 }} />
                      {staff.currentShift?.zone || 'Z01'}
                      <ChevronRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                    </span>
                  </div>
                </div>
              </div>
              {/* Performance Rank with trend */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: C.neutral[500], marginBottom: 2 }}>Performance Rank</p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: '32px', fontWeight: 300, color: C.purple[600] }}>#{staff.performance?.ranking || 2}</span>
                  <span style={{ fontSize: '14px', color: C.neutral[500] }}>/ {staff.performance?.rankingTotal || 28}</span>
                </div>
                {staff.performance?.rankingTrend && (
                  <span style={{ 
                    fontSize: '11px', 
                    color: staff.performance.rankingTrend.startsWith('+') ? C.success[600] : C.error[600],
                    display: 'inline-flex', alignItems: 'center', gap: 2
                  }}>
                    {staff.performance.rankingTrend.startsWith('+') ? <ArrowUpRight style={{ width: 12, height: 12 }} /> : <ArrowDownRight style={{ width: 12, height: 12 }} />}
                    {staff.performance.rankingTrend} this week
                  </span>
                )}
              </div>
            </div>
            
            {/* Divider */}
            <div style={{ borderTop: `1px solid ${C.neutral[200]}`, marginBottom: sp.md }} />
            
            {/* Key Performance Metrics - 3x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.sm }}>
              {[
                { 
                  label: 'Units/Hour', 
                  value: staff.performance?.uph?.current || 52, 
                  pred: staff.performance?.uph?.predicted || 51,
                  target: staff.performance?.uph?.target || 45,
                  getColor: (v, t) => v >= t ? C.success : C.warning
                },
                { 
                  label: 'Efficiency', 
                  value: staff.performance?.efficiency?.current || 94, 
                  pred: staff.performance?.efficiency?.predicted || 93,
                  target: staff.performance?.efficiency?.target || 85,
                  unit: '%',
                  getColor: (v, t) => v >= t ? C.success : C.warning
                },
                { 
                  label: 'Fatigue Score', 
                  value: staff.fatigueScore?.current || 92, 
                  pred: staff.fatigueScore?.predicted || 78,
                  target: staff.fatigueScore?.target || 80,
                  unit: '%',
                  getColor: (v, t) => v >= t ? C.success : v >= t - 10 ? C.warning : C.error,
                  predWarn: (staff.fatigueScore?.predicted || 78) < (staff.fatigueScore?.target || 80)
                },
                { 
                  label: 'Pick Accuracy', 
                  value: staff.performance?.pickAccuracy?.current || 99.4, 
                  pred: staff.performance?.pickAccuracy?.predicted || 99.3,
                  target: staff.performance?.pickAccuracy?.target || 99.0,
                  unit: '%',
                  getColor: (v, t) => v >= t ? C.success : C.warning
                },
                { 
                  label: 'Safety Score', 
                  value: staff.safety?.safetyScore?.current || 98, 
                  pred: staff.safety?.safetyScore?.predicted || 97,
                  target: staff.safety?.safetyScore?.target || 90,
                  unit: '%',
                  getColor: (v, t) => v >= t ? C.success : C.warning
                },
                { 
                  label: 'Attendance', 
                  value: staff.attendance?.rate || 98.6, 
                  unit: '%',
                  getColor: (v) => v >= 95 ? C.success : v >= 90 ? C.warning : C.error
                }
              ].map((m, i) => {
                const color = m.getColor(m.value, m.target);
                const predColor = m.predWarn ? C.warning : C.purple;
                return (
                  <div key={i} style={{ 
                    padding: sp.sm, 
                    background: color[50], 
                    borderRadius: 6, 
                    textAlign: 'center',
                    borderTop: `3px solid ${color[500]}`
                  }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{m.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px', fontWeight: 500, color: color[600] }}>
                        {m.value}{m.unit || ''}
                      </span>
                      {m.pred && (
                        <>
                          <ArrowRight style={{ width: 8, height: 8, color: C.neutral[400] }} />
                          <span style={{ fontSize: '12px', color: predColor[600] }}>{m.pred}{m.unit || ''}</span>
                        </>
                      )}
                    </div>
                    {m.target && <p style={{ fontSize: '9px', color: C.neutral[400] }}>Target: {m.target}{m.unit || ''}</p>}
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Productivity Timeline Chart */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Productivity Timeline</h3>
                  <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                    isOpen: true, 
                    title: 'Productivity', 
                    data: contributingFactorsData.productivity 
                  })} />
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>
                  Tasks completed today • Target: {staff.performance?.tasksCompleted?.target || 70} by {useEOD ? 'EOD' : 'EOS'}
                </p>
              </div>
              {isContextualDifferent && contextualTime !== '10:00' && staff.performance?.tasksCompleted?.timeline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, padding: '4px 10px', background: C.brand[100], borderRadius: 6 }}>
                  <span style={{ fontSize: '12px', color: C.brand[600] }}>
                    @{contextualTime}: <strong>{Math.round(interpolateValue(staff.performance.tasksCompleted.timeline, contextualTime) || 0)}</strong> tasks
                  </span>
                </div>
              )}
            </div>
            
            {/* Chart */}
            <div style={{ position: 'relative', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staff.performance?.tasksCompleted?.timeline || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="taskActualFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.purple[500]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.purple[500]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="taskPredFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.indigo[500]} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={C.indigo[500]} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={30} />
                  {/* Target line */}
                  <Area type="linear" dataKey={() => staff.performance?.tasksCompleted?.target || 70} stroke={C.success[400]} strokeWidth={1} strokeDasharray="4 4" fill="none" />
                  {/* Actual line */}
                  <Area type="linear" dataKey="actual" stroke={C.purple[500]} strokeWidth={2} fill="url(#taskActualFill)" dot={false} connectNulls />
                  {/* Predicted line */}
                  <Area type="linear" dataKey="predicted" stroke={C.indigo[500]} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* NOW marker */}
              {(() => {
                const timeline = staff.performance?.tasksCompleted?.timeline || [];
                if (timeline.length === 0) return null;
                const times = timeline.map(d => {
                  const [h, m] = d.time.split(':').map(Number);
                  return h + (m || 0) / 60;
                });
                const minTime = Math.min(...times);
                const maxTime = Math.max(...times);
                const nowDecimal = 10;
                const nowPosition = ((nowDecimal - minTime) / (maxTime - minTime)) * 100;
                const leftOffset = 30;
                const rightOffset = 10;
                const adjustedPosition = leftOffset + (nowPosition / 100) * (100 - leftOffset - rightOffset) * (100 / (100));
                
                return (
                  <div style={{ 
                    position: 'absolute', 
                    left: `calc(${adjustedPosition}% - ${leftOffset * adjustedPosition / 100}px)`, 
                    top: 10, 
                    bottom: 25, 
                    width: 2, 
                    background: C.neutral[600], 
                    zIndex: 9 
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: -2, 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: C.neutral[700], 
                      color: 'white', 
                      padding: '1px 4px', 
                      borderRadius: 2, 
                      fontSize: 8, 
                      fontWeight: 600 
                    }}>NOW</div>
                  </div>
                );
              })()}
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', gap: sp.md, marginTop: sp.sm, justifyContent: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 3, background: C.purple[500], borderRadius: 2 }} /> Actual
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 3, background: C.indigo[500], borderRadius: 2, opacity: 0.7 }} /> Predicted
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.neutral[600] }}>
                <span style={{ width: 16, height: 2, background: C.success[400], borderRadius: 2 }} /> Target
              </span>
            </div>
          </Card>
          
          {/* Fatigue Score Trend */}
          <Card style={{ background: `linear-gradient(135deg, ${(staff.fatigueScore?.predicted || 78) < (staff.fatigueScore?.target || 80) ? C.warning[50] : C.success[50]} 0%, ${C.neutral[50]} 100%)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Activity style={{ width: 16, height: 16, color: (staff.fatigueScore?.predicted || 78) < (staff.fatigueScore?.target || 80) ? C.warning[600] : C.success[600] }} />
                    Fatigue Score Trend
                  </h3>
                  <ContributingFactorsLink onClick={() => setContributingFactorsModal({ 
                    isOpen: true, 
                    title: 'Fatigue Score', 
                    data: contributingFactorsData.fatigue 
                  })} />
                </div>
                <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>
                  Threshold: {staff.fatigueScore?.target || 80}% • {(staff.fatigueScore?.predicted || 78) < (staff.fatigueScore?.target || 80) ? 'At risk of dropping below threshold' : 'On track'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '24px', fontWeight: 500, color: C.neutral[800] }}>{staff.fatigueScore?.current || 92}%</span>
                  <ArrowRight style={{ width: 12, height: 12, color: C.neutral[400] }} />
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 500, 
                    color: (staff.fatigueScore?.predicted || 78) < (staff.fatigueScore?.target || 80) ? C.warning[600] : C.purple[600] 
                  }}>
                    {staff.fatigueScore?.predicted || 78}%
                  </span>
                </div>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>@{endTimeLabel}</p>
              </div>
            </div>
            
            {/* Chart */}
            <div style={{ position: 'relative', height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staff.fatigueScore?.timeline || []} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="fatigueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.success[500]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.warning[500]} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={30} />
                  {/* Threshold line */}
                  <Area type="linear" dataKey={() => staff.fatigueScore?.target || 80} stroke={C.error[400]} strokeWidth={1} strokeDasharray="4 4" fill="none" />
                  {/* Actual line */}
                  <Area type="linear" dataKey="actual" stroke={C.success[500]} strokeWidth={2} fill="url(#fatigueGradient)" dot={false} connectNulls />
                  {/* Predicted line */}
                  <Area type="linear" dataKey="predicted" stroke={C.warning[500]} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Today's Stats - compact 2-column */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.sm }}>
            {[
              { 
                label: 'Tasks Completed', 
                value: staff.performance?.tasksCompleted?.current || 42,
                pred: staff.performance?.tasksCompleted?.predicted || 78,
                target: staff.performance?.tasksCompleted?.target || 70,
                icon: CheckCircle,
                good: (staff.performance?.tasksCompleted?.predicted || 78) >= (staff.performance?.tasksCompleted?.target || 70)
              },
              { 
                label: 'Hours Worked', 
                value: staff.performance?.hoursWorked?.current || 4.1,
                pred: staff.performance?.hoursWorked?.predicted || 8.0,
                target: staff.performance?.hoursWorked?.target || 8.0,
                icon: Clock,
                good: true
              },
              { 
                label: 'Break Time Left', 
                value: staff.breaks?.remaining?.breakMinutes || 30,
                unit: ' min',
                icon: Coffee,
                good: (staff.breaks?.remaining?.breakMinutes || 30) > 0
              },
              { 
                label: 'Idle Time', 
                value: staff.performance?.idleTime?.current || 6,
                pred: staff.performance?.idleTime?.predicted || 8,
                target: staff.performance?.idleTime?.target || 12,
                unit: '%',
                icon: Minus,
                good: (staff.performance?.idleTime?.current || 6) <= (staff.performance?.idleTime?.target || 12),
                lowerIsBetter: true
              }
            ].map((metric, i) => (
              <Card key={i} style={{ padding: sp.sm, borderLeft: `3px solid ${metric.good ? C.success[500] : C.warning[500]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: 6, 
                    background: metric.good ? C.success[50] : C.warning[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <metric.icon style={{ width: 16, height: 16, color: metric.good ? C.success[600] : C.warning[600] }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0, marginBottom: 2 }}>{metric.label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px', fontWeight: 500, color: C.neutral[800] }}>
                        {metric.value}{metric.unit || ''}
                      </span>
                      {metric.pred && (
                        <>
                          <ArrowRight style={{ width: 10, height: 10, color: C.neutral[400] }} />
                          <span style={{ fontSize: '14px', fontWeight: 500, color: C.purple[600] }}>{metric.pred}{metric.unit || ''}</span>
                        </>
                      )}
                      {metric.target && (
                        <span style={{ fontSize: '10px', color: metric.good ? C.success[600] : C.warning[600] }}>
                          ({metric.good ? '✓' : '!'} {metric.target})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Upcoming Events */}
          {staff.upcomingEvents && staff.upcomingEvents.length > 0 && (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
                <Calendar style={{ width: 16, height: 16, color: C.neutral[500] }} />
                <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Upcoming Events</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {staff.upcomingEvents.map((event, i) => {
                  const iconMap = { coffee: Coffee, users: Users, clipboard: ClipboardList };
                  const EventIcon = iconMap[event.icon] || Clock;
                  const colorMap = { break: C.warning, handoff: C.purple, training: C.brand };
                  const color = colorMap[event.type] || C.neutral;
                  
                  return (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: sp.md,
                      padding: sp.sm, background: C.neutral[50], borderRadius: 6,
                      borderLeft: `3px solid ${color[400]}`
                    }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 6,
                        background: color[100],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <EventIcon style={{ width: 16, height: 16, color: color[600] }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{event.title}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>{event.desc}</p>
                      </div>
                      <div style={{ padding: '4px 8px', background: color[100], borderRadius: 4 }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: color[700] }}>{event.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
          
          {/* Analysis */}
          {staff.predictiveAlerts && staff.predictiveAlerts.length > 0 && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>Analysis</h3>
                  <p style={{ fontSize: '11px', color: C.neutral[500], margin: 0 }}>Issues that may require attention</p>
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: sp.xs,
                  padding: '6px 12px', background: C.purple[50], borderRadius: 6,
                  cursor: 'pointer', border: `1px solid ${C.purple[200]}`
                }}>
                  <Lightbulb style={{ width: 14, height: 14, color: C.purple[600] }} />
                  <span style={{ fontSize: '12px', color: C.purple[700], fontWeight: 500 }}>View Recommendations</span>
                  <ChevronRight style={{ width: 14, height: 14, color: C.purple[500] }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {staff.predictiveAlerts.map((alert, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: sp.sm,
                    background: alert.sev === 'warning' ? C.warning[50] : C.brand[50],
                    borderRadius: 6,
                    borderLeft: `3px solid ${alert.sev === 'warning' ? C.warning[500] : C.brand[500]}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                      <AlertTriangle style={{ width: 16, height: 16, color: alert.sev === 'warning' ? C.warning[600] : C.brand[600] }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{alert.title}</p>
                        <p style={{ fontSize: '11px', color: C.neutral[600], margin: 0 }}>{alert.msg}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: C.neutral[700], margin: 0 }}>{alert.time}</p>
                        <p style={{ fontSize: '10px', color: C.neutral[500], margin: 0 }}>{alert.conf}% confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Quick Info */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Quick Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              <div>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Shift</p>
                <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{staff.shift} ({staff.shiftTime})</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Supervisor</p>
                <p 
                  onClick={() => onNavigateToStaff && onNavigateToStaff(staff.supervisorId, staff.supervisor)}
                  style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: C.purple[600], cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  {staff.supervisor}
                  <ChevronRight style={{ width: 12, height: 12, color: C.purple[400] }} />
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Days Since Incident</p>
                <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: C.success[600] }}>{staff.safety?.daysSinceIncident || 412} days</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>Clocked In</p>
                <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{staff.currentShift?.clockedIn || '5:55 AM'}</p>
              </div>
            </div>
          </Card>
        </>
      )}
      
      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <>
          {/* Performance Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Units/Hour', value: staff.performance?.uph?.current || staff.performance?.uph || 0, sub: `Target: ${staff.performance?.uph?.target || staff.performance?.uphTarget || 45}`, good: true },
              { label: 'Efficiency', value: `${staff.performance?.efficiency?.current || staff.performance?.efficiency || 0}%`, sub: `${staff.performance?.directLaborPct || 89}% direct labor`, good: true },
              { label: 'Idle Time', value: `${staff.performance?.idleTime?.current || staff.performance?.idleTime || 0}%`, sub: 'Today', warn: (staff.performance?.idleTime?.current || staff.performance?.idleTime || 0) > 10 },
              { label: 'Rank', value: `#${staff.performance?.ranking || 1}`, sub: `of ${staff.performance?.rankingTotal || 28}`, good: (staff.performance?.ranking || 1) <= 5 }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Productivity Breakdown */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Productivity Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md }}>
              {[
                { metric: 'Pallets Today', value: staff.performance?.palletsToday?.current || staff.performance?.palletsToday || 86, target: 80, max: 120 },
                { metric: 'Pallets This Week', value: staff.performance?.palletsWeek || 412, target: 400, max: 500 },
                { metric: 'Pallets This Month', value: staff.performance?.palletsMonth || 1847, target: 1800, max: 2200 },
                { metric: 'Avg Cycle Time', value: staff.performance?.avgCycleTime || 1.9, target: 2.5, max: 4, unit: 'min', lower: true }
              ].map((m, i) => {
                const pct = m.lower ? Math.max(0, 100 - ((m.value / m.max) * 100)) : (m.value / m.max) * 100;
                const isGood = m.lower ? m.value <= m.target : m.value >= m.target;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '13px' }}>{m.metric}</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: isGood ? C.success[600] : C.warning[600] }}>
                        {m.value}{m.unit || ''} <span style={{ color: C.neutral[400], fontWeight: 400 }}>/ {m.target}{m.unit || ''}</span>
                      </span>
                    </div>
                    <div style={{ height: 8, background: C.neutral[100], borderRadius: 4, position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', left: `${(m.target / m.max) * 100}%`, top: -2, bottom: -2,
                        width: 2, background: C.neutral[400]
                      }} />
                      <div style={{ 
                        width: `${Math.min(pct, 100)}%`, height: '100%', 
                        background: isGood ? C.success[500] : C.warning[500], borderRadius: 4 
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Performance vs Team */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Performance vs Team Average</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { metric: 'Units Per Hour', yours: staff.performance?.uph?.current || staff.performance?.uph || 52, avg: 42, unit: '' },
                { metric: 'Pick Accuracy', yours: staff.performance?.pickAccuracy?.current || staff.performance?.pickAccuracy || 99.4, avg: 98.5, unit: '%' },
                { metric: 'Efficiency', yours: staff.performance?.efficiency?.current || staff.performance?.efficiency || 94, avg: 88, unit: '%' },
                { metric: 'Idle Time', yours: staff.performance?.idleTime?.current || staff.performance?.idleTime || 6, avg: 12, unit: '%', lower: true }
              ].map((m, i) => {
                const diff = m.yours - m.avg;
                const isBetter = m.lower ? diff < 0 : diff > 0;
                return (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: sp.sm, background: C.neutral[50], borderRadius: 6
                  }}>
                    <span style={{ fontSize: '13px' }}>{m.metric}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{m.yours}{m.unit}</span>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 2,
                        color: isBetter ? C.success[600] : C.warning[600]
                      }}>
                        {isBetter ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />}
                        <span style={{ fontSize: '11px' }}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}{m.unit}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: C.neutral[400] }}>avg: {m.avg}{m.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Weekly Trend */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Weekly UPH Trend</h3>
            <div style={{ display: 'flex', gap: sp.xs, alignItems: 'flex-end', height: 80 }}>
              {[
                { day: 'Mon', value: 45 },
                { day: 'Tue', value: 48 },
                { day: 'Wed', value: 44 },
                { day: 'Thu', value: 52 },
                { day: 'Fri', value: 47 },
                { day: 'Sat', value: 0 },
                { day: 'Sun', value: 0 }
              ].map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '70%', 
                    height: d.value > 0 ? Math.max((d.value / 55) * 60, 4) : 4,
                    background: d.value >= staff.performance.uphTarget ? C.success[500] : d.value > 0 ? C.warning[500] : C.neutral[200],
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '10px', color: C.neutral[500], marginTop: 4 }}>{d.day}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.sm, fontSize: '10px', color: C.neutral[500] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: C.success[500], borderRadius: 2 }} />
                Above target
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: C.warning[500], borderRadius: 2 }} />
                Below target
              </div>
            </div>
          </Card>
        </>
      )}
      
      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <>
          {/* Equipment Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Certified On', value: staff.certifiedEquipment.length, sub: 'Equipment types' },
              { label: 'Total Hours', value: '2,225', sub: 'All equipment' },
              { label: 'Primary', value: 'FL-01', sub: 'Most used' },
              { label: 'Last Eval', value: '8mo', sub: 'Since evaluation' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500 }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Certified Equipment List */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Certified Equipment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {staff.certifiedEquipment.map((eq, i) => (
                <div 
                  key={i}
                  onClick={() => onNavigateToEquipment && onNavigateToEquipment(eq.id, eq.id.toUpperCase())}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: sp.md, background: C.neutral[50], borderRadius: 8,
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.neutral[50];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 8, 
                      background: C.brand[50], 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Truck style={{ width: 20, height: 20, color: C.brand[600] }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{eq.type}</p>
                      <p style={{ fontSize: '12px', color: C.neutral[500] }}>{eq.id.toUpperCase()} • {eq.hours} hrs</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>Cert expires</p>
                      <p style={{ fontSize: '12px', fontWeight: 500 }}>{eq.expiry}</p>
                    </div>
                    <Badge status={eq.status === 'Active' ? 'success' : 'warning'} label={eq.status} />
                    <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Hours by Equipment Type */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Hours by Equipment Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { type: 'Sit-Down Forklift', hours: 1620, pct: 73, color: C.brand[500] },
                { type: 'Reach Truck', hours: 520, pct: 23, color: C.purple[500] },
                { type: 'Order Picker', hours: 85, pct: 4, color: C.warning[500] }
              ].map((eq, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '12px' }}>{eq.type}</span>
                    <span style={{ fontSize: '12px', color: C.neutral[600] }}>{eq.hours} hrs ({eq.pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: C.neutral[100], borderRadius: 3 }}>
                    <div style={{ width: `${eq.pct}%`, height: '100%', background: eq.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <>
          {/* Schedule Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Current Shift', value: staff.shift || 'Day Shift', sub: staff.shiftTime || '6:00 AM - 2:00 PM' },
              { label: 'Hours This Week', value: staff.schedule?.weeklyHours?.current || '20.3', sub: `of ${staff.schedule?.weeklyHours?.target || 40} scheduled` },
              { label: 'Overtime', value: `${staff.schedule?.overtimeHours || 0.2}`, unit: 'hrs', sub: `Limit: ${staff.schedule?.overtimeLimit || 10}`, warn: (staff.schedule?.overtimeHours || 0) > (staff.schedule?.overtimeLimit || 10) * 0.8 },
              { label: 'PTO Balance', value: staff.attendance?.ptoBalance || 14, sub: 'days available' }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: s.warn ? C.warning[600] : C.neutral[800] }}>
                  {s.value}{s.unit && <span style={{ fontSize: '12px', color: C.neutral[500] }}>{s.unit}</span>}
                </p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Weekly Schedule */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>This Week</h3>
            <div style={{ display: 'flex', gap: sp.xs }}>
              {(staff.schedule?.currentWeek || [
                { day: 'Mon', date: 'Dec 16', shift: 'Day', time: '6AM-2PM', status: 'worked', hours: 8.2 },
                { day: 'Tue', date: 'Dec 17', shift: 'Day', time: '6AM-2PM', status: 'worked', hours: 8.0 },
                { day: 'Wed', date: 'Dec 18', shift: 'Day', time: '6AM-2PM', status: 'current', hours: 4.1 },
                { day: 'Thu', date: 'Dec 19', shift: 'Day', time: '6AM-2PM', status: 'scheduled' },
                { day: 'Fri', date: 'Dec 20', shift: 'Day', time: '6AM-2PM', status: 'scheduled' },
                { day: 'Sat', date: 'Dec 21', shift: 'Off', time: '-', status: 'off' },
                { day: 'Sun', date: 'Dec 22', shift: 'Off', time: '-', status: 'off' }
              ]).map((day, i) => (
                <div key={i} style={{ 
                  flex: 1, padding: sp.sm, 
                  background: day.status === 'current' ? C.brand[50] : day.status === 'off' ? C.neutral[50] : 'white',
                  border: `1px solid ${day.status === 'current' ? C.brand[300] : C.neutral[200]}`,
                  borderRadius: 8,
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: day.status === 'current' ? C.brand[600] : C.neutral[600] }}>{day.day}</p>
                  <p style={{ fontSize: '10px', color: C.neutral[500] }}>{day.date}</p>
                  <div style={{ marginTop: sp.sm }}>
                    {day.status !== 'off' ? (
                      <>
                        <p style={{ fontSize: '12px', fontWeight: 500 }}>{day.shift}</p>
                        <p style={{ fontSize: '10px', color: C.neutral[500] }}>{day.time}</p>
                      </>
                    ) : (
                      <p style={{ fontSize: '12px', color: C.neutral[400] }}>Off</p>
                    )}
                  </div>
                  {day.status === 'current' && (
                    <Badge status="info" label="Today" style={{ marginTop: sp.xs }} />
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          {/* Upcoming Time Off */}
          {staff.schedule?.upcomingTimeOff && (
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Upcoming Time Off</h3>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: sp.md,
                padding: sp.md, background: C.success[50], borderRadius: 8,
                borderLeft: `3px solid ${C.success[500]}`
              }}>
                <Calendar style={{ width: 24, height: 24, color: C.success[600] }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{staff.schedule.upcomingTimeOff.type}</p>
                  <p style={{ fontSize: '12px', color: C.neutral[600] }}>
                    {staff.schedule.upcomingTimeOff.start} — {staff.schedule.upcomingTimeOff.end}
                  </p>
                </div>
                <Badge status="success" label="Approved" />
              </div>
            </Card>
          )}
          
          {/* Shift Preferences */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Availability & Preferences</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Preferred Shift</p>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>Day Shift (6AM - 2PM)</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Overtime Preference</p>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>Available when needed</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Weekend Availability</p>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>Every other Saturday</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Zone Preference</p>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>Bulk Storage, Inbound</p>
              </div>
            </div>
          </Card>
        </>
      )}
      
      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <>
          {/* Cert Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Active Certs', value: (staff.certifications || []).filter(c => c.status === 'active').length, sub: 'Current', good: true },
              { label: 'Expiring Soon', value: (staff.certifications || []).filter(c => c.status === 'expiring').length, sub: 'Next 60 days', warn: (staff.certifications || []).filter(c => c.status === 'expiring').length > 0 },
              { label: 'Trainings', value: (staff.trainingHistory || []).length, sub: 'Completed' },
              { label: 'Avg Score', value: '94%', sub: 'Training scores', good: true }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Active Certifications */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Certifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {(staff.certifications || []).map((cert, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.md,
                  background: cert.status === 'expiring' ? C.warning[50] : C.neutral[50],
                  borderRadius: 8,
                  borderLeft: `4px solid ${cert.status === 'expiring' ? C.warning[500] : C.success[500]}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 8, 
                      background: cert.status === 'expiring' ? C.warning[100] : C.success[100], 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <ClipboardList style={{ width: 20, height: 20, color: cert.status === 'expiring' ? C.warning[600] : C.success[600] }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{cert.name}</p>
                      <p style={{ fontSize: '12px', color: C.neutral[500] }}>Issued by {cert.issuer} • {cert.issued}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: C.neutral[500] }}>Expires</p>
                      <p style={{ fontSize: '12px', fontWeight: 500, color: cert.status === 'expiring' ? C.warning[600] : C.neutral[700] }}>{cert.expiry}</p>
                    </div>
                    <Badge status={cert.status === 'expiring' ? 'warning' : 'success'} label={cert.status === 'expiring' ? 'Expiring' : 'Active'} />
                  </div>
                </div>
              ))}
              {(!staff.certifications || staff.certifications.length === 0) && (
                <p style={{ fontSize: '13px', color: C.neutral[500], textAlign: 'center', padding: sp.md }}>No certifications on file</p>
              )}
            </div>
          </Card>
          
          {/* Training History */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Training History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
              {(staff.trainingHistory || []).map((t, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{t.course}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{t.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: t.score >= 90 ? C.success[600] : C.warning[600] }}>{t.score}%</span>
                    <Badge status={t.status === 'passed' ? 'success' : 'error'} label={t.status} />
                  </div>
                </div>
              ))}
              {(!staff.trainingHistory || staff.trainingHistory.length === 0) && (
                <p style={{ fontSize: '13px', color: C.neutral[500], textAlign: 'center', padding: sp.md }}>No training history on file</p>
              )}
            </div>
          </Card>
        </>
      )}
      
      {/* Safety Tab */}
      {activeTab === 'safety' && (
        <>
          {/* Safety Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Days Safe', value: staff.safety?.daysSinceIncident || 412, sub: 'Since last incident', good: true },
              { label: 'Safety Score', value: `${staff.safety?.safetyScore?.current || staff.safety?.safetyScore || 98}%`, sub: 'Composite score', good: (staff.safety?.safetyScore?.current || staff.safety?.safetyScore || 98) >= 90 },
              { label: 'Near-Miss Reports', value: staff.safety?.nearMissReports || 3, sub: 'Submitted', good: true },
              { label: 'Total Incidents', value: staff.safety?.totalIncidents || 0, sub: 'All time', warn: (staff.safety?.totalIncidents || 0) > 0 }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Safety Streak */}
          <Card style={{ background: C.success[50], borderLeft: `4px solid ${C.success[500]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: '50%', 
                background: C.success[100], 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `3px solid ${C.success[500]}`
              }}>
                <CheckCircle style={{ width: 32, height: 32, color: C.success[600] }} />
              </div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: 300, color: C.success[700] }}>{staff.safety?.daysSinceIncident || 412} Days</p>
                <p style={{ fontSize: '14px', color: C.success[600] }}>Without a recordable incident</p>
                {staff.safety?.streak && <p style={{ fontSize: '12px', color: C.success[500], marginTop: 4 }}>{staff.safety.streak}</p>}
              </div>
            </div>
          </Card>
          
          {/* Safety Contributions */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Safety Contributions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm }}>
                  <AlertTriangle style={{ width: 20, height: 20, color: C.warning[500] }} />
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Near-Miss Reports</p>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>{staff.safety?.nearMissReports || 3}</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Proactive hazard identification</p>
              </div>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.sm }}>
                  <Eye style={{ width: 20, height: 20, color: C.brand[500] }} />
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Safety Observations</p>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>{staff.safety?.safetyObservations || 18}</p>
                <p style={{ fontSize: '11px', color: C.neutral[500] }}>Positive behaviors noted</p>
              </div>
            </div>
          </Card>
          
          {/* Incident History */}
          {staff.safety?.lastIncident && (
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Incident History</h3>
              <div style={{ 
                padding: sp.md, background: C.neutral[50], borderRadius: 8,
                borderLeft: `4px solid ${C.warning[500]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{staff.safety.lastIncident.type}</p>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>{staff.safety.lastIncident.date}</p>
                  </div>
                  <Badge status="neutral" label="Resolved" />
                </div>
                <p style={{ fontSize: '13px', color: C.neutral[600], marginTop: sp.sm }}>{staff.safety.lastIncident.description}</p>
                <p style={{ fontSize: '12px', color: C.success[600], marginTop: sp.xs }}>Resolution: {staff.safety.lastIncident.resolution}</p>
              </div>
            </Card>
          )}
        </>
      )}
      
      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <>
          {/* Attendance Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Attendance Rate', value: `${staff.attendance?.rate || 98.6}%`, sub: 'This year', good: (staff.attendance?.rate || 98.6) >= 95 },
              { label: 'Punctuality', value: `${staff.attendance?.punctuality || 99.2}%`, sub: 'On-time arrivals', good: (staff.attendance?.punctuality || 99.2) >= 95 },
              { label: 'Late Arrivals', value: staff.attendance?.lateArrivals || 2, sub: 'This year', warn: (staff.attendance?.lateArrivals || 2) > 5 },
              { label: 'Unplanned Absences', value: staff.attendance?.unplannedAbsences || 1, sub: 'This year', warn: (staff.attendance?.unplannedAbsences || 1) > 3 }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: s.warn ? C.warning[600] : s.good ? C.success[600] : C.neutral[800] }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* Leave Balances */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Leave Balances</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: sp.md }}>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300, color: C.brand[600] }}>{staff.attendance?.ptoBalance || 14}</p>
                <p style={{ fontSize: '12px', color: C.neutral[500] }}>PTO Available</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{staff.attendance?.ptoUsed || 6} used this year</p>
              </div>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>{staff.attendance?.sickDaysUsed || 2}</p>
                <p style={{ fontSize: '12px', color: C.neutral[500] }}>Sick Days Used</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>This year</p>
              </div>
              <div style={{ padding: sp.md, background: C.neutral[50], borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: 300 }}>{staff.attendance?.daysWorked || 217}</p>
                <p style={{ fontSize: '12px', color: C.neutral[500] }}>Days Worked</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>of {staff.attendance?.scheduledDays || 220} scheduled</p>
              </div>
            </div>
          </Card>
          
          {/* Attendance Trend */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Monthly Attendance</h3>
            <div style={{ display: 'flex', gap: sp.xs, alignItems: 'flex-end', height: 80 }}>
              {[
                { month: 'Jul', rate: 100 },
                { month: 'Aug', rate: 95 },
                { month: 'Sep', rate: 100 },
                { month: 'Oct', rate: 98 },
                { month: 'Nov', rate: 95 },
                { month: 'Dec', rate: 100 }
              ].map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '70%', 
                    height: Math.max((m.rate / 100) * 60, 4),
                    background: m.rate >= 98 ? C.success[500] : m.rate >= 95 ? C.warning[500] : C.error[500],
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '10px', color: C.neutral[500], marginTop: 4 }}>{m.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* History Tab */}
      {activeTab === 'history' && (
        <>
          {/* Today's Activity */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Today's Activity</h3>
            <div style={{ position: 'relative', paddingLeft: sp.lg }}>
              <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, background: C.neutral[200] }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {(staff.activityHistory || [
                  { time: '10:15 AM', action: 'Completed putaway', details: 'Bulk Storage, Row 12', type: 'work' },
                  { time: '10:02 AM', action: 'Picked up load', details: 'Dock 2, 3 pallets', type: 'work' },
                  { time: '09:45 AM', action: 'Completed putaway', details: 'Bulk Storage, Row 8', type: 'work' },
                  { time: '08:45 AM', action: 'Break ended', details: '15 min break', type: 'break' },
                  { time: '08:30 AM', action: 'Break started', details: 'Scheduled break', type: 'break' },
                  { time: '08:15 AM', action: 'Completed putaway', details: 'Bulk Storage, Row 4', type: 'work' },
                  { time: '07:30 AM', action: 'Zone assignment', details: 'Assigned to Z04 - Bulk Storage', type: 'location' },
                  { time: '05:55 AM', action: 'Clocked in', details: 'On time', type: 'clock' }
                ]).map((activity, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm, position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: -20,
                      width: 12, height: 12, borderRadius: '50%', 
                      background: activity.type === 'work' ? C.success[500] : activity.type === 'clock' ? C.brand[500] : activity.type === 'break' ? C.warning[500] : C.neutral[400],
                      border: '2px solid white', zIndex: 1
                    }} />
                    <div style={{ 
                      flex: 1, padding: sp.sm, 
                      background: i === 0 ? C.brand[50] : C.neutral[50], 
                      borderRadius: 6 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500 }}>{activity.action}</p>
                        <span style={{ fontSize: '11px', color: C.neutral[500] }}>{activity.time}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: C.neutral[500] }}>{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Career History */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Career History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { date: 'Mar 2021', event: 'Hired', role: 'Warehouse Associate', details: 'Started in receiving department' },
                { date: 'Sep 2021', event: 'Certification', role: 'Forklift Operator', details: 'Completed OSHA forklift training' },
                { date: 'Jan 2022', event: 'Promotion', role: 'Forklift Operator I', details: 'Moved to primary operator role' },
                { date: 'Jun 2023', event: 'Certification', role: 'Reach Truck', details: 'Added reach truck certification' },
                { date: 'Jan 2024', event: 'Recognition', role: 'Safety Award', details: 'Q4 2023 Safety Champion' }
              ].map((h, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: sp.md,
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <span style={{ fontSize: '11px', color: C.neutral[500], minWidth: 60 }}>{h.date}</span>
                  <Badge status={h.event === 'Promotion' ? 'success' : h.event === 'Recognition' ? 'info' : 'neutral'} label={h.event} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{h.role}</p>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{h.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Performance Trend */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>6-Month Performance Trend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { metric: 'UPH Average', values: [42, 44, 45, 46, 47, 47], trend: 'up' },
                { metric: 'Accuracy', values: [98.5, 98.8, 99.0, 99.1, 99.2, 99.2], trend: 'up', unit: '%' },
                { metric: 'Safety Score', values: [90, 92, 93, 94, 94, 94], trend: 'stable', unit: '%' }
              ].map((m, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <span style={{ fontSize: '13px', minWidth: 100 }}>{m.metric}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {m.values.map((v, j) => (
                      <div key={j} style={{ 
                        width: 24, height: 24, borderRadius: 4,
                        background: j === m.values.length - 1 ? C.brand[500] : C.neutral[200],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '8px', color: j === m.values.length - 1 ? 'white' : C.neutral[600]
                      }}>
                        {v}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: m.trend === 'up' ? C.success[600] : C.neutral[500] }}>
                    {m.trend === 'up' && <TrendingUp style={{ width: 14, height: 14 }} />}
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{m.values[m.values.length - 1]}{m.unit || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <>
          {/* Insights Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
            {[
              { label: 'Performance Trend', value: 'Rising', sub: 'Last 90 days', good: true },
              { label: 'Anomalies', value: 1, sub: 'Detected this month' },
              { label: 'Recommendations', value: 3, sub: 'Available' },
              { label: 'Potential', value: 'High', sub: 'Growth indicator', good: true }
            ].map((s, i) => (
              <Card key={i}>
                <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: s.good ? C.success[600] : C.neutral[800] }}>{s.value}</p>
                <p style={{ fontSize: '10px', color: C.neutral[400] }}>{s.sub}</p>
              </Card>
            ))}
          </div>
          
          {/* AI Recommendations */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
              <Lightbulb style={{ width: 18, height: 18, color: C.warning[500] }} />
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>AI Recommendations</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { 
                  title: 'Cross-train on Reach Truck',
                  desc: 'Strong forklift performance suggests quick adaptation. Would increase scheduling flexibility by 23%.',
                  impact: 'High',
                  type: 'development'
                },
                { 
                  title: 'Candidate for Lead Role',
                  desc: 'Top 15% performer with strong safety record. Consider for team lead when position opens.',
                  impact: 'Medium',
                  type: 'career'
                },
                { 
                  title: 'Optimal Zone Assignment',
                  desc: 'Performance data suggests highest productivity in Bulk Storage. Consider primary assignment.',
                  impact: 'Medium',
                  type: 'assignment'
                }
              ].map((rec, i) => (
                <div key={i} style={{ 
                  padding: sp.md, background: C.neutral[50], borderRadius: 8,
                  borderLeft: `4px solid ${rec.impact === 'High' ? C.success[500] : C.brand[500]}`,
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.neutral[50];
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{rec.title}</p>
                    <Badge status={rec.impact === 'High' ? 'success' : 'info'} label={`${rec.impact} Impact`} />
                  </div>
                  <p style={{ fontSize: '12px', color: C.neutral[600] }}>{rec.desc}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Performance Anomalies */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Detected Patterns</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              <div style={{ 
                padding: sp.md, background: C.warning[50], borderRadius: 8,
                borderLeft: `4px solid ${C.warning[500]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Monday productivity dip</p>
                  <span style={{ fontSize: '11px', color: C.neutral[500] }}>Pattern detected</span>
                </div>
                <p style={{ fontSize: '12px', color: C.neutral[600], marginBottom: sp.sm }}>
                  UPH averages 12% lower on Mondays compared to other days. Consider adjusted scheduling or warm-up tasks.
                </p>
                <div style={{ 
                  padding: sp.sm, background: 'white', borderRadius: 6,
                  display: 'flex', alignItems: 'center', gap: sp.sm
                }}>
                  <Lightbulb style={{ width: 14, height: 14, color: C.warning[500] }} />
                  <span style={{ fontSize: '11px', color: C.neutral[700] }}>Suggestion: Start with simpler tasks on Monday mornings</span>
                </div>
              </div>
              
              <div style={{ 
                padding: sp.md, background: C.success[50], borderRadius: 8,
                borderLeft: `4px solid ${C.success[500]}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Peak performance hours identified</p>
                  <span style={{ fontSize: '11px', color: C.neutral[500] }}>Positive pattern</span>
                </div>
                <p style={{ fontSize: '12px', color: C.neutral[600] }}>
                  Highest productivity between 8-11 AM. Consider assigning priority tasks during this window.
                </p>
              </div>
            </div>
          </Card>
          
          {/* What-If Scenarios */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>What-If Scenarios</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { scenario: 'Assign to Bulk Storage full-time', impact: '+8% productivity', direction: 'up' },
                { scenario: 'Add reach truck to certifications', impact: '+15% flexibility', direction: 'up' },
                { scenario: 'Move to swing shift', impact: '-5% productivity', direction: 'down' }
              ].map((s, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <span style={{ fontSize: '13px' }}>{s.scenario}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, color: s.direction === 'up' ? C.success[600] : C.warning[600] }}>
                    {s.direction === 'up' ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />}
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{s.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      
      {/* Config Tab */}
      {activeTab === 'config' && (
        <>
          {/* Employee Information */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Employee Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              {[
                { label: 'Employee ID', value: staff.id },
                { label: 'Full Name', value: staff.name },
                { label: 'Role', value: staff.role },
                { label: 'Department', value: staff.department },
                { label: 'Hire Date', value: staff.hireDate },
                { label: 'Status', value: staff.status },
                { label: 'Phone', value: staff.phone },
                { label: 'Email', value: staff.email }
              ].map((field, i) => (
                <div key={i} style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                  <p style={{ fontSize: '10px', color: C.neutral[500], marginBottom: 2 }}>{field.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{field.value}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Reporting Structure */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Reporting Structure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              <div 
                onClick={() => onNavigateToStaff && onNavigateToStaff(staff.supervisorId, staff.supervisor)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.md, background: C.neutral[50], borderRadius: 8,
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.neutral[50];
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: C.purple[100], 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <Users style={{ width: 20, height: 20, color: C.purple[600] }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{staff.supervisor}</p>
                    <p style={{ fontSize: '12px', color: C.neutral[500] }}>Direct Supervisor</p>
                  </div>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
              </div>
            </div>
          </Card>
          
          {/* Work Preferences */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Work Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { label: 'Preferred Shift', value: 'Day Shift (6AM - 2PM)', editable: true },
                { label: 'Overtime Availability', value: 'Available when needed', editable: true },
                { label: 'Weekend Availability', value: 'Every other Saturday', editable: true },
                { label: 'Zone Preferences', value: 'Bulk Storage, Inbound Docks', editable: true },
                { label: 'Equipment Preferences', value: 'Sit-Down Forklift', editable: true }
              ].map((pref, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <div>
                    <p style={{ fontSize: '11px', color: C.neutral[500] }}>{pref.label}</p>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{pref.value}</p>
                  </div>
                  {pref.editable && (
                    <Settings style={{ width: 14, height: 14, color: C.neutral[400], cursor: 'pointer' }} />
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>Notification Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {[
                { label: 'Schedule Changes', enabled: true },
                { label: 'Certification Reminders', enabled: true },
                { label: 'Performance Alerts', enabled: true },
                { label: 'Safety Notifications', enabled: true },
                { label: 'Training Assignments', enabled: false }
              ].map((notif, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: sp.sm, background: C.neutral[50], borderRadius: 6
                }}>
                  <span style={{ fontSize: '13px' }}>{notif.label}</span>
                  <div style={{ 
                    width: 40, height: 22, borderRadius: 11,
                    background: notif.enabled ? C.success[500] : C.neutral[300],
                    padding: 2, cursor: 'pointer', transition: 'background 0.2s'
                  }}>
                    <div style={{ 
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      transform: notif.enabled ? 'translateX(18px)' : 'translateX(0)',
                      transition: 'transform 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* System Info */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: sp.md }}>System Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: sp.md }}>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>Last Login</p>
                <p style={{ fontSize: '12px' }}>Today, 5:55 AM</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>Badge ID</p>
                <p style={{ fontSize: '12px' }}>WH-2024-1247</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>Access Level</p>
                <p style={{ fontSize: '12px' }}>Standard Operator</p>
              </div>
              <div style={{ padding: sp.sm, background: C.neutral[50], borderRadius: 6 }}>
                <p style={{ fontSize: '10px', color: C.neutral[500] }}>Profile Updated</p>
                <p style={{ fontSize: '12px' }}>Dec 10, 2024</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default StaffDetailContent;
