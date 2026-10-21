export function GestureGlyph({ fingers }: { fingers: readonly boolean[] }) {
  return (
    <span className="gesture-glyph" aria-hidden="true">
      {fingers.map((active, index) => <i key={index} className={active ? 'active' : ''}><b /></i>)}
    </span>
  )
}
