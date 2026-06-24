import { useState, useRef, useCallback, useEffect } from 'react';
import { playDrum, playMetronomeClick } from '../audio/drumSounds';

export function usePlayback(pattern, bpmOverride, stopAfterReps = 0, onDrumPlayed, metronomeOn = false, drumPlaybackOn = true, countdownOn = false) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(0);
  const intervalRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const stepRef = useRef(0);
  const stepsRef = useRef(32);
  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpmOverride);
  const stopAfterRef = useRef(stopAfterReps);
  const loopCountRef = useRef(0);
  const metronomeRef = useRef(metronomeOn);
  const drumPlaybackRef = useRef(drumPlaybackOn);
  const countdownRef = useRef(countdownOn);

  useEffect(() => { bpmRef.current = bpmOverride; }, [bpmOverride]);
  useEffect(() => { stopAfterRef.current = stopAfterReps; }, [stopAfterReps]);
  useEffect(() => { metronomeRef.current = metronomeOn; }, [metronomeOn]);
  useEffect(() => { drumPlaybackRef.current = drumPlaybackOn; }, [drumPlaybackOn]);
  useEffect(() => { countdownRef.current = countdownOn; }, [countdownOn]);

  useEffect(() => {
    patternRef.current = pattern;
    if (pattern) {
      const steps = pattern.measures * 16;
      stepsRef.current = steps;
      setTotalSteps(steps);
    }
  }, [pattern]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsPlaying(false);
    setIsCountdown(false);
    setCurrentStep(0);
    stepRef.current = 0;
    loopCountRef.current = 0;
    setCurrentLoop(0);
  }, []);

  const startPattern = useCallback((intervalMs) => {
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      const step = stepRef.current;
      const p2 = patternRef.current;
      if (!p2) return;
      const steps = stepsRef.current;

      const modStep = step % steps;

      if (drumPlaybackRef.current) {
        for (const [drumId, row] of Object.entries(p2.grid)) {
          if (row[modStep]) {
            const vel = row[modStep];
            playDrum(drumId, vel);
            onDrumPlayed?.(drumId, vel);
          }
        }
      }

      if (metronomeRef.current && modStep % 4 === 0) {
        playMetronomeClick(modStep % 16 === 0);
      }

      const nextStep = step + 1;
      stepRef.current = nextStep;
      setCurrentStep(nextStep);

      if (nextStep > 0 && nextStep % steps === 0) {
        loopCountRef.current++;
        setCurrentLoop(loopCountRef.current);
        if (stopAfterRef.current > 0 && loopCountRef.current >= stopAfterRef.current) {
          stop();
          return;
        }
      }

      if (nextStep >= steps * 2) {
        stepRef.current = 0;
        setCurrentStep(0);
      }
    }, intervalMs);
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

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (countdownRef.current) {
      setIsCountdown(true);
      let count = 4;
      const tick = () => {
        playMetronomeClick(count === 4);
        count--;
        if (count > 0) {
          countdownTimerRef.current = setTimeout(tick, intervalMs);
        } else {
          countdownTimerRef.current = null;
          setIsCountdown(false);
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
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, []);

  return { isPlaying, isCountdown, currentStep, totalSteps, currentLoop, togglePlay, stop, play };
}