import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { STEPS_PER_MEASURE, TRAINING_HIT_TOLERANCE, TRAINING_SCORE_GOOD_WEIGHT, TRAINING_SCORE_MULTIPLIER } from '../config/constants';

export function useTraining(pattern, currentStep, isPlaying = false) {
  const [trainingMode, setTrainingMode] = useState(false);
  const [userHits, setUserHits] = useState([]);
  const [missedHits, setMissedHits] = useState(0);
  const runningCountsRef = useRef({ perfect: 0, good: 0, off: 0, miss: 0 });
  const hitIdRef = useRef(0);
  const currentStepRef = useRef(currentStep);
  const prevStepRef = useRef(currentStep);
  const patternRef = useRef(pattern);
  const missedStepsRef = useRef(new Set());

  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { patternRef.current = pattern; }, [pattern]);

  const prevPatternIdRef = useRef(pattern?.id);
  useEffect(() => {
    if (pattern?.id !== prevPatternIdRef.current) {
      prevPatternIdRef.current = pattern?.id;
      setUserHits([]);
      setMissedHits(0);
      runningCountsRef.current = { perfect: 0, good: 0, off: 0, miss: 0 };
    }
  }, [pattern?.id]);

  const clearHits = useCallback(() => {
    setUserHits([]);
    setMissedHits(0);
    missedStepsRef.current = new Set();
    runningCountsRef.current = { perfect: 0, good: 0, off: 0, miss: 0 };
  }, []);

  const userHitsRef = useRef([]);
  useEffect(() => { userHitsRef.current = userHits; }, [userHits]);

  useEffect(() => {
    if (!trainingMode || !isPlaying) return;
    const p = patternRef.current;
    if (!p) return;
    const steps = p.measures * STEPS_PER_MEASURE;
    const prevMod = prevStepRef.current % steps;
    const currMod = currentStep % steps;
    prevStepRef.current = currentStep;

    if (prevMod === currMod || missedStepsRef.current.has(prevMod)) return;

    const drumsWithNotes = [];
    for (const [drumId, row] of Object.entries(p.grid)) {
      if (row[prevMod]) {
        drumsWithNotes.push(drumId);
      }
    }

    if (drumsWithNotes.length === 0) return;

    const currentHits = userHitsRef.current;
    let uncovered = 0;
    for (const drumId of drumsWithNotes) {
      const covered = currentHits.some(h =>
        h.drumId === drumId && Math.abs(h.step - prevMod) <= TRAINING_HIT_TOLERANCE
      );
      if (!covered) uncovered++;
    }
    if (uncovered > 0) {
      setMissedHits(prev => prev + uncovered);
    }

    missedStepsRef.current.add(prevMod);
  }, [currentStep, trainingMode, isPlaying]);

  const handleDrumHit = useCallback((drumId) => {
    if (!trainingMode || !isPlaying) return;

    const p = patternRef.current;
    if (!p) return;

    const step = currentStepRef.current;
    const steps = p.measures * 16;
    const modStep = step % steps;

    let accuracy;
    if (!p.grid[drumId]) {
      accuracy = 'miss';
    } else {
      let nearestDist = Infinity;
      for (let offset = -TRAINING_HIT_TOLERANCE * 2; offset <= TRAINING_HIT_TOLERANCE * 2; offset++) {
        const checkStep = ((modStep + offset) % steps + steps) % steps;
        if (p.grid[drumId][checkStep]) {
          const dist = Math.abs(offset);
          if (dist < nearestDist) nearestDist = dist;
        }
      }

      if (nearestDist === Infinity) {
        accuracy = 'miss';
      } else if (nearestDist === 0) {
        accuracy = 'perfect';
      } else if (nearestDist <= TRAINING_HIT_TOLERANCE) {
        accuracy = 'good';
      } else {
        accuracy = 'off';
      }
    }

    runningCountsRef.current[accuracy]++;
    runningCountsRef.current.total = runningCountsRef.current.perfect + runningCountsRef.current.good + runningCountsRef.current.off + runningCountsRef.current.miss;

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
  }, [trainingMode, isPlaying]);
 
  useEffect(() => {
    if (!trainingMode) {
      setUserHits([]);
      setMissedHits(0);
      missedStepsRef.current = new Set();
      runningCountsRef.current = { perfect: 0, good: 0, off: 0, miss: 0 };
      return;
    }
    const interval = setInterval(() => {
      const cutoff = Date.now() - 2500;
      setUserHits(prev => prev.filter(h => h.timestamp > cutoff));
    }, 300);
    return () => clearInterval(interval);
  }, [trainingMode]);

  const accuracyStats = useMemo(() => {
    const c = runningCountsRef.current;
    const total = c.perfect + c.good + c.off + c.miss;
    if (total === 0) return null;
    const score = Math.round(((c.perfect + c.good * TRAINING_SCORE_GOOD_WEIGHT) / total) * TRAINING_SCORE_MULTIPLIER);
    return { perfect: c.perfect, good: c.good, off: c.off, miss: c.miss, total, score };
  }, [userHits]);

  return {
    trainingMode,
    setTrainingMode: (v) => {
      setUserHits([]);
      setMissedHits(0);
      missedStepsRef.current = new Set();
      runningCountsRef.current = { perfect: 0, good: 0, off: 0, miss: 0 };
      setTrainingMode(v);
    },
    userHits,
    handleDrumHit,
    clearHits,
    accuracyStats,
    missedHits,
  };
}
