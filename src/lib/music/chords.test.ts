import { describe, expect, it } from 'vitest'
import { getChordByPosition } from './chords'

describe('getChordByPosition', () => {
  it.each([[1, 'C'], [2, 'G'], [3, 'Am'], [4, 'F'], [5, 'Em'], [6, 'Dm']] as const)(
    'maps position %s to %s',
    (position, name) => expect(getChordByPosition(position).name).toBe(name),
  )
})
