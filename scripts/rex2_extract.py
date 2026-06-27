#!/usr/bin/env python3
"""
Extract non-layered drum patterns from JBK REX2 files.
Parse slice offsets → quantize to 16th-note grid → assign drum by position.
BPM sourced from directory name. Sample rate assumed 44100.
"""

import struct
from pathlib import Path
import re

REX2_BASE = Path("/media/music/samples/JUNGLE.BREAKS/ORIGINAL_JUNGLE_BREAKS/JBK_REX_FILES/ORIGINAL_JUNGLE_BREAKS")
KNOWN = {b'HEAD', b'GLOB', b'CREI', b'RECY', b'RCYX', b'CAT ', b'SINF', b'SDAT', b'SLCL', b'DEVL'}


def parse_slices(path):
    data = path.read_bytes()
    if data[:4] != b'CAT ' or data[8:12] != b'REX2':
        return None
    pos = 12
    slices = []
    while pos < len(data) - 8:
        cid = data[pos:pos+4]
        if cid not in KNOWN:
            pos += 1; continue
        size = struct.unpack('>I', data[pos+4:pos+8])[0]
        padded = size + (size & 1)
        end = pos + 8 + padded
        if cid == b'CAT ' and data[pos+8:pos+12] == b'SLCL':
            off = pos + 12
            while off < end:
                if data[off:off+4] == b'SLCE':
                    esz = struct.unpack('>I', data[off+4:off+8])[0]
                    sl_off = struct.unpack('>I', data[off+8:off+12])[0]
                    slices.append(sl_off)
                    off += 8 + esz + ((8 + esz) & 1)
                else:
                    off += 1
        pos = end
    return slices


M = {d: i for i, d in enumerate(['kick', 'snare', 'hihat', 'hihatOpen',
                                   'crash', 'ride', 'tomHi', 'tomMid', 'tomLo'])}


def drum_for_step(step):
    b = step % 16
    if b == 0: return 'kick'
    if b == 8: return 'kick'
    if b in (4, 12): return 'snare'
    if b == 2: return 'hihat'
    if b == 6: return 'hihat'
    if b == 10: return 'hihat'
    if b == 14: return 'hihat'
    return 'hihat'


def extract_pattern(rx2_path, bpm):
    slices = parse_slices(rx2_path)
    if not slices or len(slices) < 3:
        return None
    sr = 44100
    times = [s / sr * 1000 for s in slices]

    gaps = [times[i+1] - times[i] for i in range(len(times)-1)]
    avg_gap = sum(gaps) / len(gaps) if gaps else 60000.0/bpm/4
    total_ms = times[-1] + avg_gap

    step_ms = 60000.0 / bpm / 4
    bar_ms = step_ms * 16
    measures = max(1, min(2, round(total_ms / bar_ms)))
    total_steps = measures * 16

    elapsed = 0
    used = {}
    step_offsets = {}

    for t in times:
        exact_step = t / step_ms
        step = round(exact_step)
        if step >= total_steps:
            continue
        offset = (t - step * step_ms)
        if step not in used:
            used[step] = drum_for_step(step)
            step_offsets[step] = []
        step_offsets[step].append(offset)

    # Build groove: average offset per step, one bar (repeat for multi-bar)
    groove = []
    for bar_step in range(16):
        offsets = []
        for m in range(measures):
            s = m * 16 + bar_step
            if s in step_offsets:
                offsets.extend(step_offsets[s])
        avg = sum(offsets) / len(offsets) if offsets else 0
        groove.append(max(-5, min(5, round(avg))))

    grid = {d: [0]*total_steps for d in M}
    for step, drum in used.items():
        grid[drum][step] = 1

    density = len(used) / total_steps
    name = rx2_path.stem
    # Clean up name
    nice_name = name.replace('JBK_', '').replace('Full_Drums_', '').replace('_', ' ').strip()
    pattern_id = re.sub(r'[^a-z0-9-]+', '-', name.lower()).strip('-')

    return {
        'id': pattern_id,
        'name': nice_name,
        'bpm': bpm,
        'measures': measures,
        'density': density,
        'n_slices': len(slices),
        'used_steps': len(used),
        'total_steps': total_steps,
        'grid': grid,
        'groove': groove,
        'filename': rx2_path.name,
    }


