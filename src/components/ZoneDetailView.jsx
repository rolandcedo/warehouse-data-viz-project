/**
 * ZoneDetailView.jsx
 * Comprehensive zone detail panel with 9 tabs
 * Displays zone metrics, staffing, equipment, locations, and insights
 */

import React from 'react';
import {
  MapPin, Users, TrendingUp, TrendingDown, AlertTriangle,
  Package, Truck, Clock, Activity, CheckCircle, LayoutDashboard,
  Wrench, Calendar, Lightbulb, Filter, BoxSelect, ChevronRight,
  ArrowRight, Minus, Grid3X3
} from 'lucide-react';
import { C, sp, typography } from '../styles/designSystem';
import { getRacksByZone } from '../data/warehouseData';
import { DataGrid, Badge, Progress, Alert } from './UI';

// Export zone tab definitions for parent to use
export const getZoneTabs = () => [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'staff', icon: Users, label: 'Staff' },
  { id: 'locations', icon: MapPin, label: 'Locations' },
  { id: 'work', icon: Package, label: 'Work Content' },
  { id: 'spaceUtil', icon: BoxSelect, label: 'Space Util' },
  { id: 'equipment', icon: Wrench, label: 'Equipment' },
  { id: 'schedule', icon: Calendar, label: 'Schedule' },
  { id: 'insights', icon: Lightbulb, label: 'Insights' },
  { id: 'config', icon: Filter, label: 'Config' }
];

const ZoneDetailView = ({ zone, activeTab = 'dashboard', zoneMetrics }) => {
  // Get racks in this zone for LocationsTab
  const racks = getRacksByZone(zone.id);

  // Calculate utilization for DashboardTab
  const totalCapacity = racks.reduce((sum, r) => sum + r.capacity, 0);
  const currentOccupancy = racks.reduce((sum, r) => sum + r.current, 0);
  const utilizationPercent = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

  // No header - parent ContextualSidepanel handles the header
  // Just render tab content directly
  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {activeTab === 'dashboard' && (
        <DashboardTab zone={zone} utilizationPercent={utilizationPercent} zoneMetrics={zoneMetrics} />
      )}
      {activeTab === 'staff' && (
        <StaffTab zone={zone} />
      )}
      {activeTab === 'locations' && (
        <LocationsTab zone={zone} racks={racks} />
      )}
      {activeTab === 'work' && (
        <WorkContentTab zone={zone} />
      )}
      {activeTab === 'spaceUtil' && (
        <SpaceUtilizationTab zone={zone} racks={racks} />
      )}
      {activeTab === 'equipment' && (
        <EquipmentTab zone={zone} />
      )}
      {activeTab === 'schedule' && (
        <PlaceholderTab tabName="Schedule" />
      )}
      {activeTab === 'insights' && (
        <PlaceholderTab tabName="Insights" />
      )}
      {activeTab === 'config' && (
        <PlaceholderTab tabName="Config" />
      )}
    </div>
  );
};

