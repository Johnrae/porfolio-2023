import { useAudio } from '@/hooks/useAudio'
import { useEffect, useRef, useState } from 'react'
import KeyboardInstructions from '@/components/dom/KeyboardInstructions'

export default function Synth() {
  const { setup } = useAudio()
  const [isComplete, setIsComplete] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  function handleStart() {
    cleanupRef.current = setup()
    setIsComplete(true)
  }

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3'>
      {!isComplete ? (
        <button
          onClick={handleStart}
          className='cursor-pointer text-sm font-mono text-zinc-300 border border-zinc-600 rounded-lg px-4 py-2 hover:bg-zinc-800 transition-colors'>
          Click to start
        </button>
      ) : (
        <KeyboardInstructions />
      )}
    </div>
  )
}
