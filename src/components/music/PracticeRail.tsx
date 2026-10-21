import { ChevronDown, Music, Pause, Play, RotateCcw } from 'lucide-react'
import { useI18n } from '../../i18n'
import { PRACTICE_SONGS, type PracticeState } from '../../lib/music/practice'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface Props {
  state: PracticeState
  onToggle: () => void
  onRestart: () => void
  onSelectSong: (index: number) => void
}

export function PracticeRail({
  state,
  onToggle,
  onRestart,
  onSelectSong,
}: Props) {
  const { t } = useI18n()
  const song = PRACTICE_SONGS[state.songIndex]
  const next = song.progression[(state.step + 1) % song.progression.length]
  return (
    <section className="grid grid-cols-[1.1fr_1.5fr_1.1fr] items-center gap-7 rounded-2xl border border-line bg-paper px-5 py-4 max-lg:grid-cols-1">
      <div className="min-w-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-[#ebe7da] text-forest hover:bg-[#e3ddcd]"
            >
              <span className="flex items-center gap-2">
                <Music className="h-4 w-4 text-terra" />
                <b className="font-display text-lg">{t(song.titleKey)}</b>
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <DropdownMenuRadioGroup
              value={String(state.songIndex)}
              onValueChange={(value) => onSelectSong(Number(value))}
            >
              {PRACTICE_SONGS.map((item, index) => (
                <DropdownMenuRadioItem value={String(index)} key={item.id}>
                  <span className="grid">
                    <b className="font-display text-sm">{t(item.titleKey)}</b>
                    <small className="text-[9px] text-muted">
                      {item.progression.join('  ')}
                    </small>
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="mt-1 text-[10px] text-muted">
          {song.progression.join(' · ')}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {song.progression.map((chord, index) => (
          <span
            key={`${chord}-${index}`}
            className={cn(
              'grid aspect-square place-items-center rounded-lg border border-line font-display text-xl',
              index === state.step && 'border-terra bg-terra text-white',
              index < state.step && 'bg-forest text-lime',
            )}
          >
            {index < state.step ? '✓' : chord}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 max-lg:justify-start">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onRestart}
          aria-label={t('practice.restart')}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 rounded-full"
          onClick={onToggle}
          aria-label={state.playing ? t('practice.pause') : t('practice.play')}
        >
          {state.playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </Button>
        <strong className="text-[10px] text-muted">
          {state.step + 1} / {song.progression.length}
        </strong>
        <span className="ml-1 border-l border-line pl-3">
          <small className="block text-[8px] text-muted">
            {t('practice.next')}
          </small>
          <b className="font-display text-xl text-terra">{next}</b>
        </span>
      </div>
    </section>
  )
}
