export async function registerMediaPipeCache(
  baseUrl = import.meta.env.BASE_URL,
  browserNavigator: Navigator = navigator,
) {
  if (!('serviceWorker' in browserNavigator)) return
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const workers = browserNavigator.serviceWorker
  await workers.register(`${base}mediapipe-sw.js`, { scope: base })
  await workers.ready

  if (workers.controller === null) {
    await new Promise<void>((resolve) => {
      const timeout = globalThis.setTimeout(resolve, 2000)
      workers.addEventListener('controllerchange', () => {
        globalThis.clearTimeout(timeout)
        resolve()
      }, { once: true })
    })
  }
}
