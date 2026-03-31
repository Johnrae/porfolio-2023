import { useEffect, useState } from 'react'

interface QuadrantHintProps {
  label: string
  sub: string
  position: 'tl' | 'tr' | 'bl' | 'br'
}

function QuadrantHint({ label, sub, position }: QuadrantHintProps) {
  const corner =
    position === 'tl'
      ? 'top-0 left-0 items-start text-left'
      : position === 'tr'
        ? 'top-0 right-0 items-end text-right'
        : position === 'bl'
          ? 'bottom-0 left-0 items-start text-left'
          : 'bottom-0 right-0 items-end text-right'

  return (
    <div className={`absolute flex flex-col gap-1 p-6 ${corner}`}>
      <span className='text-xs font-mono text-zinc-400 leading-none'>{label}</span>
      <span className='text-[10px] font-mono text-zinc-600 leading-none'>{sub}</span>
    </div>
  )
}

// Dash pattern controls
const DASH = 8 // dash length in px
const GAP = 16 // gap length in px
const CENTER_GAP = 8 // half-size of the open + gap at center in px
const STROKE_COLOR = '#BEFF26'

const dasharray = `${DASH} ${GAP}`
const period = DASH + GAP

// Given a line of total length L, compute the strokeDashoffset so that a gap
// is centered at L/2. The gap spans [L/2 - CENTER_GAP, L/2 + CENTER_GAP].
// We want the gap to start at L/2 - CENTER_GAP. Within the repeating pattern,
// a gap starts at every (n * period + DASH) position. So we solve:
//   (DASH - offset) mod period === L/2 - CENTER_GAP
//   offset = DASH - ((L/2 - CENTER_GAP) mod period)
function centerOffset(length: number) {
  const gapStart = length / 2 - CENTER_GAP
  return DASH - (((gapStart % period) + period) % period)
}

export default function QuadrantOverlay() {
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const hOffset = centerOffset(size.w)
  const vOffset = centerOffset(size.h)

  return (
    <div className='fixed inset-0 pointer-events-none z-20'>
      <svg className='absolute inset-0 w-full h-full'>
        {/* horizontal midline */}
        <line
          x1='0'
          y1='50%'
          x2='100%'
          y2='50%'
          stroke={STROKE_COLOR}
          strokeWidth={1}
          strokeDasharray={dasharray}
          strokeDashoffset={hOffset}
        />
        {/* vertical midline */}
        <line
          x1='50%'
          y1='0'
          x2='50%'
          y2='100%'
          stroke={STROKE_COLOR}
          strokeWidth={1}
          strokeDasharray={dasharray}
          strokeDashoffset={vOffset}
        />
      </svg>
      <QuadrantHint position='tl' label='chorus' sub='warm doubling' />
      <QuadrantHint position='tr' label='delay' sub='echo' />
      <QuadrantHint position='bl' label='bitcrush' sub='lo-fi' />
      <QuadrantHint position='br' label='tremolo' sub='pulse' />
    </div>
  )
}
