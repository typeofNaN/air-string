import { useI18n } from '../i18n'
import type { GuitarPosition, TrackingMetrics } from '../types/guitar'

export function DebugPanel({
  metrics,
  stable,
}: {
  metrics: TrackingMetrics
  stable: GuitarPosition
}) {
  const { t } = useI18n()
  return (
    <aside
      className="mt-2 rounded-lg border border-line bg-[#eeebe3] p-3 text-[9px]"
      aria-live="polite"
    >
      <strong className="mb-2 block text-[10px]">{t('debug.title')}</strong>
      <code className="leading-relaxed">
        FPS: {metrics.fps}
        <br />
        Inference: {metrics.inferenceMs}ms
        <br />
        Left confidence: {metrics.leftConfidence.toFixed(2)}
        <br />
        Gesture: {metrics.rawGesture ?? '—'} / stable {stable}
        <br />
        Fingers:{' '}
        {metrics.fingers
          ? Object.entries(metrics.fingers)
              .filter(([, on]) => on)
              .map(([name]) => name)
              .join(', ')
          : '—'}
        <br />
        Right: {metrics.rightState}
        <br />
        Velocity Y: {metrics.velocityY}
      </code>
    </aside>
  )
}
