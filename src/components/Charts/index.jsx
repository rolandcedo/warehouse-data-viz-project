import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useTimeContext } from '../../context/TimeContext';
import { C, sp } from '../../styles/designSystem';

// ===== PREDICTIVE TIMELINE CHART =====
const PredictiveTimeline = ({ data, height = 120, yLabel, target, warning, critical, showConfidence = true, contextualTime }) => {
  const nowIndex = data.findIndex(d => d.now);
  const legendHeight = 24;

  // Calculate contextual time position if provided
  const getContextualPosition = () => {
    if (!contextualTime || !data || data.length < 2) return null;

    const times = data.map(d => {
      const [h, m] = d.time.split(':').map(Number);
      return h + m / 60;
    });
    const [ctxH, ctxM] = contextualTime.split(':').map(Number);
    const ctxDecimal = ctxH + ctxM / 60;

    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    if (ctxDecimal < minTime || ctxDecimal > maxTime) return null;

    // Find position as percentage
    const position = ((ctxDecimal - minTime) / (maxTime - minTime)) * 100;

    // Check if contextual is same as now
    const nowTime = data[nowIndex]?.time;
    if (nowTime === contextualTime) return null;

    return position;
  };

  const contextualPosition = getContextualPosition();

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple[500]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={C.purple[500]} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brand[500]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.brand[500]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={30} domain={['auto', 'auto']} />
            {critical && <Area type="monotone" dataKey={() => critical} stroke="none" fill={C.error[100]} fillOpacity={0.5} />}
            {warning && <Area type="monotone" dataKey={() => warning} stroke="none" fill={C.warning[100]} fillOpacity={0.3} />}
            {showConfidence && <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confBand)" />}
            {showConfidence && <Area type="monotone" dataKey="lower" stroke="none" fill="url(#confBand)" />}
            <Area type="monotone" dataKey="actual" stroke={C.brand[500]} strokeWidth={2} fill="url(#actualFill)" dot={false} />
            <Area type="monotone" dataKey="predicted" stroke={C.purple[500]} strokeWidth={2} strokeDasharray="6 3" fill="none" dot={false} />
            {target && <Area type="monotone" dataKey={() => target} stroke={C.success[500]} strokeWidth={1} strokeDasharray="4 4" fill="none" />}
          </AreaChart>
        </ResponsiveContainer>
        {/* NOW marker */}
        {nowIndex >= 0 && (
          <div style={{ position: 'absolute', top: 10, bottom: 5, left: `${(nowIndex / (data.length - 1)) * 100}%`, width: 2, background: C.neutral[900], zIndex: 10 }}>
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C.neutral[900], color: 'white', padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 600 }}>NOW</div>
          </div>
        )}
        {/* CONTEXTUAL TIME marker */}
        {contextualPosition !== null && (
          <div style={{ position: 'absolute', top: 10, bottom: 5, left: `${contextualPosition}%`, width: 3, background: C.brand[500], zIndex: 15, borderRadius: 1, boxShadow: `0 0 8px ${C.brand[500]}60` }}>
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C.brand[500], color: 'white', padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>{contextualTime}</div>
          </div>
        )}
      </div>
      {/* Legend - Bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: sp.lg, paddingTop: sp.sm, borderTop: `1px solid ${C.neutral[100]}`, marginTop: sp.sm }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
          <span style={{ width: 20, height: 3, background: C.brand[500], borderRadius: 2 }} />
          Actual
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
          <span style={{ width: 20, height: 0, borderTop: `3px dashed ${C.purple[500]}` }} />
          Predicted
        </span>
        {showConfidence && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
            <span style={{ width: 20, height: 10, background: `linear-gradient(180deg, ${C.purple[500]}40 0%, ${C.purple[500]}10 100%)`, borderRadius: 2 }} />
            Confidence
          </span>
        )}
        {target && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
            <span style={{ width: 20, height: 0, borderTop: `2px dashed ${C.success[500]}` }} />
            Target
          </span>
        )}
        {warning && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
            <span style={{ width: 20, height: 10, background: C.warning[100], borderRadius: 2 }} />
            Warning
          </span>
        )}
        {critical && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
            <span style={{ width: 20, height: 10, background: C.error[100], borderRadius: 2 }} />
            Critical
          </span>
        )}
      </div>
    </div>
  );
};

// ===== SCENARIO COMPARISON TIMELINE =====
// Shows baseline (gray) vs scenario (purple) with shaded delta region
const ScenarioPredictiveTimeline = ({ data, scenarioData, height = 140, target, contextualTime }) => {
  const nowIndex = data.findIndex(d => d.now);

  // Merge data for chart - combine baseline and scenario predictions
  const mergedData = data.map((d, i) => ({
    ...d,
    scenarioPredicted: scenarioData[i]?.predicted || null,
    scenarioUpper: scenarioData[i]?.upper || null,
    scenarioLower: scenarioData[i]?.lower || null
  }));

  // Calculate contextual time position
  const getContextualPosition = () => {
    if (!contextualTime || !data || data.length < 2) return null;
    const times = data.map(d => {
      const [h, m] = d.time.split(':').map(Number);
      return h + m / 60;
    });
    const [ctxH, ctxM] = contextualTime.split(':').map(Number);
    const ctxDecimal = ctxH + ctxM / 60;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    if (ctxDecimal < minTime || ctxDecimal > maxTime) return null;
    const position = ((ctxDecimal - minTime) / (maxTime - minTime)) * 100;
    const nowTime = data[nowIndex]?.time;
    if (nowTime === contextualTime) return null;
    return position;
  };

  const contextualPosition = getContextualPosition();

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              {/* Baseline confidence band - gray */}
              <linearGradient id="baselineConfBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.neutral[500]} stopOpacity={0.15} />
                <stop offset="100%" stopColor={C.neutral[500]} stopOpacity={0.02} />
              </linearGradient>
              {/* Scenario confidence band - purple */}
              <linearGradient id="scenarioConfBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple[500]} stopOpacity={0.25} />
                <stop offset="100%" stopColor={C.purple[500]} stopOpacity={0.05} />
              </linearGradient>
              {/* Actual fill */}
              <linearGradient id="actualFillScenario" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brand[500]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.brand[500]} stopOpacity={0} />
              </linearGradient>
              {/* Delta fill between baseline and scenario */}
              <linearGradient id="deltaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.success[500]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={C.success[500]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={{ stroke: C.neutral[200] }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.neutral[500] }} axisLine={false} tickLine={false} width={35} domain={['auto', 'auto']} />

            {/* Baseline confidence band */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#baselineConfBand)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="url(#baselineConfBand)" />

            {/* Scenario confidence band */}
            <Area type="monotone" dataKey="scenarioUpper" stroke="none" fill="url(#scenarioConfBand)" />
            <Area type="monotone" dataKey="scenarioLower" stroke="none" fill="url(#scenarioConfBand)" />

            {/* Actual data */}
            <Area type="monotone" dataKey="actual" stroke={C.brand[500]} strokeWidth={2} fill="url(#actualFillScenario)" dot={false} />

            {/* Baseline prediction - gray dashed */}
            <Area type="monotone" dataKey="predicted" stroke={C.neutral[400]} strokeWidth={2} strokeDasharray="4 4" fill="none" dot={false} />

            {/* Scenario prediction - purple solid */}
            <Area type="monotone" dataKey="scenarioPredicted" stroke={C.purple[500]} strokeWidth={2.5} fill="none" dot={false} />

            {/* Target line */}
            {target && <Area type="monotone" dataKey={() => target} stroke={C.success[500]} strokeWidth={1} strokeDasharray="4 4" fill="none" />}
          </AreaChart>
        </ResponsiveContainer>

        {/* NOW marker */}
        {nowIndex >= 0 && (
          <div style={{ position: 'absolute', top: 10, bottom: 5, left: `${(nowIndex / (data.length - 1)) * 100}%`, width: 2, background: C.neutral[900], zIndex: 10 }}>
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C.neutral[900], color: 'white', padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 600 }}>NOW</div>
          </div>
        )}

        {/* CONTEXTUAL TIME marker */}
        {contextualPosition !== null && (
          <div style={{ position: 'absolute', top: 10, bottom: 5, left: `${contextualPosition}%`, width: 3, background: C.brand[500], zIndex: 15, borderRadius: 1, boxShadow: `0 0 8px ${C.brand[500]}60` }}>
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: C.brand[500], color: 'white', padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>{contextualTime}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: sp.lg, paddingTop: sp.sm, borderTop: `1px solid ${C.neutral[100]}`, marginTop: sp.sm }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
          <span style={{ width: 20, height: 3, background: C.brand[500], borderRadius: 2 }} />
          Actual
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
          <span style={{ width: 20, height: 0, borderTop: `2px dashed ${C.neutral[400]}` }} />
          Baseline
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
          <span style={{ width: 20, height: 3, background: C.purple[500], borderRadius: 2 }} />
          Scenario
        </span>
        {target && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.neutral[600] }}>
            <span style={{ width: 20, height: 0, borderTop: `2px dashed ${C.success[500]}` }} />
            Target
          </span>
        )}
      </div>
    </div>
  );
};

export { PredictiveTimeline, ScenarioPredictiveTimeline };
