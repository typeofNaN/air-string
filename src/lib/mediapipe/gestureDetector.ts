import type { FingerState, GuitarPosition } from '../../types/guitar'

export function classifyFingerState(
  fingers: FingerState,
): GuitarPosition | null {
  const { thumb, index, middle, ring, pinky } = fingers
  if (thumb && !index && !middle && !ring && pinky) return 6
  if (thumb && index && middle && ring && pinky) return 5
  if (!thumb && index && middle && ring && pinky) return 4
  if (index && middle && ring && !pinky) return 3
  if (!thumb && index && middle && !ring && !pinky) return 2
  if (!thumb && index && !middle && !ring && !pinky) return 1
  return null
}
