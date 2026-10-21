# AirString Studio Redesign

## Intent

Turn AirString from a visual demo into a calm, playable practice instrument. Free play remains the default workflow; guided chord practice is one click away. Interaction should match the supplied reference: screen-left gestures select chords and screen-right fist-to-open plays them.

## Product decisions

- Positions map to `C`, `G`, `Am`, `F`, `Em`, `Dm`.
- A large camera canvas and chord inspector are the primary surface; the decorative guitar illustration is removed.
- The inspector adds master volume, tempo, strum/arpeggio mode, automatic arpeggio, chord diagram, and a non-overlay debug disclosure.
- Three original practice exercises ship locally: `晚风练习` (`C G Am F`), `公路练习` (`G Dm Em C`), and `柔光练习` (`Am F C G`). They contain chord progressions only, not copyrighted lyrics or melodies.
- Practice advances on successful strums, shows current/next chord and progress, and allows transport restart/pause.
- Gesture teaching uses five-line/five-dot diagrams rather than emoji hands.
- Smoother feel comes from shorter gesture voting, zone dead-band, animated lock feedback, Web Audio gain ramps, and fewer React updates.

## Visual system

The generated concept at `/Users/typeofnan/.codex/generated_images/01a15cee-b673-73f3-bc55-047cf1b5b745/exec-28937d27-eda8-41d4-b0aa-2844567c8ae8.png` is the production reference. Palette: bone `#f2efe7`, forest `#173b2a`, olive `#71814f`, graphite `#222520`, terracotta `#b7644c`, citron `#dce98c`. Typography pairs an editorial serif for chords/titles with a neutral sans for controls. Geometry is mostly open layout with hairline borders and restrained 10px corners.

## Success

- The complete 1440×900 screen fits without overlap.
- Volume changes affect every subsequent note immediately.
- Debug information participates in layout and is collapsed by default.
- All six positions visibly show chord names and correct chord diagrams.
- Practice mode can select, play/pause, advance, and restart exercises.
- Desktop and mobile remain usable; tests, lint, typecheck, and build pass.
