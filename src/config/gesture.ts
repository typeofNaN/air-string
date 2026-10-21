export const GESTURE_CONFIG = {
  stabilizationFrames: 4,
  requiredVotes: 2,
  minConfidence: 0.7,
  strumCooldown: 250,
  strumVelocityThreshold: 0.07,
  strumDistanceThreshold: 0.05,
  inferenceFPS: 30,
} as const

export const MEDIAPIPE_CONFIG = {
  wasmUrl: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm',
  modelUrl:
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
} as const
