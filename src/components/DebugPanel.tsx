import { useI18n } from '../i18n'
import type { GuitarPosition, TrackingMetrics } from '../types/guitar'

export function DebugPanel({ metrics, stable }: { metrics: TrackingMetrics; stable: GuitarPosition }) {
  const { t } = useI18n()
  return (
    <aside className="debug-panel" aria-live="polite">
      <strong>{t('debug.title')}</strong>
      <code>FPS: {metrics.fps}<br />Inference: {metrics.inferenceMs}ms<br />Left confidence: {metrics.leftConfidence.toFixed(2)}<br />Gesture: {metrics.rawGesture ?? '—'} / stable {stable}<br />Fingers: {metrics.fingers ? Object.entries(metrics.fingers).filter(([, on]) => on).map(([name]) => name).join(', ') : '—'}<br />Right: {metrics.rightState}<br />Velocity Y: {metrics.velocityY}</code>
    </aside>
  )
}
