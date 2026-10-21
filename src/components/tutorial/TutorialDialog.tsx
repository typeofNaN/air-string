import { Camera, Hand, Music2, X } from 'lucide-react'
import { useI18n } from '../../i18n'

export function TutorialDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  if (!open) return null
  const steps = [
    [Camera, t('tutorial.1')],
    [Hand, t('tutorial.2')],
    [Hand, t('tutorial.3')],
    [Music2, t('tutorial.4')],
  ] as const
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="tutorial-dialog" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose} aria-label={t('tutorial.close')}><X /></button>
        <h2 id="tutorial-title">{t('tutorial.title')}</h2>
        <div className="tutorial-steps">{steps.map(([Icon, label], index) => <div key={label}><span><Icon /></span><b>0{index + 1}</b><p>{label}</p></div>)}</div>
        <p className="tutorial-note">{t('tutorial.note')}</p>
        <button className="dialog-confirm" onClick={onClose}>{t('tutorial.close')}</button>
      </section>
    </div>
  )
}
