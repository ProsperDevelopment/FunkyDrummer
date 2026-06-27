import { useState, useRef, useCallback, useEffect } from 'react';
import { playDrum, playMetronomeClick } from '../audio/drumSounds';
import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL, COUNT_IN_BEATS } from '../config/constants';

export function usePlayback(pattern, bpmOverride, stopAfterReps = 0, onDrumPlayed, metronomeOn = false, drumPlaybackOn = true, countdownOn = false, grooveOn = false) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [repsComplete, setRepsComplete] = useState(false);
  const [countdownCount, setCountdownCount] = useState(0);
  const intervalRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const stepRef = useRef(0);
  const stepsRef = useRef(STEPS_PER_MEASURE * 2);
  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpmOverride);
  const stopAfterRef = useRef(stopAfterReps);
  const loopCountRef = useRef(0);
  const metronomeRef = useRef(metronomeOn);
  const drumPlaybackRef = useRef(drumPlaybackOn);
  const countdownRef = useRef(countdownOn);
  const grooveOnRef = useRef(grooveOn);
  const drumTimeoutsRef = useRef([]);

  useEffect(() => { bpmRef.current = bpmOverride; }, [bpmOverride]);
  useEffect(() => { stopAfterRef.current = stopAfterReps; }, [stopAfterReps]);
  useEffect(() => { metronomeRef.current = metronomeOn; }, [metronomeOn]);
  useEffect(() => { drumPlaybackRef.current = drumPlaybackOn; }, [drumPlaybackOn]);
  useEffect(() => { countdownRef.current = countdownOn; }, [countdownOn]);
  useEffect(() => { grooveOnRef.current = grooveOn; }, [grooveOn]);

  useEffect(() => {
    patternRef.current = pattern;
    if (pattern) {
      const steps = pattern.measures * STEPS_PER_MEASURE;
      stepsRef.current = steps;
      setTotalSteps(steps);
    }
  }, [pattern]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    for (const t of drumTimeoutsRef.current) clearTimeout(t);
    drumTimeoutsRef.current = [];
    setIsPlaying(false);
    setIsCountdown(false);
    setCurrentStep(0);
    setCountdownCount(0);
    stepRef.current = 0;
    loopCountRef.current = 0;
    setCurrentLoop(0);
  }, []);

  const startPattern = useCallback((intervalMs) => {
    setIsPlaying(true);

    let hasPreScheduled = false;

    const scheduleDrum = (drumId, vel, delay) => {
      const t = setTimeout(() => {
        if (!grooveOnRef.current) return;
        playDrum(drumId, vel);
        onDrumPlayed?.(drumId, vel);
      }, delay);
      drumTimeoutsRef.current.push(t);
    };

    const tick = () => {
      const step = stepRef.current;
      const p2 = patternRef.current;
      if (!p2) return;
      const steps = stepsRef.current;
      const modStep = step % steps;

      if (drumPlaybackRef.current) {
        const groove = p2.groove;
        const grooveLen = groove ? groove.length : 16;

        // Phase 1: pre-schedule next step's negative-groove hits (anticipatory)
        if (grooveOnRef.current && groove) {
          const nextModStep = (modStep + 1) % steps;
          for (const [drumId, row] of Object.entries(p2.grid)) {
            if (row[nextModStep]) {
              const vel = row[nextModStep];
              const nextGroove = groove[nextModStep % grooveLen] || 0;
              if (nextGroove < 0) {
                scheduleDrum(drumId, vel, intervalMs + nextGroove);
              }
            }
          }
        }

        // Phase 2-4: current step hits
        for (const [drumId, row] of Object.entries(p2.grid)) {
          if (row[modStep]) {
            const vel = row[modStep];
            const grooveOffset = grooveOnRef.current && groove ? (groove[modStep % grooveLen] || 0) : 0;
            if (grooveOffset > 0) {
              scheduleDrum(drumId, vel, grooveOffset);
            } else if (grooveOffset === 0) {
              playDrum(drumId, vel);
              onDrumPlayed?.(drumId, vel);
            } else if (!hasPreScheduled) {
              // First tick: play negative-groove hits immediately
              playDrum(drumId, vel);
              onDrumPlayed?.(drumId, vel);
            }
            // else grooveOffset < 0 && hasPreScheduled: skipped (handled by Phase 1 of previous tick)
          }
        }

        hasPreScheduled = true;
      }

      if (metronomeRef.current && modStep % BEAT_INTERVAL === 0) {
        playMetronomeClick(modStep % MEASURE_INTERVAL === 0);
      }

      const nextStep = step + 1;
      stepRef.current = nextStep;
      setCurrentStep(nextStep);

      if (nextStep > 0 && nextStep % steps === 0) {
        loopCountRef.current++;
        setCurrentLoop(loopCountRef.current);
        if (stopAfterRef.current > 0 && loopCountRef.current >= stopAfterRef.current) {
          setRepsComplete(true);
          stop();
          return;
        }
      }

      if (nextStep >= steps * 2) {
        stepRef.current = 0;
        setCurrentStep(0);
      }

      intervalRef.current = setTimeout(tick, intervalMs);
    };

    intervalRef.current = setTimeout(tick, intervalMs);
  }, [stop, onDrumPlayed]);

  const play = useCallback(() => {
    if (!patternRef.current) return;
    const p = patternRef.current;
    const bpm = bpmRef.current || p.bpm;
    const intervalMs = (60 / bpm) * 1000 / 4;

    stepRef.current = 0;
    setCurrentStep(0);
    loopCountRef.current = 0;
    setCurrentLoop(0);
    setRepsComplete(false);

    if (intervalRef.current) clearTimeout(intervalRef.current);

    if (countdownRef.current) {
      setIsCountdown(true);
      let count = COUNT_IN_BEATS;
      const tick = () => {
        setCountdownCount(count);
        if (count % 4 === 0) playMetronomeClick(true);
        count--;
        if (count > 0) {
          countdownTimerRef.current = setTimeout(tick, intervalMs);
        } else {
          countdownTimerRef.current = null;
          setIsCountdown(false);
          setCountdownCount(0);
          startPattern(intervalMs);
        }
      };
      tick();
    } else {
      startPattern(intervalMs);
    }
  }, [stop, startPattern]);

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [bpmOverride]);

  const togglePlay = useCallback(() => {
    if (isPlaying || isCountdown) stop();
    else play();
  }, [isPlaying, isCountdown, play, stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      for (const t of drumTimeoutsRef.current) clearTimeout(t);
    };
  }, []);

  const clearRepsComplete = useCallback(() => {
    setRepsComplete(false);
  }, []);

  return { isPlaying, isCountdown, currentStep, totalSteps, currentLoop, repsComplete, countdownCount, togglePlay, stop, play, clearRepsComplete };
}
