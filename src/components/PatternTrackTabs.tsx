import { useState } from 'react';
import PatternMenu from './PatternMenu';
import TrackMenu from './TrackMenu';
import StyleFilter from './StyleFilter';
import './PatternTrackTabs.css';

interface PatternTrackTabsProps {
  selectedPatternId: string;
  onSelectPattern: (id: string) => void;
  selectedTrackId: string | null;
  currentTrackName?: string;
  onSelectTrack: (id: string) => void;
  isPlayingTrack: boolean;
  trackPart: number;
  trackTotalParts: number;
}

export default function PatternTrackTabs(props: PatternTrackTabsProps) {
  const [tab, setTab] = useState<'patterns' | 'tracks'>('patterns');
  const [activeStyles, setActiveStyles] = useState<string[]>([]);

  return (
    <div className="pattern-track-tabs">
      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'patterns' ? 'active' : ''}`}
          onClick={() => setTab('patterns')}
        >Patterns</button>
        <button
          className={`tab-btn ${tab === 'tracks' ? 'active' : ''}`}
          onClick={() => setTab('tracks')}
        >Tracks</button>
        <StyleFilter activeStyles={activeStyles} onChange={setActiveStyles} />
      </div>
      <div className="tab-content">
        {tab === 'patterns' ? (
          <PatternMenu
            selectedPatternId={props.selectedPatternId}
            onSelectPattern={props.onSelectPattern}
            activeStyles={activeStyles}
            embedded
          />
        ) : (
          <TrackMenu
            selectedTrackId={props.selectedTrackId}
            currentTrackName={props.currentTrackName}
            onSelectTrack={props.onSelectTrack}
            isPlayingTrack={props.isPlayingTrack}
            trackPart={props.trackPart}
            trackTotalParts={props.trackTotalParts}
            activeStyles={activeStyles}
            embedded
          />
        )}
      </div>
    </div>
  );
}
