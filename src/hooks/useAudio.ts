// [oscillator] -> [echoNode] -> [gainNode] -> [context.destination]
//         \________________________/

// Signal processing is wild

import { throttle } from 'underscore'
import Tuna from 'tunajs'

// bottom row of keys
const keyboard = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']

const noteToFrequency = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12)
}

const setupAudio = (): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const context = new AudioContext()
  const tuna = new Tuna(context)

  // Closure-scoped current note — no window pollution
  let currentNote = 48

  const oscillator = context.createOscillator()
  oscillator.frequency.value = noteToFrequency(currentNote)
  const input = context.createGain()

  const chorus = new tuna.Chorus({
    rate: 1.5,
    feedback: 0.2,
    delay: 0.0045,
    bypass: 0,
  })

  const delay = new tuna.Delay({
    feedback: 0.7,
    delayTime: 150,
    wetLevel: 1,
    dryLevel: 1,
    cutoff: 16000,
    bypass: false,
  })

  const bitcrusher = new tuna.Bitcrusher({
    bits: 4,
    normfreq: 0.1,
    bufferSize: 4096,
  })

  const phaser = new tuna.Phaser({
    rate: 1.2,
    depth: 0.3,
    feedback: 0.2,
    stereoPhase: 30,
    bypass: 0,
  })

  const tremolo = new tuna.Tremolo({
    intensity: 0.3,
    rate: 4,
    stereoPhase: 0,
    bypass: false,
  })

  const moogFilter = new tuna.MoogFilter({
    cutoff: 0.065,
    resonance: 3.5,
    bufferSize: 8192,
  })

  const output = context.createGain()
  input.gain.value = 0 // Master Volume

  oscillator.type = 'sawtooth'
  oscillator.connect(input)
  oscillator.start()

  input.connect(chorus)
  chorus.connect(output)

  input.connect(bitcrusher)
  bitcrusher.connect(output)

  input.connect(delay)
  delay.connect(output)

  input.connect(phaser)
  phaser.connect(output)

  input.connect(tremolo)
  tremolo.connect(output)

  input.connect(moogFilter)
  moogFilter.connect(output)

  output.connect(context.destination)

  const play = () => {
    input.gain.value = 0.5
  }

  const stop = () => {
    input.gain.value = 0
  }

  const handleMouseDown = () => {
    play()
  }

  const handleMouseUp = () => {
    stop()
  }

  const handleMouseMove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = clientX / innerWidth
    const y = clientY / innerHeight

    const quadrantNormalized = {
      x: x > 0.5 ? (x - 0.5) * 2 : Math.abs((x - 0.5) * 2),
      y: y > 0.5 ? (y - 0.5) * 2 : Math.abs((y - 0.5) * 2),
    }

    if (x > 0.5 && y < 0.5) {
      delay.feedback = quadrantNormalized.x
      delay.delayTime = quadrantNormalized.y * 1000
    } else if (x < 0.5 && y < 0.5) {
      moogFilter.cutoff = quadrantNormalized.x
      moogFilter.resonance = quadrantNormalized.y * 4
    } else if (x < 0.5 && y > 0.5) {
      bitcrusher.bits = Math.floor(x * 15) + 1
      bitcrusher.bufferSize = Math.pow(2, Math.floor((y - 0.5) * 13))
    } else if (x > 0.5 && y > 0.5) {
      phaser.mix = (x - 0.5) * 2
      tremolo.rate = (y - 0.5) * 15 + 1
      tremolo.intensity = (y - 0.5) * 2
    }
  }, 100)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'f') {
      currentNote += 1
      oscillator.frequency.value = noteToFrequency(currentNote)
      return
    }

    if (e.key === 'a') {
      currentNote -= 1
      oscillator.frequency.value = noteToFrequency(currentNote)
      return
    }

    if (e.key === 's') {
      oscillator.frequency.value -= 2
      return
    }

    if (e.key === 'd') {
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

  // Return cleanup function
  return () => {
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
