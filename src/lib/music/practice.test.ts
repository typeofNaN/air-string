import { describe, expect, it } from 'vitest'
import { initialPracticeState, practiceReducer } from './practice'

describe('practiceReducer', () => {
  it('advances and wraps an active progression', () => {
    let state = { ...initialPracticeState, playing: true, step: 3 }
    state = practiceReducer(state, { type: 'strum' })
    expect(state.step).toBe(0)
  })

  it('does not advance while paused', () => {
    expect(practiceReducer(initialPracticeState, { type: 'strum' }).step).toBe(0)
  })

  it('restarts when selecting another exercise', () => {
    const state = practiceReducer({ ...initialPracticeState, step: 2 }, { type: 'select-song', songIndex: 1 })
    expect(state).toMatchObject({ songIndex: 1, step: 0, playing: false })
  })
})
