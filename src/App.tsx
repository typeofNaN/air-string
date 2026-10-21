import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Languages, Music2 } from 'lucide-react'
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
import { initialPracticeState, PRACTICE_SONGS, practiceReducer } from './lib/music/practice'
import type { GuitarPosition, StrumDirection } from './types/guitar'

type WorkspaceMode = 'free' | 'practice'

export default function App() {
  const { locale, setLocale, t } = useI18n()
  const camera = useCamera()
  const { initialize: initializeAudio, play: playAudio, setVolume: setAudioVolume } = useGuitarAudio()
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
  const [tutorialOpen, setTutorialOpen] = useState(() => localStorage.getItem('airstring-tutorial-seen') !== '1')
  const [practice, dispatchPractice] = useReducer(practiceReducer, initialPracticeState)

  const chord = getChordByPosition(position)
  const practiceSong = PRACTICE_SONGS[practice.songIndex]
  const expectedChord = practiceSong.progression[practice.step % practiceSong.progression.length]

  useEffect(() => setAudioVolume(volume), [setAudioVolume, volume])
  useEffect(() => { document.documentElement.lang = locale }, [locale])

  useEffect(() => {
    if (!autoArpeggio || camera.status !== 'playing') return
    const timer = window.setInterval(() => playAudio(position, 'DOWN', 'arpeggio', tempo), (60 / tempo) * 3000)
    return () => window.clearInterval(timer)
  }, [autoArpeggio, camera.status, playAudio, position, tempo])

  useEffect(() => {
    const handleVisibility = () => { if (document.hidden && camera.status !== 'idle') camera.stop() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [camera])

  const handleStrum = useCallback((direction: StrumDirection) => {
    setLastStrum(direction)
    setStrumPulse((value) => value + 1)
    playAudio(position, direction, style, tempo)
    if (mode === 'practice' && chord.name === expectedChord) dispatchPractice({ type: 'strum' })
  }, [chord.name, expectedChord, mode, playAudio, position, style, tempo])

  const tracking = useHandTracking({
    enabled: camera.status === 'loading-model' || camera.status === 'playing' || camera.status === 'ready',
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
      if (context && canvasRef.current) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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
    : camera.status === 'requesting' ? t('camera.requesting')
      : camera.status === 'loading-model' ? t('camera.loading') : null

  return (
    <div className="app-shell">
      <header className="studio-header">
        <a className="brand" href={import.meta.env.BASE_URL}><span className="brand-mark"><Music2 /></span><span>AirString <b>Studio</b></span></a>
        <nav className="mode-nav" aria-label="Workspace mode">
          <button className={mode === 'free' ? 'is-active' : ''} onClick={() => changeMode('free')}>{t('nav.free')}</button>
          <button className={mode === 'practice' ? 'is-active' : ''} onClick={() => changeMode('practice')}>{t('nav.practice')}</button>
        </nav>
        <button className="language-button" onClick={() => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}><Languages />{t('nav.language')}</button>
      </header>

      <main className="studio-main">
        <section className="studio-workspace">
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

        {statusMessage && <div className={`system-message ${camera.status === 'error' ? 'is-error' : ''}`}>{statusMessage}</div>}

        <ChordPads position={position} onSelect={(next) => { setPosition(next); playAudio(next, 'DOWN', style, tempo) }} />

        <div className={mode === 'practice' ? 'practice-wrap is-focused' : 'practice-wrap'}>
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
