import type { RefObject } from 'react'
import { Camera, ScanLine, Square } from 'lucide-react'
import { useI18n } from '../../i18n'
import { getChordByPosition } from '../../lib/music/chords'
import type {
  AppStatus,
  GuitarPosition,
  StrumDirection,
} from '../../types/guitar'
import { Button } from '../ui/button'

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  status: AppStatus
  position: GuitarPosition
  showLandmarks: boolean
  onToggleLandmarks: () => void
  leftDetected: boolean
  rightDetected: boolean
  onStart: () => void
  onStop: () => void
  lastStrum: StrumDirection | null
  strumPulse: number
}

export function CameraView({
  videoRef,
  canvasRef,
  status,
  position,
  showLandmarks,
  onToggleLandmarks,
  leftDetected,
  rightDetected,
  onStart,
  onStop,
  lastStrum,
  strumPulse,
}: Props) {
  const { t } = useI18n()
  const active = ['ready', 'playing', 'loading-model'].includes(status)
  const chordName = getChordByPosition(position).name
  return (
    <section className="min-w-0 bg-[#d9d7d0]">
      <div className="relative min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_42%_30%,#ece9df,#c8c7bf)] max-lg:min-h-[430px] max-sm:min-h-[340px]">
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[3] h-full w-full -scale-x-100 object-cover"
        />
        {!active && (
          <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-3 text-[#6d7069]">
            <Camera className="h-10 w-10" />
            <span>{t('camera.empty')}</span>
            <Button onClick={onStart} className="rounded-full">
              {t('action.start')}
            </Button>
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-1/2 border border-dashed border-white/40">
          <span className="absolute left-4 top-4 rounded-full bg-forest/70 px-3 py-2 text-[10px] font-bold tracking-widest text-white backdrop-blur">
            {t('camera.left')}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-1/2 border border-dashed border-white/40">
          <span className="absolute right-4 top-4 rounded-full bg-forest/70 px-3 py-2 text-[10px] font-bold tracking-widest text-white backdrop-blur">
            {t('camera.right')}
          </span>
        </div>
        {lastStrum && (
          <div
            key={strumPulse}
            className="pointer-events-none absolute right-[17%] top-1/4 z-[7] flex animate-strum-pop items-center gap-1.5 rounded-full bg-lime/90 px-5 py-4 text-forest"
            aria-live="polite"
            aria-label={`${chordName} chord played`}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} className="h-14 w-0.5 rotate-[18deg] bg-terra" />
            ))}
            <b className="ml-1 font-display text-3xl">{chordName}</b>
          </div>
        )}
        <div className="absolute inset-x-4 bottom-4 z-[6] flex items-center justify-between rounded-xl bg-[#1c231e]/75 px-3 py-2 text-[11px] text-[#f7f5ef] backdrop-blur-xl">
          <span className="flex items-center gap-2">
            <i
              className={`h-2 w-2 rounded-full ${active ? 'bg-[#bde477] shadow-[0_0_0_4px_rgba(189,228,119,.15)]' : 'bg-[#a79e8c]'}`}
            />
            {active ? t('camera.connected') : t('camera.disconnected')}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-1.5">
              <ScanLine className="h-3.5 w-3.5" />
              {t('camera.landmarks')}
              <input
                className="accent-lime"
                type="checkbox"
                checked={showLandmarks}
                onChange={onToggleLandmarks}
              />
            </label>
            {active && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-[10px]"
                onClick={onStop}
              >
                <Square className="h-2.5 w-2.5 fill-current" />
                {t('action.stop')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="grid min-h-[70px] grid-cols-2 bg-forest text-white max-sm:grid-cols-1">
        {[
          [
            t('camera.left'),
            active && leftDetected ? (
              <>
                {t('camera.gesture')}{' '}
                <b className="font-display text-lg text-lime">{position}</b> ·{' '}
                <em className="text-[10px] not-italic text-lime">
                  {t('camera.stable')}
                </em>
              </>
            ) : (
              t('camera.waiting')
            ),
          ],
          [
            t('camera.right'),
            <span className="text-lime">
              {active && rightDetected
                ? t('camera.ready')
                : t('camera.playHint')}
            </span>,
          ],
        ].map(([label, value], index) => (
          <div key={index} className="border-r border-white/15 px-5 py-3">
            <small className="block text-[9px] tracking-widest text-[#aebcaf]">
              {label}
            </small>
            <strong className="mt-1 block text-xs">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
