import { createRef } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../../i18n'
import { CameraView } from './CameraView'

afterEach(cleanup)

describe('CameraView strum feedback', () => {
  it('shows the current chord name instead of a direction arrow', () => {
    render(
      <I18nProvider>
        <CameraView
          videoRef={createRef<HTMLVideoElement>()}
          canvasRef={createRef<HTMLCanvasElement>()}
          status="playing"
          position={2}
          showLandmarks
          onToggleLandmarks={() => undefined}
          leftDetected
          rightDetected
          onStart={() => undefined}
          onStop={() => undefined}
          lastStrum="DOWN"
          strumPulse={1}
        />
      </I18nProvider>,
    )
    expect(screen.getByLabelText('G chord played').textContent).toBe('G')
    expect(screen.queryByText('↓')).toBeNull()
  })

  it('offers a stop action while the camera is active', () => {
    const onStop = vi.fn()
    const props = {
      videoRef: createRef<HTMLVideoElement>(),
      canvasRef: createRef<HTMLCanvasElement>(),
      status: 'playing',
      position: 2,
      showLandmarks: true,
      onToggleLandmarks: () => undefined,
      leftDetected: true,
      rightDetected: true,
      onStart: () => undefined,
      onStop,
      lastStrum: null,
      strumPulse: 0,
    } as const
    render(
      <I18nProvider>
        <CameraView {...props} />
      </I18nProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: '停止演奏' }))
    expect(onStop).toHaveBeenCalledOnce()
  })
})
