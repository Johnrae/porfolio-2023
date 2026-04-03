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
    const scheduleUpdate = (x: number, y: number) => {
      latestRef.current = { x, y }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ ...latestRef.current })
        rafRef.current = null
      })
    }

    const handleMove = (e: MouseEvent) => scheduleUpdate(e.clientX, e.clientY)

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      scheduleUpdate(touch.clientX, touch.clientY)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchstart', handleTouch, { passive: true })
    window.addEventListener('touchmove', handleTouch, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('touchmove', handleTouch)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return position
}
