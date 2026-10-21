/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIAPIPE_ASSET_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
