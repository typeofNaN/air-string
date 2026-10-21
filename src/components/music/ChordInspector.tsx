import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { ChordDefinition } from '../../lib/music/chords'
import type { PlayStyle } from '../../lib/audio/guitarAudio'
import type { TrackingMetrics } from '../../types/guitar'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
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
    <aside className="border-l border-line bg-paper p-6 max-lg:border-l-0 max-lg:border-t">
      <div className="grid grid-cols-[1fr_130px] items-center border-b border-line pb-5">
        <div>
          <strong className="font-display text-6xl leading-none text-forest">
            {props.chord.name}
          </strong>
          <p className="mt-2 text-xs text-muted">
            {props.chord.name}{' '}
            {t(props.chord.quality === 'major' ? 'chord.major' : 'chord.minor')}
          </p>
        </div>
        <ChordDiagram chord={props.chord} />
      </div>
      <div className="my-5 grid grid-cols-2 rounded-lg border border-line p-1">
        {(['strum', 'arpeggio'] as const).map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className={cn(
              'text-[11px]',
              props.style === value &&
                'bg-forest text-white hover:bg-forest hover:text-white',
            )}
            onClick={() => props.onStyle(value)}
          >
            {t(value === 'strum' ? 'control.strum' : 'control.arpeggio')}
          </Button>
        ))}
      </div>
      <Control
        label={t('control.tempo')}
        value={`${props.tempo} BPM`}
        min={50}
        max={140}
        step={2}
        numeric={props.tempo}
        onChange={props.onTempo}
      />
      <Control
        label={t('control.volume')}
        value={`${Math.round(props.volume * 100)}%`}
        min={0}
        max={1}
        step={0.01}
        numeric={props.volume}
        onChange={props.onVolume}
      />
      <div className="my-5 flex items-center justify-between border-y border-line py-4">
        <span className="flex flex-col">
          <b className="text-[11px]">{t('control.auto')}</b>
          <small className="mt-0.5 text-[9px] text-muted">
            {t('control.autoHint')}
          </small>
        </span>
        <Switch
          aria-label={t('control.auto')}
          checked={props.autoArpeggio}
          onCheckedChange={props.onAutoArpeggio}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start px-0 text-[10px] text-muted"
        onClick={props.onDebug}
      >
        {props.debugOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
        {t('debug.title')}
      </Button>
      {props.debugOpen && (
        <DebugPanel metrics={props.metrics} stable={props.chord.position} />
      )}
    </aside>
  )
}

function Control({
  label,
  value,
  min,
  max,
  step,
  numeric,
  onChange,
}: {
  label: string
  value: string
  min: number
  max: number
  step: number
  numeric: number
  onChange: (value: number) => void
}) {
  return (
    <div className="my-5">
      <div className="flex justify-between text-[11px] font-bold">
        <span>{label}</span>
        <output className="text-terra">{value}</output>
      </div>
      <div className="mt-2 grid grid-cols-[28px_1fr_28px] items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => onChange(Math.max(min, numeric - step))}
          aria-label={`${label} -`}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Slider
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={[numeric]}
          onValueChange={([value]) => onChange(value)}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => onChange(Math.min(max, numeric + step))}
          aria-label={`${label} +`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
