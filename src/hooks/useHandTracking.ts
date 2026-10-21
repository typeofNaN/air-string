import { useEffect, useRef, useState, type RefObject } from 'react'
import { DrawingUtils, HandLandmarker, type HandLandmarkerResult } from '@mediapipe/tasks-vision'
import { GESTURE_CONFIG } from '../config/gesture'
import { classifyFingerState } from '../lib/mediapipe/gestureDetector'
import { GestureStabilizer } from '../lib/mediapipe/gestureStabilizer'
import { createHandLandmarker } from '../lib/mediapipe/handLandmarker'
import { assignHandsByVisualZone } from '../lib/mediapipe/handAssignment'
import { getFingerState, isClosedHand, isOpenHand } from '../lib/mediapipe/handUtils'
import { StrumDetector } from '../lib/mediapipe/strumDetector'
import type { GuitarPosition, StrumDirection, TrackingMetrics } from '../types/guitar'

interface Options {
  enabled: boolean
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  showLandmarks: boolean
  onReady: () => void
  onPosition: (position: GuitarPosition) => void
  onStrum: (direction: StrumDirection) => void
  onError: () => void
}

const emptyMetrics: TrackingMetrics = {
  fps: 0,
  inferenceMs: 0,
  leftConfidence: 0,
  rawGesture: null,
  fingers: null,
  rightState: 'OPEN',
  velocityY: 0,
  leftDetected: false,
  rightDetected: false,
}

export function useHandTracking(options: Options) {
  const [metrics, setMetrics] = useState<TrackingMetrics>(emptyMetrics)
  const callbacks = useRef(options)
  callbacks.current = options

  useEffect(() => {
    if (!options.enabled) return
    let active = true
    let raf = 0
    let lastInference = 0
    let lastMetrics = 0
    let frameCount = 0
    let fpsStarted = performance.now()
    const stabilizer = new GestureStabilizer({
      windowSize: GESTURE_CONFIG.stabilizationFrames,
      requiredVotes: GESTURE_CONFIG.requiredVotes,
      minConfidence: GESTURE_CONFIG.minConfidence,
    })
    const strummer = new StrumDetector({
      cooldownMs: GESTURE_CONFIG.strumCooldown,
    })

    const draw = (result: HandLandmarkerResult) => {
      const canvas = callbacks.current.canvasRef.current
      const video = callbacks.current.videoRef.current
      if (!canvas || !video) return
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (!context) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (!callbacks.current.showLandmarks) return
      const drawing = new DrawingUtils(context)
      const assignment = assignHandsByVisualZone(result.landmarks)
      result.landmarks.forEach((landmarks, index) => {
        const color = index === assignment.chordIndex ? '#ff765f' : '#24d6c1'
        drawing.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color,
          lineWidth: 2,
        })
        drawing.drawLandmarks(landmarks, { color, radius: 3, lineWidth: 1 })
      })
    }

    createHandLandmarker()
      .then((landmarker) => {
        if (!active) return
        callbacks.current.onReady()
        const loop = (now: number) => {
          if (!active) return
          const video = callbacks.current.videoRef.current
          if (video && video.readyState >= 2 && now - lastInference >= 1000 / GESTURE_CONFIG.inferenceFPS) {
            const started = performance.now()
            const result = landmarker.detectForVideo(video, now)
            const inferenceMs = performance.now() - started
            lastInference = now
            frameCount += 1
            draw(result)
            let rawGesture: GuitarPosition | null = null
            let leftConfidence = 0
            let leftFingers = null
            let leftDetected = false
            let rightDetected = false
            const assignment = assignHandsByVisualZone(result.landmarks)
            result.landmarks.forEach((landmarks, index) => {
              const category = result.handedness[index]?.[0]
              const confidence = category?.score ?? 0
              const fingers = getFingerState(landmarks)
              if (index === assignment.chordIndex) {
                leftDetected = true
                rawGesture = classifyFingerState(fingers)
                leftConfidence = confidence
                leftFingers = fingers
                const stable = stabilizer.update(rawGesture, confidence)
                if (stable !== null) callbacks.current.onPosition(stable)
              } else if (index === assignment.playIndex) {
                rightDetected = true
                const strum = strummer.update({ y: landmarks[0].y, open: isOpenHand(fingers), closed: isClosedHand(fingers), timestamp: now })
                if (strum) callbacks.current.onStrum(strum)
              }
            })
            if (!rightDetected) strummer.reset()
            if (now - lastMetrics > 250) {
              const elapsed = now - fpsStarted
              const fps = elapsed > 0 ? Math.round((frameCount * 1000) / elapsed) : 0
              setMetrics({
                fps,
                inferenceMs: Math.round(inferenceMs),
                leftConfidence,
                rawGesture,
                fingers: leftFingers,
                rightState: strummer.state,
                velocityY: Number(strummer.velocityY.toFixed(2)),
                leftDetected,
                rightDetected,
              })
              lastMetrics = now
              if (elapsed > 1000) {
                frameCount = 0
                fpsStarted = now
              }
            }
          }
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      })
      .catch(() => {
        if (active) callbacks.current.onError()
      })

    return () => {
      active = false
      cancelAnimationFrame(raf)
    }
  }, [options.enabled])

  return metrics
}
