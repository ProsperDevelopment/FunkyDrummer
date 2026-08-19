import { useState, useRef, useCallback, useEffect } from 'react';
import { playDrum, playMetronomeClick } from '../audio/drumSounds';
import { drumPatterns } from '../data/drumPatterns';
import { STEPS_PER_MEASURE, BEAT_INTERVAL, MEASURE_INTERVAL, COUNT_IN_BEATS } from '../config/constants';
import type { Track, DrumPattern } from '../types';

function getPattern(id: string): DrumPattern {
  return drumPatterns.find(p => p.id === id) || drumPatterns[0];
}

export function useTrackPlayback(
  track: Track | null,
  onDrumPlayed?: (drumId: string, vel: number) => void,
  metronomeOn = false,
  drumPlaybackOn = true,
  bpmOverride: number | null = null,
  countdownOn = false,
  grooveOn = false
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentPattern, setCurrentPattern] = useState<DrumPattern | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [countdownCount, setCountdownCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalMsRef = useRef(1000);
  const tickRef = useRef<() => void>(() => {});
  const stepRef = useRef(0);
  const partIndexRef = useRef(0);
  const repeatRef = useRef(0);
  const trackRef = useRef(track);
  const metronomeRef = useRef(metronomeOn);
  const drumPlaybackRef = useRef(drumPlaybackOn);
  const bpmOverrideRef = useRef(bpmOverride);
  const countdownRef = useRef(countdownOn);
  const grooveOnRef = useRef(grooveOn);
  const drumTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { metronomeRef.current = metronomeOn; }, [metronomeOn]);
  useEffect(() => { drumPlaybackRef.current = drumPlaybackOn; }, [drumPlaybackOn]);
  useEffect(() => { bpmOverrideRef.current = bpmOverride; }, [bpmOverride]);
  useEffect(() => { countdownRef.current = countdownOn; }, [countdownOn]);
  useEffect(() => { grooveOnRef.current = grooveOn; }, [grooveOn]);

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
    setCountdownCount(0);
    setCurrentStep(0);
    stepRef.current = 0;
    setCurrentPartIndex(0);
    partIndexRef.current = 0;
    repeatRef.current = 0;
    const t = trackRef.current;
    if (t && t.parts && t.parts.length > 0) {
      const firstPattern = getPattern(t.parts[0].patternId);
      setCurrentPattern(firstPattern);
    } else {
      setCurrentPattern(null);
    }
    setIsFinished(false);
  }, []);

  const play = useCallback(() => {
    const t = trackRef.current;
    if (!t || !t.parts || t.parts.length === 0) return;

    const bpm = bpmOverrideRef.current || t.bpm;
    intervalMsRef.current = (60 / bpm) * 1000 / 4;

    stepRef.current = 0;
    partIndexRef.current = 0;
    repeatRef.current = 0;
    setCurrentStep(0);
    setCurrentPartIndex(0);
    setIsFinished(false);
    setCountdownCount(0);

    const firstPart = t.parts[0];
    const firstPattern = getPattern(firstPart.patternId);
    setCurrentPattern(firstPattern);

    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);

    const scheduleDrum = (drumId: string, vel: number, delay: number) => {
      const tmo = setTimeout(() => {
        playDrum(drumId, vel);
        onDrumPlayed?.(drumId, vel);
      }, delay);
      drumTimeoutsRef.current.push(tmo);
    };

    const tick = () => {
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
        const groove = p.groove;
        const grooveLen = groove ? groove.length : 16;

        if (grooveOnRef.current && groove) {
          const nextModStep = (modStep + 1) % steps;
          for (const [drumId, row] of Object.entries(p.grid)) {
            if (row[nextModStep]) {
              const vel = row[nextModStep];
              const nextGroove = groove[nextModStep % grooveLen] || 0;
              if (nextGroove < 0) {
                scheduleDrum(drumId, vel, intervalMsRef.current + nextGroove);
              }
            }
          }
        }

        for (const [drumId, row] of Object.entries(p.grid)) {
          if (row[modStep]) {
            const vel = row[modStep];
            const grooveOffset = grooveOnRef.current && groove ? (groove[modStep % grooveLen] || 0) : 0;
            if (grooveOffset > 0) {
              scheduleDrum(drumId, vel, grooveOffset);
            } else {
              playDrum(drumId, vel);
              onDrumPlayed?.(drumId, vel);
            }
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
              clearTimeout(intervalRef.current);
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

      intervalRef.current = setTimeout(tick, intervalMsRef.current);
    };

    tickRef.current = tick;

    const begin = () => {
      setIsPlaying(true);
      setIsCountdown(false);
      setCountdownCount(0);
      intervalRef.current = setTimeout(tick, intervalMsRef.current);
    };

    if (countdownRef.current) {
      setIsCountdown(true);
      let count = COUNT_IN_BEATS;
      const countTick = () => {
        setCountdownCount(count);
        if (count % 4 === 0) playMetronomeClick(true);
        count--;
        if (count > 0) {
          countdownTimerRef.current = setTimeout(countTick, intervalMsRef.current);
        } else {
          countdownTimerRef.current = null;
          begin();
        }
      };
      countTick();
    } else {
      begin();
    }
  }, [stop, onDrumPlayed]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = trackRef.current;
    const bpm = bpmOverrideRef.current || t?.bpm;
    if (!bpm) return;
    intervalMsRef.current = (60 / bpm) * 1000 / 4;
    if (intervalRef.current) clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(tickRef.current, intervalMsRef.current);
  }, [bpmOverride, isPlaying]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      for (const t of drumTimeoutsRef.current) clearTimeout(t);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying || isCountdown) stop();
    else play();
  }, [isPlaying, isCountdown, play, stop]);

  const getCurrentStep = useCallback(() => stepRef.current, []);

  return {
    isPlaying,
    isCountdown,
    currentStep,
    currentPattern,
    currentPartIndex,
    isFinished,
    countdownCount,
    togglePlay,
    stop,
    play,
    getCurrentStep,
  };
}
