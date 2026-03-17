import { useState } from 'react'

export function useMouseState() {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseDown = () => {
    setIsMouseDown(true)
  }

  const onMouseUp = () => {
    setIsMouseDown(false)
  }

  return { isMouseDown, onMouseDown, onMouseUp }
}
