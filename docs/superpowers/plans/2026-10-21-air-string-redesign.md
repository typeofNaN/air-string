# AirString Studio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add musical controls, chord practice, and a warm editorial interface while improving perceived tracking smoothness.

**Architecture:** Pure chord and practice modules provide deterministic data/state. Existing tracking and audio hooks expose stable position/strum events and gain controls. Focused React components compose camera stage, chord inspector, chord pads, practice rail, and inline debug disclosure.

**Tech Stack:** React, TypeScript, Vite, Tailwind/CSS, MediaPipe Tasks Vision, Web Audio, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-21-airstring-studio-redesign.md`

## Global Constraints

- Preserve strict TypeScript and the existing camera cleanup lifecycle.
- No copyrighted song lyrics or melodies; exercises contain original chord progressions only.
- All visible strings remain bilingual.
- Debug UI never uses fixed positioning.
- Master volume stays in `[0, 1]`; tempo stays in `[50, 140]` BPM.

## Review Focus

- Progress must wrap without indexing past the progression.
- A paused practice must not advance when a strum arrives.
- Volume changes must apply to overlapping and future audio safely.
- Automatic arpeggio timers must be cleared when disabled/unmounted.
- Gesture zones near the center must not rapidly flip roles.

### Task 1: Musical domain and practice state

**Files:** Create `src/lib/music/chords.ts`, `src/lib/music/practice.ts`, tests beside each.

- [ ] Write failing tests for chord mapping, next chord, wraparound, pause behavior, and exercise switching.
- [ ] Run tests and confirm missing-module failures.
- [ ] Implement typed chord definitions and pure practice reducer.
- [ ] Run tests and confirm pass.

### Task 2: Audio controls and smoother tracking

**Files:** Modify `src/lib/audio/guitarAudio.ts`, `src/hooks/useGuitarAudio.ts`, `src/config/gesture.ts`, `src/lib/mediapipe/handAssignment.ts` and tests.

- [ ] Write failing dead-band assignment tests.
- [ ] Implement zone dead-band, lower-latency stabilization, master gain, volume setter, and arpeggio playback.
- [ ] Run focused and complete tests.

### Task 3: Studio interface

**Files:** Create `ChordDiagram.tsx`, `ChordInspector.tsx`, `ChordPads.tsx`, `PracticeRail.tsx`, `GestureGlyph.tsx`; modify camera, debug, app, i18n, and styles.

- [ ] Build the full concept-driven component hierarchy and controls.
- [ ] Wire practice advancement, transport, modes, volume, tempo, and auto-arpeggio.
- [ ] Keep debug disclosure inline and closed by default.
- [ ] Add responsive behavior and motion with reduced-motion support.

### Task 4: Verification

- [ ] Run lint, strict typecheck, tests, and production build.
- [ ] Verify desktop and mobile layout, language switch, sliders, modes, practice transport, and disclosure in Browser/IAB.
- [ ] Compare a 1440×900 screenshot with the concept using `view_image`; fix all material drift.
