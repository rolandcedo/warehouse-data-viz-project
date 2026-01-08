// Generate 8-hour timeline data (-4hr to +4hr from NOW at 10:00)
export const genTimelineData = (baseActual, basePred, variance = 0.1, trend = 0) => {
  const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  const nowIdx = 4; // 10:00
  return times.map((time, i) => {
    const isActual = i <= nowIdx;
    const progress = i / (times.length - 1);
    const trendAdjust = trend * progress;
    const base = baseActual + (basePred - baseActual) * progress + trendAdjust;
    const noise = (Math.random() - 0.5) * baseActual * 0.05;
    const value = Math.round(base + noise);
    const confWidth = isActual ? 0 : (i - nowIdx) * baseActual * variance * 0.15;
    return {
      time,
      actual: isActual ? value : null,
      predicted: !isActual ? value : (i === nowIdx ? value : null),
      upper: !isActual ? value + confWidth : null,
      lower: !isActual ? Math.max(0, value - confWidth) : null,
      now: i === nowIdx
    };
  });
};
