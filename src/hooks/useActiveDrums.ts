import { useState, useCallback, useRef, useEffect } from 'react';
import { DRUM_GLOW_MS, DEFAULT_VELOCITY } from '../config/constants';

export function useActiveDrums() {
  const [activeDrums, setActiveDrums] = useState<Map<string, number>>(new Map());
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const hit = useCallback((drumId: string, velocity = DEFAULT_VELOCITY) => {
    setActiveDrums(prev => new Map(prev).set(drumId, velocity));
    if (timersRef.current[drumId]) {
      clearTimeout(timersRef.current[drumId]);
    }
    timersRef.current[drumId] = setTimeout(() => {
      setActiveDrums(prev => {
        const next = new Map(prev);
        next.delete(drumId);
        return next;
      });
      delete timersRef.current[drumId];
    }, DRUM_GLOW_MS);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return { activeDrums, hit };
}
