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
      onPointerDown={(e) => e.eventObject.scale.set(1.5, 1.5, 1.5)}
      onPointerUp={(e) => e.eventObject.scale.set(1, 1, 1)}
      ref={ref}
      position={[0, 0, 10]}
      {...props}>
      <sphereBufferGeometry args={[50, 50, 50]} />
      <MeshWobbleMaterial color={'#1fb2f5'} />
    </mesh>
  )
}
