import { midiNoteToDrum as defaultNoteMap } from '../config/drumConfig';
import { MIDI_STATUS_MASK, MIDI_CC, MIDI_NOTE_ON } from '../config/constants';
import type { MidiInput } from '../types';

class MIDIStore {
  midiAccess = $state<WebMidi.MIDIAccess | null>(null);
  inputs = $state<MidiInput[]>([]);
  activeInput = $state<string | null>(null);

  private noteMap: Record<number, string | null> = defaultNoteMap;
  private onNoteOn?: (drumId: string, velocity: number) => void;
  private onCC?: (controller: number, value: number) => void;
  private activeHandler: ((event: WebMidi.MIDIMessageEvent) => void) | null = null;
  private stateHandler: (() => void) | null = null;

  setOnNoteOn(cb: (drumId: string, velocity: number) => void) {
    this.onNoteOn = cb;
  }

  setOnCC(cb?: (controller: number, value: number) => void) {
    this.onCC = cb;
  }

  setNoteMap(map: Record<number, string | null>) {
    this.noteMap = map || defaultNoteMap;
  }

  private initialized = false;

  async init() {
    if (this.initialized) return;
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not available — check chrome://flags/#web-midi or use HTTPS');
      return;
    }

    try {
      console.log('Requesting MIDI access...');
      const access = await navigator.requestMIDIAccess({ sysex: false });
      this.initialized = true;
      this.midiAccess = access;
      const list: MidiInput[] = [];
      for (const input of access.inputs.values()) {
        list.push({ id: input.id, name: input.name || 'MIDI Input' });
      }
      this.inputs = list;
      console.log(`MIDI: ${list.length} input(s) found`, list.map(i => i.name));
      if (list.length > 0) {
        const preferred = list.find(i => !i.name.includes('MIDI Through'));
        this.activeInput = preferred ? preferred.id : list[0].id;
      }

      this.setupStateListener(access);
      this.setupMessageListener();
    } catch (err) {
      console.error('MIDI access failed:', err);
    }
  }

  private setupStateListener(access: WebMidi.MIDIAccess) {
    if (this.stateHandler) {
      access.removeEventListener('statechange', this.stateHandler);
    }

    this.stateHandler = () => {
      const list: MidiInput[] = [];
      for (const input of access.inputs.values()) {
        list.push({ id: input.id, name: input.name || 'MIDI Input' });
      }
      this.inputs = list;
      // Auto-select new device if none active
      if (list.length > 0 && !this.activeInput) {
        const preferred = list.find(i => !i.name.includes('MIDI Through'));
        this.activeInput = preferred ? preferred.id : list[0].id;
        this.setupMessageListener();
      }
    };

    access.addEventListener('statechange', this.stateHandler);
  }

  selectInput(inputId: string | null) {
    this.activeInput = inputId;
    this.setupMessageListener();
  }

  private setupMessageListener() {
    if (!this.midiAccess || !this.activeInput) return;

    const input = this.midiAccess.inputs.get(this.activeInput);
    if (!input) return;

    if (this.activeHandler) {
      input.removeEventListener('midimessage', this.activeHandler as EventListener);
    }

    this.activeHandler = (event: WebMidi.MIDIMessageEvent) => {
      const data = event.data;
      if (!data) return;
      const status = data[0] & MIDI_STATUS_MASK;
      const data1 = data[1];
      const data2 = data[2];

      if (status === MIDI_CC) {
        console.log(`MIDI CC ${data1} = ${data2}`);
        this.onCC?.(data1, data2);
        return;
      }

      if (status === MIDI_NOTE_ON && data2 > 0) {
        const velocity = data2 / 127;
        const drumId = this.noteMap[data1];
        console.log(`MIDI Note ${data1} → ${drumId || '(unmapped)'} vel=${velocity.toFixed(2)}`);
        if (drumId) {
          this.onNoteOn?.(drumId, velocity);
        }
      }
    };

    input.addEventListener('midimessage', this.activeHandler as EventListener);
  }

  destroy() {
    this.initialized = false;
    if (this.activeHandler && this.midiAccess && this.activeInput) {
      const input = this.midiAccess.inputs.get(this.activeInput);
      if (input) {
        input.removeEventListener('midimessage', this.activeHandler as EventListener);
      }
    }
    if (this.stateHandler && this.midiAccess) {
      this.midiAccess.removeEventListener('statechange', this.stateHandler);
    }
  }
}

export const midi = new MIDIStore();
