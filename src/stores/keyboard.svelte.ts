import { keyToDrum } from '../config/drumConfig';
import { getKeyboardMap, type KeyboardMap } from '../config/keyboardMaps';
import { DEFAULT_VELOCITY } from '../config/constants';
import type { KeyboardActions } from '../types';

class KeyboardStore {
  private handler: ((e: KeyboardEvent) => void) | null = null;
  private onNoteOn?: (drumId: string, velocity: number) => void;
  private actions: KeyboardActions = {};
  private disabled = false;
  private keyboardMapId = 'standard';

  setOnNoteOn(cb: (drumId: string, velocity: number) => void) {
    this.onNoteOn = cb;
  }

  setActions(actions: KeyboardActions) {
    this.actions = actions;
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    if (disabled && this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    } else if (!disabled && !this.handler) {
      this.init();
    }
  }

  setKeyboardMap(mapId: string) {
    this.keyboardMapId = mapId;
  }

  getKeyboardMap(): KeyboardMap {
    return getKeyboardMap(this.keyboardMapId);
  }

  init() {
    if (this.disabled) return;

    this.handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;

      const key = e.key.toLowerCase();
      const map = getKeyboardMap(this.keyboardMapId);
      const mapping = map.keys[key];

      if (mapping) {
        e.preventDefault();
        this.onNoteOn?.(mapping.drumId, mapping.velocity || DEFAULT_VELOCITY);
        return;
      }

      // Fallback to drumConfig key mapping
      const drumId = keyToDrum[key];
      if (drumId) {
        e.preventDefault();
        this.onNoteOn?.(drumId, DEFAULT_VELOCITY);
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          this.actions.onTogglePlay?.();
          break;
        case 'Escape':
          e.preventDefault();
          this.actions.onStop?.();
          break;
        case 'm':
          e.preventDefault();
          this.actions.onToggleMetronome?.();
          break;
        case 'p':
          e.preventDefault();
          this.actions.onToggleDrumPlayback?.();
          break;
        case 't':
          e.preventDefault();
          this.actions.onTrainingToggle?.();
          break;
        case 'g':
          e.preventDefault();
          this.actions.onGrooveToggle?.();
          break;
        case 'e':
          e.preventDefault();
          this.actions.onEdgeModeToggle?.();
          break;
        case '+':
        case '=':
          e.preventDefault();
          this.actions.onBpmUp?.();
          break;
        case '-':
        case '_':
          e.preventDefault();
          this.actions.onBpmDown?.();
          break;
      }
    };

    window.addEventListener('keydown', this.handler);
  }

  destroy() {
    if (this.handler) {
      window.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
  }
}

export const keyboard = new KeyboardStore();
