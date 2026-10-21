import { useState } from 'react'
import { ChevronDown, Music, Pause, Play, RotateCcw } from 'lucide-react'
import { useI18n } from '../../i18n'
import { PRACTICE_SONGS, type PracticeState } from '../../lib/music/practice'

interface Props {
  state: PracticeState
  onToggle: () => void
  onRestart: () => void
  onSelectSong: (index: number) => void
}

export function PracticeRail({ state, onToggle, onRestart, onSelectSong }: Props) {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const song = PRACTICE_SONGS[state.songIndex]
  const next = song.progression[(state.step + 1) % song.progression.length]
  return (
    <section className="practice-rail">
      <div className="song-info">
        <div className="song-picker">
          <button type="button" className="song-picker-trigger" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span><Music /><b>{t(song.titleKey)}</b></span><ChevronDown />
          </button>
          {menuOpen && <div className="song-picker-menu" role="listbox" aria-label={t('practice.song')}>
            {PRACTICE_SONGS.map((item, index) => <button role="option" aria-selected={index === state.songIndex} key={item.id} onClick={() => { onSelectSong(index); setMenuOpen(false) }}><span>{String(index + 1).padStart(2, '0')}</span><b>{t(item.titleKey)}</b><small>{item.progression.join('  ')}</small></button>)}
          </div>}
        </div>
        <p>{song.progression.join(' · ')}</p>
      </div>
      <div className="progression">
        {song.progression.map((chord, index) => <span key={`${chord}-${index}`} className={index === state.step ? 'active' : index < state.step ? 'done' : ''}>{index < state.step ? '✓' : chord}</span>)}
      </div>
      <div className="practice-transport">
        <button onClick={onRestart} aria-label={t('practice.restart')}><RotateCcw /></button>
        <button className="transport-main" onClick={onToggle} aria-label={state.playing ? t('practice.pause') : t('practice.play')}>{state.playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
        <strong>{state.step + 1} / {song.progression.length}</strong>
        <span><small>{t('practice.next')}</small><b>{next}</b></span>
      </div>
    </section>
  )
}
