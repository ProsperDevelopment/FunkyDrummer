import { useRef, useEffect } from 'react';
import { drumKits } from '../config/drumKits';
import { drumLayouts } from '../config/drumLayouts';
import './SettingsModal.css';

export default function SettingsModal({
  onClose,
  activeKitId, onKitChange, kitBusy,
  drumLayoutId, onLayoutChange,
  showVisualizer,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.target === overlayRef.current) onClose();
    };
    const el = overlayRef.current;
    el?.addEventListener('mousedown', handler);
    return () => el?.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
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
              {kitBusy && <span className="settings-loading">loading…</span>}
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
        </div>
      </div>
    </div>
  );
}
