import { useState, useEffect, useRef } from 'react';
import { midiNoteToDrum as defaultNoteMap } from '../config/drumConfig';
import { MIDI_STATUS_MASK, MIDI_CC, MIDI_NOTE_ON } from '../config/constants';
import type { MidiInput } from '../types';

export function useMIDI(
  onNoteOn: (drumId: string, velocity: number) => void,
  noteMap: Record<number, string | null>,
  onCC?: (controller: number, value: number) => void
) {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [inputs, setInputs] = useState<MidiInput[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const noteMapRef = useRef(noteMap || defaultNoteMap);
  noteMapRef.current = noteMap || defaultNoteMap;
  const onCCRef = useRef(onCC);
  onCCRef.current = onCC;

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      console.log('Web MIDI API not available');
      return;
    }

    navigator.requestMIDIAccess().then(
      (access) => {
        setMidiAccess(access);
        const list: MidiInput[] = [];
        for (const input of access.inputs.values()) {
          list.push({ id: input.id, name: input.name || 'MIDI Input' });
        }
        setInputs(list);
        if (list.length > 0) {
          const preferred = list.find(i => !i.name.includes('MIDI Through'));
          setActiveInput(preferred ? preferred.id : list[0].id);
        }
      },
      (err) => console.log('MIDI access denied:', err)
    );
  }, []);

  useEffect(() => {
    if (!midiAccess || !activeInput) return;

    const input = midiAccess.inputs.get(activeInput);
    if (!input) return;

    const handler = (event: WebMidi.MIDIMessageEvent) => {
      const data = event.data;
      if (!data) return;
      const status = data[0] & MIDI_STATUS_MASK;
      const data1 = data[1];
      const data2 = data[2];

      if (status === MIDI_CC) {
        console.log(`MIDI CC ${data1} = ${data2}`);
        onCCRef.current?.(data1, data2);
        return;
      }

      if (status === MIDI_NOTE_ON && data2 > 0) {
        const velocity = data2 / 127;
        const drumId = noteMapRef.current[data1];
        if (drumId) {
          onNoteOn(drumId, velocity);
        }
      }
    };

    input.addEventListener('midimessage', handler as EventListener);
    return () => input.removeEventListener('midimessage', handler as EventListener);
  }, [midiAccess, activeInput, onNoteOn]);

  useEffect(() => {
    if (!midiAccess) return;

    const onConnect = () => {
      const list: MidiInput[] = [];
      for (const input of midiAccess.inputs.values()) {
        list.push({ id: input.id, name: input.name || 'MIDI Input' });
      }
      setInputs(list);
    };

    midiAccess.addEventListener('statechange', onConnect);
    return () => midiAccess.removeEventListener('statechange', onConnect);
  }, [midiAccess]);

  return { inputs, activeInput, setActiveInput };
}
