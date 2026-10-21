import { describe, expect, it } from 'vitest'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { getFingerState } from './handUtils'

const point = (x: number, y: number): NormalizedLandmark => ({
  x,
  y,
  z: 0,
  visibility: 1,
})
const hand = () => Array.from({ length: 21 }, () => point(0.5, 0.7))

describe('getFingerState', () => {
  it('treats a thumb folded across the palm as closed', () => {
    const points = hand()
    points[5] = point(0.4, 0.6)
    points[17] = point(0.7, 0.6)
    points[2] = point(0.42, 0.64)
    points[3] = point(0.5, 0.62)
    points[4] = point(0.58, 0.61)
    expect(getFingerState(points).thumb).toBe(false)
  })

  it('treats a thumb extended away from the palm as open', () => {
    const points = hand()
    points[5] = point(0.4, 0.6)
    points[17] = point(0.7, 0.6)
    points[2] = point(0.42, 0.64)
    points[3] = point(0.3, 0.58)
    points[4] = point(0.18, 0.52)
    expect(getFingerState(points).thumb).toBe(true)
  })

  it('recognizes a finger extended sideways instead of relying on screen Y', () => {
    const points = hand()
    points[0] = point(0.38, 0.72)
    points[5] = point(0.46, 0.6)
    points[6] = point(0.62, 0.6)
    points[7] = point(0.72, 0.6)
    points[8] = point(0.84, 0.6)
    points[17] = point(0.42, 0.78)
    expect(getFingerState(points).index).toBe(true)
  })

  it('recognizes the same extended finger when the hand is mirrored', () => {
    const points = hand()
    points[0] = point(0.62, 0.72)
    points[5] = point(0.54, 0.6)
    points[6] = point(0.38, 0.6)
    points[7] = point(0.28, 0.6)
    points[8] = point(0.16, 0.6)
    points[17] = point(0.58, 0.78)
    expect(getFingerState(points).index).toBe(true)
  })
})
