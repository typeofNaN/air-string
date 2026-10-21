import type { GuitarPosition } from '../../types/guitar'

export type ChordName = 'C' | 'G' | 'Am' | 'F' | 'Em' | 'Dm'

export interface ChordDefinition {
  position: GuitarPosition
  name: ChordName
  quality: 'major' | 'minor'
  frets: readonly number[]
  gesture: readonly boolean[]
}

export const CHORDS: readonly ChordDefinition[] = [
  {
    position: 1,
    name: 'C',
    quality: 'major',
    frets: [-1, 3, 2, 0, 1, 0],
    gesture: [false, true, false, false, false],
  },
  {
    position: 2,
    name: 'G',
    quality: 'major',
    frets: [3, 2, 0, 0, 0, 3],
    gesture: [false, true, true, false, false],
  },
  {
    position: 3,
    name: 'Am',
    quality: 'minor',
    frets: [-1, 0, 2, 2, 1, 0],
    gesture: [false, true, true, true, false],
  },
  {
    position: 4,
    name: 'F',
    quality: 'major',
    frets: [1, 3, 3, 2, 1, 1],
    gesture: [false, true, true, true, true],
  },
  {
    position: 5,
    name: 'Em',
    quality: 'minor',
    frets: [0, 2, 2, 0, 0, 0],
    gesture: [true, true, true, true, true],
  },
  {
    position: 6,
    name: 'Dm',
    quality: 'minor',
    frets: [-1, -1, 0, 2, 3, 1],
    gesture: [true, false, false, false, true],
  },
] as const

export function getChordByPosition(position: GuitarPosition): ChordDefinition {
  return CHORDS[position - 1]
}

export function getPositionByChord(name: ChordName): GuitarPosition {
  return CHORDS.find((chord) => chord.name === name)?.position ?? 1
}
