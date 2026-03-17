import { ReactNode } from 'react'
import { Canvas, CanvasProps } from '@react-three/fiber'
import { OrthographicCamera, Preload } from '@react-three/drei'

interface SceneProps extends Partial<CanvasProps> {
  children?: ReactNode
}

export default function Scene({ children, ...props }: SceneProps) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      <OrthographicCamera makeDefault near={1} far={1000} position={[0, 0, 5]} zoom={0.5} />

      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      {children}
      <Preload all />
    </Canvas>
  )
}
