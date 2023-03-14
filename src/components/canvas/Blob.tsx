import { useRef, useState } from 'react'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'
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
    <mesh ref={ref} position={[0, 0, 0.01]} {...props}>
      <sphereGeometry args={[100, 100, 100]} />
      <MeshDistortMaterial speed={10} roughness={0} color={'#1fb2f5'} />
    </mesh>
  )
}
