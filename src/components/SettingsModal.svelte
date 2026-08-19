<script lang="ts">
  import { drumKits } from '../config/drumKits';
  import { drumLayouts } from '../config/drumLayouts';
  import { midiConfigs } from '../config/midiConfigs';
  import './SettingsModal.css';
  import type { MidiInput } from '../types';

  interface Props {
    onClose: () => void;
    activeKitId: string;
    onKitChange: (id: string) => void;
    kitBusy: boolean;
    drumLayoutId: string;
    onLayoutChange: (id: string) => void;
    showVisualizer: boolean;
    midiInputs: MidiInput[];
    activeInput: string | null;
    onInputChange: (id: string) => void;
    midiConfigId: string;
    onMidiConfigChange: (id: string) => void;
  }

  let {
    onClose,
    activeKitId,
    onKitChange,
    kitBusy,
    drumLayoutId,
    onLayoutChange,
    showVisualizer,
    midiInputs,
    activeInput,
    onInputChange,
    midiConfigId,
    onMidiConfigChange,
  }: Props = $props();

  let overlayRef = $state<HTMLDivElement>();

  $effect(() => {
    const el = overlayRef;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      if (e.target === el) onClose();
    };
    el.addEventListener('mousedown', handler);
    return () => el.removeEventListener('mousedown', handler);
  });

  $effect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });
</script>

<div class="settings-overlay" bind:this={overlayRef}>
  <div class="settings-modal">
    <div class="settings-header">
      <span class="settings-title">Settings</span>
      <button class="settings-close" onclick={onClose}>&times;</button>
    </div>

    <div class="settings-body">
      <div class="settings-field">
        <label class="settings-label">Drum Kit</label>
        <div class="settings-control">
          <select
            class="settings-select"
            value={activeKitId}
            disabled={kitBusy}
            onchange={(e) => onKitChange((e.target as HTMLSelectElement).value)}
          >
            {#each drumKits as kit (kit.id)}
              <option value={kit.id}>{kit.name}</option>
            {/each}
          </select>
          {#if kitBusy}<span class="settings-loading">loading&hellip;</span>{/if}
        </div>
      </div>

      <div class="settings-field">
        <label class="settings-label">Drum Layout</label>
        <div class="settings-control">
          <select
            class="settings-select"
            value={drumLayoutId}
            onchange={(e) => onLayoutChange((e.target as HTMLSelectElement).value)}
          >
            {#each drumLayouts as l (l.id)}
              <option value={l.id}>{l.name}</option>
            {/each}
          </select>
          {#if !showVisualizer}
            <span class="settings-hint">(visualizer off)</span>
          {/if}
        </div>
      </div>

      <div class="settings-field">
        <label class="settings-label">MIDI Device</label>
        <div class="settings-control">
          {#if midiInputs.length > 0}
            <select
              class="settings-select"
              value={activeInput || ''}
              onchange={(e) => onInputChange((e.target as HTMLSelectElement).value)}
            >
              {#each midiInputs as input (input.id)}
                <option value={input.id}>{input.name}</option>
              {/each}
            </select>
          {:else}
            <span class="settings-hint">No MIDI devices</span>
          {/if}
        </div>
      </div>

      <div class="settings-field">
        <label class="settings-label">MIDI Map</label>
        <div class="settings-control">
          <select
            class="settings-select"
            value={midiConfigId}
            onchange={(e) => onMidiConfigChange((e.target as HTMLSelectElement).value)}
          >
            {#each midiConfigs as c (c.id)}
              <option value={c.id}>{c.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
