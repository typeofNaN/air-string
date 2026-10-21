import { describe, expect, it } from 'vitest'
import { classifyFingerState } from './gestureDetector'

describe('classifyFingerState', () => {
  it.each([
    [{ thumb: false, index: true, middle: false, ring: false, pinky: false }, 1],
    [{ thumb: false, index: true, middle: true, ring: false, pinky: false }, 2],
    [{ thumb: false, index: true, middle: true, ring: true, pinky: false }, 3],
    [{ thumb: false, index: true, middle: true, ring: true, pinky: true }, 4],
    [{ thumb: true, index: true, middle: true, ring: true, pinky: true }, 5],
    [{ thumb: true, index: false, middle: false, ring: false, pinky: true }, 6],
  ] as const)('maps %o to position %s', (fingers, position) => {
    expect(classifyFingerState(fingers)).toBe(position)
  })

  it('rejects an ambiguous finger combination', () => {
    expect(classifyFingerState({ thumb: true, index: true, middle: false, ring: false, pinky: false })).toBeNull()
  })

  it('recognizes three center fingers when a palm-facing thumb appears extended', () => {
    expect(classifyFingerState({ thumb: true, index: true, middle: true, ring: true, pinky: false })).toBe(3)
  })
})
