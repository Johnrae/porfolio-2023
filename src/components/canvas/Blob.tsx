import { useRef, useState, useEffect } from 'react'
import { MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Mesh } from 'three'

// Extract the ref element type that MeshDistortMaterial forwards to
type DistortMaterial = NonNullable<React.ComponentRef<typeof MeshDistortMaterial>>

const BASE_SCALE = 1
const EXPANDED_SCALE = 1.5
const Z_POSITION = 0
const MIN_DISTORTION = 0.1
const MAX_DISTORTION = 0.6
const PRESSED_DISTORTION_MULTIPLIER = 2.5

export default function Blob() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<DistortMaterial>(null)
  const distortionRef = useRef(MIN_DISTORTION)
  const isMouseDownRef = useRef(false)
  const [active, setActive] = useState(false)

  const springConfig = { mass: 1, tension: 200, friction: 16 }

  const { scale } = useSpring({
    scale: active
      ? ([EXPANDED_SCALE, EXPANDED_SCALE, EXPANDED_SCALE] as [number, number, number])
      : ([BASE_SCALE, BASE_SCALE, BASE_SCALE] as [number, number, number]),
    config: springConfig,
  })

  useEffect(() => {
    const onDown = () => {
      isMouseDownRef.current = true
    }
    const onUp = () => {
      isMouseDownRef.current = false
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('touchend', onUp)
    window.addEventListener('touchcancel', onUp)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
    }
  }, [])

  useFrame(({ pointer, viewport, clock }) => {
    if (!meshRef.current || !materialRef.current) return

    meshRef.current.position.x = pointer.x * (viewport.width / 3)
    meshRef.current.position.y = pointer.y * (viewport.height / 3)
    meshRef.current.position.z = Z_POSITION

    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime())
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1)

    const distanceFromCenter = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y)
    const normalizedDistance = Math.min(distanceFromCenter / 2, 1)
    const baseDistortion = MIN_DISTORTION + normalizedDistance * (MAX_DISTORTION - MIN_DISTORTION)

    distortionRef.current = isMouseDownRef.current
      ? Math.min(baseDistortion * PRESSED_DISTORTION_MULTIPLIER, 3.0)
      : baseDistortion

    materialRef.current.distort = distortionRef.current
  })

  return (
    <animated.mesh
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      ref={meshRef}
      scale={scale as unknown as [number, number, number]}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        roughness={0.2}
        metalness={0.0}
        distort={MIN_DISTORTION}
        color={'#BEFF26'}
      />
    </animated.mesh>
  )
}
