// Signal chain:
//
//   oscillator
//       │
//       ▼
//     source (GainNode — master vol, gated 0/0.5)
//       │
//       ├── dryGain ────────────────────────────────► output
//       │
//       ├── tlWetGain ──► reverb ──────────────────► output   top-left
//       ├── trWetGain ──► delay ───────────────────► output   top-right
//       ├── blWetGain ──► bitcrusher ──────────────► output   bottom-left
//       └── brWetGain ──► tremolo ─────────────────► output   bottom-right
//
// Mouse acts as a 4-channel spatial mixer. Each wet gain ramps from 0 (cursor
// at center) to 1 (cursor at that corner). The dry gain is the complement so
// the center feels clean and neutral.

import Tuna from 'tunajs'

const SEMITONE_UP = Math.pow(2, 1 / 12) // ×1.0595 per semitone up
const SEMITONE_DOWN = Math.pow(2, -1 / 12) // ×0.9439 per semitone down

// ── Key layout ───────────────────────────────────────────────────────────────
// Edit this map to change which MIDI note each key plays.
// MIDI 69 = A4 = 440 Hz. Each integer step is one semitone.
const KEY_NOTES: Record<string, number> = {
  // A row (upper) — B2 → Eb4
  a: 47, // B2
  s: 49, // C#3
  d: 51, // Eb3
  f: 53, // F3
  g: 55, // G3
  h: 57, // A3
  j: 59, // B3
  k: 61, // C#4
  l: 63, // Eb4
  // Z row (lower) — C3 → D4
  z: 48, // C3
  x: 50, // D3
  c: 52, // E3
  v: 53, // F3
  b: 55, // G3
  n: 57, // A3
  m: 59, // B3
  ',': 60, // C4
  '.': 62, // D4
}

const midiToHz = (note: number) => 440 * Math.pow(2, (note - 69) / 12)

// Derived at module load — no per-keystroke math
const frequencyMap: Record<string, number> = Object.fromEntries(
  Object.entries(KEY_NOTES).map(([key, midi]) => [key, midiToHz(midi)]),
)

const keyboard = Object.keys(KEY_NOTES)

// Smooth gain transitions to avoid zipper noise
const setGain = (node: GainNode, value: number, context: AudioContext) => {
  node.gain.setTargetAtTime(value, context.currentTime, 0.05)
}

