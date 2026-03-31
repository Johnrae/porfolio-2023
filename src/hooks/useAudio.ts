// Signal chain:
//
//   oscillator
//       │
//       ▼
//     source (GainNode — master vol, gated 0/0.5)
//       │
//       ├── dryGain ────────────────────────────────► output
//       │
//       ├── tlWetGain ──► chorus ──────────────────► output   top-left
//       ├── trWetGain ──► delay ───────────────────► output   top-right
//       ├── blWetGain ──► bitcrusher ──────────────► output   bottom-left
//       └── brWetGain ──► tremolo ─────────────────► output   bottom-right
//
// Mouse acts as a 4-channel spatial mixer. Each wet gain ramps from 0 (cursor
// at center) to 1 (cursor at that corner). The dry gain is the complement so
// the center feels clean and neutral.

import Tuna from 'tunajs'

// bottom row of keys
const keyboard = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']

const noteToFrequency = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12)
}

// Smooth gain transitions to avoid zipper noise
const setGain = (node: GainNode, value: number, context: AudioContext) => {
  node.gain.setTargetAtTime(value, context.currentTime, 0.05)
}

const setupAudio = (): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const context = new AudioContext()
  const tuna = new Tuna(context)

  let currentNote = 48

  // ── Source ──────────────────────────────────────────────────────────────────
  const oscillator = context.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = noteToFrequency(currentNote)

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

  // ── Top-left: Chorus ────────────────────────────────────────────────────────
  // Lush, warm doubling effect. Parameters set for a thick, noticeable chorus.
  const chorus = new tuna.Chorus({
    rate: 0.8, // LFO rate in Hz — slow and wide for a dreamy feel
    feedback: 0.4, // feedback ratio — adds depth
    delay: 0.008, // base delay in seconds — longer = more spread
    bypass: 0,
  })

  const tlWetGain = context.createGain()
  tlWetGain.gain.value = 0
  source.connect(tlWetGain)
  tlWetGain.connect(chorus)
  chorus.connect(output)

  // ── Top-right: Delay ────────────────────────────────────────────────────────
  // Slapback / echo. Keep feedback below 1 to avoid runaway buildup.
  const delay = new tuna.Delay({
    feedback: 0.45, // echo decay — stays controlled
    delayTime: 220, // ms — dotted-8th-ish at moderate tempo
    wetLevel: 1.0, // internal wet; we control level via trWetGain
    dryLevel: 0.0, // no internal dry — our dryGain handles that
    cutoff: 4000, // darken the echoes
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
    bits: 5, // bit depth — 5 gives clear grit without being too harsh
    normfreq: 0.12, // sample-rate reduction — adds graininess
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
    intensity: 0.9, // depth of the volume oscillation
    rate: 4, // Hz — noticeable pulse
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
  }

  const stop = () => {
    source.gain.setTargetAtTime(0, context.currentTime, 0.02)
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

  const rafLoop = () => {
    const x = mouseX
    const y = mouseY

    // Per-axis distance from center, [0, 1]
    const rx = Math.abs(x - 0.5) * 2
    const ry = Math.abs(y - 0.5) * 2

    // Corner weights: product of how far we are toward each axis direction
    const tlW = Math.max(0, 0.5 - x) * 2 * Math.max(0, 0.5 - y) * 2 // left × top
    const trW = Math.max(0, x - 0.5) * 2 * Math.max(0, 0.5 - y) * 2 // right × top
    const blW = Math.max(0, 0.5 - x) * 2 * Math.max(0, y - 0.5) * 2 // left × bottom
    const brW = Math.max(0, x - 0.5) * 2 * Math.max(0, y - 0.5) * 2 // right × bottom

    // Dry is loudest at center; fades as cursor moves to any corner
    const wetness = Math.min(1, Math.sqrt(rx * rx + ry * ry))
    const dryLevel = 1 - wetness * 0.8 // never fully silent on dry

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
      currentNote += 1
      oscillator.frequency.value = noteToFrequency(currentNote)
      return
    }

    if (e.key === 'w') {
      currentNote -= 1
      oscillator.frequency.value = noteToFrequency(currentNote)
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

    const noteMap: Record<string, number> = {
      z: 48,
      x: 50,
      c: 52,
      v: 53,
      b: 55,
      n: 57,
      m: 59,
      ',': 60,
      '.': 62,
      a: 47,
      s: 49,
      d: 51,
      f: 53,
      g: 55,
      h: 57,
      j: 59,
      k: 61,
      l: 63,
    }

    if (e.key in noteMap) {
      currentNote = noteMap[e.key]
      oscillator.frequency.value = noteToFrequency(currentNote)
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
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    oscillator.stop()
    context.close()
  }
}

export const useAudio = () => {
  return {
    setup: setupAudio,
  }
}
