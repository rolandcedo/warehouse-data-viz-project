import React, { createContext, useContext, useState } from 'react';

// ===== TIME CONTEXT =====
// Global state for contextual time across all components
const TimeContext = createContext();

export const useTimeContext = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTimeContext must be used within TimeProvider');
  }
  return context;
};

// Convert time string "HH:MM" to decimal hours (e.g., "10:30" -> 10.5)
export const timeToDecimal = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
};

// Convert decimal hours to time string
export const decimalToTime = (decimal) => {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Interpolate a value from timeline data at a given time
export const interpolateValue = (timelineData, targetTime, valueKey = 'actual') => {
  if (!timelineData || timelineData.length === 0) return null;

  const targetDecimal = typeof targetTime === 'string' ? timeToDecimal(targetTime) : targetTime;

  // Find surrounding data points
  for (let i = 0; i < timelineData.length - 1; i++) {
    const curr = timelineData[i];
    const next = timelineData[i + 1];
    const currTime = timeToDecimal(curr.time);
    const nextTime = timeToDecimal(next.time);

    if (targetDecimal >= currTime && targetDecimal <= nextTime) {
      const progress = (targetDecimal - currTime) / (nextTime - currTime);
      const currVal = curr[valueKey] ?? curr.predicted ?? curr.actual;
      const nextVal = next[valueKey] ?? next.predicted ?? next.actual;
      if (currVal !== null && nextVal !== null) {
        return Math.round(currVal + (nextVal - currVal) * progress);
      }
    }
  }

  // Return first or last value if out of range
  const firstTime = timeToDecimal(timelineData[0].time);
  const lastTime = timeToDecimal(timelineData[timelineData.length - 1].time);
  if (targetDecimal <= firstTime) {
    return timelineData[0][valueKey] ?? timelineData[0].actual;
  }
  if (targetDecimal >= lastTime) {
    const last = timelineData[timelineData.length - 1];
    return last[valueKey] ?? last.predicted ?? last.actual;
  }

  return null;
};

// Available scenarios (mock data)
export const AVAILABLE_SCENARIOS = [
  {
    id: 'scenario-1',
    name: '+2 FTEs for Outbound Surge',
    description: 'Add 2 temp workers starting at 12:00 to handle predicted volume spike',
    triggerTime: '12:00',
    impacts: {
      staffing: { delta: +8 },
      throughput: { delta: +12 },
      health: { delta: +7 },
      laborCost: { delta: +320 }
    },
    alertImpact: {
      mitigated: ['alert-1', 'alert-2', 'alert-3'], // Zone capacity, UPS cutoff, Swing understaffed
      persists: ['alert-4', 'alert-5'],              // Labor over budget, Receiving backup
      newAlerts: ['alert-new-1']                     // Possible overtime concern
    }
  },
  {
    id: 'scenario-2',
    name: 'Stagger Breaks by 15min',
    description: 'Offset break times to maintain coverage during lunch',
    triggerTime: '11:00',
    impacts: {
      staffing: { delta: +4 },
      throughput: { delta: +5 },
      health: { delta: +3 },
      laborCost: { delta: 0 }
    },
    alertImpact: {
      mitigated: ['alert-3'],                        // Swing understaffed partially addressed
      persists: ['alert-1', 'alert-2', 'alert-4', 'alert-5'],
      newAlerts: []
    }
  },
  {
    id: 'scenario-3',
    name: 'Activate Overflow Zone Z07',
    description: 'Enable overflow zone to handle bulk storage capacity breach',
    triggerTime: '11:30',
    impacts: {
      staffing: { delta: 0 },
      throughput: { delta: +3 },
      health: { delta: +4 },
      laborCost: { delta: +80 }
    },
    alertImpact: {
      mitigated: ['alert-1'],                        // Zone capacity
      persists: ['alert-2', 'alert-3', 'alert-4', 'alert-5'],
      newAlerts: []
    }
  }
];

export const TimeProvider = ({ children }) => {
  const NOW_TIME = '10:00'; // Fixed "now" for mockup
  const [contextualTime, setContextualTime] = useState(NOW_TIME);

  // View Mode state - controls baseline reality
  const [viewMode, setViewMode] = useState('live-plan'); // 'live' | 'live-plan'

  // Scenario state
  const [scenarioMode, setScenarioMode] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [scenarioSource, setScenarioSource] = useState('manual'); // 'manual' | 'draft-plan'
  const [draftPlanScenario, setDraftPlanScenario] = useState(null); // { planId, planName, projectedImpacts }

  // EOS vs EOD toggle (global)
  const [endTimeMode, setEndTimeMode] = useState('eos'); // 'eos' or 'eod'
  const END_OF_SHIFT = '14:00';  // Day shift ends
  const END_OF_DAY = '22:00';    // End of operations
  const endTime = endTimeMode === 'eos' ? END_OF_SHIFT : END_OF_DAY;
  const endTimeLabel = endTimeMode === 'eos' ? 'EOS' : 'EOD';

  const isContextualDifferent = contextualTime !== NOW_TIME;
  const isContextualPast = timeToDecimal(contextualTime) < timeToDecimal(NOW_TIME);
  const isContextualFuture = timeToDecimal(contextualTime) > timeToDecimal(NOW_TIME);

  const resetToNow = () => setContextualTime(NOW_TIME);

  // Get active scenario data
  const activeScenario = activeScenarioId ? AVAILABLE_SCENARIOS.find(s => s.id === activeScenarioId) : null;

  // Toggle scenario mode
  const toggleScenarioMode = (enabled, scenarioId = null) => {
    setScenarioMode(enabled);
    setActiveScenarioId(enabled ? (scenarioId || AVAILABLE_SCENARIOS[0].id) : null);
    if (!enabled) {
      setScenarioSource('manual');
      setDraftPlanScenario(null);
    }
  };

  // Activate draft plan scenario mode
  const activateDraftPlanScenario = (planId, planName, projectedImpacts) => {
    setScenarioMode(true);
    setScenarioSource('draft-plan');
    setDraftPlanScenario({ planId, planName, projectedImpacts });
    setActiveScenarioId(null); // Clear manual scenario
  };

  // Exit draft plan scenario
  const exitDraftPlanScenario = () => {
    setScenarioMode(false);
    setScenarioSource('manual');
    setDraftPlanScenario(null);
  };

  // Calculate scenario-adjusted value based on time and scenario impacts
  const getScenarioValue = (baseValue, impactKey, atTime) => {
    if (!scenarioMode || !activeScenario) return baseValue;

    const impact = activeScenario.impacts[impactKey];
    if (!impact) return baseValue;

    const triggerDecimal = timeToDecimal(activeScenario.triggerTime);
    const atDecimal = typeof atTime === 'string' ? timeToDecimal(atTime) : atTime;

    // Scenario impact only applies after trigger time
    if (atDecimal >= triggerDecimal) {
      // Gradual ramp-up over 1 hour after trigger
      const hoursSinceTrigger = atDecimal - triggerDecimal;
      const rampFactor = Math.min(1, hoursSinceTrigger / 1);
      return Math.round(baseValue + (impact.delta * rampFactor));
    }

    return baseValue;
  };

  return (
    <TimeContext.Provider value={{
      nowTime: NOW_TIME,
      contextualTime,
      setContextualTime,
      isContextualDifferent,
      isContextualPast,
      isContextualFuture,
      resetToNow,
      timeToDecimal,
      decimalToTime,
      interpolateValue,
      // View mode state
      viewMode,
      setViewMode,
      // Scenario state
      scenarioMode,
      activeScenario,
      activeScenarioId,
      availableScenarios: AVAILABLE_SCENARIOS,
      toggleScenarioMode,
      setActiveScenarioId,
      getScenarioValue,
      // Draft plan scenario
      scenarioSource,
      draftPlanScenario,
      activateDraftPlanScenario,
      exitDraftPlanScenario,
      // End time mode
      endTimeMode,
      setEndTimeMode,
      endTime,
      endTimeLabel
    }}>
      {children}
    </TimeContext.Provider>
  );
};
