import React, { useState, useRef, useEffect } from 'react';
import {
  Lightbulb, Zap, ChevronRight, ChevronDown, ChevronLeft, AlertTriangle,
  CheckCircle, Target, Users, Package, MapPin, Wrench, Calendar, X,
  TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight, ExternalLink,
  Info, AlertOctagon, Eye, Plus, DollarSign
} from 'lucide-react';
import { C, sp } from '../../styles/designSystem';
import {
  Card, Badge, Alert, Accordion, AlertVisualization,
  SeverityPills, Header
} from '../../components/UI';

const InsightsTabContent = ({
  alerts,
  activePlans,
  onNavigateToAlert,
  onNavigateToPlan,
  setActiveTab
}) => {
  // Local state for sub-tabs and selections
  const [insightsSubTab, setInsightsSubTab] = useState('overall');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [highlightedAlert, setHighlightedAlert] = useState(null);

  // Accordion state management
  const [isActivePlanExpanded, setIsActivePlanExpanded] = useState(false);
  const [isFteCardExpanded, setIsFteCardExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    whatsHappening: true,
    whyImportant: true,
    contributingIssues: true,
    suggestedResolution: true
  });

  // Track container width for responsive masonry layout
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Determine column count based on container width (not window width)
  const columnCount = containerWidth >= 2200 ? 3 : (containerWidth >= 992 ? 2 : 1);

  // Accordion header component
  const AccordionHeader = ({ title, isExpanded, onClick, icon = null, badge = null }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: sp.sm,
        background: C.neutral[50],
        borderRadius: 4,
        border: `1px solid ${C.neutral[200]}`,
        transition: 'all 0.15s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
        {icon}
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: C.neutral[700] }}>
          {title}
        </span>
        {badge}
      </div>
      <ChevronDown
        style={{
          width: 16,
          height: 16,
          color: C.neutral[500],
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}
      />
    </div>
  );

  const hasActivePlan = activePlans.length > 0;
  const plan = activePlans[0];
  const tasksComplete = plan?.tasks?.filter(t => t.status === 'done').length || 0;
  const tasksTotal = plan?.tasks?.length || 0;

  return (
    <>
      <Header icon={Lightbulb} title="Analysis" sub="AI-generated alerts, root cause analysis, and recommended actions" color={C.purple[500]} />

      {/* State-Aware Summary Panel - MOVED ABOVE sub-tabs */}
      <Card style={{
        background: hasActivePlan ? C.success[50] : C.neutral[50],
        border: `1px solid ${hasActivePlan ? C.success[200] : C.neutral[200]}`,
        marginBottom: sp.md
      }}>
        {hasActivePlan ? (
          <>
            {/* Active Plan Summary - with link to Plan */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.md }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                  <Zap style={{ width: 16, height: 16, color: C.success[600] }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: C.success[700] }}>Active Plan: {plan.name}</span>
                  <span style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: plan.priority === 'critical' ? C.error[100] : plan.priority === 'high' ? C.warning[100] : C.neutral[100],
                    color: plan.priority === 'critical' ? C.error[700] : plan.priority === 'high' ? C.warning[700] : C.neutral[600],
                    borderRadius: 4,
                    textTransform: 'uppercase'
                  }}>{plan.priority}</span>
                </div>
                <p style={{ fontSize: '12px', color: C.neutral[600], margin: 0 }}>
                  {tasksComplete}/{tasksTotal} tasks complete • Target: {plan.targetCompletion}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                  <div style={{ width: 100, height: 6, background: C.success[100], borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${plan.progress}%`, background: C.success[500], borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.success[700] }}>{plan.progress}%</span>
                </div>
                <button
                  onClick={() => setActiveTab('plans')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: C.success[700],
                    background: 'white',
                    border: `1px solid ${C.success[300]}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  View Plan <ChevronRight style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>

            {/* Accordion toggle for main content */}
            <AccordionHeader
              title="Plan Details & Analysis"
              isExpanded={isActivePlanExpanded}
              onClick={() => setIsActivePlanExpanded(!isActivePlanExpanded)}
              badge={
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  background: C.neutral[100],
                  color: C.neutral[600],
                  borderRadius: 3
                }}>
                  4 Root Causes • 6 Alerts • 1 Tradeoff
                </span>
              }
            />

            {isActivePlanExpanded && (
              <>
                {/* Stacked: Root Causes */}
                <div style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}`, marginBottom: sp.sm, marginTop: sp.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', margin: 0 }}>Root Causes</p>
                <span style={{ fontSize: '10px', color: C.neutral[400] }}>4 identified</span>
              </div>
              <div style={{ display: 'flex', gap: sp.sm, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[100], padding: '2px 8px', borderRadius: 4 }}>1 Resolved</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[700], background: C.brand[100], padding: '2px 8px', borderRadius: 4 }}>1 Targeted</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[100], padding: '2px 8px', borderRadius: 4 }}>1 Tradeoff</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>1 Persists</span>
              </div>
            </div>

            {/* Stacked: Alerts */}
            <div style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${C.neutral[200]}`, marginBottom: sp.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.xs }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', margin: 0 }}>Alerts</p>
                <span style={{ fontSize: '10px', color: C.neutral[400] }}>{alerts.length} total</span>
              </div>
              <div style={{ display: 'flex', gap: sp.sm, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.success[700], background: C.success[100], padding: '2px 8px', borderRadius: 4 }}>2 Resolved</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.brand[700], background: C.brand[100], padding: '2px 8px', borderRadius: 4 }}>1 Targeted</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[100], padding: '2px 8px', borderRadius: 4 }}>1 Tradeoff</span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>2 Persist</span>
              </div>
            </div>

            {/* Emerging Tradeoffs Analysis - Grouped like Root Cause Analysis */}
            <div style={{ marginBottom: sp.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.sm }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: C.warning[700], textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: sp.xs }}>
                  <AlertTriangle style={{ width: 12, height: 12 }} />
                  Emerging Tradeoffs Analysis
                </p>
                <span style={{ fontSize: '10px', color: C.neutral[400] }}>1 intervention • 3 issues</span>
              </div>

              {/* FTE Card Accordion */}
              <AccordionHeader
                title="FTE Reallocation Impact"
                isExpanded={isFteCardExpanded}
                onClick={() => setIsFteCardExpanded(!isFteCardExpanded)}
                icon={<AlertTriangle style={{ width: 14, height: 14, color: C.warning[600] }} />}
                badge={
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    background: C.warning[100],
                    color: C.warning[700],
                    borderRadius: 3,
                    fontWeight: 600
                  }}>
                    TRADEOFF
                  </span>
                }
              />

              {isFteCardExpanded && (
                <div style={{ marginTop: sp.sm }}>
                  {/* Tradeoff Group Card - similar structure to Root Cause cards */}
                  <div style={{
                    background: 'white',
                    border: `1px solid ${C.warning[200]}`,
                    borderLeft: `4px solid ${C.warning[500]}`,
                    borderRadius: '0 8px 8px 0',
                    overflow: 'hidden'
                  }}>
                {/* Group Header */}
                <div style={{
                  padding: sp.md,
                  background: C.warning[50],
                  borderBottom: `1px solid ${C.warning[200]}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.xs }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: C.warning[800] }}>FTE Reallocation Impact</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          background: C.warning[100],
                          color: C.warning[700],
                          borderRadius: 3,
                          textTransform: 'uppercase'
                        }}>
                          Tradeoff
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: C.neutral[600], margin: 0 }}>
                        From: <span style={{ fontWeight: 500 }}>"Reassign 2 FTEs from Receiving to Picking"</span>
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      background: C.success[100],
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success[500] }} />
                      <span style={{ fontSize: '10px', fontWeight: 600, color: C.success[700] }}>Within tolerance</span>
                    </div>
                  </div>
                </div>

                {/* Narrative Sections */}
                <div style={{ padding: sp.md, borderBottom: `1px solid ${C.neutral[200]}` }}>
                  {/* What's Happening */}
                  <div style={{ marginBottom: sp.md }}>
                    <div
                      onClick={() => setExpandedSections(prev => ({ ...prev, whatsHappening: !prev.whatsHappening }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: sp.xs,
                        cursor: 'pointer',
                        marginBottom: sp.xs
                      }}
                    >
                      <ChevronDown
                        style={{
                          width: 12,
                          height: 12,
                          color: C.neutral[500],
                          transform: expandedSections.whatsHappening ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      />
                      <p style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: C.neutral[500],
                        textTransform: 'uppercase',
                        margin: 0
                      }}>
                        What's Happening
                      </p>
                    </div>

                    {expandedSections.whatsHappening && (
                      <p style={{ fontSize: '13px', color: C.neutral[700], margin: 0, lineHeight: 1.5 }}>
                        Moving 2 FTEs from Receiving to Picking resolved the UPS cutoff risk but reduced inbound processing capacity. This was an expected tradeoff when the plan was created.
                      </p>
                    )}
                  </div>

                  {/* Why It's Important */}
                  <div style={{ marginBottom: sp.md }}>
                    <div
                      onClick={() => setExpandedSections(prev => ({ ...prev, whyImportant: !prev.whyImportant }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: sp.xs,
                        cursor: 'pointer',
                        marginBottom: sp.xs
                      }}
                    >
                      <ChevronDown
                        style={{
                          width: 12,
                          height: 12,
                          color: C.neutral[500],
                          transform: expandedSections.whyImportant ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      />
                      <p style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: C.neutral[500],
                        textTransform: 'uppercase',
                        margin: 0
                      }}>
                        Why It's Important
                      </p>
                    </div>

                    {expandedSections.whyImportant && (
                      <p style={{ fontSize: '13px', color: C.neutral[700], margin: 0, lineHeight: 1.5 }}>
                        Receiving is currently running 30 min behind target. If the delay exceeds 45 min, dock congestion will cascade into afternoon shifts and impact outbound capacity.
                      </p>
                    )}
                  </div>

                  {/* Potential Outcome */}
                  <div style={{
                    padding: sp.sm,
                    background: C.error[50],
                    borderRadius: 6,
                    border: `1px solid ${C.error[200]}`
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: C.error[700], textTransform: 'uppercase', marginBottom: sp.xs }}>
                      Potential Outcome (if unaddressed)
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                        <span style={{ fontSize: '13px', color: C.error[700] }}>2 trucks delayed → <strong>$400 detention fees</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                        <span style={{ fontSize: '13px', color: C.error[700] }}>Putaway backlog spills into Shift 2</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <span style={{ fontSize: '12px', color: C.error[700] }}>•</span>
                        <span style={{ fontSize: '13px', color: C.error[700] }}>Receiving SLA breach risk increases to 65%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contributing Issues - Alert card style */}
                <div style={{ padding: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <div
                    onClick={() => setExpandedSections(prev => ({ ...prev, contributingIssues: !prev.contributingIssues }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: sp.sm
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                      <ChevronDown
                        style={{
                          width: 12,
                          height: 12,
                          color: C.neutral[500],
                          transform: expandedSections.contributingIssues ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      />
                      <p style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: C.neutral[500],
                        textTransform: 'uppercase',
                        margin: 0
                      }}>
                        Contributing Issues
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', color: C.neutral[400] }}>(3)</span>
                  </div>

                  {expandedSections.contributingIssues && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginBottom: sp.md }}>
                    {/* Issue 1 - Warning severity */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: sp.sm,
                      padding: sp.sm,
                      background: C.warning[50],
                      borderLeft: `3px solid ${C.warning[700]}`,
                      borderRadius: '0 6px 6px 0'
                    }}>
                      <AlertTriangle style={{ width: 14, height: 14, color: C.warning[700], flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: C.warning[700] }}>Receiving Throughput Degraded</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', color: C.neutral[500] }}>+1.5hr</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                          Inbound running 30 min behind target due to reduced staffing
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 78%</span>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>30/45 min</span>
                            <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: '66%', height: '100%', background: C.warning[400], borderRadius: 2 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issue 2 - Warning severity */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: sp.sm,
                      padding: sp.sm,
                      background: C.warning[50],
                      borderLeft: `3px solid ${C.warning[700]}`,
                      borderRadius: '0 6px 6px 0'
                    }}>
                      <AlertTriangle style={{ width: 14, height: 14, color: C.warning[700], flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: C.warning[700] }}>Inbound Queue Building</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', color: C.neutral[500] }}>+2hr</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                          2 trucks waiting, dock turnaround slowing
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 82%</span>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>2/4 trucks</span>
                            <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: '50%', height: '100%', background: C.success[400], borderRadius: 2 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issue 3 - Info severity (lower concern) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: sp.sm,
                      padding: sp.sm,
                      background: C.brand[50],
                      borderLeft: `3px solid ${C.brand[600]}`,
                      borderRadius: '0 6px 6px 0'
                    }}>
                      <Info style={{ width: 14, height: 14, color: C.brand[600], flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: sp.sm }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: C.brand[600] }}>Putaway Backlog Growing</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', color: C.neutral[500] }}>+1hr</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: C.neutral[600], margin: `${sp.xs} 0 0 0` }}>
                          Staged pallets waiting for storage assignment
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginTop: sp.xs }}>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>Confidence: 65%</span>
                          <span style={{ fontSize: '11px', color: C.neutral[400] }}>•</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: '10px', color: C.neutral[500] }}>15/25 pallets</span>
                            <div style={{ width: 40, height: 4, background: C.neutral[200], borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: '60%', height: '100%', background: C.warning[400], borderRadius: 2 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
                </div>

                {/* Suggested Resolution - Action Card style (matches Recommended Actions in Insights) */}
                <div style={{ marginTop: sp.md, padding: sp.md }}>
                  <div
                    onClick={() => setExpandedSections(prev => ({ ...prev, suggestedResolution: !prev.suggestedResolution }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sp.xs,
                      cursor: 'pointer',
                      marginBottom: sp.sm
                    }}
                  >
                    <ChevronDown
                      style={{
                        width: 12,
                        height: 12,
                        color: C.neutral[500],
                        transform: expandedSections.suggestedResolution ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                    <p style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: C.neutral[500],
                      textTransform: 'uppercase',
                      margin: 0
                    }}>
                      Suggested Resolution
                    </p>
                  </div>

                  {expandedSections.suggestedResolution && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginBottom: sp.md }}>
                    {/* Action 1 - Primary recommendation (green border = positive impact) */}
                    <div style={{
                      background: 'white',
                      borderRadius: 6,
                      border: `1px solid ${C.neutral[200]}`,
                      borderLeft: `4px solid ${C.success[500]}`,
                      padding: sp.md
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Add 1 temp worker to Receiving</span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: C.neutral[600],
                          background: C.neutral[100],
                          padding: '4px 10px',
                          borderRadius: 4
                        }}>
                          Shift Lead
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                          <span style={{ color: C.success[600] }}>Addresses all 3 issues</span>
                        </span>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                          <span style={{ color: C.warning[600] }}>+$160 labor cost</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 85%</span>
                    </div>

                    {/* Action 2 - Alternative (orange border = has significant tradeoff) */}
                    <div style={{
                      background: 'white',
                      borderRadius: 6,
                      border: `1px solid ${C.neutral[200]}`,
                      borderLeft: `4px solid ${C.warning[500]}`,
                      padding: sp.md
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Pull 1 FTE back from Picking</span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: C.neutral[600],
                          background: C.neutral[100],
                          padding: '4px 10px',
                          borderRadius: 4
                        }}>
                          Shift Lead
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                          <span style={{ color: C.success[600] }}>Immediate, no cost</span>
                        </span>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                          <span style={{ color: C.warning[600] }}>Reduces picking gains ~12%</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 78%</span>
                        <span style={{ fontSize: '12px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                          <AlertTriangle style={{ width: 12, height: 12 }} />
                          Conflicts with original plan goal
                        </span>
                      </div>
                    </div>

                    {/* Action 3 - Alternative (gray border = partial/minor) */}
                    <div style={{
                      background: 'white',
                      borderRadius: 6,
                      border: `1px solid ${C.neutral[200]}`,
                      borderLeft: `4px solid ${C.neutral[400]}`,
                      padding: sp.md
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: C.neutral[900] }}>Delay low-priority putaway tasks</span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: C.neutral[600],
                          background: C.neutral[100],
                          padding: '4px 10px',
                          borderRadius: 4
                        }}>
                          Ops Manager
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.xs }}>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.success[600] }}>Impact:</span>{' '}
                          <span style={{ color: C.success[600] }}>Frees receiving capacity</span>
                        </span>
                        <span style={{ fontSize: '13px' }}>
                          <span style={{ color: C.warning[600] }}>Trade-off:</span>{' '}
                          <span style={{ color: C.warning[600] }}>Only addresses 1 of 3 issues</span>
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: C.neutral[400] }}>Confidence: 91%</span>
                    </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: sp.sm }}>
                    <button style={{
                      flex: 1,
                      padding: `${sp.sm} ${sp.md}`,
                      fontSize: '12px',
                      fontWeight: 500,
                      background: 'white',
                      color: C.neutral[600],
                      border: `1px solid ${C.neutral[300]}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: sp.xs
                    }}>
                      <Eye style={{ width: 14, height: 14 }} /> Monitor All
                    </button>
                    <button style={{
                      flex: 1,
                      padding: `${sp.sm} ${sp.md}`,
                      fontSize: '12px',
                      fontWeight: 500,
                      background: C.success[500],
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: sp.xs
                    }}>
                      <Plus style={{ width: 14, height: 14 }} /> Add to Plan
                    </button>
                    <button style={{
                      flex: 1,
                      padding: `${sp.sm} ${sp.md}`,
                      fontSize: '12px',
                      fontWeight: 500,
                      background: 'white',
                      color: C.purple[600],
                      border: `1px solid ${C.purple[300]}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: sp.xs
                    }}>
                      <Zap style={{ width: 14, height: 14 }} /> Create Plan
                    </button>
                  </div>
                </div>
                  </div>
                </div>
              )}
            </div>
              </>
            )}
          </>
        ) : (
          /* No Active Plan - Show summary of issues */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: C.neutral[700], marginBottom: sp.xs }}>No Active Plan</p>
                <p style={{ fontSize: '12px', color: C.neutral[500], margin: 0 }}>
                  2 root causes identified driving {alerts.length} alerts across categories
                </p>
              </div>
              <button
                onClick={() => setActiveTab('plans')}
                style={{
                  padding: `${sp.xs} ${sp.sm}`,
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'white',
                  background: C.purple[500],
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Zap style={{ width: 12, height: 12 }} />
                Create Plan
              </button>
            </div>
            <div style={{ display: 'flex', gap: sp.sm }}>
              <span style={{ fontSize: '11px', fontWeight: 500, color: C.error[700], background: C.error[50], padding: '2px 8px', borderRadius: 4 }}>
                {[...new Set(alerts.filter(a => a.rootCause).map(a => a.rootCause.id))].length} Root Causes
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: C.warning[700], background: C.warning[50], padding: '2px 8px', borderRadius: 4 }}>
                {alerts.filter(a => a.sev === 'critical').length} Critical
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: C.neutral[600], background: C.neutral[100], padding: '2px 8px', borderRadius: 4 }}>
                {alerts.filter(a => a.sev === 'warning').length} Warning
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Category Sub-tabs */}
      <div style={{
        display: 'flex',
        gap: 0,
        marginBottom: sp.md,
        borderBottom: `1px solid ${C.neutral[200]}`
      }}>
        {[
          { id: 'overall', label: 'Overall', count: alerts.length },
          { id: 'staffing', label: 'Staffing', count: alerts.filter(a => a.rootCause?.name?.toLowerCase().includes('staff') || a.title?.toLowerCase().includes('staff') || a.title?.toLowerCase().includes('fte') || a.title?.toLowerCase().includes('break') || a.title?.toLowerCase().includes('swing')).length },
          { id: 'work', label: 'Work Content', count: alerts.filter(a => a.title?.toLowerCase().includes('ups') || a.title?.toLowerCase().includes('fedex') || a.title?.toLowerCase().includes('queue') || a.title?.toLowerCase().includes('velocity')).length },
          { id: 'zones', label: 'Zones', count: alerts.filter(a => a.title?.toLowerCase().includes('zone') || a.title?.toLowerCase().includes('capacity') || a.title?.toLowerCase().includes('z0')).length },
          { id: 'equipment', label: 'Equipment', count: alerts.filter(a => a.category === 'equipment' || a.title?.toLowerCase().includes('pm') || a.title?.toLowerCase().includes('fl-') || a.title?.toLowerCase().includes('epj-') || a.title?.toLowerCase().includes('battery')).length },
          { id: 'schedules', label: 'Schedules', count: alerts.filter(a => a.title?.toLowerCase().includes('shift') || a.title?.toLowerCase().includes('cutoff') || a.title?.toLowerCase().includes('handoff')).length }
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => { setInsightsSubTab(tab.id); setSelectedAlert(null); }}
            style={{
              padding: `${sp.sm} ${sp.md}`,
              fontSize: '13px',
              fontWeight: 500,
              color: insightsSubTab === tab.id ? C.neutral[900] : C.neutral[500],
              borderBottom: insightsSubTab === tab.id ? `2px solid ${C.neutral[900]}` : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: sp.xs
            }}
            onMouseEnter={(e) => { if (insightsSubTab !== tab.id) e.currentTarget.style.color = C.neutral[700]; }}
            onMouseLeave={(e) => { if (insightsSubTab !== tab.id) e.currentTarget.style.color = C.neutral[500]; }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 10,
                background: insightsSubTab === tab.id ? C.neutral[900] : C.neutral[200],
                color: insightsSubTab === tab.id ? 'white' : C.neutral[600]
              }}>
                {tab.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Masonry Container - wraps ALL conditional content below sub-tabs */}
      <div ref={containerRef} style={{
        columnCount: columnCount,
        columnGap: sp.lg
      }}>

        {/* Alert Detail View - shown when an alert is selected */}
        {selectedAlert ? (
          <div style={{
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
            WebkitColumnBreakInside: 'avoid',
            marginBottom: sp.lg,
            display: 'block',
            width: '100%'
          }}>
            <Card>
          {/* Back navigation */}
          <div
            onClick={() => setSelectedAlert(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: sp.xs,
              cursor: 'pointer',
              marginBottom: sp.lg,
              color: C.brand[600],
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            Back to {insightsSubTab === 'overall' ? 'All Alerts' : `${({ staffing: 'Staffing', work: 'Work Content', zones: 'Zones', equipment: 'Equipment', schedules: 'Schedules' })[insightsSubTab]} Alerts`}
          </div>

          {/* Alert Header */}
          {(() => {
            const cfg = {
              critical: [C.error[50], C.error[100], C.error[700], AlertOctagon],
              warning: [C.warning[50], C.warning[100], C.warning[700], AlertTriangle],
              info: [C.brand[100], C.brand[100], C.brand[600], Info]
            };
            const [bg, bdr, txt, Icon] = cfg[selectedAlert.sev] || cfg.info;
            return (
              <div style={{
                background: bg,
                borderTop: `1px solid ${bdr}`,
                borderRight: `1px solid ${bdr}`,
                borderBottom: `1px solid ${bdr}`,
                borderLeft: `4px solid ${txt}`,
                borderRadius: '0 6px 6px 0',
                padding: `${sp.sm} ${sp.md}`,
                marginBottom: sp.md
              }}>
                <div style={{ display: 'flex', gap: sp.sm, alignItems: 'flex-start' }}>
                  <Icon style={{ width: 14, height: 14, color: txt, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: txt }}>{selectedAlert.title}</span>
                      <span style={{ fontSize: '11px', color: txt, opacity: 0.8, marginLeft: sp.sm, flexShrink: 0 }}>{selectedAlert.sev} • {selectedAlert.time} • {selectedAlert.conf}% conf</span>
                    </div>
                    <p style={{ fontSize: '11px', color: txt, marginTop: '2px', opacity: 0.9 }}>{selectedAlert.msg}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Root Cause Context Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: sp.sm,
              background: C.purple[50],
              borderRadius: 6,
              marginBottom: sp.md,
              border: `1px solid ${C.purple[200]}`,
              cursor: 'pointer'
            }}
            onClick={() => setSelectedAlert(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
              <span style={{ fontSize: '13px', color: C.purple[700] }}>
                Part of: <strong>{selectedAlert.rootCause?.name || 'Unknown Root Cause'}</strong>
              </span>
              <Badge status={selectedAlert.rootCause?.alertCount > 2 ? 'error' : 'warning'} label={`${selectedAlert.rootCause?.alertCount || 1} alert${selectedAlert.rootCause?.alertCount > 1 ? 's' : ''} share this root cause`} />
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: C.purple[500] }} />
          </div>

          {/* What's Happening */}
          <Accordion title="What's Happening" defaultOpen={true}>
            <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
              {selectedAlert.whatsHappening || 'Details not available.'}
            </p>
            <AlertVisualization alertId={selectedAlert.id} type="whatsHappening" />
          </Accordion>

          {/* Why It Matters */}
          <Accordion title="Why It Matters" defaultOpen={true}>
            <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
              {selectedAlert.whyItMatters || 'Impact details not available.'}
            </p>
            <AlertVisualization alertId={selectedAlert.id} type="whyItMatters" />
          </Accordion>

          {/* Recommended Actions */}
          <Accordion title={`Recommended Actions (${selectedAlert.actions?.length || 0})`} defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
              {(selectedAlert.actions || []).map((item, i) => (
                <div key={i} style={{
                  padding: sp.sm,
                  background: 'white',
                  borderRadius: 6,
                  border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`,
                  borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                    <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                  </div>
                  <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                    <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                    <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                    {item.conflict && (
                      <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with another root cause
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Trade-offs */}
          <Accordion title="Trade-offs" defaultOpen={true}>
            <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
              <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                <strong>If recommended actions are applied:</strong>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs, marginBottom: sp.md }}>
                {(selectedAlert.actions || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                    <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500], flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '12px', color: C.neutral[600] }}>{item.tradeoff}</span>
                  </div>
                ))}
              </div>

              {/* Root Cause Scope Warning */}
              {selectedAlert.rootCause?.alertCount > 1 && (
                <div style={{ background: C.purple[50], borderRadius: 6, padding: sp.sm, border: `1px solid ${C.purple[200]}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                    <Lightbulb style={{ width: 14, height: 14, color: C.purple[600], flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: '12px', color: C.purple[700], lineHeight: 1.5 }}>
                        This alert shares a root cause with <strong>{selectedAlert.rootCause.alertCount - 1} other alert{selectedAlert.rootCause.alertCount > 2 ? 's' : ''}</strong>.
                        Fixing this alert individually may leave related issues unresolved.
                      </p>
                      <button
                        onClick={() => setSelectedAlert(null)}
                        style={{
                          marginTop: sp.xs,
                          fontSize: '12px',
                          fontWeight: 500,
                          color: C.purple[600],
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        View Root Cause: {selectedAlert.rootCause.name} <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Accordion>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.lg, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
            <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
              <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario Mode
            </button>
            <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
              <Users style={{ width: 14, height: 14 }} /> Delegate to Shift Lead
            </button>
            <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '13px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
              <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify Staff
            </button>
          </div>
            </Card>
          </div>
        ) : null}

        {/* All Alerts */}
        {!selectedAlert && (() => {
              // Filter alerts based on selected sub-tab
              const filterAlert = (a) => {
                if (insightsSubTab === 'overall') return true;
                if (insightsSubTab === 'staffing') {
                  return a.rootCause?.name?.toLowerCase().includes('staff') ||
                         a.title?.toLowerCase().includes('staff') ||
                         a.title?.toLowerCase().includes('fte') ||
                         a.title?.toLowerCase().includes('break') ||
                         a.title?.toLowerCase().includes('understaffed') ||
                         a.title?.toLowerCase().includes('swing');
                }
                if (insightsSubTab === 'work') {
                  return a.title?.toLowerCase().includes('ups') ||
                         a.title?.toLowerCase().includes('fedex') ||
                         a.title?.toLowerCase().includes('queue') ||
                         a.title?.toLowerCase().includes('velocity') ||
                         a.title?.toLowerCase().includes('carryover');
                }
                if (insightsSubTab === 'zones') {
                  return a.title?.toLowerCase().includes('zone') ||
                         a.title?.toLowerCase().includes('capacity') ||
                         a.title?.toLowerCase().includes('z0');
                }
                if (insightsSubTab === 'equipment') {
                  return a.category === 'equipment' ||
                         a.title?.toLowerCase().includes('pm ') ||
                         a.title?.toLowerCase().includes('fl-') ||
                         a.title?.toLowerCase().includes('epj-') ||
                         a.title?.toLowerCase().includes('rt-') ||
                         a.title?.toLowerCase().includes('tt-') ||
                         a.title?.toLowerCase().includes('battery') ||
                         a.title?.toLowerCase().includes('offline') ||
                         a.title?.toLowerCase().includes('repair');
                }
                if (insightsSubTab === 'schedules') {
                  return a.title?.toLowerCase().includes('shift') ||
                         a.title?.toLowerCase().includes('cutoff') ||
                         a.title?.toLowerCase().includes('handoff') ||
                         a.title?.toLowerCase().includes('break');
                }
                return true;
              };

              const filteredAlerts = alerts.filter(filterAlert);
              const subTabLabels = { overall: 'All', staffing: 'Staffing', work: 'Work Content', zones: 'Zones', equipment: 'Equipment', schedules: 'Schedules' };

              return (
                <div style={{
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                  WebkitColumnBreakInside: 'avoid',
                  marginBottom: sp.lg,
                  display: 'block',
                  width: '100%'
                }}>
                  <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sp.md }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 500 }}>
                      {insightsSubTab === 'overall' ? 'All Alerts' : `${subTabLabels[insightsSubTab]} Alerts`}
                    </h3>
                    <SeverityPills alerts={filteredAlerts} />
                  </div>
                  {filteredAlerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                      {filteredAlerts.map((a, i) => (
                        <Alert
                          key={i}
                          {...a}
                          id={`insight-${a.id}`}
                          isHighlighted={highlightedAlert === a.id}
                          onClick={() => setSelectedAlert(a)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: sp.lg, textAlign: 'center', color: C.neutral[500] }}>
                      <p style={{ fontSize: '13px' }}>No {subTabLabels[insightsSubTab].toLowerCase()} alerts at this time</p>
                    </div>
                  )}
                  </Card>
                </div>
              );
            })()}

        {/* Root Causes Section */}
        {!selectedAlert && (
          <div style={{
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
            WebkitColumnBreakInside: 'avoid',
            marginBottom: sp.lg,
            display: 'block',
            width: '100%'
          }}>
              <Card id="root-cause-analysis">
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: sp.lg }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.purple[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb style={{ width: 18, height: 18, color: C.purple[600] }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Root Cause Analysis</h3>
                  <p style={{ fontSize: '12px', color: C.neutral[500] }}>2 root causes identified from 4 alerts</p>
                </div>
              </div>

              {/* Root Cause 1: Staffing-Capacity Mismatch */}
              <div style={{ background: C.neutral[50], borderRadius: 8, padding: sp.md, marginBottom: sp.md, border: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.error[500] }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Staffing-Capacity Mismatch</span>
                  </div>
                  <Badge status="error" label="Affects 3 alerts" />
                </div>

                <Accordion title="What's Happening" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Insufficient staffing in high-velocity zones (Z03 Picking, Z04 Storage) is creating capacity pressure.
                    Z04 is at 83% and projected to hit 91% by 12:00. Meanwhile, picking velocity has dropped to 520/hr
                    (target: 600/hr) due to 4 FTE gap in Day Shift.
                  </p>
                  <AlertVisualization alertId="alert-1" type="whatsHappening" />
                </Accordion>

                <Accordion title="Why It Matters" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    If unaddressed, this cascade will cause ~40 UPS orders to miss the 15:30 cutoff, resulting in
                    <strong> $4,800 in SLA penalties</strong> and <strong>customer impact to 12 accounts</strong>.
                    Z04 capacity breach will also block inbound receiving, creating upstream delays.
                  </p>
                  <AlertVisualization alertId="alert-2" type="whyItMatters" />
                </Accordion>

                <Accordion title="Recommended Actions (3)" defaultOpen={true}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                    {[
                      { action: 'Reassign 2 FTEs from Z02 Putaway → Z03 Picking', impact: '+18% pick velocity', tradeoff: 'Z02 putaway slows ~12%', confidence: 89, owner: 'Shift Lead' },
                      { action: 'Authorize 4 hrs OT for Pack team (2 FTEs)', impact: '+200 orders/hr capacity', tradeoff: '+$180 labor cost', confidence: 94, conflict: true, owner: 'Ops Manager' },
                      { action: 'Prioritize UPS orders in pick queue', impact: 'UPS on-time ↑15%', tradeoff: 'FedEx orders may slip 8%', confidence: 78, owner: 'System' }
                    ].map((item, i) => (
                      <div key={i} style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`, borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                          <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                          <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                          <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                          {item.conflict && (
                            <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with Root Cause 2
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>

                <Accordion title="Trade-offs Summary" defaultOpen={false}>
                  <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                    <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                      <strong>If all actions are applied:</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowUpRight style={{ width: 14, height: 14, color: C.success[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Pick velocity increases ~18%, UPS on-time improves 15%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Z02 putaway slows 12%, FedEx orders may slip 8%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <DollarSign style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>+$180 labor cost from OT authorization</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], marginTop: sp.sm, fontStyle: 'italic' }}>
                      Net impact: Protects $4,800 in SLA penalties at cost of $180 + temporary slowdowns
                    </p>
                  </div>
                </Accordion>

                {/* Root Cause 1 Action Buttons */}
                <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Users style={{ width: 14, height: 14 }} /> Delegate
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify
                  </button>
                </div>
              </div>

              {/* Root Cause 2: Labor Cost Overrun */}
              <div style={{ background: C.neutral[50], borderRadius: 8, padding: sp.md, marginBottom: sp.md, border: `1px solid ${C.neutral[200]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.warning[500] }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Labor Cost Overrun</span>
                  </div>
                  <Badge status="warning" label="Affects 1 alert" />
                </div>

                <Accordion title="What's Happening" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Current labor spend is tracking 5.6% over budget ($6,420 actual vs $6,080 planned at this hour).
                    OT hours are at 24 (target: 18 by this point) and temp labor is at 4 FTEs.
                    Projected EOD spend is $13,100 vs $12,400 budget.
                  </p>
                  <AlertVisualization alertId="alert-4" type="whatsHappening" />
                </Accordion>

                <Accordion title="Why It Matters" defaultOpen={true}>
                  <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6 }}>
                    Continued trajectory will result in <strong>$700 budget overrun</strong> for the day.
                    If pattern continues through week, monthly impact could reach <strong>$15,000+</strong>.
                    Finance has flagged labor efficiency as a Q4 focus area.
                  </p>
                  <AlertVisualization alertId="alert-4" type="whyItMatters" />
                </Accordion>

                <Accordion title="Recommended Actions (2)" defaultOpen={true}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                    {[
                      { action: 'Reduce temp labor by 1 FTE after 12:00', impact: '-$95 labor cost', tradeoff: 'Slightly slower pack rate', confidence: 82, owner: 'Shift Lead' },
                      { action: 'Cap OT at 40 hrs total for shift', impact: 'Stay within budget', tradeoff: 'May need to deprioritize non-critical work', confidence: 91, conflict: true, owner: 'Ops Manager' }
                    ].map((item, i) => (
                      <div key={i} style={{ padding: sp.sm, background: 'white', borderRadius: 6, border: `1px solid ${item.conflict ? C.warning[300] : C.neutral[200]}`, borderLeft: `3px solid ${item.conflict ? C.warning[500] : C.success[500]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: sp.xs }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.action}</span>
                          <span style={{ fontSize: '10px', color: C.neutral[500], background: C.neutral[100], padding: '2px 6px', borderRadius: 4 }}>{item.owner}</span>
                        </div>
                        <div style={{ display: 'flex', gap: sp.md, fontSize: '11px', marginBottom: sp.xs }}>
                          <span style={{ color: C.success[600] }}>Impact: {item.impact}</span>
                          <span style={{ color: C.warning[600] }}>Trade-off: {item.tradeoff}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: C.neutral[500] }}>Confidence: {item.confidence}%</span>
                          {item.conflict && (
                            <span style={{ fontSize: '10px', color: C.warning[600], display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle style={{ width: 12, height: 12 }} /> Conflicts with Root Cause 1
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion>

                <Accordion title="Trade-offs Summary" defaultOpen={false}>
                  <div style={{ background: 'white', borderRadius: 6, padding: sp.sm, border: `1px solid ${C.neutral[200]}` }}>
                    <p style={{ fontSize: '13px', color: C.neutral[700], lineHeight: 1.6, marginBottom: sp.sm }}>
                      <strong>If all actions are applied:</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowUpRight style={{ width: 14, height: 14, color: C.success[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Labor cost reduced by ~$95, stays within budget ceiling</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
                        <ArrowDownRight style={{ width: 14, height: 14, color: C.warning[500] }} />
                        <span style={{ fontSize: '12px', color: C.neutral[600] }}>Pack rate may slow, some non-critical work deprioritized</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: C.neutral[500], marginTop: sp.sm, fontStyle: 'italic' }}>
                      Net impact: Maintains budget compliance but may impact throughput capacity
                    </p>
                  </div>
                </Accordion>

                {/* Root Cause 2 Action Buttons */}
                <div style={{ display: 'flex', gap: sp.sm, marginTop: sp.md, paddingTop: sp.md, borderTop: `1px solid ${C.neutral[200]}` }}>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Zap style={{ width: 14, height: 14 }} /> Explore in Scenario
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.brand[600], background: C.brand[50], border: `1px solid ${C.brand[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <Users style={{ width: 14, height: 14 }} /> Delegate
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.md}`, fontSize: '12px', fontWeight: 500, color: C.success[600], background: C.success[50], border: `1px solid ${C.success[200]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.xs }}>
                    <CheckCircle style={{ width: 14, height: 14 }} /> Apply Now & Notify
                  </button>
                </div>
              </div>

              {/* Conflict Warning */}
              <div style={{ background: C.warning[50], border: `1px solid ${C.warning[200]}`, borderRadius: 8, padding: sp.md, marginBottom: sp.md, display: 'flex', alignItems: 'flex-start', gap: sp.sm }}>
                <AlertTriangle style={{ width: 20, height: 20, color: C.warning[600], flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.warning[700], marginBottom: sp.xs }}>Conflict Detected Between Root Causes</p>
                  <p style={{ fontSize: '13px', color: C.warning[700], lineHeight: 1.5 }}>
                    "Authorize 4 hrs OT" (Root Cause 1) directly worsens "Labor Cost Overrun" (Root Cause 2).
                    Consider prioritizing FTE reassignment before authorizing overtime, or accept the cost trade-off to protect SLAs.
                  </p>
                </div>
              </div>

              {/* Bulk Actions - Apply All */}
              <div style={{ background: C.purple[50], border: `1px solid ${C.purple[200]}`, borderRadius: 8, padding: sp.md }}>
                <div style={{ marginBottom: sp.sm }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.purple[700] }}>Bulk Actions</p>
                  <p style={{ fontSize: '12px', color: C.purple[600] }}>Apply all recommended solutions across both root causes (accepts all trade-offs and conflicts)</p>
                </div>
                <div style={{ display: 'flex', gap: sp.sm }}>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: 'white', background: C.purple[600], border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Zap style={{ width: 16, height: 16 }} /> Explore All in Scenario Mode
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: C.brand[600], background: 'white', border: `1px solid ${C.brand[300]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <Users style={{ width: 16, height: 16 }} /> Delegate All to Shift Lead
                  </button>
                  <button style={{ padding: `${sp.sm} ${sp.lg}`, fontSize: '13px', fontWeight: 500, color: C.success[700], background: C.success[100], border: `1px solid ${C.success[300]}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: sp.sm }}>
                    <CheckCircle style={{ width: 16, height: 16 }} /> Apply All Now & Notify Staff
                  </button>
                </div>
              </div>
              </Card>
            </div>
          )}

      </div>
    </>
  );
};

export default InsightsTabContent;
