import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, Preload } from '@react-three/drei'

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}>
      {/* @ts-ignore */}
      <OrthographicCamera makeDefault near={0.01} far={200} position={[0, 0, 110]} />

      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      {children}
      <Preload all />
    </Canvas>
  )
}