const setupAudio = (): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const context = new AudioContext()
  const tuna = new Tuna(context)

  let currentFreq = frequencyMap['z'] // C3 default

  // ── Source ──────────────────────────────────────────────────────────────────
  const oscillator = context.createOscillator()
  oscillator.type = 'sawtooth'
  oscillator.frequency.value = currentFreq

  const source = context.createGain()
  source.gain.value = 0 // gated; toggled by play/stop

  oscillator.connect(source)
  oscillator.start()

  // ── Output ──────────────────────────────────────────────────────────────────
  const output = context.createGain()
  output.gain.value = 1
  output.connect(context.destination)

  // ── Dry path (center = fully dry) ───────────────────────────────────────────
  const dryGain = context.createGain()
  dryGain.gain.value = 1
  source.connect(dryGain)
  dryGain.connect(output)

  // ── Top-left: Modulated Reverb ──────────────────────────────────────────────
  // Convolver reverb with an LFO-driven pre-delay for pitch shimmer.
  // The LFO modulates a short DelayNode before the convolver — this causes the
  // reverb tail to waver in pitch, giving a lush "modulated reverb" character.
  //
  // NOTE: tlWetGain gates only the *input* to the reverb. The convolver is
  // connected directly to output (not through source) so the tail rings out
  // naturally after mouse up — it is not cut by the source gate.
  const buildImpulse = (ctx: AudioContext, duration: number, decay: number) => {
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const impulse = ctx.createBuffer(2, length, sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
      }
    }
    return impulse
  }

  const MOD_DELAY_CENTER = 0.02 // 20ms center delay
  const MOD_DEPTH = 0.008 // ±8ms pitch shimmer
  const MOD_RATE = 0.3 // Hz — slow, dreamy sweep

  const reverbPreDelay = context.createDelay(0.05)
  reverbPreDelay.delayTime.value = MOD_DELAY_CENTER

  const reverbLfo = context.createOscillator()
  reverbLfo.type = 'sine'
  reverbLfo.frequency.value = MOD_RATE

  const reverbLfoDepth = context.createGain()
  reverbLfoDepth.gain.value = MOD_DEPTH

  reverbLfo.connect(reverbLfoDepth)
  reverbLfoDepth.connect(reverbPreDelay.delayTime)
  reverbLfo.start()

  const reverb = context.createConvolver()
  reverb.buffer = buildImpulse(context, 2.5, 2.5)
  reverb.normalize = true

  const reverbOutput = context.createGain()
  reverbOutput.gain.value = 0.6 // tame the wet level slightly

  reverbPreDelay.connect(reverb)
  reverb.connect(reverbOutput)
  reverbOutput.connect(output)

  // The reverb send taps the oscillator via its own gate (reverbGate), opened
  // and closed by play()/stop() in sync with source. The gate going to 0 stops
  // new signal entering the convolver, but the tail rings out naturally.
  const reverbGate = context.createGain()
  reverbGate.gain.value = 0
  oscillator.connect(reverbGate)

  const tlWetGain = context.createGain()
  tlWetGain.gain.value = 0
  reverbGate.connect(tlWetGain)
  tlWetGain.connect(reverbPreDelay)

  // ── Top-right: Delay ────────────────────────────────────────────────────────
  // Slapback / echo. Keep feedback below 1 to avoid runaway buildup.
  const delay = new tuna.Delay({
    feedback: 0.55, // echo decay — stays controlled
    delayTime: 300, // ms — dotted-8th-ish at moderate tempo
    wetLevel: 1.0, // internal wet; we control level via trWetGain
    dryLevel: 0.0, // no internal dry — our dryGain handles that
    cutoff: 16000, // darken the echoes
    bypass: false,
  })

  const trWetGain = context.createGain()
  trWetGain.gain.value = 0
  source.connect(trWetGain)
  trWetGain.connect(delay)
  delay.connect(output)

  // ── Bottom-left: Bitcrusher ─────────────────────────────────────────────────
  // Lo-fi crunch. Fixed at a clearly audible setting.
  const bitcrusher = new tuna.Bitcrusher({
    bits: 4, // bit depth — 4 gives clear grit without being too harsh
    normfreq: 0.05, // sample-rate reduction — adds graininess
    bufferSize: 256,
  })

  const blWetGain = context.createGain()
  blWetGain.gain.value = 0
  source.connect(blWetGain)
  blWetGain.connect(bitcrusher)
  bitcrusher.connect(output)

  // ── Bottom-right: Tremolo ───────────────────────────────────────────────────
  // Rhythmic amplitude modulation.
  const tremolo = new tuna.Tremolo({
    intensity: 1, // depth of the volume oscillation
    rate: 2, // Hz — noticeable pulse
    stereoPhase: 180, // full stereo alternation for width
    bypass: false,
  })

  const brWetGain = context.createGain()
  brWetGain.gain.value = 0
  source.connect(brWetGain)
  brWetGain.connect(tremolo)
  tremolo.connect(output)

  // ── Playback control ────────────────────────────────────────────────────────
  const play = () => {
    source.gain.setTargetAtTime(0.5, context.currentTime, 0.01)
    reverbGate.gain.setTargetAtTime(1, context.currentTime, 0.01)
  }

  const stop = () => {
    source.gain.setTargetAtTime(0, context.currentTime, 0.02)
    reverbGate.gain.setTargetAtTime(0, context.currentTime, 0.02)
  }

  const handleMouseDown = () => play()
  const handleMouseUp = () => stop()

  // ── Spatial mixer ───────────────────────────────────────────────────────────
  // The mousemove listener does the absolute minimum: store raw coordinates.
  // A rAF loop reads them once per frame and applies the gain changes, keeping
  // all audio-graph writes perfectly frame-aligned and off the event thread.
  let mouseX = 0.5
  let mouseY = 0.5
  let rafId = 0

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX / window.innerWidth
    mouseY = e.clientY / window.innerHeight
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    mouseX = touch.clientX / window.innerWidth
    mouseY = touch.clientY / window.innerHeight
    play()
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    mouseX = touch.clientX / window.innerWidth
    mouseY = touch.clientY / window.innerHeight
  }

  const handleTouchEnd = () => stop()

  const rafLoop = () => {
    const x = mouseX
    const y = mouseY

    // Per-axis distance from center, [0, 1].
    // rx = 0 at x=0.5 (center), 1 at either horizontal edge
    // ry = 0 at y=0.5 (center), 1 at either vertical edge
    const rx = Math.abs(x - 0.5) * 2
    const ry = Math.abs(y - 0.5) * 2

    // Overall displacement from center drives wetness and dry attenuation.
    const wetness = Math.min(1, Math.sqrt(rx * rx + ry * ry))
    const dryLevel = 1 - wetness * 0.8 // never fully silent on dry

    // Directional shares along each axis.
    // xShare splits rx between left (L) and right (R): at the left edge xL=1,xR=0;
    // at the right edge xL=0,xR=1; on the vertical center line xL=xR=0.5.
    // yShare splits ry between top (T) and bottom (B) the same way.
    // Multiplying a share by its axis distance gives the actual contribution.
    const xShareL = x < 0.5 ? 1 : x > 0.5 ? 0 : 0.5
    const xShareR = x > 0.5 ? 1 : x < 0.5 ? 0 : 0.5
    const yShareT = y < 0.5 ? 1 : y > 0.5 ? 0 : 0.5
    const yShareB = y > 0.5 ? 1 : y < 0.5 ? 0 : 0.5

    // Each corner weight = wetness × horizontal share × vertical share.
    // Examples (all at wetness = 1):
    //   top-left corner   (0,0):   xShareL=1, yShareT=1 → tlW=1, rest=0
    //   top-right corner  (1,0):   xShareR=1, yShareT=1 → trW=1, rest=0
    //   top-center edge   (0.5,0): xShareL=xShareR=0.5, yShareT=1 → tlW=trW=0.5
    //   right-center edge (1,0.5): xShareR=1, yShareT=yShareB=0.5 → trW=brW=0.5
    //   center            (0.5,0.5): wetness=0 → all weights 0 (fully dry)
    const tlW = wetness * xShareL * yShareT
    const trW = wetness * xShareR * yShareT
    const blW = wetness * xShareL * yShareB
    const brW = wetness * xShareR * yShareB

    setGain(dryGain, dryLevel, context)
    setGain(tlWetGain, tlW, context)
    setGain(trWetGain, trW, context)
    setGain(blWetGain, blW, context)
    setGain(brWetGain, brW, context)

    rafId = requestAnimationFrame(rafLoop)
  }

  rafId = requestAnimationFrame(rafLoop)

  // ── Keyboard ────────────────────────────────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'q') {
      currentFreq *= SEMITONE_UP
      oscillator.frequency.value = currentFreq
      return
    }

    if (e.key === 'w') {
      currentFreq *= SEMITONE_DOWN
      oscillator.frequency.value = currentFreq
      return
    }

    if (e.key === 'e') {
      oscillator.frequency.value -= 2
      return
    }

    if (e.key === 'r') {
      oscillator.frequency.value += 2
      return
    }

    if (e.key in frequencyMap) {
      currentFreq = frequencyMap[e.key]
      oscillator.frequency.value = currentFreq
    }

    play()
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (keyboard.includes(e.key)) {
      stop()
    }
  }

  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('touchend', handleTouchEnd)
  window.addEventListener('touchcancel', handleTouchEnd)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('touchcancel', handleTouchEnd)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    oscillator.stop()
    reverbLfo.stop()
    context.close()
  }
}

export const useAudio = () => {
  return {
    setup: setupAudio,
  }
}