// ===== DASHBOARD TAB =====
const DashboardTab = ({ zone, utilizationPercent, zoneMetrics }) => {
  const alerts = getZoneAlerts(zone.type, utilizationPercent);

  // Get zone-specific KPI metrics with current → contextual → predicted values
  const kpiCards = getKPIMetricsByZone(zone, zoneMetrics, utilizationPercent);

  // Get zone type label for description
  const zoneTypeLabel = getZoneTypeLabel(zone.zoneType);

  return (
    <div>
      {/* ===== GRADIENT HEADER WITH KPI CARDS ===== */}
      <div style={{
        background: `linear-gradient(135deg, ${C.blueLight[500]} 0%, ${C.brand[600]} 100%)`,
        borderRadius: 12,
        padding: sp.lg,
        color: 'white',
        marginBottom: sp.lg,
        margin: sp.lg
      }}>
        {/* Header Row: Zone Info + Space Utilization */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: sp.lg
        }}>
          {/* Left: Zone Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
            {/* Zone Icon */}
            <div style={{
              padding: sp.sm,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 10
            }}>
              <Truck style={{ width: 28, height: 28 }} />
            </div>

            {/* Zone Name & Description */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                <h2 style={{ fontSize: '26px', fontWeight: 300, margin: 0 }}>
                  {zone.id} — {zone.name}
                </h2>
                <Badge status="success" label="Active" />
              </div>
              <p style={{ opacity: 0.8, fontSize: '14px', marginTop: 4, margin: 0 }}>
                {zoneTypeLabel} • {zoneMetrics?.rackCount || 0} Locations
              </p>
            </div>
          </div>

          {/* Right: Space Utilization */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ opacity: 0.7, fontSize: '12px', margin: 0, marginBottom: 4 }}>
              Space Utilization
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: sp.sm,
              justifyContent: 'flex-end'
            }}>
              <span style={{ fontSize: '42px', fontWeight: 300 }}>
                {utilizationPercent}%
              </span>
              <ArrowRight style={{ width: 16, height: 16, opacity: 0.7 }} />
              <span style={{ fontSize: '24px', fontWeight: 500 }}>
                {Math.min(utilizationPercent + 6, 100)}%
              </span>
            </div>
            <p style={{ opacity: 0.7, fontSize: '11px', marginTop: 4, margin: 0 }}>
              @12:15
            </p>
          </div>
        </div>

        {/* KPI Cards Grid - 5 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: sp.md
        }}>
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: sp.md
                }}
              >
                {/* Header: Label + Icon */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: sp.sm
                }}>
                  <span style={{ opacity: 0.8, fontSize: '11px' }}>{kpi.label}</span>
                  <Icon style={{ width: 14, height: 14, opacity: 0.7 }} />
                </div>

                {/* Values: Current → Predicted */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: sp.xs,
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 300 }}>
                    {kpi.current}
                  </span>
                  <ArrowRight style={{ width: 10, height: 10, opacity: 0.6 }} />
                  <span style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    color: kpi.warn ? C.warning[200] : 'inherit'
                  }}>
                    {kpi.predicted}
                  </span>
                </div>

                {/* Target */}
                <p style={{
                  fontSize: '10px',
                  opacity: 0.6,
                  marginTop: 4,
                  margin: 0,
                  marginTop: 4
                }}>
                  Target: {kpi.target}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CONTENT BELOW HEADER ===== */}
      <div style={{ padding: `0 ${sp.lg} ${sp.lg} ${sp.lg}` }}>
        {/* Analysis Card */}
        <AnalysisCard zone={zone} />

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <Section title="Active Alerts" icon={AlertTriangle} color={C.error[500]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {alerts.map((alert, idx) => (
                <AlertCard key={idx} alert={alert} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

// ===== STAFF TAB =====
const StaffTab = ({ zone }) => {
  const staffSummary = getStaffSummary(zone.type);
  const staffRoster = getStaffRoster(zone.type);

  return (
    <div style={{ padding: sp.lg }}>
      {/* Staff Summary */}
      <Section title="Staff Summary" icon={Users} color={C.purple[500]}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: sp.sm }}>
          <SummaryStatCard
            label="Present"
            value={staffSummary.present}
            color={C.success[500]}
            bgColor={C.success[50]}
          />
          <SummaryStatCard
            label="Scheduled"
            value={staffSummary.scheduled}
            color={C.neutral[700]}
            bgColor={C.neutral[100]}
          />
          <SummaryStatCard
            label="Gap"
            value={staffSummary.gap}
            color={staffSummary.gap > 0 ? C.warning[700] : C.success[700]}
            bgColor={staffSummary.gap > 0 ? C.warning[50] : C.success[50]}
          />
          <SummaryStatCard
            label="Productivity"
            value={`${staffSummary.productivity}%`}
            color={C.brand[500]}
            bgColor={C.brand[50]}
          />
        </div>
      </Section>

      {/* Staff Roster */}
      <Section title="Staff Roster" icon={Users} color={C.purple[500]}>
        <StaffDataGrid staffRoster={staffRoster} />
      </Section>
    </div>
  );
};

// ===== LOCATIONS TAB =====
const LocationsTab = ({ zone, racks }) => {
  const totalCapacity = racks.reduce((sum, r) => sum + r.capacity, 0);
  const currentOccupancy = racks.reduce((sum, r) => sum + r.current, 0);
  const utilization = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

  // For receiving zones, show dock doors; for storage, show aisles
  if (zone.type === 'receiving') {
    const dockDoors = getDockDoors(zone.id);

    return (
      <div style={{ padding: sp.lg }}>
        {/* Utilization Summary */}
        <Section title="Zone Utilization" icon={Activity} color={C.brand[500]}>
          <div style={{
            padding: sp.lg,
            background: `linear-gradient(135deg, ${C.brand[500]}15, ${C.brand[600]}25)`,
            borderRadius: 8,
            border: `1px solid ${C.brand[200]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: sp.sm, marginBottom: sp.sm }}>
              <span style={{ ...typography.h2(), color: C.brand[600], margin: 0 }}>
                {utilization}%
              </span>
              <span style={{ ...typography.body(), color: C.neutral[600] }}>
                Space Utilization
              </span>
            </div>
            <div style={{
              height: 8,
              background: C.neutral[200],
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${utilization}%`,
                background: utilization > 85 ? C.warning[500] : C.brand[500],
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </Section>

        {/* Dock Doors */}
        <Section title="Dock Doors" icon={Truck} color={C.blueLight[500]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            {dockDoors.map((door, idx) => (
              <DockDoorCard key={idx} door={door} />
            ))}
          </div>
        </Section>
      </div>
    );
  }

  // Storage zones - show aisles
  const aisles = getAisles(zone.id);

  return (
    <div style={{ padding: sp.lg }}>
      {/* Aisle Structure */}
      <Section title="Aisle Structure" icon={MapPin} color={C.purple[500]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {aisles.map((aisle, idx) => (
            <AisleCard key={idx} aisle={aisle} />
          ))}
        </div>
      </Section>

      {/* Rack Breakdown */}
      <Section title="Rack Locations" icon={Package} color={C.blueLight[500]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
          {racks.map((rack) => (
            <LocationRow key={rack.id} rack={rack} />
          ))}
        </div>
      </Section>
    </div>
  );
};

// ===== PLACEHOLDER TAB =====
const PlaceholderTab = ({ tabName }) => (
  <div style={{
    padding: sp.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300
  }}>
    <div style={{
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: C.neutral[100],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sp.md
    }}>
      <Package style={{ width: 32, height: 32, color: C.neutral[400] }} />
    </div>
    <h3 style={{ ...typography.h3(), margin: 0, marginBottom: sp.sm, color: C.neutral[700] }}>
      {tabName}
    </h3>
    <p style={{ ...typography.body(), color: C.neutral[500], margin: 0, textAlign: 'center' }}>
      Content for this tab coming soon
    </p>
  </div>
);

// ===== REUSABLE COMPONENTS =====

// Section Header Component
const Section = ({ title, icon: Icon, color, children }) => (
  <div style={{ marginBottom: sp.lg }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.md }}>
      <Icon style={{ width: 16, height: 16, color }} />
      <h4 style={{ ...typography.h4(), margin: 0, color: C.neutral[800] }}>
        {title}
      </h4>
    </div>
    {children}
  </div>
);

// Quick Stat Component
const QuickStat = ({ label, value, trend, color }) => (
  <div style={{
    padding: sp.md,
    background: 'white',
    borderRadius: 8,
    border: `1px solid ${C.neutral[200]}`
  }}>
    <div style={{ ...typography.bodySmall(), color: C.neutral[500], marginBottom: sp.xs }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
      <span style={{ ...typography.h4(), color, margin: 0 }}>{value}</span>
      {trend === 'up' && <TrendingUp style={{ width: 16, height: 16, color: C.error[500] }} />}
      {trend === 'down' && <TrendingDown style={{ width: 16, height: 16, color: C.success[500] }} />}
    </div>
  </div>
);

// Alert Card Component
const AlertCard = ({ alert }) => (
  <div style={{
    padding: sp.md,
    background: C.error[50],
    border: `1px solid ${C.error[200]}`,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'start',
    gap: sp.sm
  }}>
    <AlertTriangle style={{ width: 16, height: 16, color: C.error[500], flexShrink: 0, marginTop: 2 }} />
    <div style={{ flex: 1 }}>
      <div style={{ ...typography.bodySmall({ medium: true }), marginBottom: 2 }}>
        {alert.title}
      </div>
      <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
        {alert.description}
      </div>
    </div>
  </div>
);

// Analysis Card Component
const AnalysisCard = ({ zone, onAlertClick }) => {
  const analysisData = getZoneAnalysisAlerts(zone);
  const topAlerts = analysisData.alerts.slice(0, 6);
  const totalAlerts = analysisData.alerts.length;
  const remaining = totalAlerts;

  return (
    <div style={{
      padding: sp.lg,
      background: 'white',
      border: `1px solid ${C.neutral[200]}`,
      borderRadius: 8,
      marginBottom: sp.lg
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: sp.sm,
        marginBottom: sp.lg,
        paddingBottom: sp.md,
        borderBottom: `1px solid ${C.neutral[200]}`
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: C.purple[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
        </div>
        <h3 style={{ ...typography.h3(), margin: 0, color: C.neutral[800] }}>
          Analysis
        </h3>
        <div style={{
          padding: '2px 8px',
          background: C.purple[100],
          borderRadius: 4,
          ...typography.bodySmall({ medium: true }),
          color: C.purple[700]
        }}>
          {totalAlerts}
        </div>
        <ArrowRight style={{ width: 14, height: 14, color: C.neutral[400] }} />
        <div style={{
          ...typography.bodySmall(),
          color: C.neutral[600]
        }}>
          {remaining} remaining
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        ...typography.bodySmall(),
        color: C.neutral[600],
        marginBottom: sp.md
      }}>
        {analysisData.rootCauses} root causes • {analysisData.resolved} resolved, {analysisData.inProgress} in progress, {analysisData.tradeoffs} tradeoffs
      </div>

      {/* Alert List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        marginBottom: sp.md
      }}>
        {topAlerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            sev={alert.sev}
            title={alert.title}
            msg={alert.msg}
            time={alert.time}
            conf={alert.conf}
            onClick={() => {
              // Navigate to zone's Insights tab with this alert
              if (onAlertClick) {
                onAlertClick(alert.id, alert.category);
              } else {
                // Fallback: log to console for now
                console.log('Navigate to alert:', alert.id, alert.category);
              }
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      <button style={{
        width: '100%',
        padding: sp.sm,
        background: 'white',
        border: `1px solid ${C.neutral[300]}`,
        borderRadius: 6,
        ...typography.bodySmall({ medium: true }),
        color: C.neutral[700],
        cursor: 'pointer',
        marginBottom: sp.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sp.xs
      }}>
        View all {totalAlerts} alerts
        <ChevronRight style={{ width: 14, height: 14 }} />
      </button>

      {/* Insights Section */}
      <div style={{
        padding: sp.md,
        background: C.blueLight[50],
        borderRadius: 6,
        border: `1px solid ${C.blueLight[200]}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: sp.sm,
          marginBottom: sp.sm
        }}>
          <Lightbulb style={{ width: 14, height: 14, color: C.blueLight[600] }} />
          <span style={{
            ...typography.bodySmall({ medium: true }),
            color: C.neutral[800]
          }}>
            Insights
          </span>
        </div>
        <div style={{
          ...typography.bodySmall(),
          color: C.neutral[700],
          marginBottom: sp.sm
        }}>
          {analysisData.insight}
        </div>
        <button style={{
          padding: `${sp.xs} ${sp.sm}`,
          background: 'white',
          border: `1px solid ${C.blueLight[300]}`,
          borderRadius: 4,
          ...typography.bodySmall({ medium: true }),
          color: C.blueLight[700],
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: sp.xs
        }}>
          View Full Analysis
          <ChevronRight style={{ width: 12, height: 12 }} />
        </button>
      </div>
    </div>
  );
};

// KPI Metric Card Component
const KPIMetricCard = ({ kpi }) => (
  <div style={{
    padding: sp.md,
    background: C.neutral[100],
    border: `1px solid ${C.neutral[200]}`,
    borderRadius: 6
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs, marginBottom: sp.xs }}>
      {kpi.icon && <kpi.icon style={{ width: 14, height: 14, color: C.neutral[500] }} />}
      <div style={{
        ...typography.bodySmall(),
        color: C.neutral[500]
      }}>
        {kpi.label}
      </div>
    </div>
    <div style={{
      ...typography.h3(),
      margin: 0,
      marginBottom: 4,
      color: C.neutral[900]
    }}>
      {kpi.current}
    </div>
    {kpi.predicted && (
      <div style={{ ...typography.bodySmall(), color: C.neutral[600], marginBottom: 2 }}>
        Predicted: {kpi.predicted}
      </div>
    )}
    {kpi.target && (
      <div style={{
        ...typography.bodySmall(),
        color: kpi.current >= kpi.target ? C.success[600] : C.warning[600]
      }}>
        Target: {kpi.target}
      </div>
    )}
  </div>
);

// Summary Stat Card Component
const SummaryStatCard = ({ label, value, color, bgColor }) => (
  <div style={{
    padding: sp.md,
    background: bgColor,
    border: `1px solid ${C.neutral[200]}`,
    borderRadius: 6,
    textAlign: 'center'
  }}>
    <div style={{ ...typography.bodySmall(), color: C.neutral[600], marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ ...typography.h2(), color, margin: 0 }}>
      {value}
    </div>
  </div>
);

// Staff Data Grid Component
const StaffDataGrid = ({ staffRoster }) => (
  <div style={{ overflow: 'auto' }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
      gap: sp.xs,
      padding: sp.sm,
      background: C.neutral[50],
      borderRadius: '6px 6px 0 0',
      border: `1px solid ${C.neutral[200]}`,
      borderBottom: 'none'
    }}>
      <div style={{ ...typography.bodySmall({ medium: true }), color: C.neutral[700] }}>Name</div>
      <div style={{ ...typography.bodySmall({ medium: true }), color: C.neutral[700] }}>Role</div>
      <div style={{ ...typography.bodySmall({ medium: true }), color: C.neutral[700] }}>Status</div>
      <div style={{ ...typography.bodySmall({ medium: true }), color: C.neutral[700] }}>UPLH</div>
    </div>
    {staffRoster.map((staff, idx) => (
      <div
        key={idx}
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
          gap: sp.xs,
          padding: sp.sm,
          background: 'white',
          border: `1px solid ${C.neutral[200]}`,
          borderTop: idx === 0 ? `1px solid ${C.neutral[200]}` : 'none',
          borderRadius: idx === staffRoster.length - 1 ? '0 0 6px 6px' : 0
        }}
      >
        <div style={{ ...typography.bodySmall(), color: C.neutral[900] }}>{staff.name}</div>
        <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>{staff.role}</div>
        <div>
          <StatusBadge status={staff.status} />
        </div>
        <div style={{ ...typography.bodySmall({ medium: true }), color: C.neutral[900] }}>{staff.uplh}</div>
      </div>
    ))}
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    'active': { bg: C.success[100], text: C.success[700], label: 'Active' },
    'break': { bg: C.warning[100], text: C.warning[700], label: 'Break' },
    'offline': { bg: C.neutral[100], text: C.neutral[600], label: 'Offline' }
  };
  const { bg, text, label } = config[status] || config.offline;

  return (
    <span style={{
      padding: '2px 8px',
      background: bg,
      color: text,
      borderRadius: 4,
      fontSize: '11px',
      fontWeight: 500
    }}>
      {label}
    </span>
  );
};

// Dock Door Card Component
const DockDoorCard = ({ door }) => (
  <div style={{
    padding: sp.md,
    background: door.status === 'occupied' ? C.brand[50] : 'white',
    border: `1px solid ${C.neutral[200]}`,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    gap: sp.md
  }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 6,
      background: door.status === 'occupied' ? C.brand[100] : C.neutral[100],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <Truck style={{ width: 20, height: 20, color: door.status === 'occupied' ? C.brand[600] : C.neutral[400] }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ ...typography.bodySmall({ medium: true }), marginBottom: 2 }}>
        {door.id}
      </div>
      {door.status === 'occupied' ? (
        <>
          <div style={{ ...typography.bodySmall(), color: C.neutral[600], marginBottom: 2 }}>
            {door.trailer} • {door.carrier}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: sp.sm
          }}>
            <div style={{
              flex: 1,
              height: 4,
              background: C.neutral[200],
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${door.progress}%`,
                background: C.brand[500]
              }} />
            </div>
            <span style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
              {door.progress}%
            </span>
          </div>
        </>
      ) : (
        <div style={{ ...typography.bodySmall(), color: C.success[600] }}>
          Available
        </div>
      )}
    </div>
    <ChevronRight style={{ width: 16, height: 16, color: C.neutral[400] }} />
  </div>
);

// Aisle Card Component
const AisleCard = ({ aisle }) => {
  const utilPercent = Math.round((aisle.occupied / aisle.totalSlots) * 100);

  return (
    <div style={{
      padding: sp.md,
      background: 'white',
      border: `1px solid ${C.neutral[200]}`,
      borderRadius: 6
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: sp.sm }}>
        <div>
          <div style={{ ...typography.bodySmall({ medium: true }), marginBottom: 2 }}>
            {aisle.id}
          </div>
          <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
            {aisle.type} • {aisle.bays}×{aisle.levels} • {aisle.totalSlots} slots
          </div>
        </div>
        <div style={{ ...typography.bodySmall({ medium: true }), color: utilPercent > 85 ? C.warning[600] : C.neutral[700] }}>
          {utilPercent}%
        </div>
      </div>
      <div style={{
        height: 6,
        background: C.neutral[200],
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${utilPercent}%`,
          background: utilPercent > 85 ? C.warning[500] : C.brand[500]
        }} />
      </div>
      <div style={{ ...typography.bodySmall(), color: C.neutral[600], marginTop: sp.xs }}>
        {aisle.occupied} occupied • {aisle.reserved} reserved • {aisle.totalSlots - aisle.occupied - aisle.reserved} available
      </div>
    </div>
  );
};

// Location Row Component
const LocationRow = ({ rack }) => {
  const utilPercent = Math.round((rack.current / rack.capacity) * 100);
  const status = utilPercent > 90 ? 'high' : utilPercent > 75 ? 'medium' : 'low';
  const statusColor = status === 'high' ? C.error[500] : status === 'medium' ? C.warning[500] : C.success[500];

  return (
    <div style={{
      padding: sp.sm,
      background: 'white',
      border: `1px solid ${C.neutral[200]}`,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      gap: sp.md
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...typography.bodySmall({ medium: true }), marginBottom: 2 }}>
          {rack.id}
        </div>
        <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
          {rack.current} / {rack.capacity} units
        </div>
      </div>
      <div style={{
        ...typography.bodySmall({ medium: true }),
        color: statusColor
      }}>
        {utilPercent}%
      </div>
    </div>
  );
};

// ===== DATA GENERATORS =====

// formatZoneType helper moved to ContextualSidepanel

// Get zone type label for display
const getZoneTypeLabel = (zoneType) => {
  const labels = {
    'receiving': 'Inbound Receiving Dock',
    'storage': 'Reserve Storage Zone',
    'picking': 'Forward Picking Zone',
    'outbound': 'Outbound Shipping Dock'
  };
  return labels[zoneType] || 'Warehouse Zone';
};

// Get KPI metrics with current → predicted format
const getKPIMetricsByZone = (zone, zoneMetrics, utilizationPercent) => {
  const metricsByType = {
    'receiving': [
      {
        label: 'Pallets/Hr',
        current: 142,
        predicted: 168,
        target: 180,
        icon: Package
      },
      {
        label: 'Avg Dwell (min)',
        current: 38,
        predicted: 42,
        target: '≤45',
        icon: Clock,
        warn: false
      },
      {
        label: 'Receiving Accuracy',
        current: '98.2%',
        predicted: '97.8%',
        target: '99%',
        icon: CheckCircle
      },
      {
        label: 'Staged Pallets',
        current: 47,
        predicted: 62,
        target: 80,
        icon: Package
      },
      {
        label: 'Dock Utilization',
        current: '75%',
        predicted: '85%',
        target: '90%',
        icon: MapPin
      }
    ],
    'storage': [
      {
        label: 'Cube Util',
        current: '72%',
        predicted: '78%',
        target: '80%',
        icon: Package
      },
      {
        label: 'Inv Accuracy',
        current: '99.2%',
        predicted: '99.1%',
        target: '99.5%',
        icon: CheckCircle
      },
      {
        label: 'Putaway Time',
        current: '4.2 min',
        predicted: '4.5 min',
        target: '4.0 min',
        icon: Clock,
        warn: true
      },
      {
        label: 'Putaway Backlog',
        current: 28,
        predicted: 35,
        target: 20,
        icon: Package,
        warn: true
      },
      {
        label: 'Replen Pending',
        current: 15,
        predicted: 22,
        target: 10,
        icon: TrendingUp,
        warn: true
      }
    ],
    'picking': [
      {
        label: 'Pick Rate',
        current: '185/hr',
        predicted: '200/hr',
        target: '210/hr',
        icon: Package
      },
      {
        label: 'Travel Time',
        current: '3.2 min',
        predicted: '3.5 min',
        target: '3.0 min',
        icon: Clock,
        warn: true
      },
      {
        label: 'Accuracy',
        current: '99.5%',
        predicted: '99.3%',
        target: '99.8%',
        icon: CheckCircle
      },
      {
        label: 'Lines/Hr',
        current: 42,
        predicted: 45,
        target: 50,
        icon: Activity
      },
      {
        label: 'Order Backlog',
        current: 85,
        predicted: 95,
        target: 60,
        icon: Package,
        warn: true
      }
    ],
    'outbound': [
      {
        label: 'Ship Rate',
        current: '120/hr',
        predicted: '135/hr',
        target: '150/hr',
        icon: Truck
      },
      {
        label: 'Dwell Time',
        current: '22 min',
        predicted: '25 min',
        target: '20 min',
        icon: Clock,
        warn: true
      },
      {
        label: 'Accuracy',
        current: '99.8%',
        predicted: '99.7%',
        target: '99.9%',
        icon: CheckCircle
      },
      {
        label: 'Staged Orders',
        current: 52,
        predicted: 68,
        target: 80,
        icon: Package
      },
      {
        label: 'Dock Util',
        current: '65%',
        predicted: '80%',
        target: '75%',
        icon: Truck,
        warn: true
      }
    ]
  };

  return metricsByType[zone.zoneType] || metricsByType['receiving'];
};

// Get KPI metrics by zone type
const getKPIMetrics = (zoneType, utilization) => {
  const metricsByType = {
    'receiving': [
      { label: 'Pallets/Hr', current: 142, predicted: 168, target: 180, icon: Package },
      { label: 'Avg Dwell (min)', current: 38, predicted: 42, target: 35, icon: Clock },
      { label: 'Accuracy', current: '98.2%', predicted: '97.8%', target: '99%', icon: CheckCircle },
      { label: 'Staged Pallets', current: 47, predicted: 62, target: 80, icon: Package },
      { label: 'Dock Util', current: '75%', predicted: '85%', target: '80%', icon: Truck }
    ],
    'storage': [
      { label: 'Cube Util', current: '72%', predicted: '78%', target: '80%', icon: Package },
      { label: 'Inv Accuracy', current: '99.2%', predicted: '99.1%', target: '99.5%', icon: CheckCircle },
      { label: 'Putaway Time', current: '4.2 min', predicted: '4.5 min', target: '4.0 min', icon: Clock },
      { label: 'Putaway Backlog', current: 28, predicted: 35, target: 20, icon: Package },
      { label: 'Replen Pending', current: 15, predicted: 22, target: 10, icon: TrendingUp }
    ],
    'picking': [
      { label: 'Pick Rate', current: '185/hr', predicted: '200/hr', target: '210/hr', icon: Package },
      { label: 'Travel Time', current: '3.2 min', predicted: '3.5 min', target: '3.0 min', icon: Clock },
      { label: 'Accuracy', current: '99.5%', predicted: '99.3%', target: '99.8%', icon: CheckCircle },
      { label: 'Lines/Hr', current: 42, predicted: 45, target: 50, icon: Activity },
      { label: 'Order Backlog', current: 85, predicted: 95, target: 60, icon: Package }
    ],
    'outbound': [
      { label: 'Ship Rate', current: '120/hr', predicted: '135/hr', target: '150/hr', icon: Truck },
      { label: 'Dwell Time', current: '22 min', predicted: '25 min', target: '20 min', icon: Clock },
      { label: 'Accuracy', current: '99.8%', predicted: '99.7%', target: '99.9%', icon: CheckCircle },
      { label: 'Staged Orders', current: 52, predicted: 68, target: 80, icon: Package },
      { label: 'Dock Util', current: '65%', predicted: '80%', target: '75%', icon: Truck }
    ]
  };

  return metricsByType[zoneType] || metricsByType['storage'];
};

// Get staff summary
const getStaffSummary = (zoneType) => {
  const summaries = {
    'receiving': { present: 10, scheduled: 10, gap: 0, productivity: 98 },
    'storage': { present: 9, scheduled: 10, gap: 1, productivity: 92 },
    'picking': { present: 12, scheduled: 12, gap: 0, productivity: 96 },
    'outbound': { present: 8, scheduled: 10, gap: 2, productivity: 88 }
  };
  return summaries[zoneType] || summaries['storage'];
};

// Get staff roster
const getStaffRoster = (zoneType) => {
  const rostersByType = {
    'receiving': [
      { name: 'John Smith', role: 'Dock Worker', status: 'active', uplh: 145 },
      { name: 'Sarah Johnson', role: 'Dock Worker', status: 'active', uplh: 158 },
      { name: 'Mike Chen', role: 'Forklift Op', status: 'active', uplh: 132 },
      { name: 'Lisa Garcia', role: 'Forklift Op', status: 'break', uplh: 142 },
      { name: 'Tom Wilson', role: 'Receiving Clerk', status: 'active', uplh: 98 },
      { name: 'Amy Brown', role: 'Receiving Clerk', status: 'active', uplh: 105 },
      { name: 'David Lee', role: 'QC Inspector', status: 'active', uplh: 85 },
      { name: 'Rachel Davis', role: 'Dock Worker', status: 'active', uplh: 152 }
    ],
    'storage': [
      { name: 'Carlos Martinez', role: 'WH Associate', status: 'active', uplh: 125 },
      { name: 'Jennifer Kim', role: 'WH Associate', status: 'active', uplh: 118 },
      { name: 'Robert Taylor', role: 'Forklift Op', status: 'active', uplh: 140 },
      { name: 'Emily White', role: 'Forklift Op', status: 'break', uplh: 135 },
      { name: 'James Anderson', role: 'Reach Truck Op', status: 'active', uplh: 148 },
      { name: 'Maria Lopez', role: 'Reach Truck Op', status: 'active', uplh: 142 }
    ],
    'picking': [
      { name: 'Kevin Moore', role: 'Order Picker', status: 'active', uplh: 185 },
      { name: 'Ashley Martin', role: 'Order Picker', status: 'active', uplh: 192 },
      { name: 'Daniel Jackson', role: 'Order Picker', status: 'active', uplh: 178 },
      { name: 'Michelle Thompson', role: 'Order Picker', status: 'break', uplh: 188 },
      { name: 'Chris Harris', role: 'Forklift Op', status: 'active', uplh: 145 },
      { name: 'Jessica Clark', role: 'Forklift Op', status: 'active', uplh: 152 }
    ],
    'outbound': [
      { name: 'Brian Lewis', role: 'Packer', status: 'active', uplh: 125 },
      { name: 'Nicole Robinson', role: 'Packer', status: 'active', uplh: 132 },
      { name: 'Steven Walker', role: 'Shipper', status: 'active', uplh: 110 },
      { name: 'Amanda Hall', role: 'Shipper', status: 'break', uplh: 118 },
      { name: 'Paul Allen', role: 'QC', status: 'active', uplh: 95 },
      { name: 'Laura Young', role: 'QC', status: 'active', uplh: 98 }
    ]
  };
  return rostersByType[zoneType] || rostersByType['storage'];
};

// Get dock doors (for receiving zones)
const getDockDoors = (zoneId) => {
  const doorsByZone = {
    'Z01': ['D01', 'D02', 'D03', 'D04'],
    'Z02': ['D05', 'D06', 'D07', 'D08'],
    'Z03': ['D09', 'D10', 'D11', 'D12'],
    'Z04': ['D13', 'D14', 'D15', 'D16']
  };

  const doorIds = doorsByZone[zoneId] || ['D01', 'D02', 'D03', 'D04'];

  return doorIds.map((id, idx) => ({
    id,
    status: idx < 3 ? 'occupied' : 'available',
    trailer: idx < 3 ? `TRL-${1000 + idx}` : null,
    carrier: idx < 3 ? ['FedEx', 'UPS', 'ABC Freight'][idx] : null,
    progress: idx < 3 ? [85, 42, 15][idx] : 0
  }));
};

// Get aisles (for storage zones)
const getAisles = (zoneId) => {
  return [
    { id: 'A1', type: 'Selective Rack', bays: 12, levels: 4, totalSlots: 192, occupied: 165, reserved: 12 },
    { id: 'A2', type: 'Selective Rack', bays: 12, levels: 4, totalSlots: 192, occupied: 178, reserved: 8 },
    { id: 'A3', type: 'VNA Rack', bays: 16, levels: 6, totalSlots: 384, occupied: 342, reserved: 18 },
    { id: 'A4', type: 'Floor Storage', bays: 8, levels: 1, totalSlots: 64, occupied: 52, reserved: 4 }
  ];
};

// Get zone alerts
const getZoneAlerts = (zoneType, utilization) => {
  const alerts = [];

  if (utilization > 90) {
    alerts.push({
      title: 'High Utilization',
      description: `Zone is at ${utilization}% capacity. Consider reallocating inventory or expanding storage.`
    });
  }

  if (utilization > 85 && utilization <= 90) {
    alerts.push({
      title: 'Approaching Capacity',
      description: `Zone utilization at ${utilization}%. Monitor closely to prevent congestion.`
    });
  }

  return alerts;
};

// Get zone analysis alerts (placeholder data)
const getZoneAnalysisAlerts = (zone) => {
  const alertsByType = {
    'receiving': {
      rootCauses: 8,
      resolved: 2,
      inProgress: 1,
      tradeoffs: 1,
      insight: 'Dock utilization peaks at 98% between 11:00-13:00. Consider staggering inbound appointments to reduce congestion during lunch coverage gaps.',
      alerts: [
        {
          id: 'zone-recv-1',
          sev: 'critical',
          title: 'Zone Z04 Capacity Breach',
          msg: 'Zone will reach 91% capacity by 12:00. Consider overflow staging to adjacent zones.',
          time: '12:00',
          conf: 94,
          category: 'capacity',
          state: 'persists'
        },
        {
          id: 'zone-recv-2',
          sev: 'critical',
          title: 'UPS Cutoff at Risk',
          msg: '15:30 deadline may be missed due to receiving delays. 12 orders behind schedule.',
          time: '15:30',
          conf: 89,
          category: 'scheduling',
          state: 'persists'
        },
        {
          id: 'zone-recv-3',
          sev: 'warning',
          title: 'Break Coverage Gap',
          msg: 'Lunch period 12:00-13:00 has insufficient coverage. Only 3 of 5 positions filled.',
          time: '12:00',
          conf: 100,
          category: 'staffing',
          state: 'persists'
        },
        {
          id: 'zone-recv-4',
          sev: 'warning',
          title: 'Inbound ASN-2403 Delayed',
          msg: '32 lines pending receipt. Truck arrived 45 minutes late, impacting downstream flow.',
          time: 'in 1.5 hrs',
          conf: 92,
          category: 'inbound',
          state: 'targeted'
        },
        {
          id: 'zone-recv-5',
          sev: 'warning',
          title: 'Dock Door D06 Dwell Time Exceeds Target',
          msg: 'Average dwell time 52 minutes vs 45 minute target. Forklift allocation issue.',
          time: '11:30',
          conf: 87,
          category: 'throughput',
          state: 'persists'
        },
        {
          id: 'zone-recv-6',
          sev: 'warning',
          title: 'Receiving Accuracy Below Target',
          msg: 'Current accuracy 97.8% vs 99% target. 6 discrepancies found this shift.',
          time: '10:45',
          conf: 91,
          category: 'quality',
          state: 'active'
        },
        {
          id: 'zone-recv-7',
          sev: 'info',
          title: 'Staged Pallets Approaching Limit',
          msg: '62 of 80 staging locations occupied (78%). Monitor for overflow conditions.',
          time: '11:00',
          conf: 96,
          category: 'capacity',
          state: 'active'
        },
        {
          id: 'zone-recv-8',
          sev: 'info',
          title: 'Forklift FLT-202 Utilization Critical',
          msg: 'Equipment running at 92% utilization. Consider backup allocation during peak hours.',
          time: '11:15',
          conf: 88,
          category: 'equipment',
          state: 'active'
        }
      ]
    },
    'storage': {
      rootCauses: 6,
      resolved: 1,
      inProgress: 2,
      tradeoffs: 0,
      insight: 'Putaway backlog increasing due to labor shortage. Predicted 35 pallets by end of shift. Consider reallocating staff from picking zone.',
      alerts: [
        {
          id: 'zone-stor-1',
          sev: 'critical',
          title: 'Putaway Backlog Critical',
          msg: '35 pallets predicted by end of shift. Current backlog growing due to 2 FTE shortfall.',
          time: '16:00',
          conf: 91,
          category: 'throughput',
          state: 'persists'
        },
        {
          id: 'zone-stor-2',
          sev: 'warning',
          title: 'Aisle A3 Capacity Critical',
          msg: '89% utilization in primary VNA aisle. Overflow will impact putaway times.',
          time: '13:30',
          conf: 96,
          category: 'capacity',
          state: 'persists'
        },
        {
          id: 'zone-stor-3',
          sev: 'warning',
          title: 'Replenishment Pending',
          msg: '22 replenishment tasks scheduled for 14:00. Pick zone may experience stockouts.',
          time: '14:00',
          conf: 88,
          category: 'operations',
          state: 'targeted'
        },
        {
          id: 'zone-stor-4',
          sev: 'warning',
          title: 'Inventory Accuracy Drift',
          msg: 'Current accuracy 99.1% vs 99.5% target. 4 cycle count discrepancies this week.',
          time: '09:00',
          conf: 93,
          category: 'quality',
          state: 'active'
        },
        {
          id: 'zone-stor-5',
          sev: 'warning',
          title: 'VNA Equipment Unavailable',
          msg: 'RCH-305 in scheduled maintenance until 15:00. Reduced putaway capacity.',
          time: '15:00',
          conf: 100,
          category: 'equipment',
          state: 'persists'
        },
        {
          id: 'zone-stor-6',
          sev: 'info',
          title: 'Cube Utilization Below Target',
          msg: 'Current 78% vs 80% target. Slotting optimization recommended for slow movers.',
          time: '08:00',
          conf: 87,
          category: 'capacity',
          state: 'active'
        }
      ]
    },
    'picking': {
      rootCauses: 9,
      resolved: 1,
      inProgress: 1,
      tradeoffs: 2,
      insight: 'Order backlog rising to 95 by shift end. Travel time increasing due to poor slotting. Recommend batch picking for similar orders.',
      alerts: [
        {
          id: 'zone-pick-1',
          sev: 'critical',
          title: 'Order Backlog Critical',
          msg: '95 orders predicted by 16:00. Current rate 185/hr vs target 210/hr.',
          time: '16:00',
          conf: 92,
          category: 'throughput',
          state: 'persists'
        },
        {
          id: 'zone-pick-2',
          sev: 'warning',
          title: 'Travel Time Exceeds Target',
          msg: 'Average 3.5 min vs 3.0 min target. Poor slotting in aisles A8-A10 causing delays.',
          time: '11:45',
          conf: 89,
          category: 'efficiency',
          state: 'persists'
        },
        {
          id: 'zone-pick-3',
          sev: 'warning',
          title: 'Priority Orders At Risk',
          msg: '12 orders behind schedule. Amazon Prime cutoff at 14:00 may be impacted.',
          time: '14:00',
          conf: 94,
          category: 'scheduling',
          state: 'targeted'
        },
        {
          id: 'zone-pick-4',
          sev: 'warning',
          title: 'Pick Accuracy Below Target',
          msg: 'Current 99.3% vs 99.8% target. 8 mispicks this shift, mostly in aisle A12.',
          time: '10:30',
          conf: 90,
          category: 'quality',
          state: 'active'
        },
        {
          id: 'zone-pick-5',
          sev: 'warning',
          title: 'Staff Gap — Picker Absent',
          msg: '1 picker called out sick. Zone running at 92% capacity with current staffing.',
          time: '08:00',
          conf: 100,
          category: 'staffing',
          state: 'persists'
        },
        {
          id: 'zone-pick-6',
          sev: 'warning',
          title: 'Hot Pick Zone Depleted',
          msg: 'Restocking needed for 18 high-velocity SKUs. Impacting pick efficiency.',
          time: 'in 45 min',
          conf: 95,
          category: 'inventory',
          state: 'targeted'
        },
        {
          id: 'zone-pick-7',
          sev: 'info',
          title: 'Lines Per Hour Below Target',
          msg: 'Current 45/hr vs 50/hr target. Batch picking could improve throughput.',
          time: '12:00',
          conf: 87,
          category: 'throughput',
          state: 'active'
        },
        {
          id: 'zone-pick-8',
          sev: 'info',
          title: 'Equipment Idle',
          msg: 'Pallet jack PPT-104 unused for 2 hours. Consider redeploying to storage zone.',
          time: '11:00',
          conf: 100,
          category: 'equipment',
          state: 'active'
        },
        {
          id: 'zone-pick-9',
          sev: 'info',
          title: 'Wave 3 Delayed',
          msg: 'Release pushed from 14:00 to 14:30 due to receiving delays upstream.',
          time: '14:30',
          conf: 98,
          category: 'scheduling',
          state: 'active'
        }
      ]
    },
    'outbound': {
      rootCauses: 7,
      resolved: 2,
      inProgress: 1,
      tradeoffs: 1,
      insight: 'Carrier pickup schedule creating staging bottleneck at 15:00-16:00. Recommend earlier load staging for FedEx and UPS routes.',
      alerts: [
        {
          id: 'zone-out-1',
          sev: 'critical',
          title: 'Carrier Pickup Congestion',
          msg: '15:00-16:00 window has 4 simultaneous pickups. Dock capacity insufficient.',
          time: '15:00',
          conf: 96,
          category: 'scheduling',
          state: 'persists'
        },
        {
          id: 'zone-out-2',
          sev: 'warning',
          title: 'Staged Orders Exceeding Target',
          msg: '68 orders staged vs 80 capacity. Limited buffer for late-day volume surge.',
          time: '13:00',
          conf: 91,
          category: 'capacity',
          state: 'persists'
        },
        {
          id: 'zone-out-3',
          sev: 'warning',
          title: 'Dwell Time Above Target',
          msg: 'Average 25 minutes vs 20 minute target. Load verification bottleneck at dock doors.',
          time: '12:30',
          conf: 88,
          category: 'throughput',
          state: 'persists'
        },
        {
          id: 'zone-out-4',
          sev: 'warning',
          title: 'Load BOL-4402 Incomplete',
          msg: '12 cartons missing from manifest. Shipment on hold pending inventory check.',
          time: 'in 30 min',
          conf: 100,
          category: 'operations',
          state: 'targeted'
        },
        {
          id: 'zone-out-5',
          sev: 'warning',
          title: 'Dock Utilization High',
          msg: '80% utilization vs 75% target. Limited flex capacity for unplanned shipments.',
          time: '14:00',
          conf: 93,
          category: 'capacity',
          state: 'active'
        },
        {
          id: 'zone-out-6',
          sev: 'info',
          title: 'Shipping Accuracy Drift',
          msg: 'Current 99.7% vs 99.9% target. 2 address corrections needed this shift.',
          time: '11:00',
          conf: 90,
          category: 'quality',
          state: 'active'
        },
        {
          id: 'zone-out-7',
          sev: 'info',
          title: 'Trailer TRL-1002 Departure Delayed',
          msg: 'Scheduled 14:00 departure pushed to 14:45 due to driver traffic delays.',
          time: '14:45',
          conf: 100,
          category: 'scheduling',
          state: 'targeted'
        }
      ]
    }
  };

  return alertsByType[zone.zoneType] || alertsByType['receiving'];
};

// ===== WORK CONTENT TAB =====
const WorkContentTab = ({ zone }) => {
  // Mock ASN/PO data
  const asnPoData = [
    { asn: 'ASN-2401', po: 'PO-98765', vendor: 'Acme Co.', lines: 24, received: 20, variance: 4, status: 'receiving' },
    { asn: 'ASN-2402', po: 'PO-98766', vendor: 'Global Supply', lines: 18, received: 18, variance: 0, status: 'complete' },
    { asn: 'ASN-2403', po: 'PO-98767', vendor: 'Metro Dist.', lines: 32, received: 28, variance: 4, status: 'receiving' },
    { asn: 'ASN-2404', po: 'PO-98768', vendor: 'Pacific Trade', lines: 15, received: 15, variance: 0, status: 'complete' },
    { asn: 'ASN-2405', po: 'PO-98769', vendor: 'Eastern Supply', lines: 22, received: 18, variance: 4, status: 'receiving' }
  ];

  // Mock WIP data
  const wipData = {
    awaitingPutaway: 127,
    qcHold: 8,
    readyForPutaway: 94
  };

  return (
    <div style={{ padding: sp.lg }}>
      {/* ASN/PO Tracking */}
      <Section title="ASN/PO Tracking" icon={Package} color={C.brand[500]}>
        <DataGrid
          columns={[
            { key: 'asn', label: 'ASN' },
            { key: 'po', label: 'PO' },
            { key: 'vendor', label: 'Vendor' },
            { key: 'lines', label: 'Lines' },
            { key: 'received', label: 'Received' },
            {
              key: 'variance',
              label: 'Variance',
              render: (val) => val > 0 ? <Badge status="warning" label={`+${val}`} /> : <Badge status="success" label="0" />
            },
            {
              key: 'status',
              label: 'Status',
              render: (val) => <Badge status={val === 'complete' ? 'success' : 'info'} label={val === 'complete' ? 'Complete' : 'Receiving'} />
            }
          ]}
          data={asnPoData}
        />
      </Section>

      {/* Receiving Throughput - Placeholder for chart */}
      <Section title="Receiving Throughput" icon={TrendingUp} color={C.brand[500]}>
        <div style={{
          padding: sp.xl,
          background: C.neutral[50],
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`,
          textAlign: 'center'
        }}>
          <TrendingUp style={{ width: 48, height: 48, color: C.neutral[400], margin: '0 auto', marginBottom: sp.md }} />
          <p style={{ ...typography.body(), color: C.neutral[600], margin: 0 }}>
            Chart: Pallets/Hr over time (Current: 82 → Predicted: 85)
          </p>
        </div>
      </Section>

      {/* Work in Progress */}
      <Section title="Work in Progress" icon={Clock} color={C.brand[500]}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: sp.md
        }}>
          <SummaryStatCard
            label="Awaiting Putaway"
            value={wipData.awaitingPutaway}
            bgColor={C.warning[50]}
            textColor={C.warning[600]}
            icon={Clock}
          />
          <SummaryStatCard
            label="QC Hold"
            value={wipData.qcHold}
            bgColor={C.error[50]}
            textColor={C.error[600]}
            icon={AlertTriangle}
          />
          <SummaryStatCard
            label="Ready for Putaway"
            value={wipData.readyForPutaway}
            bgColor={C.success[50]}
            textColor={C.success[600]}
            icon={CheckCircle}
          />
        </div>
      </Section>
    </div>
  );
};

// ===== SPACE UTILIZATION TAB =====
const SpaceUtilizationTab = ({ zone, racks }) => {
  // Calculate capacity data from racks
  const totalCapacity = racks.reduce((sum, r) => sum + r.capacity, 0);
  const currentOccupancy = racks.reduce((sum, r) => sum + r.current, 0);
  const predictedOccupancy = Math.min(Math.round(currentOccupancy * 1.15), totalCapacity);

  // Mock zone dimensions
  const dimensions = {
    sqFt: zone.zoneType === 'receiving' ? '12,450' : '28,600',
    dockDoorsOrAisles: zone.zoneType === 'receiving' ? 6 : 8,
    palletCapacity: totalCapacity
  };

  // Mock location utilization based on racks
  const locationUtil = racks.slice(0, 6).map(rack => {
    const util = Math.round((rack.current / rack.capacity) * 100);
    return {
      id: rack.id,
      name: rack.id,
      util,
      trend: util > 85 ? 'up' : util < 60 ? 'down' : 'stable',
      color: util > 85 ? C.error[500] : util > 75 ? C.warning[500] : C.success[500]
    };
  });

  return (
    <div style={{ padding: sp.lg }}>
      {/* Space Utilization Forecast - Placeholder */}
      <Section title="Space Utilization Forecast" icon={BoxSelect} color={C.brand[500]}>
        <div style={{
          padding: sp.xl,
          background: C.neutral[50],
          borderRadius: 8,
          border: `1px solid ${C.neutral[200]}`,
          textAlign: 'center'
        }}>
          <Activity style={{ width: 48, height: 48, color: C.neutral[400], margin: '0 auto', marginBottom: sp.md }} />
          <p style={{ ...typography.body(), color: C.neutral[600], margin: 0 }}>
            Chart: Utilization % over time with thresholds at 75%, 85%, 90%
          </p>
        </div>
      </Section>

      {/* Staging Capacity */}
      <Section title="Staging Capacity" icon={Package} color={C.brand[500]}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: sp.md,
          marginBottom: sp.sm
        }}>
          <span style={{ ...typography.h2(), color: C.neutral[700], margin: 0 }}>
            {currentOccupancy}
          </span>
          <ArrowRight style={{ width: 20, height: 20, color: C.neutral[400] }} />
          <span style={{ ...typography.h2(), color: C.brand[500], margin: 0 }}>
            {predictedOccupancy}
          </span>
          <span style={{ ...typography.h4(), color: C.neutral[500], margin: 0 }}>/</span>
          <span style={{ ...typography.h3(), color: C.neutral[600], margin: 0 }}>
            {totalCapacity}
          </span>
        </div>
        <Progress
          value={currentOccupancy}
          pred={predictedOccupancy}
          max={totalCapacity}
          color={predictedOccupancy > totalCapacity * 0.9 ? C.error[500] : C.brand[500]}
          h={8}
        />
      </Section>

      {/* Zone Dimensions */}
      <Section title="Zone Dimensions" icon={Grid3X3} color={C.brand[500]}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: sp.md
        }}>
          <SummaryStatCard
            label="Square Footage"
            value={dimensions.sqFt}
            bgColor={C.neutral[50]}
            textColor={C.neutral[700]}
          />
          <SummaryStatCard
            label={zone.zoneType === 'receiving' ? 'Dock Doors' : 'Aisles'}
            value={dimensions.dockDoorsOrAisles}
            bgColor={C.neutral[50]}
            textColor={C.neutral[700]}
          />
          <SummaryStatCard
            label="Pallet Capacity"
            value={dimensions.palletCapacity}
            bgColor={C.neutral[50]}
            textColor={C.neutral[700]}
          />
        </div>
      </Section>

      {/* Utilization by Location */}
      <Section title="Utilization by Location" icon={MapPin} color={C.brand[500]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
          {locationUtil.map(loc => (
            <div
              key={loc.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sp.md,
                padding: sp.sm,
                background: 'white',
                borderRadius: 6,
                border: `1px solid ${C.neutral[200]}`
              }}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: loc.color,
                flexShrink: 0
              }} />
              <span style={{ ...typography.body(), flex: 1, minWidth: 0 }}>
                {loc.name}
              </span>
              <div style={{ flex: 2, minWidth: 0 }}>
                <Progress value={loc.util} max={100} color={loc.color} h={6} />
              </div>
              <span style={{ ...typography.bodySmall(), fontWeight: 500, color: loc.color, width: 40, textAlign: 'right' }}>
                {loc.util}%
              </span>
              {loc.trend === 'up' && <TrendingUp style={{ width: 16, height: 16, color: C.error[500] }} />}
              {loc.trend === 'down' && <TrendingDown style={{ width: 16, height: 16, color: C.success[500] }} />}
              {loc.trend === 'stable' && <Minus style={{ width: 16, height: 16, color: C.neutral[500] }} />}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ===== EQUIPMENT TAB =====
const EquipmentTab = ({ zone }) => {
  // Mock equipment summary
  const equipmentSummary = {
    active: 12,
    idle: 3,
    maintenance: 1,
    avgUtil: 78
  };

  // Mock equipment roster data
  const equipmentData = [
    { id: 'FLT-201', type: 'Forklift', status: 'active', util: 85, operator: 'J. Smith' },
    { id: 'FLT-202', type: 'Forklift', status: 'active', util: 92, operator: 'M. Davis' },
    { id: 'FLT-203', type: 'Forklift', status: 'idle', util: 0, operator: '-' },
    { id: 'PPT-104', type: 'Pallet Jack', status: 'active', util: 67, operator: 'K. Johnson' },
    { id: 'PPT-105', type: 'Pallet Jack', status: 'active', util: 73, operator: 'R. Lee' },
    { id: 'RCH-305', type: 'Reach Truck', status: 'maintenance', util: 0, operator: '-' },
    { id: 'RCH-306', type: 'Reach Truck', status: 'active', util: 88, operator: 'T. Garcia' },
    { id: 'FLT-204', type: 'Forklift', status: 'active', util: 76, operator: 'P. Wilson' }
  ];

  return (
    <div style={{ padding: sp.lg }}>
      {/* Equipment Summary */}
      <Section title="Equipment Summary" icon={Wrench} color={C.brand[500]}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: sp.md
        }}>
          <SummaryStatCard
            label="Active"
            value={equipmentSummary.active}
            bgColor={C.success[50]}
            textColor={C.success[600]}
            icon={CheckCircle}
          />
          <SummaryStatCard
            label="Idle"
            value={equipmentSummary.idle}
            bgColor={C.neutral[100]}
            textColor={C.neutral[700]}
            icon={Minus}
          />
          <SummaryStatCard
            label="Maintenance"
            value={equipmentSummary.maintenance}
            bgColor={C.warning[50]}
            textColor={C.warning[600]}
            icon={Wrench}
          />
          <SummaryStatCard
            label="Avg Utilization"
            value={`${equipmentSummary.avgUtil}%`}
            bgColor={C.brand[50]}
            textColor={C.brand[600]}
            icon={Activity}
          />
        </div>
      </Section>

      {/* Equipment Roster */}
      <Section title="Equipment Roster" icon={Wrench} color={C.brand[500]}>
        <DataGrid
          columns={[
            { key: 'id', label: 'Equipment ID' },
            { key: 'type', label: 'Type' },
            {
              key: 'status',
              label: 'Status',
              render: (val) => {
                const statusMap = {
                  'active': { status: 'success', label: 'Active' },
                  'idle': { status: 'neutral', label: 'Idle' },
                  'maintenance': { status: 'warning', label: 'Maintenance' }
                };
                const config = statusMap[val] || statusMap.idle;
                return <Badge status={config.status} label={config.label} />;
              }
            },
            {
              key: 'util',
              label: 'Utilization',
              render: (val) => `${val}%`
            },
            { key: 'operator', label: 'Operator' }
          ]}
          data={equipmentData}
        />
      </Section>
    </div>
  );
};

export default ZoneDetailView;
