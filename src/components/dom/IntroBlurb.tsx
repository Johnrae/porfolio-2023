import { useEffect, useRef, useState, useCallback } from 'react'
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'
import type { PreparedTextWithSegments, LayoutCursor } from '@chenglou/pretext'
import { getBallRadius } from '@/components/dom/GhostBall'

const BLURB = `
  Hey, I'm John. I've spent the last ten years building React applications, leading frontend teams, 
  and occasionally convincing designers I'm one of them. When I'm not writing code I'm building 
  tube amplifiers, guitar pedals, and recording equipment from scratch.
`

const HINT = 'click anywhere to start the synth'

const FONT_SIZE = 18
const LINE_HEIGHT = 30
const FONT = `${FONT_SIZE}px 'Space Mono', ui-monospace, SFMono-Regular, Menlo, monospace`
const BALL_PADDING = 12
const MIN_SLOT_WIDTH = 40

interface IntroBlurbProps {
  ballPosRef: React.MutableRefObject<{ x: number; y: number }>
  containerRef: React.RefObject<HTMLDivElement | null>
}

interface RenderedLine {
  text: string
  x: number
  y: number
}

// Returns the horizontal interval the circle blocks for a given line band, or null if no overlap.
const circleInterval = (
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
): { left: number; right: number } | null => {
  if (bandTop - vPad >= cy + r || bandBottom + vPad <= cy - r) return null
  const clampedCy = Math.max(bandTop - vPad, Math.min(cy, bandBottom + vPad))
  const dy = Math.abs(cy - clampedCy)
  if (dy >= r) return null
  const dx = Math.sqrt(r * r - dy * dy)
  return { left: cx - dx - hPad, right: cx + dx + hPad }
}

// Carves a blocked interval out of a base interval, returning remaining viable slots.
const carveSlots = (
  base: { left: number; right: number },
  blocked: { left: number; right: number } | null,
): Array<{ left: number; right: number }> => {
  if (!blocked) return [base]
  const slots: Array<{ left: number; right: number }> = []
  if (blocked.left > base.left) slots.push({ left: base.left, right: Math.min(blocked.left, base.right) })
  if (blocked.right < base.right) slots.push({ left: Math.max(blocked.right, base.left), right: base.right })
  return slots.filter((s) => s.right - s.left >= MIN_SLOT_WIDTH)
}

export default function IntroBlurb({ ballPosRef, containerRef }: IntroBlurbProps) {
  const preparedRef = useRef<PreparedTextWithSegments | null>(null)
  const [lines, setLines] = useState<RenderedLine[]>([])
  const rafRef = useRef<number | null>(null)
  const lastBallXRef = useRef(-999)
  const lastBallYRef = useRef(-999)

  // Prepare text once on mount
  useEffect(() => {
    preparedRef.current = prepareWithSegments(BLURB, FONT)
  }, [])

  const reflow = useCallback(
    (ballX: number, ballY: number) => {
      if (!preparedRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const maxWidth = Math.min(560, rect.width - 80)
      const startX = rect.left + (rect.width - maxWidth) / 2
      const startY = rect.top + rect.height * 0.35
      const obstacleR = getBallRadius() + BALL_PADDING

      const result: RenderedLine[] = []
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
      let y = startY

      while (true) {
        const lineTop = y - LINE_HEIGHT * 0.8
        const lineBottom = y + LINE_HEIGHT * 0.2

        // Compute which horizontal interval the ball blocks for this line band
        const blocked = circleInterval(ballX, ballY, obstacleR, lineTop, lineBottom, 4, 4)

        // Carve it out to get the slots text can occupy on this line
        const base = { left: startX, right: startX + maxWidth }
        const slots = carveSlots(base, blocked)

        if (slots.length === 0) {
          // Entire line is blocked — skip without consuming text
          y += LINE_HEIGHT
          if (y > rect.bottom + LINE_HEIGHT) break
          continue
        }

        // Flow text into each available slot on this line, left to right
        let anyFit = false
        for (const slot of slots) {
          const slotWidth = slot.right - slot.left
          const line = layoutNextLine(preparedRef.current, cursor, slotWidth)
          if (line === null) break
          result.push({ text: line.text, x: slot.left, y })
          cursor = line.end
          anyFit = true
        }

        if (!anyFit) break

        y += LINE_HEIGHT
        if (y > rect.bottom + LINE_HEIGHT) break
      }

      setLines(result)
    },
    [containerRef],
  )

  // Drive reflow from a rAF loop reading the ball's smoothed physics position
  useEffect(() => {
    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      const { x, y } = ballPosRef.current
      if (x === lastBallXRef.current && y === lastBallYRef.current) return
      lastBallXRef.current = x
      lastBallYRef.current = y
      reflow(x, y)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [ballPosRef, reflow])

  // Also reflow on container resize
  useEffect(() => {
    const observer = new ResizeObserver(() => reflow(lastBallXRef.current, lastBallYRef.current))
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef, reflow])

  return (
    <div className='fixed inset-0 pointer-events-none z-20 select-none' aria-label={BLURB}>
      {lines.map((line, i) => (
        <span
          key={i}
          className='absolute font-mono text-black whitespace-pre'
          style={{
            left: line.x,
            top: line.y - FONT_SIZE,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
          }}>
          {line.text}
        </span>
      ))}
      <span className='absolute font-mono text-zinc-400 tracking-widest uppercase top-50 left-1/2 -translate-1/2'>
        {HINT}
      </span>
    </div>
  )
}
