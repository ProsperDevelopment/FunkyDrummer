import { useState, useEffect, useRef } from 'react';
import { midiNoteToDrum as defaultNoteMap } from '../config/drumConfig';
import { MIDI_STATUS_MASK, MIDI_CC, MIDI_NOTE_ON } from '../config/constants';

export function useMIDI(onNoteOn, noteMap, onCC) {
  const [midiAccess, setMidiAccess] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
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
        const list = [];
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

    const handler = (event) => {
      const status = event.data[0] & MIDI_STATUS_MASK;
      const data1 = event.data[1];
      const data2 = event.data[2];

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

    input.addEventListener('midimessage', handler);
    return () => input.removeEventListener('midimessage', handler);
  }, [midiAccess, activeInput, onNoteOn]);

  useEffect(() => {
    if (!midiAccess) return;

    const onConnect = (_e) => {
      const list = [];
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
