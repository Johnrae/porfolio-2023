// [oscillator] -> [echoNode] -> [gainNode] -> [context.destination]
//         \________________________/

// Signal processing is wild

import { throttle } from 'underscore'
import Tuna from 'tunajs'
import { useMouseState } from './useMouseState'

// bottom row of keys
const keyboard = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']

const noteToFrequency = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12)
}

const setupAudio = (mouseDown, mouseUp) => {
  if (!window) return

  const context = new AudioContext()
  const tuna = new Tuna(context)

  // create Oscillator and gain node
  const oscillator = context.createOscillator()
  oscillator.frequency.value = noteToFrequency(48)
  // @ts-ignore
  window.currentNote = 48
  const input = context.createGain()

  const chorus = new tuna.Chorus({
    rate: 1.5,
    feedback: 0.2,
    delay: 0.0045,
    bypass: 0,
  })

  const delay = new tuna.Delay({
    feedback: 0.7, //0 to 1+
    delayTime: 150, //1 to 10000 milliseconds
    wetLevel: 1, //0 to 1+
    dryLevel: 1, //0 to 1+
    cutoff: 16000, //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: false,
  })

  const bitcrusher = new tuna.Bitcrusher({
    bits: 4, //1 to 16
    normfreq: 0.1, //0 to 1
    bufferSize: 4096, //256 to 16384
  })

  const phaser = new tuna.Phaser({
    rate: 1.2, // 0.01 to 8 is a decent range, but not limited to it. Default = 1.2
    depth: 0.3, // 0 to 1. Default = 0.3
    feedback: 0.2, // 0 to 1+ Default = 0.2
    stereoPhase: 30, // 0 to 180. Default = 30
    bypass: 0,
  })

  const tremolo = new tuna.Tremolo({
    intensity: 0.3, //0 to 1. Default = 0.3
    rate: 4, //0.1 to 16. Default = 4
    stereoPhase: 0, //0 to 180. Default = 0
    bypass: false,
  })

  const moogFilter = new tuna.MoogFilter({
    cutoff: 0.065, //0 to 1
    resonance: 3.5, //0 to 4
    bufferSize: 8192, //256 to 16384
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
    input.gain.value = 0.5 // Master Volume
  }

  const stop = () => {
    input.gain.value = 0 // Master Volume
  }

  window.addEventListener('mousedown', () => {
    mouseDown()
    play()
  })

  window.addEventListener('mouseup', () => {
    mouseUp()
    stop()
  })

  const handleMouseMove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = clientX / innerWidth
    const y = clientY / innerHeight

    // Calculate distance from center in each quadrant (0 to 1)
    const quadrantNormalized = {
      x: x > 0.5 ? (x - 0.5) * 2 : Math.abs((x - 0.5) * 2),
      y: y > 0.5 ? (y - 0.5) * 2 : Math.abs((y - 0.5) * 2),
    }

    if (x > 0.5 && y < 0.5) {
      // Top right quadrant
      delay.feedback = quadrantNormalized.x // Now 0 to 1
      delay.delayTime = quadrantNormalized.y * 1000
    } else if (x < 0.5 && y < 0.5) {
      // Top left quadrant
      moogFilter.cutoff = quadrantNormalized.x
      moogFilter.resonance = quadrantNormalized.y * 4
    } else if (x < 0.5 && y > 0.5) {
      // Bottom left is bitcrusher, bits on x and bufferSize on y
      bitcrusher.bits = Math.floor(x * 15) + 1 // Map x to bits (1 to 16)
      bitcrusher.bufferSize = Math.pow(2, Math.floor((y - 0.5) * 13)) // Map y to bufferSize (256 to 8192)
    } else if (x > 0.5 && y > 0.5) {
      // Bottom right is phaser and tremolo, phaser mix on x and tremolo speed and intensity on y
      phaser.mix = (x - 0.5) * 2 // Map x to phaser mix (0 to 1)
      tremolo.rate = (y - 0.5) * 15 + 1 // Map y to tremolo speed (1 to 16)
      tremolo.intensity = (y - 0.5) * 2 // Map y to tremolo intensity (0 to 1)
    }
  }, 100)

  window.addEventListener('mousemove', (e: any) => {
    handleMouseMove(e)
  })

  window.addEventListener('keydown', (e: any) => {
    // Modulator keys
    if (e.key === 'f') {
      // @ts-ignore
      window.currentNote += 1
      // @ts-ignore
      oscillator.frequency.value = noteToFrequency(window.currentNote)
      return
    }

    if (e.key === 'a') {
      // @ts-ignore
      window.currentNote -= 1
      // @ts-ignore
      oscillator.frequency.value = noteToFrequency(window.currentNote)
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

    // Keyboard
    if (e.key === 'z') {
      // @ts-ignore
      window.currentNote = 48
      oscillator.frequency.value = noteToFrequency(48)
    }

    if (e.key === 'x') {
      // @ts-ignore
      window.currentNote = 50
      oscillator.frequency.value = noteToFrequency(50)
    }

    if (e.key === 'c') {
      // @ts-ignore
      window.currentNote = 52
      oscillator.frequency.value = noteToFrequency(52)
    }

    if (e.key === 'v') {
      // @ts-ignore
      window.currentNote = 53
      oscillator.frequency.value = noteToFrequency(53)
    }

    if (e.key === 'b') {
      // @ts-ignore
      window.currentNote = 55
      oscillator.frequency.value = noteToFrequency(55)
    }

    if (e.key === 'n') {
      // @ts-ignore
      window.currentNote = 57
      oscillator.frequency.value = noteToFrequency(57)
    }

    if (e.key === 'm') {
      // @ts-ignore
      window.currentNote = 59
      oscillator.frequency.value = noteToFrequency(59)
    }

    if (e.key === ',') {
      // @ts-ignore
      window.currentNote = 60
      oscillator.frequency.value = noteToFrequency(60)
    }

    if (e.key === '.') {
      // @ts-ignore
      window.currentNote = 62
      oscillator.frequency.value = noteToFrequency(62)
    }

    return play()
  })

  window.addEventListener('keyup', (e: any) => {
    // for any of the bottom row keys, stop playing
    if (keyboard.includes(e.key)) {
      stop()
    }
  })
}

export const useAudio = () => {
  const { onMouseDown, onMouseUp } = useMouseState()
  return {
    setup: () => setupAudio(onMouseDown, onMouseUp),
  }
}
