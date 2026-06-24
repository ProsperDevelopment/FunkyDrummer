import { useState, useRef, useCallback, useEffect } from 'react';
import { playDrum, playMetronomeClick } from '../audio/drumSounds';

export function usePlayback(pattern, bpmOverride, stopAfterReps = 0, onDrumPlayed, metronomeOn = false, drumPlaybackOn = true) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(0);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);
  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpmOverride);
  const stopAfterRef = useRef(stopAfterReps);
  const loopCountRef = useRef(0);
  const metronomeRef = useRef(metronomeOn);
  const drumPlaybackRef = useRef(drumPlaybackOn);

  useEffect(() => { bpmRef.current = bpmOverride; }, [bpmOverride]);
  useEffect(() => { stopAfterRef.current = stopAfterReps; }, [stopAfterReps]);
  useEffect(() => { metronomeRef.current = metronomeOn; }, [metronomeOn]);
  useEffect(() => { drumPlaybackRef.current = drumPlaybackOn; }, [drumPlaybackOn]);

  useEffect(() => {
    patternRef.current = pattern;
    if (pattern) {
      const steps = pattern.measures * 16;
      setTotalSteps(steps);
    }
  }, [pattern]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    stepRef.current = 0;
    loopCountRef.current = 0;
    setCurrentLoop(0);
  }, []);

  const play = useCallback(() => {
    if (!patternRef.current) return;
    const p = patternRef.current;
    const bpm = bpmRef.current || p.bpm;
    const steps = p.measures * 16;
    const intervalMs = (60 / bpm) * 1000 / 4;

    stepRef.current = 0;
    setCurrentStep(0);
    loopCountRef.current = 0;
    setCurrentLoop(0);
    setIsPlaying(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const step = stepRef.current;
      const p2 = patternRef.current;
      if (!p2) return;

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
  }, [stop]);

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [bpmOverride]);

  const togglePlay = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { isPlaying, currentStep, totalSteps, currentLoop, togglePlay, stop, play };
}
