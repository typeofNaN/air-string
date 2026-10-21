import type { StrumDirection, StrumState } from '../../types/guitar'

interface StrumConfig {
  cooldownMs: number
}

interface Frame {
  y: number
  open: boolean
  closed: boolean
  timestamp: number
}

export class StrumDetector {
  state: StrumState = 'OPEN'
  velocityY = 0
  private cooldownUntil = 0
  private fistArmed = false

  constructor(private readonly config: StrumConfig) {}

  update(frame: Frame): StrumDirection | null {
    if (!frame.open) {
      if (frame.closed && frame.timestamp >= this.cooldownUntil)
        this.fistArmed = true
      this.state = 'OPEN'
      return null
    }
    if (frame.timestamp < this.cooldownUntil) {
      this.state = 'COOLDOWN'
      return null
    }
    if (this.fistArmed) {
      this.fistArmed = false
      this.state = 'COOLDOWN'
      this.cooldownUntil = frame.timestamp + this.config.cooldownMs
      return 'DOWN'
    }
    this.state = 'OPEN'
    this.velocityY = 0
    return null
  }

  reset(): void {
    this.state = 'OPEN'
    this.velocityY = 0
    this.cooldownUntil = 0
    this.fistArmed = false
  }
}
