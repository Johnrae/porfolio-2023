import { useAudio } from '@/hooks/useAudio'
import { useEffect, useRef, useState } from 'react'

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
    <div className='fixed top-0 left-0 z-10 bg-transparent'>
      <button onClick={handleStart} className='cursor-pointer'>
        Click here to start
      </button>
      {isComplete ? <span>Ready ✅</span> : <span>Loading...</span>}
    </div>
  )
}
