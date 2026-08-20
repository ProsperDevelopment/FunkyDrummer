/// <reference types="vite/client" />

declare namespace WebMidi {
  interface MIDIAccess {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((e: MIDIConnectionEvent) => void) | null;
    sysexEnabled: boolean;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface MIDIInputMap {
    get(id: string): MIDIInput | undefined;
    values(): IterableIterator<MIDIInput>;
    forEach(callback: (input: MIDIInput) => void): void;
  }

  interface MIDIInput {
    id: string;
    name: string | null;
    onmidimessage: ((e: MIDIMessageEvent) => void) | null;
    addEventListener(type: 'midimessage', listener: EventListener): void;
    removeEventListener(type: 'midimessage', listener: EventListener): void;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIInput;
  }
}

interface Navigator {
  requestMIDIAccess(options?: { sysex?: boolean }): Promise<WebMidi.MIDIAccess>;
}
