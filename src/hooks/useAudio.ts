import { useEffect, useState } from 'react'

export const useAudio = () => {
  const [context, setContext] = useState<AudioContext | null>(null)
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)
  const [gain, setGain] = useState<GainNode | null>(null)
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    if (!window || initialized) return

    const context = new AudioContext()

    // create Oscillator and gain node
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    oscillator.start(10)
    gainNode.connect(context.destination)
    gainNode.gain.value = 0.1

    setContext(context)
    setGain(gainNode)
    setOscillator(oscillator)
    setInitialized(true)
  }, [])

  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let timer
    console.log(playing, oscillator)
    if (playing) {
      timer = setTimeout(() => {
        oscillator.disconnect(gain)
        setPlaying(false)
      }, 1000)
    }
    timer = setTimeout(() => {}, 10)
    return () => clearTimeout(timer)
  }, [playing])

  const play = () => {
    if (playing) return
    oscillator.connect(gain)
    setPlaying(true)
  }

  return {
    context,
    oscillator,
    play,
  }
}
