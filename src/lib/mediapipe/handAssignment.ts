import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export interface HandAssignment {
  chordIndex: number | null
  playIndex: number | null
}

export function assignHandsByVisualZone(
  hands: NormalizedLandmark[][],
): HandAssignment {
  if (hands.length === 0) return { chordIndex: null, playIndex: null }
  if (hands.length === 1) {
    // The preview is mirrored: raw x > .5 appears in the screen's left half.
    if (hands[0][0].x >= 0.56) return { chordIndex: 0, playIndex: null }
    if (hands[0][0].x <= 0.44) return { chordIndex: null, playIndex: 0 }
    return { chordIndex: null, playIndex: null }
  }
  const located = hands.map((landmarks, index) => ({
    index,
    rawX: landmarks[0].x,
  }))
  const chord = located
    .filter((hand) => hand.rawX >= 0.56)
    .sort((a, b) => b.rawX - a.rawX)[0]
  const play = located
    .filter((hand) => hand.rawX <= 0.44)
    .sort((a, b) => a.rawX - b.rawX)[0]
  return { chordIndex: chord?.index ?? null, playIndex: play?.index ?? null }
}
