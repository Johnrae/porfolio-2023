// [oscillator] -> [echoNode] -> [gainNode] -> [context.destination]
//         \________________________/

// Signal processing is wild

import { throttle } from 'underscore'
import Tuna from 'tunajs'
import { useMouseState } from './useMouseState'

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
    feedback: 0.45, //0 to 1+
    delayTime: 100, //1 to 10000 milliseconds
    wetLevel: 0.5, //0 to 1+
    dryLevel: 1, //0 to 1+
    cutoff: 20000, //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: 0.5,
  })

  const bitcrusher = new tuna.Bitcrusher({
    bits: 4, //1 to 16
    normfreq: 0.1, //0 to 1
    bufferSize: 4096, //256 to 16384
  })

  const output = context.createGain()
  input.gain.value = 0.1

  oscillator.type = 'square'
  oscillator.start()

  input.connect(chorus)
  chorus.connect(output)

  input.connect(bitcrusher)
  bitcrusher.connect(output)

  input.connect(delay)
  delay.connect(output)

  output.connect(context.destination)

  window.addEventListener('mousedown', () => {
    mouseDown()
    oscillator.connect(input)
  })

  window.addEventListener('mouseup', () => {
    mouseUp()
    oscillator.disconnect(input)
  })

  const handleMouseMove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = clientX / innerWidth
    const y = clientY / innerHeight
    // TODO: Implement kaos pad stuff here
    input.gain.value = x * 0.5
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
    }

    if (e.key === 'a') {
      // @ts-ignore
      window.currentNote -= 1
      // @ts-ignore
      oscillator.frequency.value = noteToFrequency(window.currentNote)
    }

    if (e.key === 's') {
      oscillator.frequency.value -= 2
    }

    if (e.key === 'd') {
      oscillator.frequency.value += 2
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
  })

  console.log('Audio set up!')
}

export const useAudio = () => {
  const { onMouseDown, onMouseUp } = useMouseState()
  return {
    setup: () => setupAudio(onMouseDown, onMouseUp),
  }
}
