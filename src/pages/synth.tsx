import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAudio } from '@/hooks/useAudio'
import KeyboardInstructions from '@/components/dom/KeyboardInstructions'
import QuadrantOverlay from '@/components/dom/QuadrantOverlay'
import Scene from '@/components/canvas/Scene'

const Blob = dynamic(() => import('@/components/canvas/Blob'), { ssr: false })
const Backdrop = dynamic(() => import('@/components/canvas/Backdrop'), { ssr: false })

export default function SynthPage() {
  const { setup } = useAudio()
  const cleanupRef = useRef<(() => void) | null>(null)
  const router = useRouter()

  useEffect(() => {
    cleanupRef.current = setup()
    return () => {
      cleanupRef.current?.()
    }
  }, [setup])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <>
      <div className='w-screen h-screen fixed z-10 top-0 left-0 overflow-hidden'>
        <Scene>
          <Backdrop />
          <Blob />
        </Scene>
      </div>
      <QuadrantOverlay />
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none'>
        <KeyboardInstructions />
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Synth' } }
}
