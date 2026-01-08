import React, { useState } from 'react';
import { X, AlertTriangle, TrendingUp, Lightbulb, Clock, Info, ChevronDown } from 'lucide-react';
import { C, sp, typography } from '../styles/designSystem';
import { ALERTS_DATA } from '../data/alertsData';
import TabLayout from './TabLayout';
import { Breadcrumb } from './UI/index';

/**
 * ContextualSidepanel - 10K ft view: Analyze & Optimize
 * Displays detailed information and insights for selected entities
 * Now includes fixed header with breadcrumb navigation, facility info, and side tabs
 */
const ContextualSidepanel = ({
  data,
  onClose,
  facilityName = 'Acme Distribution',
  breadcrumbItems = [],
  onBreadcrumbNavigate,
  tabs = [{ id: 'details', label: 'Details', icon: Info }],
  activeTab = 'details',
  onTabChange
}) => {
  if (!data) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white'
    }}>
      {/* NEW: Fixed Header Section */}
      <div style={{
        flexShrink: 0,
        background: 'white',
        borderBottom: `1px solid ${C.neutral[200]}`
      }}>
        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <div style={{ padding: `${sp.md} ${sp.lg} ${sp.sm} ${sp.lg}` }}>
            <Breadcrumb
              items={breadcrumbItems}
              onNavigate={onBreadcrumbNavigate}
            />
          </div>
        )}

        {/* Logo + Title + Actions Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: sp.md,
          padding: `${sp.sm} ${sp.lg} ${sp.md} ${sp.lg}`
        }}>
          {/* Left: Logo + Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: sp.md,
            flex: 1
          }}>
            <img
              src="/facility-logo.png"
              alt="Facility Logo"
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                objectFit: 'contain'
              }}
            />
            <h1 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: C.neutral[900],
              margin: 0
            }}>
              {facilityName} Overview
            </h1>
          </div>

          {/* Right: Facility Actions Dropdown */}
          <FacilityActionsDropdown />
        </div>
      </div>

      {/* TabLayout wraps the detail content */}
      <TabLayout
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      >
        {/* Render panel content based on entity type */}
        {data.type === 'alert' && <AlertDetailTab alert={data} onClose={onClose} />}
        {data.type === 'zone' && <ZoneDetailTab zone={data} onClose={onClose} />}
        {data.type === 'staff' && <StaffDetailTab staff={data} onClose={onClose} />}
        {data.type === 'equipment' && <EquipmentDetailTab equipment={data} onClose={onClose} />}
        {!['alert', 'zone', 'staff', 'equipment'].includes(data.type) && (
          <DefaultTab data={data} onClose={onClose} />
        )}
      </TabLayout>
    </div>
  );
};

/**
 * FacilityActionsDropdown - Dropdown menu for facility-level actions
 */
const FacilityActionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sp.sm,
          padding: `${sp.sm} ${sp.md}`,
          background: C.brand[500],
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.brand[600];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = C.brand[500];
        }}
      >
        Facility Actions
        <ChevronDown style={{
          width: 14,
          height: 14,
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s'
        }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 998 }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: sp.xs,
            minWidth: 200,
            background: 'white',
            border: `1px solid ${C.neutral[200]}`,
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 999,
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setIsOpen(false)}
              style={{
                padding: sp.md,
                cursor: 'pointer',
                borderBottom: `1px solid ${C.neutral[100]}`,
                transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontSize: '13px', color: C.neutral[800] }}>
                Placeholder Action 1
              </div>
            </div>
            <div
              onClick={() => setIsOpen(false)}
              style={{
                padding: sp.md,
                cursor: 'pointer',
                borderBottom: `1px solid ${C.neutral[100]}`,
                transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontSize: '13px', color: C.neutral[800] }}>
                Placeholder Action 2
              </div>
            </div>
            <div
              onClick={() => setIsOpen(false)}
              style={{
                padding: sp.md,
                cursor: 'pointer',
                transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.neutral[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontSize: '13px', color: C.neutral[800] }}>
                Placeholder Action 3
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * AlertDetailTab - Tab content for alert details
 * Contains the previous AlertDetailPanel content but without outer flex container
 */
const AlertDetailTab = ({ alert, onClose }) => {
  const alertData = ALERTS_DATA[alert.id] || alert;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Detail Header */}
      <div style={{
        padding: sp.lg,
        borderBottom: `1px solid ${C.neutral[200]}`,
        background: C.neutral[50],
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
              <AlertTriangle style={{
                width: 20,
                height: 20,
                color: alertData.sev === 'critical' ? C.error[600] : C.warning[600]
              }} />
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: alertData.sev === 'critical' ? C.error[600] : C.warning[600]
              }}>
                {alertData.sev}
              </span>
            </div>
            <h3 style={{ ...typography.h4(), margin: 0 }}>
              {alertData.title}
            </h3>
          </div>
          {onClose && (
            <button onClick={onClose} style={{
              padding: sp.xs,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}>
              <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: sp.lg,
        paddingLeft: sp.xl,
        paddingRight: sp.xl
      }}>
        {/* Description */}
        <section style={{ marginBottom: sp.lg }}>
          <h4 style={{
            ...typography.caption(),
            textTransform: 'uppercase',
            color: C.neutral[500],
            marginBottom: sp.sm
          }}>
            Description
          </h4>
          <p style={{ ...typography.body(), color: C.neutral[800], margin: 0 }}>
            {alertData.msg}
          </p>
        </section>

        {/* Predicted Impact */}
        <section style={{ marginBottom: sp.lg }}>
          <h4 style={{
            ...typography.caption(),
            textTransform: 'uppercase',
            color: C.neutral[500],
            marginBottom: sp.sm
          }}>
            Predicted Impact
          </h4>
          <div style={{ background: C.neutral[50], padding: sp.md, borderRadius: 6 }}>
            <p style={{ ...typography.bodySmall(), color: C.neutral[700], margin: 0 }}>
              Occurs in: {alertData.time}
            </p>
            <p style={{ ...typography.bodySmall(), color: C.neutral[700], margin: 0, marginTop: sp.xs }}>
              Confidence: {alertData.conf}%
            </p>
          </div>
        </section>

        {/* Contributing Factors */}
        <section style={{ marginBottom: sp.lg }}>
          <h4 style={{
            ...typography.caption(),
            textTransform: 'uppercase',
            color: C.neutral[500],
            marginBottom: sp.sm
          }}>
            Contributing Factors
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
            <FactorCard icon={TrendingUp} title="Historical Pattern" value="3 similar events this quarter" />
            <FactorCard icon={Clock} title="Time Constraint" value="Peak period (14:00-16:00)" />
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <h4 style={{
            ...typography.caption(),
            textTransform: 'uppercase',
            color: C.neutral[500],
            marginBottom: sp.sm
          }}>
            Recommendations
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: sp.sm,
            padding: sp.md,
            background: C.purple[50],
            border: `1px solid ${C.purple[200]}`,
            borderRadius: 6
          }}>
            <Lightbulb style={{ width: 18, height: 18, color: C.purple[600], flexShrink: 0 }} />
            <div>
              <p style={{ ...typography.bodySmall({ medium: true }), margin: 0, marginBottom: sp.xs }}>
                Add 2 FTE to Pack Station
              </p>
              <p style={{ ...typography.bodySmall(), color: C.neutral[700], margin: 0 }}>
                Reassign staff from Zone 2 to maintain velocity through cutoff window.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: sp.lg,
        borderTop: `1px solid ${C.neutral[200]}`,
        background: 'white',
        flexShrink: 0
      }}>
        <button style={{
          width: '100%',
          padding: `${sp.sm} ${sp.md}`,
          background: C.brand[500],
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Create Action Plan
        </button>
      </div>
    </div>
  );
};

