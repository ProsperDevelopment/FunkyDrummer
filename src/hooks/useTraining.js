import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

function computeStats(hits) {
  if (hits.length === 0) return null;
  const counts = { perfect: 0, good: 0, off: 0, miss: 0 };
  for (const h of hits) counts[h.accuracy]++;
  const total = hits.length;
  const score = Math.round(((counts.perfect + counts.good * 0.5) / total) * 100);
  return { ...counts, total, score };
}

export function useTraining(pattern, currentStep) {
  const [trainingMode, setTrainingMode] = useState(false);
  const [userHits, setUserHits] = useState([]);
  const hitIdRef = useRef(0);
  const currentStepRef = useRef(currentStep);
  const patternRef = useRef(pattern);

  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { patternRef.current = pattern; }, [pattern]);

  const prevPatternIdRef = useRef(pattern?.id);
  useEffect(() => {
    if (pattern?.id !== prevPatternIdRef.current) {
      prevPatternIdRef.current = pattern?.id;
      setUserHits([]);
    }
  }, [pattern?.id]);

  const clearHits = useCallback(() => { setUserHits([]); }, []);

  const handleDrumHit = useCallback((drumId) => {
    if (!trainingMode) return;

    const p = patternRef.current;
    if (!p || !p.grid[drumId]) return;

    const step = currentStepRef.current;
    const steps = p.measures * 16;
    const modStep = step % steps;

    let nearestDist = Infinity;
    for (let offset = -2; offset <= 2; offset++) {
      const checkStep = ((modStep + offset) % steps + steps) % steps;
      if (p.grid[drumId][checkStep]) {
        const dist = Math.abs(offset);
        if (dist < nearestDist) nearestDist = dist;
      }
    }

    let accuracy;
    if (nearestDist === Infinity) {
      accuracy = 'miss';
    } else if (nearestDist === 0) {
      accuracy = 'perfect';
    } else if (nearestDist <= 1) {
      accuracy = 'good';
    } else {
      accuracy = 'off';
    }

    const hit = {
      id: hitIdRef.current++,
      drumId,
      step: modStep,
      accuracy,
      timestamp: Date.now(),
    };

    setUserHits(prev => {
      const next = [...prev, hit];
      return next.slice(-200);
    });
  }, [trainingMode]);

  useEffect(() => {
    if (!trainingMode) {
      setUserHits([]);
      return;
    }
    const interval = setInterval(() => {
      const cutoff = Date.now() - 2500;
      setUserHits(prev => prev.filter(h => h.timestamp > cutoff));
    }, 300);
    return () => clearInterval(interval);
  }, [trainingMode]);

  const accuracyStats = useMemo(() => computeStats(userHits), [userHits]);

  return {
    trainingMode,
    setTrainingMode: (v) => {
      setUserHits([]);
      setTrainingMode(v);
    },
    userHits,
    handleDrumHit,
    clearHits,
    accuracyStats,
  };
}
