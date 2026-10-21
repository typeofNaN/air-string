import type { GuitarPosition, StrumDirection } from '../../types/guitar'

export const CHORD_FREQUENCIES: Record<GuitarPosition, Array<number | null>> = {
  1: [null, 130.81, 164.81, 196, 261.63, 329.63],
  2: [98, 123.47, 146.83, 196, 246.94, 392],
  3: [null, 110, 164.81, 220, 261.63, 329.63],
  4: [87.31, 130.81, 174.61, 220, 261.63, 349.23],
  5: [82.41, 123.47, 164.81, 196, 246.94, 329.63],
  6: [null, null, 146.83, 220, 293.66, 349.23],
}

export type PlayStyle = 'strum' | 'arpeggio'
export const normalizeVolume = (value: number) =>
  Math.min(1, Math.max(0, value))

export class GuitarAudio {
  private context: AudioContext | null = null
  private buffers = new Map<string, AudioBuffer>()
  private master: GainNode | null = null
  private volume = 0.38

  async initialize(): Promise<void> {
    this.context ??= new AudioContext({ latencyHint: 'interactive' })
    if (!this.master) {
      this.master = this.context.createGain()
      this.master.gain.value = this.volume
      this.master.connect(this.context.destination)
    }
    await this.context.resume()
    for (const [position, frequencies] of Object.entries(CHORD_FREQUENCIES)) {
      frequencies.forEach((frequency, stringIndex) => {
        if (frequency === null) return
        const key = `${position}-${stringIndex}`
        if (!this.buffers.has(key))
          this.buffers.set(key, this.createPluckBuffer(frequency))
      })
    }
  }

  setVolume(value: number): void {
    this.volume = normalizeVolume(value)
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.025,
      )
    }
  }

  play(
    position: GuitarPosition,
    direction: StrumDirection,
    style: PlayStyle = 'strum',
    tempo = 84,
  ): void {
    if (!this.context || !this.master) return
    const strings = CHORD_FREQUENCIES[position].flatMap((frequency, index) =>
      frequency === null ? [] : [index],
    )
    if (direction === 'UP') strings.reverse()
    strings.forEach((stringIndex, order) => {
      const source = this.context!.createBufferSource()
      const gain = this.context!.createGain()
      source.buffer = this.buffers.get(`${position}-${stringIndex}`) ?? null
      const spacing = style === 'arpeggio' ? 60 / tempo / 2 : 0.018
      const startTime = this.context!.currentTime + order * spacing
      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.exponentialRampToValueAtTime(0.72, startTime + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2)
      source.connect(gain).connect(this.master!)
      source.start(startTime)
    })
  }

  private createPluckBuffer(frequency: number): AudioBuffer {
    const context = this.context!
    const duration = 2.2
    const length = Math.floor(context.sampleRate * duration)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const data = buffer.getChannelData(0)
    const period = Math.max(2, Math.round(context.sampleRate / frequency))
    for (let i = 0; i < period; i += 1) data[i] = Math.random() * 2 - 1
    for (let i = period; i < length; i += 1) {
      data[i] = 0.497 * (data[i - period] + data[i - period + 1]) * 0.9985
    }
    return buffer
  }
}
