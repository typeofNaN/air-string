import { describe, expect, it } from 'vitest'
import { CHORD_FREQUENCIES, normalizeVolume } from './guitarAudio'

describe('normalizeVolume', () => {
  it('clamps values to the safe master-gain range', () => {
    expect(normalizeVolume(-0.2)).toBe(0)
    expect(normalizeVolume(0.38)).toBe(0.38)
    expect(normalizeVolume(2)).toBe(1)
  })
})

describe('CHORD_FREQUENCIES', () => {
  it('uses playable guitar voicings and preserves muted strings', () => {
    expect(CHORD_FREQUENCIES[1]).toEqual([null, 130.81, 164.81, 196, 261.63, 329.63])
    expect(CHORD_FREQUENCIES[6]).toEqual([null, null, 146.83, 220, 293.66, 349.23])
  })
})
