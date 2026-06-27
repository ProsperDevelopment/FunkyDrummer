import { useEffect } from 'react';
import { keyToDrum } from '../config/drumConfig';
import { DEFAULT_VELOCITY } from '../config/constants';

export function useKeyboard(onNoteOn, actions = {}, disabled = false) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e) => {
      if (e.repeat) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      const drumId = keyToDrum[key];
      if (drumId) {
        e.preventDefault();
        onNoteOn(drumId, DEFAULT_VELOCITY);
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          actions.onTogglePlay?.();
          break;
        case 'Escape':
          e.preventDefault();
          actions.onStop?.();
          break;
        case 'm':
          e.preventDefault();
          actions.onToggleMetronome?.();
          break;
        case 'p':
          e.preventDefault();
          actions.onToggleDrumPlayback?.();
          break;
        case 't':
          e.preventDefault();
          actions.onTrainingToggle?.();
          break;
        case 'g':
          e.preventDefault();
          actions.onGrooveToggle?.();
          break;
        case 'e':
          e.preventDefault();
          actions.onEdgeModeToggle?.();
          break;
        case '+':
        case '=':
          e.preventDefault();
          actions.onBpmUp?.();
          break;
        case '-':
        case '_':
          e.preventDefault();
          actions.onBpmDown?.();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNoteOn, actions, disabled]);
}