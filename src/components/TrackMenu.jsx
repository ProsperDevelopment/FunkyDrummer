import { trackList } from '../data/trackList';
import './TrackMenu.css';

export default function TrackMenu({ selectedTrackId, currentTrackName, onSelectTrack, isPlayingTrack, trackPart, trackTotalParts }) {
  return (
    <div className="track-menu">
      <div className="menu-section">
        <h2 className="menu-section-title">Tracks</h2>
        <div className="track-list">
          {trackList.map(track => {
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
      </div>
    </div>
  );
}
