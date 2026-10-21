import { CHORDS } from '../../lib/music/chords'
import type { GuitarPosition } from '../../types/guitar'
import { GestureGlyph } from './GestureGlyph'

export function ChordPads({ position, onSelect }: { position: GuitarPosition; onSelect: (position: GuitarPosition) => void }) {
  return (
    <section className="chord-pads" aria-label="Chord selection">
      {CHORDS.map((chord) => (
        <button key={chord.name} type="button" className={position === chord.position ? 'active' : ''} onClick={() => onSelect(chord.position)}>
          <small>{chord.position}</small>
          <strong>{chord.name}</strong>
          <GestureGlyph fingers={chord.gesture} />
        </button>
      ))}
    </section>
  )
}
