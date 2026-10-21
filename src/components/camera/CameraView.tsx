import type { RefObject } from 'react'
import { Camera, ScanLine, Square } from 'lucide-react'
import { useI18n } from '../../i18n'
import { getChordByPosition } from '../../lib/music/chords'
import type { AppStatus, GuitarPosition, StrumDirection } from '../../types/guitar'

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

export function CameraView({ videoRef, canvasRef, status, position, showLandmarks, onToggleLandmarks, leftDetected, rightDetected, onStart, onStop, lastStrum, strumPulse }: Props) {
  const { t } = useI18n()
  const active = ['ready', 'playing', 'loading-model'].includes(status)
  const chordName = getChordByPosition(position).name
  return (
    <section className="camera-panel studio-camera">
      <div className={`camera-frame ${active ? 'is-active' : ''}`}>
        <video ref={videoRef} muted playsInline />
        <canvas ref={canvasRef} />
        {!active && <div className="camera-placeholder"><Camera size={38} /><span>{t('camera.empty')}</span><button onClick={onStart}>{t('action.start')}</button></div>}
        <div className="camera-zone chord-zone"><span>{t('camera.left')}</span><i /></div>
        <div className="camera-zone play-zone"><span>{t('camera.right')}</span><i /></div>
        {lastStrum && <div key={strumPulse} className="strum-feedback" aria-live="polite" aria-label={`${chordName} chord played`}><i /><i /><i /><i /><i /><i /><b>{chordName}</b></div>}
        <div className="camera-toolbar">
          <span className={active ? 'online' : ''}><i />{active ? t('camera.connected') : t('camera.disconnected')}</span>
          <div className="camera-actions">
            <label className="landmark-control"><ScanLine />{t('camera.landmarks')}<input type="checkbox" checked={showLandmarks} onChange={onToggleLandmarks} /></label>
            {active && <button className="stop-playing" onClick={onStop}><Square />{t('action.stop')}</button>}
          </div>
        </div>
      </div>
      <div className="hand-readouts">
        <div><small>{t('camera.left')}</small><strong>{active && leftDetected ? <>{t('camera.gesture')} <b>{position}</b> · <em>{t('camera.stable')}</em></> : t('camera.waiting')}</strong></div>
        <div><small>{t('camera.right')}</small><strong className="ready-copy">{active && rightDetected ? t('camera.ready') : t('camera.playHint')}</strong></div>
      </div>
    </section>
  )
}
