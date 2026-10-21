import type { ChordDefinition } from '../../lib/music/chords'

export function ChordDiagram({ chord }: { chord: ChordDefinition }) {
  return (
    <div
      className="relative h-[105px] w-[116px]"
      aria-label={`${chord.name} chord diagram`}
    >
      <div className="absolute inset-x-3 top-3 border-t-4 border-ink" />
      <div className="absolute bottom-1 left-3 right-2 top-4 grid grid-rows-4">
        {Array.from({ length: 4 }, (_, fret) => (
          <i key={fret} className="border-b border-[#aaa89f]" />
        ))}
      </div>
      <div className="absolute bottom-0 left-3 right-2 top-0 grid grid-cols-6">
        {chord.frets.map((fret, string) => (
          <span
            key={string}
            className="relative border-l border-[#93948c] last:border-r"
          >
            {fret < 0 && (
              <i className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] not-italic">
                ×
              </i>
            )}
            {fret === 0 && (
              <i className="absolute left-1/2 top-0 -translate-x-1/2 text-[9px] not-italic">
                ○
              </i>
            )}
            {fret > 0 && (
              <b
                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terra"
                style={{ top: `${(fret - 0.5) * 25}%` }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
