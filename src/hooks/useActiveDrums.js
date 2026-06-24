import { useState, useCallback, useRef, useEffect } from 'react';

export function useActiveDrums() {
  const [activeDrums, setActiveDrums] = useState(new Map());
  const timersRef = useRef({});

  const hit = useCallback((drumId, velocity = 1) => {
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
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return { activeDrums, hit };
}
