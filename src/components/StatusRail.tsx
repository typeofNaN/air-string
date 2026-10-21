import { ArrowDown, ArrowUp, Hand, Play, Square } from 'lucide-react'
import { useI18n } from '../i18n'
import type { AppStatus, GuitarPosition, StrumDirection } from '../types/guitar'

export function StatusRail({
  position,
  strum,
  status,
  rightDetected,
  onToggle,
}: {
  position: GuitarPosition
  strum: StrumDirection | null
  status: AppStatus
  rightDetected: boolean
  onToggle: () => void
}) {
  const { t } = useI18n()
  const active =
    status === 'playing' ||
    status === 'ready' ||
    status === 'loading-model' ||
    status === 'requesting'
  return (
    <section className="status-rail">
      <div className="position-readout">
        <small>{t('status.position')}</small>
        <strong>{position}</strong>
      </div>
      <div className="rail-item">
        <span>
          <small>{t('status.rightHand')}</small>
          <strong>
            {active && rightDetected ? t('status.ready') : t('status.waiting')}
          </strong>
        </span>
        <Hand />
      </div>
      <div className="rail-item action-readout">
        <span>
          <small>{t('status.lastAction')}</small>
          <strong>{strum ?? '—'}</strong>
        </span>
        {strum === 'UP' ? <ArrowUp /> : <ArrowDown />}
      </div>
      <button
        className={`play-button ${active ? 'is-stop' : ''}`}
        onClick={onToggle}
        type="button"
      >
        <span>
          {active ? (
            <Square fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
        </span>
        {active ? t('action.stop') : t('action.start')}
      </button>
    </section>
  )
}
