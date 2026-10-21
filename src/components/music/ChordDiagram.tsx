import type { ChordDefinition } from '../../lib/music/chords'

export function ChordDiagram({ chord }: { chord: ChordDefinition }) {
  return (
    <div className="chord-diagram" aria-label={`${chord.name} chord diagram`}>
      <div className="diagram-nut" />
      <div className="diagram-grid">{Array.from({ length: 4 }, (_, fret) => <i key={fret} />)}</div>
      <div className="diagram-strings">
        {chord.frets.map((fret, string) => (
          <span key={string} className={fret < 0 ? 'muted' : fret === 0 ? 'open' : ''}>
            {fret > 0 && <b style={{ top: `${(fret - 0.5) * 25}%` }} />}
          </span>
        ))}
      </div>
    </div>
  )
}
