import { useRef, useState } from 'react'
import { MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Mesh } from 'three'

interface BlobProps {
  [key: string]: any
}

export default function Blob(props: BlobProps) {
  // Properly type the ref as a Mesh
  const ref = useRef<Mesh>(null)
  const [distortion, setDistortion] = useState(0.5)
  const [active, setActive] = useState(false)

  // Constants for better control - adjusted for visual size
  const BASE_SCALE = 100 // Base scale
  const EXPANDED_SCALE = 150 // Slightly larger expanded scale
  const Z_POSITION = -500 // Position much further back to avoid clipping
  const MIN_DISTORTION = 0.2 // Minimum distortion at center
  const MAX_DISTORTION = 1.0 // Maximum distortion at edges

  // Spring config only for scale changes
  const springConfig = { mass: 1, tension: 170, friction: 26 }

  // Create spring for scale only
  const { scale } = useSpring({
    scale: active ? [EXPANDED_SCALE, EXPANDED_SCALE, EXPANDED_SCALE] : [BASE_SCALE, BASE_SCALE, BASE_SCALE],
    config: springConfig,
  })

  useFrame(({ pointer, viewport, clock }) => {
    // Safe check with early return if ref.current is null
    if (!ref.current) return

    // Calculate position based on pointer (direct positioning, no spring)
    const positionX = pointer.x * (viewport.width / 2)
    const positionY = pointer.y * (viewport.height / 2)

    // Directly set the position - now properly typed
    ref.current.position.x = positionX
    ref.current.position.y = positionY
    ref.current.position.z = Z_POSITION

    // Handle rotation separately - now properly typed
    ref.current.rotation.y = Math.sin(clock.getElapsedTime())
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1)

    // Calculate distance from center (0,0) to current pointer position
    const distanceFromCenter = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y)
    const normalizedDistance = Math.min(distanceFromCenter / Math.sqrt(2), 1)
    const newDistortion = MIN_DISTORTION + normalizedDistance * (MAX_DISTORTION - MIN_DISTORTION)
    setDistortion(newDistortion)
  })

  return (
    <animated.mesh
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      ref={ref}
      scale={scale}
      {...props}>
      <sphereBufferGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.01} distortionScale={20} distort={distortion} color={'hotpink'} />
    </animated.mesh>
  )
}
