import { CHORDS } from '../../lib/music/chords'
import { cn } from '../../lib/utils'
import type { GuitarPosition } from '../../types/guitar'
import { Button } from '../ui/button'
import { GestureGlyph } from './GestureGlyph'

export function ChordPads({
  position,
  onSelect,
}: {
  position: GuitarPosition
  onSelect: (position: GuitarPosition) => void
}) {
  return (
    <section
      className="my-5 grid grid-cols-6 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2"
      aria-label="Chord selection"
    >
      {CHORDS.map((chord) => (
        <Button
          key={chord.name}
          variant="outline"
          className={cn(
            'grid min-h-[78px] h-auto grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-4 py-3 text-left hover:-translate-y-0.5 hover:bg-paper',
            position === chord.position &&
              'border-[#c8d36f] bg-lime hover:bg-lime',
          )}
          onClick={() => onSelect(chord.position)}
        >
          <small className="text-[9px] text-muted">{chord.position}</small>
          <strong className="font-display text-3xl text-forest">
            {chord.name}
          </strong>
          <GestureGlyph fingers={chord.gesture} />
        </Button>
      ))}
    </section>
  )
}
