<script lang="ts">
  import './StyleFilter.css';

  const ALL_STYLES = ['Rock', 'Funk', 'Electronic', 'Techno', 'Electro', 'Breakbeat', 'Jazz', 'Metal', 'Hip Hop', 'World', 'Practice', 'Punk', 'Blues', 'Latin'];

  interface Props {
    activeStyles: string[];
    onChange: (styles: string[]) => void;
  }

  let { activeStyles, onChange }: Props = $props();

  let open = $state(false);
  let ref = $state<HTMLDivElement>();

  $effect(() => {
    const handler = (e: MouseEvent) => {
      if (ref && !ref.contains(e.target as Node)) open = false;
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  });

  function toggle(style: string) {
    const next = activeStyles.includes(style)
      ? activeStyles.filter(s => s !== style)
      : [...activeStyles, style];
    onChange(next);
  }

  let count = $derived(activeStyles.length);
</script>

<div class="style-filter" bind:this={ref}>
  <button class="style-filter-btn" onclick={() => open = !open} title="Filter by style">
    &equiv;{#if count > 0}<span class="style-filter-badge">{count}</span>{/if}
  </button>
  {#if open}
    <div class="style-filter-popup">
      <button
        class="style-filter-option {activeStyles.length === 0 ? 'on' : ''}"
        onclick={() => onChange([])}
      >All</button>
      {#each ALL_STYLES as style (style)}
        <button
          class="style-filter-option {activeStyles.includes(style) ? 'on' : ''}"
          onclick={() => toggle(style)}
        >{style}</button>
      {/each}
    </div>
  {/if}
</div>
