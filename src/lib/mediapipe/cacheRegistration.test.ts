import { describe, expect, it, vi } from 'vitest'
import { registerMediaPipeCache } from './cacheRegistration'

describe('registerMediaPipeCache', () => {
  it('registers the worker within the application base path', async () => {
    const register = vi.fn().mockResolvedValue(undefined)
    const ready = Promise.resolve(undefined)

    await registerMediaPipeCache('/air-string/', { serviceWorker: { register, ready } } as unknown as Navigator)

    expect(register).toHaveBeenCalledWith('/air-string/mediapipe-sw.js', { scope: '/air-string/' })
  })

  it('waits until the worker is active before allowing model preloading', async () => {
    let markReady: () => void = () => {}
    const ready = new Promise<void>((resolve) => { markReady = resolve })
    let completed = false
    const registration = registerMediaPipeCache('/', {
      serviceWorker: { register: vi.fn().mockResolvedValue(undefined), ready },
    } as unknown as Navigator).then(() => { completed = true })

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(completed).toBe(false)
    markReady()
    await registration
    expect(completed).toBe(true)
  })

  it('does nothing when service workers are unavailable', async () => {
    await expect(registerMediaPipeCache('/', {} as Navigator)).resolves.toBeUndefined()
  })
})
