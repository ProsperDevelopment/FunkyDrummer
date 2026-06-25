import { useState, useRef, useCallback, useEffect } from 'react';
import { playDrum, playMetronomeClick } from '../audio/drumSounds';
import { drumPatterns } from '../data/drumPatterns';
import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL } from '../config/constants';

function getPattern(id) {
  return drumPatterns.find(p => p.id === id) || drumPatterns[0];
}

export function useTrackPlayback(track, onDrumPlayed, metronomeOn = false, drumPlaybackOn = true, bpmOverride = null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef(null);
  const stepRef = useRef(0);
  const partIndexRef = useRef(0);
  const repeatRef = useRef(0);
  const trackRef = useRef(track);
  const metronomeRef = useRef(metronomeOn);
  const drumPlaybackRef = useRef(drumPlaybackOn);
  const bpmOverrideRef = useRef(bpmOverride);

  useEffect(() => { metronomeRef.current = metronomeOn; }, [metronomeOn]);
  useEffect(() => { drumPlaybackRef.current = drumPlaybackOn; }, [drumPlaybackOn]);
  useEffect(() => { bpmOverrideRef.current = bpmOverride; }, [bpmOverride]);

  useEffect(() => {
    trackRef.current = track;
    if (track && track.parts && track.parts.length > 0) {
      const firstPart = track.parts[0];
      const firstPattern = getPattern(firstPart.patternId);
      setCurrentPattern(firstPattern);
      setCurrentPartIndex(0);
      partIndexRef.current = 0;
      setCurrentStep(0);
      stepRef.current = 0;
    }
  }, [track]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    stepRef.current = 0;
    setCurrentPartIndex(0);
    partIndexRef.current = 0;
    repeatRef.current = 0;
    setCurrentPattern(null);
    setIsFinished(false);
  }, []);

  const play = useCallback(() => {
    const t = trackRef.current;
    if (!t || !t.parts || t.parts.length === 0) return;

    const bpm = bpmOverrideRef.current || t.bpm;
    const intervalMs = (60 / bpm) * 1000 / 4;

    stepRef.current = 0;
    partIndexRef.current = 0;
    repeatRef.current = 0;
    setCurrentStep(0);
    setCurrentPartIndex(0);
    setIsFinished(false);
    setIsPlaying(true);

    const firstPart = t.parts[0];
    const firstPattern = getPattern(firstPart.patternId);
    setCurrentPattern(firstPattern);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const t2 = trackRef.current;
      if (!t2) return;

      const pi = partIndexRef.current;
      const part = t2.parts[pi];
      if (!part) {
        stop();
        return;
      }

      const p = getPattern(part.patternId);
      const steps = p.measures * STEPS_PER_MEASURE;
      const step = stepRef.current;
      const modStep = step % steps;

      if (drumPlaybackRef.current) {
        for (const [drumId, row] of Object.entries(p.grid)) {
          if (row[modStep]) {
            const vel = row[modStep];
            playDrum(drumId, vel);
            onDrumPlayed?.(drumId, vel);
          }
        }
      }

      if (metronomeRef.current && modStep % BEAT_INTERVAL === 0) {
        playMetronomeClick(modStep % MEASURE_INTERVAL === 0);
      }

      const nextStep = step + 1;
      stepRef.current = nextStep;
      setCurrentStep(nextStep);

      if (nextStep > 0 && nextStep % steps === 0) {
        repeatRef.current++;
        const nextRepeat = repeatRef.current;
        if (nextRepeat >= part.repeats) {
          const nextPart = pi + 1;
          if (nextPart >= t2.parts.length) {
            setIsPlaying(false);
            setIsFinished(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }
          partIndexRef.current = nextPart;
          repeatRef.current = 0;
          stepRef.current = 0;
          setCurrentStep(0);
          setCurrentPartIndex(nextPart);
          const nextPattern = getPattern(t2.parts[nextPart].patternId);
          setCurrentPattern(nextPattern);
        } else {
          stepRef.current = 0;
          setCurrentStep(0);
        }
      }
    }, intervalMs);
  }, [stop, onDrumPlayed]);

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [bpmOverride]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  const getCurrentStep = useCallback(() => stepRef.current, []);

  return {
    isPlaying,
    currentStep,
    currentPattern,
    currentPartIndex,
    isFinished,
    togglePlay,
    stop,
    play,
    getCurrentStep,
  };
}
