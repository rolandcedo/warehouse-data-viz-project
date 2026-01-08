import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTimeContext } from '../context/TimeContext';
import { C, sp } from '../styles/designSystem';

const TriTemporalMetric = ({
  current,
  predicted,
  contextualValue,
  unit = '',
  currentLabel = 'Now',
  predictedLabel = 'EOD',
  size = 'default', // 'compact', 'default', 'large'
  showLabels = true
}) => {
  const { contextualTime, isContextualDifferent, isContextualPast } = useTimeContext();

  const sizes = {
    compact: { value: '16px', label: '10px', arrow: 12, gap: sp.sm },
    default: { value: '24px', label: '11px', arrow: 14, gap: sp.md },
    large: { value: '36px', label: '12px', arrow: 18, gap: sp.lg }
  };
  const s = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {/* Current */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: s.value, fontWeight: 500, color: C.neutral[900] }}>{current}{unit}</span>
        {showLabels && <p style={{ fontSize: s.label, color: C.neutral[500] }}>{currentLabel}</p>}
      </div>

      {/* Contextual (only if different from now) */}
      {isContextualDifferent && contextualValue !== null && contextualValue !== undefined && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.neutral[400] }}>
            <ArrowRight style={{ width: s.arrow, height: s.arrow }} />
          </div>
          <div style={{
            textAlign: 'center',
            padding: '4px 8px',
            background: C.brand[100],
            borderRadius: 6,
            border: `1px solid ${C.brand[500]}30`
          }}>
            <span style={{ fontSize: s.value, fontWeight: 500, color: C.brand[600] }}>{contextualValue}{unit}</span>
            {showLabels && (
              <p style={{ fontSize: s.label, color: C.brand[500] }}>
                @{contextualTime} {isContextualPast && <span style={{ fontSize: '9px' }}>(past)</span>}
              </p>
            )}
          </div>
        </>
      )}

      {/* Predicted */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.neutral[400] }}>
        <ArrowRight style={{ width: s.arrow, height: s.arrow }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: s.value, fontWeight: 500, color: C.purple[600] }}>{predicted}{unit}</span>
        {showLabels && <p style={{ fontSize: s.label, color: C.neutral[500] }}>{predictedLabel}</p>}
      </div>
    </div>
  );
};

export default TriTemporalMetric;
