import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { ChordDefinition } from '../../lib/music/chords'
import type { PlayStyle } from '../../lib/audio/guitarAudio'
import type { TrackingMetrics } from '../../types/guitar'
import { ChordDiagram } from './ChordDiagram'
import { DebugPanel } from '../DebugPanel'

interface Props {
  chord: ChordDefinition
  style: PlayStyle
  volume: number
  tempo: number
  autoArpeggio: boolean
  debugOpen: boolean
  metrics: TrackingMetrics
  onStyle: (style: PlayStyle) => void
  onVolume: (volume: number) => void
  onTempo: (tempo: number) => void
  onAutoArpeggio: (enabled: boolean) => void
  onDebug: () => void
}

export function ChordInspector(props: Props) {
  const { t } = useI18n()
  return (
    <aside className="chord-inspector">
      <div className="chord-identity">
        <div><strong>{props.chord.name}</strong><p>{props.chord.name} {t(props.chord.quality === 'major' ? 'chord.major' : 'chord.minor')}</p></div>
        <ChordDiagram chord={props.chord} />
      </div>
      <div className="style-switch">
        <button className={props.style === 'strum' ? 'active' : ''} onClick={() => props.onStyle('strum')}>{t('control.strum')}</button>
        <button className={props.style === 'arpeggio' ? 'active' : ''} onClick={() => props.onStyle('arpeggio')}>{t('control.arpeggio')}</button>
      </div>
      <Control label={t('control.tempo')} value={`${props.tempo} BPM`} min={50} max={140} step={2} numeric={props.tempo} onChange={props.onTempo} />
      <Control label={t('control.volume')} value={`${Math.round(props.volume * 100)}%`} min={0} max={1} step={0.01} numeric={props.volume} onChange={props.onVolume} />
      <label className="auto-row">
        <span><b>{t('control.auto')}</b><small>{t('control.autoHint')}</small></span>
        <input type="checkbox" checked={props.autoArpeggio} onChange={(event) => props.onAutoArpeggio(event.target.checked)} />
        <i />
      </label>
      <button className="debug-toggle" onClick={props.onDebug}>{props.debugOpen ? <ChevronDown /> : <ChevronRight />}{t('debug.title')}</button>
      {props.debugOpen && <DebugPanel metrics={props.metrics} stable={props.chord.position} />}
    </aside>
  )
}

function Control({ label, value, min, max, step, numeric, onChange }: { label: string; value: string; min: number; max: number; step: number; numeric: number; onChange: (value: number) => void }) {
  return (
    <div className="slider-control">
      <div><span>{label}</span><output>{value}</output></div>
      <div><button onClick={() => onChange(Math.max(min, numeric - step))} aria-label={`${label} -`}><Minus /></button><input aria-label={label} type="range" min={min} max={max} step={step} value={numeric} onChange={(event) => onChange(Number(event.target.value))} /><button onClick={() => onChange(Math.min(max, numeric + step))} aria-label={`${label} +`}><Plus /></button></div>
    </div>
  )
}