// Helper component for factor cards
const FactorCard = ({ icon: Icon, title, value }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: sp.sm,
    padding: sp.sm,
    background: 'white',
    border: `1px solid ${C.neutral[200]}`,
    borderRadius: 4
  }}>
    <Icon style={{ width: 16, height: 16, color: C.neutral[500], flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ ...typography.bodySmall({ medium: true }), marginBottom: 2 }}>
        {title}
      </div>
      <div style={{ ...typography.bodySmall(), color: C.neutral[600] }}>
        {value}
      </div>
    </div>
  </div>
);

// Tab content for other entity types
const ZoneDetailTab = ({ zone, onClose }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      padding: sp.lg,
      borderBottom: `1px solid ${C.neutral[200]}`,
      background: C.neutral[50],
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      flexShrink: 0
    }}>
      <h3 style={{ ...typography.h4(), margin: 0 }}>Zone: {zone.name}</h3>
      {onClose && (
        <button onClick={onClose} style={{
          padding: sp.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}>
          <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
        </button>
      )}
    </div>
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: sp.lg,
      paddingLeft: sp.xl,
      paddingRight: sp.xl
    }}>
      <p style={{ ...typography.body(), color: C.neutral[600] }}>
        Zone detail panel - to be implemented
      </p>
    </div>
  </div>
);

const StaffDetailTab = ({ staff, onClose }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      padding: sp.lg,
      borderBottom: `1px solid ${C.neutral[200]}`,
      background: C.neutral[50],
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      flexShrink: 0
    }}>
      <h3 style={{ ...typography.h4(), margin: 0 }}>Staff: {staff.name}</h3>
      {onClose && (
        <button onClick={onClose} style={{
          padding: sp.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}>
          <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
        </button>
      )}
    </div>
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: sp.lg,
      paddingLeft: sp.xl,
      paddingRight: sp.xl
    }}>
      <p style={{ ...typography.body(), color: C.neutral[600] }}>
        Staff detail panel - to be implemented
      </p>
    </div>
  </div>
);

const EquipmentDetailTab = ({ equipment, onClose }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      padding: sp.lg,
      borderBottom: `1px solid ${C.neutral[200]}`,
      background: C.neutral[50],
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      flexShrink: 0
    }}>
      <h3 style={{ ...typography.h4(), margin: 0 }}>Equipment: {equipment.name}</h3>
      {onClose && (
        <button onClick={onClose} style={{
          padding: sp.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}>
          <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
        </button>
      )}
    </div>
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: sp.lg,
      paddingLeft: sp.xl,
      paddingRight: sp.xl
    }}>
      <p style={{ ...typography.body(), color: C.neutral[600] }}>
        Equipment detail panel - to be implemented
      </p>
    </div>
  </div>
);

const DefaultTab = ({ data, onClose }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      padding: sp.lg,
      borderBottom: `1px solid ${C.neutral[200]}`,
      background: C.neutral[50],
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      flexShrink: 0
    }}>
      <h3 style={{ ...typography.h4(), margin: 0 }}>Analysis & Insights</h3>
      {onClose && (
        <button onClick={onClose} style={{
          padding: sp.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        }}>
          <X style={{ width: 18, height: 18, color: C.neutral[500] }} />
        </button>
      )}
    </div>
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: sp.lg,
      paddingLeft: sp.xl,
      paddingRight: sp.xl
    }}>
      <p style={{ ...typography.body(), color: C.neutral[600] }}>
        Select an element to view details.
      </p>
    </div>
  </div>
);

export default ContextualSidepanel;
