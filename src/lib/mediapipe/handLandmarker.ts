import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { getMediaPipeAssetUrls } from '../../config/mediapipeAssets'

let instancePromise: Promise<HandLandmarker> | null = null

export function createHandLandmarker(): Promise<HandLandmarker> {
  if (!instancePromise) {
    const assets = getMediaPipeAssetUrls()
    instancePromise = FilesetResolver.forVisionTasks(assets.wasmUrl)
      .then((vision) =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: assets.modelUrl, delegate: 'GPU' },
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
