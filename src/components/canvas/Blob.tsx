import { useRef, useState } from 'react'
import { MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Mesh } from 'three'

export default function Blob() {
  const ref = useRef<Mesh>(null)
  const distortionRef = useRef(0.5)
  const [active, setActive] = useState(false)

  // Constants for better control
  const BASE_SCALE = 100
  const EXPANDED_SCALE = 150
  const Z_POSITION = -500
  const MIN_DISTORTION = 0.2
  const MAX_DISTORTION = 1.0

  const springConfig = { mass: 1, tension: 170, friction: 26 }

  const { scale } = useSpring({
    scale: active
      ? ([EXPANDED_SCALE, EXPANDED_SCALE, EXPANDED_SCALE] as [number, number, number])
      : ([BASE_SCALE, BASE_SCALE, BASE_SCALE] as [number, number, number]),
    config: springConfig,
  })

  useFrame(({ pointer, viewport, clock }) => {
    if (!ref.current) return

    ref.current.position.x = pointer.x * (viewport.width / 2)
    ref.current.position.y = pointer.y * (viewport.height / 2)
    ref.current.position.z = Z_POSITION

    ref.current.rotation.y = Math.sin(clock.getElapsedTime())
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1)

    // Update distortion via ref — no re-render triggered
    const distanceFromCenter = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y)
    const normalizedDistance = Math.min(distanceFromCenter / Math.sqrt(2), 1)
    distortionRef.current = MIN_DISTORTION + normalizedDistance * (MAX_DISTORTION - MIN_DISTORTION)
  })

  return (
    <animated.mesh
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      ref={ref}
      scale={scale as unknown as [number, number, number]}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.01} distort={distortionRef.current} color={'hotpink'} />
    </animated.mesh>
  )
}
