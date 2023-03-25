import { useState } from 'react'

export function useMouseState() {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true)
  }

  const onMouseUp = (event: React.MouseEvent) => {
    setIsMouseDown(false)
  }

  return { isMouseDown, onMouseDown, onMouseUp }
}
