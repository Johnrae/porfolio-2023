import { useMemo } from 'react'
import { PlaneGeometry } from 'three'

const WIDTH = 50
const HEIGHT = 50
const SEGMENTS = 48
const CURVE_DEPTH = 1.8
const Z_POSITION = -2

export default function Backdrop() {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(WIDTH, HEIGHT, SEGMENTS, SEGMENTS)
    const pos = geo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / (WIDTH / 2)
      const y = pos.getY(i) / (HEIGHT / 2)
      const curve = (x * x + y * y) * CURVE_DEPTH
      pos.setZ(i, -curve)
    }

    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} position={[0, 0, Z_POSITION]}>
      <meshStandardMaterial color='#324444' roughness={1} />
    </mesh>
  )
}
