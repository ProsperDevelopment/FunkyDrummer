<script lang="ts">
  import PatternMenu from './PatternMenu.svelte';
  import TrackMenu from './TrackMenu.svelte';
  import StyleFilter from './StyleFilter.svelte';
  import './PatternTrackModal.css';

  interface Props {
    open: boolean;
    onClose: () => void;
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
    open,
    onClose,
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

  function selectAndClose(id: string, type: 'pattern' | 'track') {
    if (type === 'pattern') {
      onSelectPattern(id);
    } else {
      onSelectTrack(id);
    }
    onClose();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" onclick={onClose}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2 class="modal-title">Patterns & Tracks</h2>
        <button class="modal-close" onclick={onClose}>&times;</button>
      </div>

      <div class="modal-tabs">
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

      <div class="modal-body">
        {#if tab === 'patterns'}
          <PatternMenu
            {selectedPatternId}
            onSelectPattern={(id) => selectAndClose(id, 'pattern')}
            {activeStyles}
            embedded
            grid
          />
        {:else}
          <TrackMenu
            {selectedTrackId}
            {currentTrackName}
            onSelectTrack={(id) => selectAndClose(id, 'track')}
            {isPlayingTrack}
            {trackPart}
            {trackTotalParts}
            {activeStyles}
            embedded
            grid
          />
        {/if}
      </div>
    </div>
  </div>
{/if}
