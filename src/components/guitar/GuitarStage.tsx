import type { GuitarPosition, StrumDirection } from '../../types/guitar'

export function GuitarStage({ position, strum, pulse }: { position: GuitarPosition; strum: StrumDirection | null; pulse: number }) {
  return (
    <section className="guitar-stage" aria-label="Virtual guitar">
      <div className="guitar-body" aria-hidden="true"><span /></div>
      <div className="neck">
        <div className="frets">
          {([1, 2, 3, 4, 5, 6] as GuitarPosition[]).map((fret) => (
            <div key={fret} className={`fret ${position === fret ? 'is-active' : ''}`}>
              <span className="fret-marker" />
            </div>
          ))}
        </div>
        <div key={pulse} className={`strings ${strum ? `is-strumming is-${strum.toLowerCase()}` : ''}`}>
          {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
        </div>
      </div>
      <div className="fret-labels" aria-label={`Position ${position}`}>
        {([1, 2, 3, 4, 5, 6] as GuitarPosition[]).map((fret) => (
          <span key={fret} className={position === fret ? 'is-active' : ''}>{fret}</span>
        ))}
      </div>
      {strum && <span key={`note-${pulse}`} className="music-note" aria-hidden="true">♪</span>}
    </section>
  )
}
