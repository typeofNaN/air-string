import { describe, expect, it } from 'vitest'
import { GestureStabilizer } from './gestureStabilizer'
import type { GuitarPosition } from '../../types/guitar'

describe('GestureStabilizer', () => {
  it('keeps the majority gesture through one noisy frame', () => {
    const stabilizer = new GestureStabilizer({ windowSize: 5, requiredVotes: 3, minConfidence: 0.7 })
    const results = ([2, 2, 3, 2, 2] as GuitarPosition[]).map((gesture) => stabilizer.update(gesture, 0.9))
    expect(results.at(-1)).toBe(2)
  })

  it('ignores low-confidence candidates', () => {
    const stabilizer = new GestureStabilizer({ windowSize: 3, requiredVotes: 2, minConfidence: 0.7 })
    stabilizer.update(4, 0.95)
    expect(stabilizer.update(4, 0.4)).toBeNull()
  })
})
