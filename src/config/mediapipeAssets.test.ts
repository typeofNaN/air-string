import { describe, expect, it } from 'vitest'
import { getMediaPipeAssetUrls } from './mediapipeAssets'

describe('getMediaPipeAssetUrls', () => {
  it('builds same-origin paths for local development', () => {
    expect(getMediaPipeAssetUrls('/')).toEqual({
      wasmUrl: '/mediapipe/wasm',
      modelUrl: '/mediapipe/models/hand_landmarker.task',
    })
  })

  it('preserves the GitHub Pages base path', () => {
    expect(getMediaPipeAssetUrls('/air-string/')).toEqual({
      wasmUrl: '/air-string/mediapipe/wasm',
      modelUrl: '/air-string/mediapipe/models/hand_landmarker.task',
    })
  })

  it('supports a dedicated domestic asset origin', () => {
    expect(getMediaPipeAssetUrls('/air-string/', 'https://static.example.cn/models/mediapipe/')).toEqual({
      wasmUrl: 'https://static.example.cn/models/mediapipe/wasm',
      modelUrl: 'https://static.example.cn/models/mediapipe/models/hand_landmarker.task',
    })
  })
})
