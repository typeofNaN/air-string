import { Camera, Hand, Music2 } from 'lucide-react'
import { useI18n } from '../../i18n'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'

export function TutorialDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { t } = useI18n()
  const steps = [
    [Camera, t('tutorial.1')],
    [Hand, t('tutorial.2')],
    [Hand, t('tutorial.3')],
    [Music2, t('tutorial.4')],
  ] as const
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent>
        <DialogTitle className="font-display text-4xl text-forest">
          {t('tutorial.title')}
        </DialogTitle>
        <div className="mt-6 grid grid-cols-4 gap-3 max-sm:grid-cols-1">
          {steps.map(([Icon, label], index) => (
            <div key={label} className="rounded-xl border border-line p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-lime">
                <Icon className="h-4 w-4" />
              </span>
              <b className="mt-4 block text-[10px] text-terra">0{index + 1}</b>
              <p className="mt-2 text-xs">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted">{t('tutorial.note')}</p>
        <Button className="mt-5 rounded-full" onClick={onClose}>
          {t('tutorial.close')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
