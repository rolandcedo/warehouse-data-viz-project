import React, { useState } from 'react';
import { Zap, X, Lightbulb, Radio, ChevronDown, CheckCircle, GripVertical, RotateCcw } from 'lucide-react';
import { useTimeContext } from '../context/TimeContext';
import { C, sp } from '../styles/designSystem';

const TimeScrubber = () => {
  const {
    nowTime, contextualTime, setContextualTime, isContextualDifferent, isContextualPast, resetToNow, decimalToTime, timeToDecimal,
    scenarioMode, activeScenario, activeScenarioId, availableScenarios, toggleScenarioMode,
    scenarioSource, draftPlanScenario, exitDraftPlanScenario
  } = useTimeContext();

  // State for scenario dropdown
  const [isOpen, setIsOpen] = useState(false);

  const START_HOUR = 6;  // 06:00
  const END_HOUR = 22;   // 22:00
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  const nowDecimal = timeToDecimal(nowTime);
  const contextualDecimal = timeToDecimal(contextualTime);

  const timeToPercent = (decimal) => ((decimal - START_HOUR) / TOTAL_HOURS) * 100;
  const percentToTime = (percent) => START_HOUR + (percent / 100) * TOTAL_HOURS;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const decimal = percentToTime(Math.max(0, Math.min(100, percent)));
    // Snap to 15-minute intervals
    const snapped = Math.round(decimal * 4) / 4;
    setContextualTime(decimalToTime(snapped));
  };

  // Generate hour markers
  const hourMarkers = [];
  for (let h = START_HOUR; h <= END_HOUR; h += 2) {
    hourMarkers.push(h);
  }

  // Shift boundaries
  const shifts = [
    { name: 'Day', start: 6, end: 14, color: C.warning[300] },
    { name: 'Swing', start: 14, end: 22, color: C.purple[300] },
  ];

  return (
    <div style={{ background: 'white', border: 'none', borderBottom: `1px solid ${C.neutral[200]}`, borderRadius: 0, padding: `${sp.sm} ${sp.lg}` }}>
      {/* Scenario Mode Banner - Manual Scenario */}
      {scenarioMode && scenarioSource === 'manual' && activeScenario && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: sp.sm,
          marginBottom: sp.md,
          background: `linear-gradient(135deg, ${C.purple[50]} 0%, ${C.brand[50]} 100%)`,
          borderRadius: 6,
          border: `1px solid ${C.purple[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Zap style={{ width: 16, height: 16, color: C.purple[600] }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: C.purple[700] }}>Scenario Mode:</span>
            <span style={{ fontSize: '0.8125rem', color: C.purple[600] }}>{activeScenario.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <button
              onClick={() => toggleScenarioMode(false)}
              style={{
                padding: '4px 10px',
                fontSize: '0.6875rem',
                background: 'white',
                color: C.neutral[600],
                border: `1px solid ${C.neutral[300]}`,
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Exit Scenario
            </button>
          </div>
        </div>
      )}

      {/* Scenario Mode Banner - Exploratory/Draft Plan */}
      {scenarioMode && scenarioSource === 'draft-plan' && draftPlanScenario && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: sp.sm,
          marginBottom: sp.md,
          background: `linear-gradient(135deg, ${C.purple[100]} 0%, ${C.brand[50]} 100%)`,
          borderRadius: 6,
          border: `1px solid ${C.purple[300]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <Lightbulb style={{ width: 16, height: 16, color: C.purple[600] }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: C.purple[800] }}>Exploratory Scenario:</span>
            <span style={{ fontSize: '0.8125rem', color: C.purple[700] }}>{draftPlanScenario.planName}</span>
            <span style={{ fontSize: '0.6875rem', color: C.purple[500], marginLeft: 4 }}>— Viewing projected impact if plan succeeds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <button
              onClick={() => exitDraftPlanScenario && exitDraftPlanScenario()}
              style={{
                padding: '4px 10px',
                fontSize: '0.6875rem',
                background: 'white',
                color: C.purple[700],
                border: `1px solid ${C.purple[300]}`,
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <X style={{ width: 12, height: 12 }} />
              Exit to Live
            </button>
          </div>
        </div>
      )}

      {/* Main controls container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: sp.lg, marginBottom: sp.md }}>
        {/* LEFT: Scenario selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <span style={{ fontSize: '0.75rem', color: C.neutral[500] }}>Scenario:</span>
            {scenarioSource === 'draft-plan' && draftPlanScenario ? (
              // Exploratory/Draft Plan scenario display
              <div style={{ display: 'flex', alignItems: 'center', gap: sp.xs }}>
                <div style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  border: `1px solid ${C.purple[400]}`,
                  borderRadius: 4,
                  background: C.purple[100],
                  color: C.purple[800],
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  maxWidth: 200
                }}>
                  <Lightbulb style={{ width: 12, height: 12, color: C.purple[600], flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Exploratory: {draftPlanScenario.planName.length > 20 ? draftPlanScenario.planName.substring(0, 20) + '...' : draftPlanScenario.planName}
                  </span>
                </div>
                <button
                  onClick={() => exitDraftPlanScenario && exitDraftPlanScenario()}
                  title="Exit to Live Mode"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    background: 'white',
                    color: C.purple[600],
                    border: `1px solid ${C.purple[300]}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <X style={{ width: 12, height: 12 }} />
                  Exit
                </button>
              </div>
            ) : (
              // Enhanced scenario dropdown with state impacts
              (() => {
                // Calculate impact summary from scenario data
                const getScenarioImpact = (scenario) => {
                  if (!scenario.alertImpact) {
                    return { mitigated: 0, persists: 5, newAlerts: 0, healthDelta: scenario.impacts?.health?.delta || 0 };
                  }
                  return {
                    mitigated: scenario.alertImpact.mitigated?.length || 0,
                    persists: scenario.alertImpact.persists?.length || 0,
                    newAlerts: scenario.alertImpact.newAlerts?.length || 0,
                    healthDelta: scenario.impacts?.health?.delta || 0
                  };
                };

                const currentScenario = scenarioMode ? availableScenarios.find(s => s.id === activeScenarioId) : null;
                const currentImpact = currentScenario ? getScenarioImpact(currentScenario) : null;

                return (
                  <div style={{ position: 'relative' }}>
                    {/* Dropdown Trigger */}
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        border: `1px solid ${scenarioMode ? C.purple[300] : C.neutral[300]}`,
                        borderRadius: 4,
                        background: scenarioMode ? C.purple[50] : 'white',
                        color: scenarioMode ? C.purple[700] : C.neutral[700],
                        cursor: 'pointer',
                        minWidth: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: sp.sm
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {scenarioMode ? (
                          <>
                            <Zap style={{ width: 12, height: 12, color: C.purple[500] }} />
                            <span style={{ fontWeight: 500 }}>{currentScenario?.name || 'Scenario'}</span>
                          </>
                        ) : (
                          <>
                            <Radio style={{ width: 12, height: 12, color: C.success[500] }} />
                            <span>Live Mode</span>
                          </>
                        )}
                      </div>
                      <ChevronDown style={{ width: 14, height: 14, opacity: 0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
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
                          left: 0,
                          marginTop: 4,
                          width: 320,
                          background: 'white',
                          border: `1px solid ${C.neutral[200]}`,
                          borderRadius: 8,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                          zIndex: 999,
                          overflow: 'hidden'
                        }}>
                          {/* Live Mode Option */}
                          <div
                            onClick={() => { toggleScenarioMode(false); setIsOpen(false); }}
                            style={{
                              padding: sp.md,
                              cursor: 'pointer',
                              background: !scenarioMode ? C.success[50] : 'white',
                              borderBottom: `1px solid ${C.neutral[100]}`,
                              transition: 'background 0.1s'
                            }}
                            onMouseEnter={(e) => { if (scenarioMode) e.currentTarget.style.background = C.neutral[50]; }}
                            onMouseLeave={(e) => { if (scenarioMode) e.currentTarget.style.background = 'white'; }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                              <Radio style={{ width: 14, height: 14, color: C.success[500] }} />
                              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: C.neutral[800] }}>Live Mode</span>
                              {!scenarioMode && <CheckCircle style={{ width: 14, height: 14, color: C.success[500], marginLeft: 'auto' }} />}
                            </div>
                            <p style={{ fontSize: '0.6875rem', color: C.neutral[500], margin: 0, paddingLeft: 22 }}>
                              Ground truth — Current facility state
                            </p>
                          </div>

                          {/* Scenarios Header */}
                          <div style={{ padding: `${sp.sm} ${sp.md}`, background: C.neutral[50], borderBottom: `1px solid ${C.neutral[100]}` }}>
                            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: C.neutral[500], textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              What-If Scenarios
                            </span>
                          </div>

                          {/* Scenario Options */}
                          {availableScenarios.map(scenario => {
                            const impact = getScenarioImpact(scenario);
                            const isSelected = scenarioMode && activeScenarioId === scenario.id;

                            return (
                              <div
                                key={scenario.id}
                                onClick={() => { toggleScenarioMode(true, scenario.id); setIsOpen(false); }}
                                style={{
                                  padding: sp.md,
                                  cursor: 'pointer',
                                  background: isSelected ? C.purple[50] : 'white',
                                  borderBottom: `1px solid ${C.neutral[100]}`,
                                  transition: 'background 0.1s'
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = C.neutral[50]; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, marginBottom: 4 }}>
                                  <Zap style={{ width: 14, height: 14, color: C.purple[500] }} />
                                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: C.neutral[800] }}>{scenario.name}</span>
                                  {isSelected && <CheckCircle style={{ width: 14, height: 14, color: C.purple[500], marginLeft: 'auto' }} />}
                                </div>
                                <p style={{ fontSize: '0.6875rem', color: C.neutral[500], margin: 0, marginBottom: 8, paddingLeft: 22 }}>
                                  {scenario.description}
                                </p>

                                {/* Impact Summary */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm, paddingLeft: 22, flexWrap: 'wrap' }}>
                                  {impact.mitigated > 0 && (
                                    <span style={{
                                      fontSize: '0.625rem',
                                      padding: '2px 6px',
                                      background: C.success[100],
                                      color: C.success[700],
                                      borderRadius: 4,
                                      fontWeight: 500
                                    }}>
                                      ✓ {impact.mitigated} mitigated
                                    </span>
                                  )}
                                  {impact.persists > 0 && (
                                    <span style={{
                                      fontSize: '0.625rem',
                                      padding: '2px 6px',
                                      background: C.neutral[100],
                                      color: C.neutral[600],
                                      borderRadius: 4,
                                      fontWeight: 500
                                    }}>
                                      {impact.persists} persist
                                    </span>
                                  )}
                                  {impact.newAlerts > 0 && (
                                    <span style={{
                                      fontSize: '0.625rem',
                                      padding: '2px 6px',
                                      background: C.warning[100],
                                      color: C.warning[700],
                                      borderRadius: 4,
                                      fontWeight: 500
                                    }}>
                                      +{impact.newAlerts} new
                                    </span>
                                  )}
                                  <span style={{
                                    fontSize: '0.625rem',
                                    padding: '2px 6px',
                                    background: impact.healthDelta > 0 ? C.success[100] : C.neutral[100],
                                    color: impact.healthDelta > 0 ? C.success[700] : C.neutral[600],
                                    borderRadius: 4,
                                    fontWeight: 600,
                                    marginLeft: 'auto'
                                  }}>
                                    Health {impact.healthDelta > 0 ? '+' : ''}{impact.healthDelta}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()
            )}
          </div>

        {/* CENTER: Timeline track */}
        <div
          style={{ flex: 1, position: 'relative', height: 34, cursor: 'pointer', userSelect: 'none' }}
          onClick={handleClick}
        >
        {/* Shift backgrounds */}
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 24, display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {shifts.map((shift, i) => (
            <div
              key={i}
              style={{
                width: `${((shift.end - shift.start) / TOTAL_HOURS) * 100}%`,
                background: `${shift.color}40`,
                borderRight: i < shifts.length - 1 ? `1px dashed ${C.neutral[300]}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '0.625rem', fontWeight: 500, color: C.neutral[600], textTransform: 'uppercase' }}>{shift.name}</span>
            </div>
          ))}
        </div>

        {/* Track line */}
        <div style={{ position: 'absolute', top: 18, left: 0, right: 0, height: 4, background: C.neutral[200], borderRadius: 2 }} />

        {/* Now marker (fixed) */}
        <div style={{
          position: 'absolute',
          left: `${timeToPercent(nowDecimal)}%`,
          top: 6,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          zIndex: 10
        }}>
          <div style={{
            width: 4, height: 28,
            background: C.neutral[800],
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
          <span style={{ fontSize: '0.625rem', fontWeight: 600, color: C.neutral[800], marginTop: 2 }}>NOW</span>
        </div>

        {/* Contextual marker (movable) */}
        {isContextualDifferent && (
          <div style={{
            position: 'absolute',
            left: `${timeToPercent(contextualDecimal)}%`,
            top: 4,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 15
          }}>
            <div style={{
              width: 14, height: 32,
              background: C.brand[500],
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(47, 114, 255, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GripVertical style={{ width: 10, height: 10, color: 'white' }} />
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: C.brand[600], marginTop: 2 }}>{contextualTime}</span>
          </div>
        )}

        {/* Hour markers */}
        <div style={{ position: 'absolute', top: 38, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
          {hourMarkers.map(h => (
            <span key={h} style={{ fontSize: '0.625rem', color: C.neutral[400], transform: 'translateX(-50%)', position: 'absolute', left: `${timeToPercent(h)}%` }}>
              {h.toString().padStart(2, '0')}:00
            </span>
          ))}
        </div>
        </div>

        {/* RIGHT: Now/Viewing stacked vertically */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: sp.xs,
          minWidth: 140
        }}>
          {/* Now display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
            <div style={{ width: 12, height: 12, background: C.neutral[800], borderRadius: 2 }} />
            <span style={{ fontSize: '0.8125rem', fontFamily: 'Roboto, sans-serif', color: C.neutral[600] }}>
              Now: <strong>{nowTime}</strong>
            </span>
          </div>

          {/* Viewing display (conditional) */}
          {isContextualDifferent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: sp.sm }}>
              <div style={{ width: 12, height: 12, background: C.brand[500], borderRadius: 2 }} />
              <span style={{ fontSize: '0.8125rem', fontFamily: 'Roboto, sans-serif', color: C.brand[600] }}>
                Viewing: <strong>{contextualTime}</strong>
                {isContextualPast && (
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'Roboto, sans-serif', color: C.neutral[500], marginLeft: 4 }}>
                    (past)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Reset button (only when time differs) */}
        {isContextualDifferent && (
          <button
            onClick={resetToNow}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 4,
              border: `1px solid ${C.neutral[300]}`,
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'Roboto, sans-serif',
              color: C.neutral[600],
              height: 'fit-content'
            }}
          >
            <RotateCcw style={{ width: 12, height: 12 }} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeScrubber;
