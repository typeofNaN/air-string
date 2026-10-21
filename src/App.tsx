import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Languages, Music2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { CameraView } from './components/camera/CameraView'
import { ChordInspector } from './components/music/ChordInspector'
import { ChordPads } from './components/music/ChordPads'
import { PracticeRail } from './components/music/PracticeRail'
import { TutorialDialog } from './components/tutorial/TutorialDialog'
import { useCamera } from './hooks/useCamera'
import { useGuitarAudio } from './hooks/useGuitarAudio'
import { useHandTracking } from './hooks/useHandTracking'
import { useI18n } from './i18n'
import type { PlayStyle } from './lib/audio/guitarAudio'
import { getChordByPosition, getPositionByChord } from './lib/music/chords'
import {
  initialPracticeState,
  PRACTICE_SONGS,
  practiceReducer,
} from './lib/music/practice'
import { cn } from './lib/utils'
import type { GuitarPosition, StrumDirection } from './types/guitar'

type WorkspaceMode = 'free' | 'practice'

export default function App() {
  const { locale, setLocale, t } = useI18n()
  const camera = useCamera()
  const {
    initialize: initializeAudio,
    play: playAudio,
    setVolume: setAudioVolume,
  } = useGuitarAudio()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activatingRef = useRef(false)
  const [position, setPosition] = useState<GuitarPosition>(2)
  const [lastStrum, setLastStrum] = useState<StrumDirection | null>(null)
  const [strumPulse, setStrumPulse] = useState(0)
  const [mode, setMode] = useState<WorkspaceMode>('free')
  const [style, setStyle] = useState<PlayStyle>('strum')
  const [volume, setVolume] = useState(0.38)
  const [tempo, setTempo] = useState(84)
  const [autoArpeggio, setAutoArpeggio] = useState(false)
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [debugOpen, setDebugOpen] = useState(false)
  const [tutorialOpen, setTutorialOpen] = useState(
    () => localStorage.getItem('airstring-tutorial-seen') !== '1',
  )
  const [practice, dispatchPractice] = useReducer(
    practiceReducer,
    initialPracticeState,
  )
  const chord = getChordByPosition(position)
  const practiceSong = PRACTICE_SONGS[practice.songIndex]
  const expectedChord =
    practiceSong.progression[practice.step % practiceSong.progression.length]

  useEffect(() => setAudioVolume(volume), [setAudioVolume, volume])
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  useEffect(() => {
    if (!autoArpeggio || camera.status !== 'playing') return
    const timer = window.setInterval(
      () => playAudio(position, 'DOWN', 'arpeggio', tempo),
      (60 / tempo) * 3000,
    )
    return () => window.clearInterval(timer)
  }, [autoArpeggio, camera.status, playAudio, position, tempo])
  useEffect(() => {
    const hide = () => {
      if (document.hidden && camera.status !== 'idle') camera.stop()
    }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [camera])

  const handleStrum = useCallback(
    (direction: StrumDirection) => {
      setLastStrum(direction)
      setStrumPulse((value) => value + 1)
      playAudio(position, direction, style, tempo)
      if (mode === 'practice' && chord.name === expectedChord)
        dispatchPractice({ type: 'strum' })
    },
    [chord.name, expectedChord, mode, playAudio, position, style, tempo],
  )

  const tracking = useHandTracking({
    enabled: ['loading-model', 'playing', 'ready'].includes(camera.status),
    videoRef: camera.videoRef,
    canvasRef,
    showLandmarks,
    onReady: () => camera.setStatus('playing'),
    onPosition: setPosition,
    onStrum: handleStrum,
    onError: () => camera.fail(),
  })

  const togglePlaying = async () => {
    if (activatingRef.current) return
    if (camera.status !== 'idle' && camera.status !== 'error') {
      camera.stop()
      const context = canvasRef.current?.getContext('2d')
      if (context && canvasRef.current)
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        )
      return
    }
    activatingRef.current = true
    try {
      await initializeAudio()
      await camera.start()
    } finally {
      activatingRef.current = false
    }
  }

  const closeTutorial = () => {
    localStorage.setItem('airstring-tutorial-seen', '1')
    setTutorialOpen(false)
  }
  const selectSong = (songIndex: number) => {
    const song = PRACTICE_SONGS[songIndex]
    dispatchPractice({ type: 'select-song', songIndex })
    setTempo(song.tempo)
    setPosition(getPositionByChord(song.progression[0]))
  }
  const changeMode = (nextMode: WorkspaceMode) => {
    setMode(nextMode)
    if (nextMode === 'practice') dispatchPractice({ type: 'restart' })
  }
  const statusMessage = camera.errorKey
    ? t(camera.errorKey as keyof typeof import('./i18n/zh-CN.json'))
    : camera.status === 'requesting'
      ? t('camera.requesting')
      : camera.status === 'loading-model'
        ? t('camera.loading')
        : null

  return (
    <div className="min-h-screen bg-bone text-ink">
      <header className="sticky top-0 z-40 grid min-h-[68px] grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-paper/90 px-5 backdrop-blur-xl md:px-16 max-md:grid-cols-[1fr_auto]">
        <a
          className="flex items-center gap-2.5 font-display text-xl text-forest"
          href={import.meta.env.BASE_URL}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-lime">
            <Music2 className="h-4 w-4" />
          </span>
          <span>
            AirString <b className="italic">Studio</b>
          </span>
        </a>
        <nav
          className="flex h-[68px] gap-7 max-md:order-3 max-md:col-span-2 max-md:h-11 max-md:justify-center"
          aria-label="Workspace mode"
        >
          {(['free', 'practice'] as const).map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={cn(
                'relative h-full rounded-none px-2 text-xs text-muted hover:bg-transparent',
                mode === item &&
                  'text-forest after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-forest',
              )}
              onClick={() => changeMode(item)}
            >
              {t(item === 'free' ? 'nav.free' : 'nav.practice')}
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          className="justify-self-end"
          onClick={() => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}
        >
          <Languages className="h-4 w-4" />
          {t('nav.language')}
        </Button>
      </header>
      <main className="mx-auto my-6 w-[calc(100%-3rem)] max-w-[1380px] max-sm:w-[calc(100%-1rem)]">
        <section className="grid grid-cols-[minmax(0,2.25fr)_minmax(310px,.8fr)] overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_18px_55px_rgba(39,43,34,.08)] max-lg:grid-cols-1">
          <CameraView
            videoRef={camera.videoRef}
            canvasRef={canvasRef}
            status={camera.status}
            position={position}
            showLandmarks={showLandmarks}
            onToggleLandmarks={() => setShowLandmarks((value) => !value)}
            onStart={togglePlaying}
            onStop={togglePlaying}
            leftDetected={tracking.leftDetected}
            rightDetected={tracking.rightDetected}
            lastStrum={lastStrum}
            strumPulse={strumPulse}
          />
          <ChordInspector
            chord={chord}
            style={style}
            tempo={tempo}
            volume={volume}
            autoArpeggio={autoArpeggio}
            debugOpen={debugOpen}
            metrics={tracking}
            onStyle={setStyle}
            onTempo={setTempo}
            onVolume={setVolume}
            onAutoArpeggio={setAutoArpeggio}
            onDebug={() => setDebugOpen((value) => !value)}
          />
        </section>
        {statusMessage && (
          <div
            className={cn(
              'mt-3 rounded-lg bg-[#e5e0d3] px-3 py-2 text-xs',
              camera.status === 'error' && 'bg-[#f8ddd6] text-[#852f24]',
            )}
          >
            {statusMessage}
          </div>
        )}
        <ChordPads
          position={position}
          onSelect={(next) => {
            setPosition(next)
            playAudio(next, 'DOWN', style, tempo)
          }}
        />
        <div
          className={cn(
            'opacity-80 transition-opacity',
            mode === 'practice' && 'opacity-100',
          )}
        >
          <PracticeRail
            state={practice}
            onSelectSong={selectSong}
            onToggle={() => dispatchPractice({ type: 'toggle' })}
            onRestart={() => dispatchPractice({ type: 'restart' })}
          />
        </div>
      </main>
      <TutorialDialog open={tutorialOpen} onClose={closeTutorial} />
    </div>
  )
}
