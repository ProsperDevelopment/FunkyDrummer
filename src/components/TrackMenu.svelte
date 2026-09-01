<script lang="ts">
  import { trackList } from '../data/trackList';
  import './TrackMenu.css';

  interface Props {
    selectedTrackId: string | null;
    currentTrackName?: string;
    onSelectTrack: (id: string) => void;
    isPlayingTrack: boolean;
    trackPart: number;
    trackTotalParts: number;
    embedded?: boolean;
    activeStyles?: string[];
    grid?: boolean;
  }

  let {
    selectedTrackId,
    currentTrackName = '',
    onSelectTrack,
    isPlayingTrack,
    trackPart,
    trackTotalParts,
    embedded = false,
    activeStyles = [],
    grid = false,
  }: Props = $props();

  let grouped = $derived.by(() => {
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
  });
</script>

{#if embedded}
  <div class="track-list">
    {#each Object.entries(grouped) as [style, tracks]}
      <div>
        <div class="style-group-header">{style}</div>
        {#each tracks as track (track.id)}
          {@const isActive = track.id === selectedTrackId}
          <button
            class="track-item {isActive ? 'active' : ''}"
            onclick={() => onSelectTrack(track.id)}
          >
            <div class="track-info">
              <span class="track-name">{track.name}</span>
              <span class="track-desc">{track.description}</span>
              {#if isActive && isPlayingTrack}
                <span class="track-progress">
                  Part {trackPart + 1} / {trackTotalParts}
                </span>
              {/if}
              {#if isActive && currentTrackName}
                <span class="track-current-pattern">{currentTrackName}</span>
              {/if}
            </div>
            <span class="track-bpm">{track.bpm} BPM</span>
          </button>
        {/each}
      </div>
    {/each}
  </div>
{:else}
  <div class="track-menu">
    <div class="menu-section">
      <h2 class="menu-section-title">Tracks</h2>
  <div class="track-list" class:grid-layout={grid}>
        {#each Object.entries(grouped) as [style, tracks]}
          <div>
            <div class="style-group-header">{style}</div>
            {#each tracks as track (track.id)}
              {@const isActive = track.id === selectedTrackId}
              <button
                class="track-item {isActive ? 'active' : ''}"
                onclick={() => onSelectTrack(track.id)}
              >
                <div class="track-info">
                  <span class="track-name">{track.name}</span>
                  <span class="track-desc">{track.description}</span>
                  {#if isActive && isPlayingTrack}
                    <span class="track-progress">
                      Part {trackPart + 1} / {trackTotalParts}
                    </span>
                  {/if}
                  {#if isActive && currentTrackName}
                    <span class="track-current-pattern">{currentTrackName}</span>
                  {/if}
                </div>
                <span class="track-bpm">{track.bpm} BPM</span>
              </button>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
