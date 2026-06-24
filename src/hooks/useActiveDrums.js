import { useState, useCallback, useRef, useEffect } from 'react';

export function useActiveDrums() {
  const [activeDrums, setActiveDrums] = useState(new Set());
  const timersRef = useRef({});

  const hit = useCallback((drumId) => {
    setActiveDrums(prev => new Set(prev).add(drumId));
    if (timersRef.current[drumId]) {
      clearTimeout(timersRef.current[drumId]);
    }
    timersRef.current[drumId] = setTimeout(() => {
      setActiveDrums(prev => {
        const next = new Set(prev);
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
