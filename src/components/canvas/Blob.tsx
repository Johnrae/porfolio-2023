import { useEffect, useRef, useState } from 'react'
import { useCursor, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Blob({ ...props }) {
  const ref = useRef()

  useFrame(({ pointer, viewport, clock }) => {
    if (!ref.current) return

    // @ts-ignore
    ref.current.rotation.y = Math.sin(clock.getElapsedTime())
    // @ts-ignore
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1)
    // @ts-ignore
    ref.current.position.x = (pointer.x * viewport.width) / 2
    // @ts-ignore
    ref.current.position.y = (pointer.y * viewport.height) / 2
  })

  return (
    <mesh
      onPointerDown={(e) => e.eventObject.scale.set(100, 100, 100)}
      onPointerUp={(e) => e.eventObject.scale.set(25, 25, 25)}
      ref={ref}
      position={[0, 0, -125]}
      scale={[25, 25, 25]}
      {...props}>
      <sphereBufferGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.01} distortionScale={100} distort={0.5} color={'hotpink'} />
    </mesh>
  )
}
