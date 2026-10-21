import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../i18n'
import { PracticeRail } from './PracticeRail'

describe('PracticeRail song picker', () => {
  it('selects a song from the custom menu', () => {
    const onSelectSong = vi.fn()
    render(<I18nProvider><PracticeRail state={{ songIndex: 0, step: 0, playing: false }} onToggle={() => undefined} onRestart={() => undefined} onSelectSong={onSelectSong} /></I18nProvider>)
    fireEvent.click(screen.getByRole('button', { name: '晚风练习' }))
    fireEvent.click(screen.getByRole('option', { name: /公路练习/ }))
    expect(onSelectSong).toHaveBeenCalledWith(1)
  })
})
