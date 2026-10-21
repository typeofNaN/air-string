import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppStatus } from '../types/guitar'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<AppStatus>('idle')
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const fail = useCallback((key = 'camera.failed') => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setErrorKey(key)
    setStatus('error')
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorKey('camera.unsupported')
      setStatus('error')
      return false
    }
    setErrorKey(null)
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('loading-model')
      return true
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      const denied =
        error instanceof DOMException &&
        (error.name === 'NotAllowedError' || error.name === 'SecurityError')
      setErrorKey(denied ? 'camera.permissionDenied' : 'camera.failed')
      setStatus('error')
      return false
    }
  }, [])

  useEffect(() => stop, [stop])
  return { videoRef, status, setStatus, errorKey, start, stop, fail }
}
