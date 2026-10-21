import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export type GuitarPosition = 1 | 2 | 3 | 4 | 5 | 6
export type StrumDirection = 'UP' | 'DOWN'
export type StrumState = 'OPEN' | 'MOVING' | 'COOLDOWN'
export type AppStatus =
  'idle' | 'requesting' | 'loading-model' | 'ready' | 'playing' | 'error'

export interface FingerState {
  thumb: boolean
  index: boolean
  middle: boolean
  ring: boolean
  pinky: boolean
}

export interface TrackedHand {
  side: 'Left' | 'Right'
  confidence: number
  landmarks: NormalizedLandmark[]
  fingers: FingerState
}

export interface TrackingMetrics {
  fps: number
  inferenceMs: number
  leftConfidence: number
  rawGesture: GuitarPosition | null
  fingers: FingerState | null
  rightState: StrumState
  velocityY: number
  leftDetected: boolean
  rightDetected: boolean
}
