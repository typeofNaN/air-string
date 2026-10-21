import { describe, expect, it } from 'vitest'
import { StrumDetector } from './strumDetector'

describe('StrumDetector', () => {
  it('never strums from vertical movement while the palm stays open', () => {
    const detector = new StrumDetector({ cooldownMs: 250 })
    expect(
      detector.update({ y: 0.2, open: true, closed: false, timestamp: 0 }),
    ).toBeNull()
    expect(
      detector.update({ y: 0.8, open: true, closed: false, timestamp: 20 }),
    ).toBeNull()
    expect(
      detector.update({ y: 0.1, open: true, closed: false, timestamp: 40 }),
    ).toBeNull()
  })

  it('does not bridge a missing-hand gap into a false strum', () => {
    const detector = new StrumDetector({ cooldownMs: 250 })
    detector.update({ y: 0.3, open: true, closed: false, timestamp: 0 })
    detector.reset()
    expect(
      detector.update({ y: 0.7, open: true, closed: false, timestamp: 100 }),
    ).toBeNull()
  })

  it('plays when a waiting fist opens like the reference interaction', () => {
    const detector = new StrumDetector({ cooldownMs: 250 })
    expect(
      detector.update({ y: 0.5, open: false, closed: true, timestamp: 0 }),
    ).toBeNull()
    expect(
      detector.update({ y: 0.5, open: true, closed: false, timestamp: 40 }),
    ).toBe('DOWN')
    expect(
      detector.update({ y: 0.5, open: true, closed: false, timestamp: 80 }),
    ).toBeNull()
  })

  it('does not arm from a partially open hand', () => {
    const detector = new StrumDetector({ cooldownMs: 250 })
    expect(
      detector.update({ y: 0.5, open: false, closed: false, timestamp: 0 }),
    ).toBeNull()
    expect(
      detector.update({ y: 0.5, open: true, closed: false, timestamp: 40 }),
    ).toBeNull()
  })
})
