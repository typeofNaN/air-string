# AirString Virtual Guitar Implementation Plan

**Goal:** Deliver the complete camera-controlled bilingual virtual guitar described in the user specification.

**Architecture:** React components compose a stage, camera surface, status rail, tutorial, and debug panel. Hooks own lifecycle resources; pure MediaPipe interpretation modules own gesture, stabilization, and strum logic. Web Audio is isolated behind a buffer-based engine.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, MediaPipe Tasks Vision, Web Audio API, Vitest, ESLint, Prettier, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-21-air-string-design.md`

## Global constraints

- TypeScript strict; no application `any`.
- Meaningful React state updates only; canvas drawing remains outside render state.
- 30 FPS inference cap; complete cleanup of animation frames, streams, and detectors.
- Chinese default and runtime English switch; all visible strings use i18n keys.
- GitHub Pages subpath-safe build.

## Tasks

### 1. Tooling and algorithm contracts
- [ ] Add Vite/Tailwind/ESLint/Prettier/Vitest configuration.
- [ ] Write failing tests for gestures 1–6, noisy stabilization, and one-shot bidirectional strums.
- [ ] Implement typed domain models and pure algorithms until tests pass.

### 2. Camera, MediaPipe, and canvas
- [ ] Implement camera lifecycle and friendly state transitions.
- [ ] Implement version-pinned HandLandmarker initialization and frame loop.
- [ ] Draw colored landmarks/connections directly to canvas.

### 3. Audio and performance UI
- [ ] Build user-activated low-latency guitar buffer engine.
- [ ] Implement responsive guitar stage, string vibration, status rail, camera HUD, tutorial, and debug panel.
- [ ] Wire meaningful tracking changes into React state and strum events into audio/animation.

### 4. Internationalization and failure states
- [ ] Add complete zh-CN and en-US dictionaries and runtime switching.
- [ ] Cover unsupported, denied, busy, model failure, missing-hand, and hidden-page states.

### 5. Delivery and verification
- [ ] Add Pages workflow, README, MIT license, and base-path configuration.
- [ ] Run tests, lint, typecheck, and build.
- [ ] Verify start/tutorial/language controls and desktop/mobile layouts in browser.
- [ ] Compare implementation screenshot with concept and repair visual drift.

## Review focus

- CSS mirroring must not swap MediaPipe handedness.
- A held open right hand must never repeatedly strum.
- Low-confidence/no-hand frames must not instantly erase a stable selection.
- AudioContext must be created/resumed only after user activation.
- Cleanup must stop camera tracks and inference after unmount/backgrounding.
