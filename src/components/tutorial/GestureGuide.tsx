import { ArrowDown, ArrowUp } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { GuitarPosition } from '../../types/guitar'

const gestures = ['☝', '✌', 'Ⅲ', '🖖', '✋', '🤙']

export function GestureGuide({ position }: { position: GuitarPosition }) {
  const { t } = useI18n()
  return (
    <section className="gesture-guide">
      <div className="guide-left">
        <h2>{t('guide.left')}</h2>
        <div className="gesture-list">
          {gestures.map((gesture, index) => {
            const value = (index + 1) as GuitarPosition
            return (
              <div
                key={value}
                className={position === value ? 'is-active' : ''}
              >
                <b>{value}</b>
                <span>{gesture}</span>
                {value === 6 && <small>{t('guide.customSix')}</small>}
              </div>
            )
          })}
        </div>
      </div>
      <div className="guide-right">
        <h2>{t('guide.right')}</h2>
        <div>
          <span>
            <ArrowUp /> UP
          </span>
          <span>
            <ArrowDown /> DOWN
          </span>
        </div>
      </div>
    </section>
  )
}
