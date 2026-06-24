import { useState, useEffect } from 'react';
import { midiNoteToDrum } from '../config/drumConfig';

export function useMIDI(onNoteOn) {
  const [midiAccess, setMidiAccess] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

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
        if (list.length > 0) setActiveInput(list[0].id);
      },
      (err) => console.log('MIDI access denied:', err)
    );
  }, []);

  useEffect(() => {
    if (!midiAccess || !activeInput) return;

    const input = midiAccess.inputs.get(activeInput);
    if (!input) return;

    const handler = (event) => {
      const status = event.data[0] & 0xF0;
      if (status === 0x90 && event.data[2] > 0) {
        const note = event.data[1];
        const velocity = event.data[2] / 127;
        const drumId = midiNoteToDrum[note];
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
