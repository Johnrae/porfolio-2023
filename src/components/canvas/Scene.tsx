import { ReactNode } from 'react'
import { Canvas, CanvasProps } from '@react-three/fiber'
import { Preload } from '@react-three/drei'

interface SceneProps extends Partial<CanvasProps> {
  children?: ReactNode
}

export default function Scene({ children, ...props }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 100 }} {...props}>
      <directionalLight position={[1.2, 1, 1]} intensity={0.5} color='#FFF1BF' />
      <directionalLight position={[-1.2, 1, 1]} intensity={0.5} color='#FFF1BF' />
      <rectAreaLight width={9} height={9} intensity={2} color='#FFF1BF' position={[0, 0, 5]} rotation={[6, 0, 0]} />

      <ambientLight intensity={0.1} />
      {children}
      <Preload all />
    </Canvas>
  )
}
