import { useEffect, useRef, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const latestRef = useRef<MousePosition>({ x: -999, y: -999 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      latestRef.current = { x: e.clientX, y: e.clientY }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ ...latestRef.current })
        rafRef.current = null
      })
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return position
}
