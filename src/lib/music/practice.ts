import type { ChordName } from './chords'

export interface PracticeSong {
  id: string
  titleKey: 'song.breeze' | 'song.road' | 'song.glow'
  progression: readonly ChordName[]
  tempo: number
}

export const PRACTICE_SONGS: readonly PracticeSong[] = [
  { id: 'breeze', titleKey: 'song.breeze', progression: ['C', 'G', 'Am', 'F'], tempo: 84 },
  { id: 'road', titleKey: 'song.road', progression: ['G', 'Dm', 'Em', 'C'], tempo: 96 },
  { id: 'glow', titleKey: 'song.glow', progression: ['Am', 'F', 'C', 'G'], tempo: 72 },
]

export interface PracticeState {
  songIndex: number
  step: number
  playing: boolean
}

export type PracticeAction =
  | { type: 'toggle' }
  | { type: 'restart' }
  | { type: 'strum' }
  | { type: 'select-song'; songIndex: number }

export const initialPracticeState: PracticeState = { songIndex: 0, step: 0, playing: false }

export function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
  if (action.type === 'toggle') return { ...state, playing: !state.playing }
  if (action.type === 'restart') return { ...state, step: 0 }
  if (action.type === 'select-song') return { songIndex: action.songIndex, step: 0, playing: false }
  if (!state.playing) return state
  const length = PRACTICE_SONGS[state.songIndex].progression.length
  return { ...state, step: (state.step + 1) % length }
}
