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
  let searchQuery = $state('');

  function resetSearch() {
    searchQuery = '';
  }

  function selectAndClose(id: string, type: 'pattern' | 'track') {
    if (type === 'pattern') {
      onSelectPattern(id);
    } else {
      onSelectTrack(id);
    }
    onClose();
  }

  function handleTabSwitch(newTab: 'patterns' | 'tracks') {
    tab = newTab;
    searchQuery = '';
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
          onclick={() => handleTabSwitch('patterns')}
        >Patterns</button>
        <button
          class="tab-btn {tab === 'tracks' ? 'active' : ''}"
          onclick={() => handleTabSwitch('tracks')}
        >Tracks</button>
        <StyleFilter {activeStyles} onChange={(styles) => activeStyles = styles} />
        <input
          class="search-input"
          type="text"
          placeholder="Search..."
          bind:value={searchQuery}
        />
      </div>

      <div class="modal-body">
        {#if tab === 'patterns'}
          <PatternMenu
            {selectedPatternId}
            onSelectPattern={(id) => selectAndClose(id, 'pattern')}
            {activeStyles}
            {searchQuery}
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
            {searchQuery}
            embedded
            grid
          />
        {/if}
      </div>
    </div>
  </div>
{/if}
