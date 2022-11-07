import { useAudio } from '@/hooks/useAudio'
import { useEffect, useState } from 'react'

// Dom components go here
export default function Synth(props) {
  const { setup } = useAudio()
  const [isComplete, setIsComplete] = useState(false)

  function handleStart() {
    setup()
    setIsComplete(true)
  }

  return (
    <>
      <h1 onClick={handleStart}>Click here to start</h1>
      {isComplete ? <span>Ready ✅</span> : <span>Loading...</span>}
    </>
  )
}
