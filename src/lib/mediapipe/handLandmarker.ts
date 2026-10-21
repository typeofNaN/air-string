import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { MEDIAPIPE_CONFIG } from '../../config/gesture'

let instancePromise: Promise<HandLandmarker> | null = null

export function createHandLandmarker(): Promise<HandLandmarker> {
  if (!instancePromise) {
    instancePromise = FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmUrl)
      .then((vision) =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MEDIAPIPE_CONFIG.modelUrl, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.6,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.55,
        }),
      )
      .catch((error: unknown) => {
        instancePromise = null
        throw error
      })
  }
  return instancePromise
}
