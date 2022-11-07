// [oscillator] -> [echoNode] -> [gainNode] -> [context.destination]
//         \________________________/

// Signal processing is wild

import { throttle } from 'underscore'

const noteToFrequency = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12)
}

const setupAudio = () => {
  if (!window) return

  const context = new AudioContext()

  // create Oscillator and gain node
  const oscillator = context.createOscillator()
  oscillator.frequency.value = noteToFrequency(48)
  // @ts-ignore
  window.currentNote = 48
  const gainNode = context.createGain()
  const echoNode = context.createDelay(100)
  echoNode.delayTime.value = 0.05
  gainNode.gain.value = 0.1

  oscillator.type = 'square'
  oscillator.start()
  echoNode.connect(gainNode).connect(context.destination)

  window.addEventListener('mousedown', () => {
    console.log(oscillator, 'mouse down')
    oscillator.connect(gainNode)
    oscillator.connect(echoNode)
  })

  window.addEventListener('mouseup', () => {
    oscillator.disconnect(gainNode)
    oscillator.disconnect(echoNode)
  })

  const handleMouseMove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = clientX / innerWidth
    const y = clientY / innerHeight
    console.log('throttling')
    echoNode.delayTime.value = y * 1.2
    gainNode.gain.value = x * 0.5
  }, 100)

  window.addEventListener('mousemove', (e: any) => {
    console.log('moving')
    handleMouseMove(e)
  })

  window.addEventListener('keydown', (e: any) => {
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
  return {
    setup: setupAudio,
  }
}
