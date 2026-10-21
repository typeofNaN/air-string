# AirString Virtual Guitar — Design

## Intent

Build a deployable browser instrument whose complete loop is camera → MediaPipe hand landmarks → stable left-hand position → right-hand strum → guitar-like audio and visual feedback. The experience should feel like a musical instrument, not a demo dashboard.

## Product decisions

- React 19, TypeScript strict, Vite, pnpm, Tailwind CSS, small shadcn-style primitives.
- MediaPipe `HandLandmarker` runs at a capped 30 FPS. Video is visually mirrored only; handedness data is never modified because of CSS mirroring.
- Left-hand gestures: index; index+middle; index+middle+ring; four fingers; open palm; thumb+pinky shaka.
- A rolling vote stabilizer ignores low confidence and changes only after a candidate wins the configured window.
- Right-hand strumming uses an OPEN → MOVING → COOLDOWN state machine based on palm openness and normalized wrist velocity, supporting UP and DOWN.
- Audio is prebuilt at user activation into reusable Web Audio buffers with Karplus–Strong plucked-string synthesis. This avoids first-note latency and preserves GitHub Pages portability without unlicensed samples.
- MediaPipe WASM and model use version-pinned HTTPS URLs; all local assets and routes use `import.meta.env.BASE_URL` semantics.
- Chinese is the default locale; every visible string is in locale dictionaries.
- Debug data is shown only in development or with `?debug=1`.

## Visual system

The accepted working concept is the generated `AirString` desktop screen: graphite background, walnut fretboard, brass details, coral active state, turquoise tracking state. A slim header leads to a two-column instrument workspace: dominant guitar stage and 4:3 camera, then a performance rail and gesture guide. Typography pairs a condensed display face for the selected position with a geometric sans for UI chrome. On narrow screens, guitar, camera, status, and guide stack vertically.

## Goals

- Complete reliable interaction loop with friendly camera/model errors.
- Stable gesture switching and one trigger per deliberate strum.
- Clear visual feedback and usable bilingual responsive UI.
- Passing tests, lint, strict typecheck, production build, and Pages workflow.

## Non-goals

- Studio-quality multisampled commercial guitar library.
- Mobile Safari performance guarantees or background operation.
- Recording, MIDI, accounts, or server persistence.

## Success criteria

The supplied 25-point acceptance checklist is authoritative. Automated tests cover pure gesture/state algorithms; build and browser QA cover integration and layout.
