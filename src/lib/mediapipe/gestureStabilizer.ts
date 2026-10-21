import type { GuitarPosition } from '../../types/guitar'

interface StabilizerConfig {
  windowSize: number
  requiredVotes: number
  minConfidence: number
}

export class GestureStabilizer {
  private history: GuitarPosition[] = []
  private stable: GuitarPosition | null = null

  constructor(private readonly config: StabilizerConfig) {}

  update(candidate: GuitarPosition | null, confidence: number): GuitarPosition | null {
    if (candidate !== null && confidence >= this.config.minConfidence) {
      this.history.push(candidate)
      if (this.history.length > this.config.windowSize) this.history.shift()
    }
    const votes = new Map<GuitarPosition, number>()
    this.history.forEach((value) => votes.set(value, (votes.get(value) ?? 0) + 1))
    let winner: GuitarPosition | null = null
    let count = 0
    votes.forEach((value, key) => {
      if (value > count) {
        winner = key
        count = value
      }
    })
    if (winner !== null && count >= this.config.requiredVotes) this.stable = winner
    return this.stable
  }

  reset(): void {
    this.history = []
    this.stable = null
  }
}