def format_pattern(p):
    drum_hits = {}
    for d in M:
        indices = [i for i, v in enumerate(p['grid'][d]) if v > 0]
        if indices:
            drum_hits[d] = indices
    if not drum_hits:
        return None
    rows = '\n'.join(
        f"      ['{d}',  [{', '.join(str(x) for x in steps)}]],"
        for d, steps in drum_hits.items()
    )
    groove_str = ', '.join(str(g) for g in p['groove'])
    return f"""  {{
    id: '{p['id']}',
    name: '{p['name']}',
    style: "Breakbeat",
    desc: "REX2 — {p['n_slices']} slices, {p['measures']} bar(s) @ {p['bpm']} BPM",
    groove: [{groove_str}],
    bpm: {p['bpm']},
    ...grid({p['measures']},
{rows}
    ),
  }},"""


def scan():
    candidates = []
    seen = set()
    for bpm_dir in sorted(REX2_BASE.iterdir()):
        if not bpm_dir.is_dir():
            continue
        m = re.search(r'(\d{3})', bpm_dir.name)
        if not m:
            continue
        bpm = int(m.group(1))
        for rx2 in sorted(bpm_dir.glob('*.rx2')):
            p = extract_pattern(rx2, bpm)
            if not p or p['id'] in seen:
                continue
            seen.add(p['id'])
            k = sum(1 for v in p['grid']['kick'] if v > 0)
            s = sum(1 for v in p['grid']['snare'] if v > 0)
            if k == 0 or s == 0:
                continue
            if p['density'] > 0.75:
                continue
            if p['used_steps'] < 4:
                continue
            candidates.append((p['density'], bpm, len(candidates), p))

    candidates.sort(key=lambda x: (x[0], x[1], x[2]))
    # Pick from diverse BPM ranges
    selected = []
    used_bpm = set()
    for _, bpm, _, p in candidates:
        group = bpm // 10 * 10
        if group not in used_bpm:
            used_bpm.add(group)
            selected.append(p)
        if len(selected) >= 6:
            break
    # If not enough diversity, grab more from used BPMs
    if len(selected) < 6:
        for _, bpm, _, p in candidates:
            if len(selected) >= 6:
                break
            if p not in selected:
                selected.append(p)
    return selected


if __name__ == '__main__':
    patterns = scan()
    if not patterns:
        print("// No patterns. Relaxing filter...")
        candidates = []
        seen = set()
        for bpm_dir in sorted(REX2_BASE.iterdir()):
            if not bpm_dir.is_dir():
                continue
            m = re.search(r'(\d{3})', bpm_dir.name)
            if not m:
                continue
            bpm = int(m.group(1))
            for rx2 in sorted(bpm_dir.glob('*.rx2')):
                p = extract_pattern(rx2, bpm)
                if not p or p['id'] in seen:
                    continue
                seen.add(p['id'])
                if p['density'] > 0.65 or p['used_steps'] < 4:
                    continue
                candidates.append((p['density'], bpm, len(candidates), p))
        candidates.sort(key=lambda x: (x[0], x[1], x[2]))
        selected = []
        used_bpm = set()
        for _, bpm, _, p in candidates:
            group = bpm // 10 * 10
            if group not in used_bpm or len(selected) < 2:
                used_bpm.add(group)
                selected.append(p)
            if len(selected) >= 6:
                break
        patterns = selected

    for p in patterns:
        out = format_pattern(p)
        if out:
            print(out)
            k = sum(1 for v in p['grid']['kick'] if v > 0)
            s = sum(1 for v in p['grid']['snare'] if v > 0)
            h = sum(1 for v in p['grid']['hihat'] if v > 0)
            print(f"  //  {p['filename']} | k={k} s={s} h={h} density={p['density']:.2f}")
