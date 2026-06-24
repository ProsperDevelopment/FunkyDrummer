import { useEffect } from 'react';
import { keyToDrum, drumConfig } from '../config/drumConfig';

export function useKeyboard(onNoteOn) {
  useEffect(() => {
    const handler = (e) => {
      if (e.repeat) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      const drumId = keyToDrum[e.key.toLowerCase()];
      if (drumId) {
        e.preventDefault();
        onNoteOn(drumId, 0.8);
      }

      if (e.key === ' ') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNoteOn]);

  return { keyToDrum, drumConfig };
}
