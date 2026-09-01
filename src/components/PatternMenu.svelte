<script lang="ts">
  import { drumPatterns } from '../data/drumPatterns';
  import './PatternMenu.css';

  interface Props {
    selectedPatternId: string;
    onSelectPattern: (id: string) => void;
    embedded?: boolean;
    activeStyles?: string[];
    grid?: boolean;
    searchQuery?: string;
  }

  let { selectedPatternId, onSelectPattern, embedded = false, activeStyles = [], grid = false, searchQuery = '' }: Props = $props();

  const visiblePatterns = drumPatterns.filter(p => !p.id.endsWith('-edge'));

  let grouped = $derived.by(() => {
    let filtered = activeStyles.length === 0
      ? visiblePatterns
      : visiblePatterns.filter(p => activeStyles.includes(p.style));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }
    const map: Record<string, typeof drumPatterns> = {};
    for (const p of filtered) {
      const s = p.style || 'Other';
      if (!map[s]) map[s] = [];
      map[s].push(p);
    }
    return map;
  });
</script>

{#if embedded}
  <div class="pattern-list">
    {#each Object.entries(grouped) as [style, patterns]}
      <div class="style-group">
        <div class="style-group-header">{style}</div>
        <div class="style-group-grid" class:grid-layout={grid}>
          {#each patterns as pattern (pattern.id)}
            <button
              class="pattern-item {pattern.id === selectedPatternId ? 'active' : ''}"
              onclick={() => onSelectPattern(pattern.id)}
            >
              <div class="pattern-info">
                <span class="pattern-name">{pattern.name}</span>
                <span class="pattern-desc">{pattern.desc}</span>
              </div>
              <span class="pattern-bpm">{pattern.bpm} BPM</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="pattern-menu">
    <div class="menu-section">
      <h2 class="menu-section-title">Patterns</h2>
      <div class="pattern-list">
        {#each Object.entries(grouped) as [style, patterns]}
          <div class="style-group">
            <div class="style-group-header">{style}</div>
            <div class="style-group-items">
              {#each patterns as pattern (pattern.id)}
                <button
                  class="pattern-item {pattern.id === selectedPatternId ? 'active' : ''}"
                  onclick={() => onSelectPattern(pattern.id)}
                >
                  <div class="pattern-info">
                    <span class="pattern-name">{pattern.name}</span>
                    <span class="pattern-desc">{pattern.desc}</span>
                  </div>
                  <span class="pattern-bpm">{pattern.bpm} BPM</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
