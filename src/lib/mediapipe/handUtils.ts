import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { FingerState } from '../../types/guitar'

const distance = (a: NormalizedLandmark, b: NormalizedLandmark) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const angle = (
  a: NormalizedLandmark,
  vertex: NormalizedLandmark,
  c: NormalizedLandmark,
) => {
  const ab = { x: a.x - vertex.x, y: a.y - vertex.y }
  const cb = { x: c.x - vertex.x, y: c.y - vertex.y }
  const denominator = Math.max(
    Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y),
    0.0001,
  )
  const cosine = Math.min(
    1,
    Math.max(-1, (ab.x * cb.x + ab.y * cb.y) / denominator),
  )
  return (Math.acos(cosine) * 180) / Math.PI
}

const fingerExtended = (
  points: NormalizedLandmark[],
  mcp: number,
  pip: number,
  tip: number,
) =>
  angle(points[mcp], points[pip], points[tip]) > 150 &&
  distance(points[tip], points[0]) > distance(points[pip], points[0]) * 1.08

export function getFingerState(points: NormalizedLandmark[]): FingerState {
  const palmWidth = Math.max(distance(points[5], points[17]), 0.04)
  return {
    thumb:
      angle(points[2], points[3], points[4]) > 145 &&
      distance(points[4], points[5]) > palmWidth * 0.7,
    index: fingerExtended(points, 5, 6, 8),
    middle: fingerExtended(points, 9, 10, 12),
    ring: fingerExtended(points, 13, 14, 16),
    pinky: fingerExtended(points, 17, 18, 20),
  }
}

export function isOpenHand(fingers: FingerState): boolean {
  return Object.values(fingers).filter(Boolean).length >= 4
}

export function isClosedHand(fingers: FingerState): boolean {
  return Object.values(fingers).filter(Boolean).length <= 1
}
