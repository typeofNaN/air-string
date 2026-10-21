export function getMediaPipeAssetUrls(baseUrl = import.meta.env.BASE_URL) {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return {
    wasmUrl: `${base}mediapipe/wasm`,
    modelUrl: `${base}mediapipe/models/hand_landmarker.task`,
  }
}
