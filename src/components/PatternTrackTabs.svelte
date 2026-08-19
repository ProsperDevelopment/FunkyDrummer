<script lang="ts">
  import PatternMenu from './PatternMenu.svelte';
  import TrackMenu from './TrackMenu.svelte';
  import StyleFilter from './StyleFilter.svelte';
  import './PatternTrackTabs.css';

  interface Props {
    selectedPatternId: string;
    onSelectPattern: (id: string) => void;
    selectedTrackId: string | null;
    currentTrackName?: string;
    onSelectTrack: (id: string) => void;
    isPlayingTrack: boolean;
    trackPart: number;
    trackTotalParts: number;
  }

  let {
    selectedPatternId,
    onSelectPattern,
    selectedTrackId,
    currentTrackName = '',
    onSelectTrack,
    isPlayingTrack,
    trackPart,
    trackTotalParts,
  }: Props = $props();

  let tab = $state<'patterns' | 'tracks'>('patterns');
  let activeStyles = $state<string[]>([]);
</script>

<div class="pattern-track-tabs">
  <div class="tab-bar">
    <button
      class="tab-btn {tab === 'patterns' ? 'active' : ''}"
      onclick={() => tab = 'patterns'}
    >Patterns</button>
    <button
      class="tab-btn {tab === 'tracks' ? 'active' : ''}"
      onclick={() => tab = 'tracks'}
    >Tracks</button>
    <StyleFilter {activeStyles} onChange={(styles) => activeStyles = styles} />
  </div>
  <div class="tab-content">
    {#if tab === 'patterns'}
      <PatternMenu
        {selectedPatternId}
        {onSelectPattern}
        {activeStyles}
        embedded
      />
    {:else}
      <TrackMenu
        {selectedTrackId}
        {currentTrackName}
        {onSelectTrack}
        {isPlayingTrack}
        {trackPart}
        {trackTotalParts}
        {activeStyles}
        embedded
      />
    {/if}
  </div>
</div>
