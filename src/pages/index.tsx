import { useRef } from 'react'
import { useRouter } from 'next/router'
import GhostBall from '@/components/dom/GhostBall'
import IntroBlurb from '@/components/dom/IntroBlurb'
import Nav from '@/components/dom/Nav'
import { useMousePosition } from '@/hooks/useMousePosition'

export default function Page() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const ballPosRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 })
  const { x, y } = useMousePosition()

  function handleClick() {
    router.push('/synth')
  }

  return (
    <div
      ref={containerRef}
      className='w-screen h-screen fixed inset-0 z-10 bg-white overflow-hidden'
      onClick={handleClick}>
      <div onClick={(e) => e.stopPropagation()}>
        <Nav />
      </div>
      <GhostBall x={x} y={y} ballPosRef={ballPosRef} />
      <IntroBlurb ballPosRef={ballPosRef} containerRef={containerRef} />
    </div>
  )
}

export async function getStaticProps() {
  return { props: { title: 'John Rae' } }
}
