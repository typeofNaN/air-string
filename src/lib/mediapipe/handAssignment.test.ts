import { describe, expect, it } from 'vitest'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { assignHandsByVisualZone } from './handAssignment'

const handAt = (x: number): NormalizedLandmark[] => [
  { x, y: 0.5, z: 0, visibility: 1 },
]

describe('assignHandsByVisualZone', () => {
  it('maps the mirrored screen-left hand to chord selection', () => {
    expect(assignHandsByVisualZone([handAt(0.2), handAt(0.8)])).toEqual({
      chordIndex: 1,
      playIndex: 0,
    })
  })

  it('assigns one hand according to its visible half of the mirrored preview', () => {
    expect(assignHandsByVisualZone([handAt(0.75)])).toEqual({
      chordIndex: 0,
      playIndex: null,
    })
    expect(assignHandsByVisualZone([handAt(0.25)])).toEqual({
      chordIndex: null,
      playIndex: 0,
    })
  })

  it('leaves a single hand unassigned inside the center dead-band', () => {
    expect(assignHandsByVisualZone([handAt(0.5)])).toEqual({
      chordIndex: null,
      playIndex: null,
    })
  })

  it('does not invent an opposite role when both hands are in one visual zone', () => {
    expect(assignHandsByVisualZone([handAt(0.7), handAt(0.8)])).toEqual({
      chordIndex: 1,
      playIndex: null,
    })
    expect(assignHandsByVisualZone([handAt(0.2), handAt(0.3)])).toEqual({
      chordIndex: null,
      playIndex: 0,
    })
  })
})
