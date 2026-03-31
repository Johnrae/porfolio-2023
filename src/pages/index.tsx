import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useAudio } from '@/hooks/useAudio'
import KeyboardInstructions from '@/components/dom/KeyboardInstructions'
import QuadrantOverlay from '@/components/dom/QuadrantOverlay'
import Scene from '@/components/canvas/Scene'

const Blob = dynamic(() => import('@/components/canvas/Blob'), { ssr: false })
const Backdrop = dynamic(() => import('@/components/canvas/Backdrop'), { ssr: false })

export default function Page() {
  const { setup } = useAudio()
  const [isComplete, setIsComplete] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  function handleEnter() {
    cleanupRef.current = setup()
    setIsComplete(true)
  }

  return (
    <>
      <div className='fixed top-0 left-0 z-0 w-screen h-screen'>
        <div className='flex flex-col items-center justify-center w-screen'>
          <h1 className='text-lg select-none'>It's a website</h1>
        </div>
      </div>
      <div className='w-screen h-screen fixed z-10 top-0 left-0'>
        <Scene>
          <Backdrop />
          <Blob />
        </Scene>
      </div>
      {!isComplete ? (
        <div className='fixed inset-0 z-20 flex items-center justify-center'>
          <button
            onClick={handleEnter}
            className='cursor-pointer text-sm font-mono text-zinc-300 border border-zinc-600 rounded-lg px-4 py-2 hover:bg-zinc-800 transition-colors'>
            Enter
          </button>
        </div>
      ) : (
        <>
          <QuadrantOverlay />
          <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-20'>
            <KeyboardInstructions />
          </div>
        </>
      )}
    </>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
