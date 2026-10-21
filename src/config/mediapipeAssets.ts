export function getMediaPipeAssetUrls(
  baseUrl = import.meta.env.BASE_URL,
  assetBaseUrl = import.meta.env.VITE_MEDIAPIPE_ASSET_BASE_URL,
) {
  const selectedBase = assetBaseUrl || baseUrl
  const base = selectedBase.endsWith('/') ? selectedBase : `${selectedBase}/`
  return {
    wasmUrl: `${base}mediapipe/wasm`,
    modelUrl: `${base}mediapipe/models/hand_landmarker.task`,
  }
}
