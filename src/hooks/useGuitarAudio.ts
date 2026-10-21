import { useCallback, useRef } from 'react'
import { GuitarAudio, type PlayStyle } from '../lib/audio/guitarAudio'
import type { GuitarPosition, StrumDirection } from '../types/guitar'

export function useGuitarAudio() {
  const engine = useRef(new GuitarAudio())
  const initialize = useCallback(() => engine.current.initialize(), [])
  const play = useCallback((position: GuitarPosition, direction: StrumDirection, style?: PlayStyle, tempo?: number) => {
    engine.current.play(position, direction, style, tempo)
  }, [])
  const setVolume = useCallback((volume: number) => engine.current.setVolume(volume), [])
  return { initialize, play, setVolume }
}
