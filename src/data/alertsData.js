// ===== SHARED ALERTS DATA =====
// Central source of truth for all predictive alerts across the application

export const ALERTS_DATA = {
  // Schedule > Staffing alerts
  'staffing-shift-coverage': {
    id: 'staffing-shift-coverage',
    sev: 'warning',
    title: 'Shift Coverage Gap — Day Shift',
    msg: '42/48 FTE on floor. 4 call-outs not yet backfilled. Consider pulling 2 from Reserve Pool.',
    time: 'Now',
    conf: 85,
    category: 'schedules'
  },
  'staffing-ups-cutoff': {
    id: 'staffing-ups-cutoff',
    sev: 'critical',
    title: 'UPS Cutoff at Risk — 15:30',
    msg: '~40 orders may miss 15:30 cutoff based on current velocity. Reassign 2 FTE to Pack Station 1.',
    time: '5.5hr out',
    conf: 72,
    category: 'schedules'
  },
  'staffing-break-coverage': {
    id: 'staffing-break-coverage',
    sev: 'warning',
    title: 'Lunch Break Coverage — 12:00',
    msg: '20 FTE scheduled for lunch may drop coverage below minimum. Stagger breaks by 15 min.',
    time: '2hr out',
    conf: 78,
    category: 'schedules'
  },
  'staffing-swing-callout': {
    id: 'staffing-swing-callout',
    sev: 'info',
    title: 'Swing Shift Pre-Alert',
    msg: '2 call-outs already reported for swing. Backup staff notified.',
    time: '4hr out',
    conf: 90,
    category: 'schedules'
  },

  // Schedule > Inbound alerts
  'inbound-dock-congestion': {
    id: 'inbound-dock-congestion',
    sev: 'warning',
    title: 'Dock Congestion Risk — 11:30',
    msg: 'T-1855 scheduled for Dock 2 while T-1847 may still be unloading at Dock 1. Consider reassigning to Dock 4.',
    time: '1.5hr out',
    conf: 82,
    category: 'schedules'
  },
  'inbound-crew-gap': {
    id: 'inbound-crew-gap',
    sev: 'warning',
    title: 'Receiving Crew Gap — 10:30-11:00',
    msg: '2 FTE waiting at Dock 3 for delayed T-1852. Reassign to assist Dock 1 unload.',
    time: 'Now',
    conf: 94,
    category: 'schedules'
  },
  'inbound-afternoon-light': {
    id: 'inbound-afternoon-light',
    sev: 'info',
    title: 'Afternoon Volume Lighter',
    msg: 'Only 3 trucks scheduled after 13:00. Good window for cycle counts or zone cleanup.',
    time: '3hr out',
    conf: 88,
    category: 'schedules'
  },

  // Schedule > Outbound alerts
  'outbound-ups-cutoff': {
    id: 'outbound-ups-cutoff',
    sev: 'warning',
    title: 'UPS Cutoff at Risk — 15:30',
    msg: 'Current velocity 127/hr vs 135/hr needed. Reassign 2 FTE from Pack Station 2 to boost throughput.',
    time: '5.5hr out',
    conf: 78,
    category: 'schedules'
  },
  'outbound-fedex-staging': {
    id: 'outbound-fedex-staging',
    sev: 'warning',
    title: 'FedEx Express Staging Delay',
    msg: '3 loads not yet picked. Start staging by 15:30 to meet 17:00 cutoff.',
    time: '3hr out',
    conf: 85,
    category: 'schedules'
  },
  'outbound-fedex-ground-ok': {
    id: 'outbound-fedex-ground-ok',
    sev: 'success',
    title: 'FedEx Ground On Track',
    msg: 'Both loads at D7 and D11 will complete by 13:45. 70-order buffer projected.',
    time: '4hr out',
    conf: 94,
    category: 'schedules'
  },

  // Schedule > Maintenance alerts
  'maint-fl02-pm-peak': {
    id: 'maint-fl02-pm-peak',
    sev: 'warning',
    title: 'FL-02 PM During Peak — 14:00',
    msg: 'Scheduled PM overlaps with swing shift start. Consider rescheduling to 13:00 or 16:00 to minimize Inbound A impact.',
    time: '4hr out',
    conf: 72,
    category: 'schedules'
  },
  'maint-epj03-return': {
    id: 'maint-epj03-return',
    sev: 'info',
    title: 'EPJ-03 Return to Service — 11:30',
    msg: 'Hydraulic repair 70% complete. Unit should be available for afternoon putaway surge.',
    time: '1.5hr out',
    conf: 88,
    category: 'schedules'
  },
  'maint-fleet-health': {
    id: 'maint-fleet-health',
    sev: 'success',
    title: 'Fleet Health Good',
    msg: '23 of 24 units operational. No overdue PMs. Conveyor inspection on track.',
    time: 'Now',
    conf: 95,
    category: 'schedules'
  },

  // Dashboard alerts (references same as staffing-ups-cutoff for consistency)
  'dashboard-ups-cutoff': {
    id: 'dashboard-ups-cutoff',
    sev: 'critical',
    title: 'UPS cutoff at risk',
    msg: '~40 orders may miss 15:30 cutoff based on current velocity',
    time: '+5.5hr',
    conf: 72,
    category: 'schedules'
  },

  // ===== STAFF TAB ALERTS =====
  'staff-break-coverage': {
    id: 'staff-break-coverage',
    sev: 'critical',
    title: 'Break Coverage Gap — 12:00',
    msg: '38 FTE predicted vs 48 required. Stagger breaks or authorize 2 overtime extensions.',
    time: '2hr out',
    conf: 87,
    category: 'staffing'
  },
  'staff-swing-understaffed': {
    id: 'staff-swing-understaffed',
    sev: 'warning',
    title: 'Swing understaffed',
    msg: '4 FTE gap vs volume for 14:00-22:00 shift.',
    time: '4hr out',
    conf: 88,
    category: 'staffing'
  },
  'staff-receiving-uplh': {
    id: 'staff-receiving-uplh',
    sev: 'warning',
    title: 'Receiving UPLH Declining',
    msg: 'Productivity trending to 90 UPLH by 14:00 (target: 95). Consider rebalancing.',
    time: '4hr out',
    conf: 72,
    category: 'staffing'
  },
  'staff-handoff-optimal': {
    id: 'staff-handoff-optimal',
    sev: 'info',
    title: 'Swing Shift Handoff Optimal',
    msg: 'Clean handoff predicted at 14:00 with no carryover labor gaps.',
    time: '4hr out',
    conf: 91,
    category: 'staffing'
  },

  // ===== ZONES TAB ALERTS =====
  'zones-z04-capacity': {
    id: 'zones-z04-capacity',
    sev: 'critical',
    title: 'Z04 Capacity Critical — 91% by 12:00',
    msg: 'Bulk Storage trending to breach. Expedite 40 pallets to Reserve or activate overflow zone.',
    time: '2hr out',
    conf: 89,
    category: 'zones'
  },
  'zones-z02-underutilized': {
    id: 'zones-z02-underutilized',
    sev: 'warning',
    title: 'Z02 Underutilized — 45%',
    msg: 'Reserve 1 has capacity for 120 additional pallets. Consider redirecting inbound.',
    time: 'Now',
    conf: 94,
    category: 'zones'
  },
  'zones-z01-pick-congestion': {
    id: 'zones-z01-pick-congestion',
    sev: 'warning',
    title: 'Z01 Pick Congestion Risk',
    msg: '3 pickers competing in Aisle A4-A6. Suggest wave staggering.',
    time: '30min out',
    conf: 76,
    category: 'zones'
  },
  'zones-z03-replen-needed': {
    id: 'zones-z03-replen-needed',
    sev: 'info',
    title: 'Z03 Replenishment Needed',
    msg: '12 pick locations below min. Replen task auto-generated.',
    time: 'Now',
    conf: 98,
    category: 'zones'
  },

  // ===== WORK CONTENT TAB ALERTS =====
  'work-ups-velocity': {
    id: 'work-ups-velocity',
    sev: 'critical',
    title: 'UPS Orders Behind — 15:30 Cutoff',
    msg: '~40 orders at risk. Current velocity 127/hr vs 135/hr needed.',
    time: '5.5hr out',
    conf: 78,
    category: 'work'
  },
  'work-pick-queue-growing': {
    id: 'work-pick-queue-growing',
    sev: 'warning',
    title: 'Pick Queue Growing',
    msg: '2,450 orders in queue vs 2,100 target. Add 1 picker to maintain flow.',
    time: 'Now',
    conf: 85,
    category: 'work'
  },
  'work-fedex-express-priority': {
    id: 'work-fedex-express-priority',
    sev: 'warning',
    title: 'FedEx Express Priority',
    msg: '124 priority orders need picking by 15:00 for 17:00 cutoff.',
    time: '5hr out',
    conf: 82,
    category: 'work'
  },
  'work-pack-station-balanced': {
    id: 'work-pack-station-balanced',
    sev: 'success',
    title: 'Pack Stations Balanced',
    msg: 'All 4 stations within 10% of target throughput. No action needed.',
    time: 'Now',
    conf: 96,
    category: 'work'
  },

  // ===== EQUIPMENT ALERTS =====
  'equip-pm-overdue': {
    id: 'equip-pm-overdue',
    sev: 'critical',
    title: 'FL-06 PM overdue',
    msg: '25 hours past scheduled maintenance',
    time: 'Now',
    conf: 95,
    category: 'equipment'
  },
  'equip-tt03-offline': {
    id: 'equip-tt03-offline',
    sev: 'critical',
    title: 'TT-03 offline',
    msg: 'Unit requires major repair - out of service',
    time: 'Now',
    conf: 100,
    category: 'equipment'
  },
  'equip-epj03-repair': {
    id: 'equip-epj03-repair',
    sev: 'warning',
    title: 'EPJ-03 in repair',
    msg: 'Expected return 14:00 today',
    time: '+4hr',
    conf: 85,
    category: 'equipment'
  },
  'equip-battery-low': {
    id: 'equip-battery-low',
    sev: 'warning',
    title: '3 units low battery',
    msg: 'RT-04, EPJ-06 charging; OP-02 at 52%',
    time: 'Now',
    conf: 90,
    category: 'equipment'
  },
  'equip-pm-upcoming': {
    id: 'equip-pm-upcoming',
    sev: 'info',
    title: '4 PMs scheduled this week',
    msg: 'FL-04 today, FL-02 tomorrow, 2 more by Friday',
    time: '+1-5d',
    conf: 100,
    category: 'equipment'
  }
};
