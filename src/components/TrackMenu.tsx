import { useMemo } from 'react';
import { trackList } from '../data/trackList';
import './TrackMenu.css';

interface TrackMenuProps {
  selectedTrackId: string | null;
  currentTrackName?: string;
  onSelectTrack: (id: string) => void;
  isPlayingTrack: boolean;
  trackPart: number;
  trackTotalParts: number;
  embedded?: boolean;
  activeStyles: string[];
}

export default function TrackMenu({ selectedTrackId, currentTrackName, onSelectTrack, isPlayingTrack, trackPart, trackTotalParts, embedded, activeStyles }: TrackMenuProps) {
  const grouped = useMemo(() => {
    const filtered = activeStyles.length === 0
      ? trackList
      : trackList.filter(t => activeStyles.includes(t.style));
    const map: Record<string, typeof trackList> = {};
    for (const t of filtered) {
      const s = t.style || 'Other';
      if (!map[s]) map[s] = [];
      map[s].push(t);
    }
    return map;
  }, [activeStyles]);

  const content = (
    <div className="track-list">
      {Object.entries(grouped).map(([style, tracks]) => (
        <div key={style}>
          <div className="style-group-header">{style}</div>
          {tracks.map(track => {
            const isActive = track.id === selectedTrackId;
            return (
              <button
                key={track.id}
                className={`track-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTrack(track.id)}
              >
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-desc">{track.description}</span>
                  {isActive && isPlayingTrack && (
                    <span className="track-progress">
                      Part {trackPart + 1} / {trackTotalParts}
                    </span>
                  )}
                  {isActive && currentTrackName && (
                    <span className="track-current-pattern">{currentTrackName}</span>
                  )}
                </div>
                <span className="track-bpm">{track.bpm} BPM</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="track-menu">
      <div className="menu-section">
        <h2 className="menu-section-title">Tracks</h2>
        {content}
      </div>
    </div>
  );
}
