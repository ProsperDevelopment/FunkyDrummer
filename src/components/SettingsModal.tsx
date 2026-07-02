import { useRef, useEffect } from 'react';
import { drumKits } from '../config/drumKits';
import { drumLayouts } from '../config/drumLayouts';
import { midiConfigs } from '../config/midiConfigs';
import './SettingsModal.css';
import type { MidiInput } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  activeKitId: string;
  onKitChange: (id: string) => void;
  kitBusy: boolean;
  drumLayoutId: string;
  onLayoutChange: (id: string) => void;
  showVisualizer: boolean;
  midiInputs: MidiInput[];
  activeInput: string | null;
  onInputChange: (id: string) => void;
  midiConfigId: string;
  onMidiConfigChange: (id: string) => void;
}

export default function SettingsModal({
  onClose,
  activeKitId, onKitChange, kitBusy,
  drumLayoutId, onLayoutChange,
  showVisualizer,
  midiInputs, activeInput, onInputChange,
  midiConfigId, onMidiConfigChange,
}: SettingsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    const el = overlayRef.current;
    el?.addEventListener('mousedown', handler);
    return () => el?.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="settings-overlay" ref={overlayRef}>
      <div className="settings-modal">
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          <div className="settings-field">
            <label className="settings-label">Drum Kit</label>
            <div className="settings-control">
              <select
                className="settings-select"
                value={activeKitId}
                disabled={kitBusy}
                onChange={e => onKitChange(e.target.value)}
              >
                {drumKits.map(kit => (
                  <option key={kit.id} value={kit.id}>{kit.name}</option>
                ))}
              </select>
              {kitBusy && <span className="settings-loading">loading&hellip;</span>}
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label">Drum Layout</label>
            <div className="settings-control">
              <select
                className="settings-select"
                value={drumLayoutId}
                onChange={e => onLayoutChange(e.target.value)}
              >
                {drumLayouts.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              {!showVisualizer && (
                <span className="settings-hint">(visualizer off)</span>
              )}
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label">MIDI Device</label>
            <div className="settings-control">
              {midiInputs.length > 0 ? (
                <select
                  className="settings-select"
                  value={activeInput || ''}
                  onChange={e => onInputChange(e.target.value)}
                >
                  {midiInputs.map(input => (
                    <option key={input.id} value={input.id}>{input.name}</option>
                  ))}
                </select>
              ) : (
                <span className="settings-hint">No MIDI devices</span>
              )}
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label">MIDI Map</label>
            <div className="settings-control">
              <select
                className="settings-select"
                value={midiConfigId}
                onChange={e => onMidiConfigChange(e.target.value)}
              >
                {midiConfigs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
