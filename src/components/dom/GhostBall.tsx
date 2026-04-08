import { useEffect, useRef } from 'react'

// Match the Blob's projected screen size: sphere radius=1, camera z=5, fov=75
const FOV_RAD = (75 * Math.PI) / 180
const CAMERA_DIST = 5

const computeRadius = () => window.innerHeight / 2 / Math.tan(FOV_RAD / 2) / CAMERA_DIST

const TRAIL_LENGTH = 12
const TRAIL_INTERVAL_MS = 30

// Ball spring
const SPRING_STIFFNESS = 80
const SPRING_DAMPING = 16

// Eye spring — looser so eyes lag behind nicely
const EYE_STIFFNESS = 60
const EYE_DAMPING = 12

// Eye geometry as fractions of ball radius
const EYE_RADIUS_FRAC = 0.04 // dot size
const EYE_OFFSET_X_FRAC = 0.36 // lateral separation from centre
const EYE_ORBIT_FRAC = 0.4 // max distance eye centre can travel from its rest position
const EYE_REST_Y_FRAC = -0.35 // rest Y offset (slightly above centre)

interface GhostBallProps {
  x: number
  y: number
  ballPosRef?: React.MutableRefObject<{ x: number; y: number }>
}

export default function GhostBall({ x, y, ballPosRef }: GhostBallProps) {
  const targetRef = useRef({ x, y })
  const ballRef = useRef({ x: -999, y: -999, vx: 0, vy: 0 })
  const radiusRef = useRef(28) // initialised properly on mount

  // Per-eye spring state: position + velocity, relative to ball centre
  const eyeRef = useRef([
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
  ])

  const mainBallElRef = useRef<HTMLDivElement>(null)
  const eye0Ref = useRef<HTMLDivElement>(null)
  const eye1Ref = useRef<HTMLDivElement>(null)
  const trailCanvasRef = useRef<HTMLCanvasElement>(null)
  const trailPointsRef = useRef<Array<{ x: number; y: number }>>([])
  const lastTrailTimeRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const hasEnteredRef = useRef(false)

  targetRef.current = { x, y }

  useEffect(() => {
    // Set initial radius and keep it synced on resize
    const onResize = () => {
      radiusRef.current = computeRadius()
      // Resize canvas to match viewport
      const canvas = trailCanvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    onResize()
    window.addEventListener('resize', onResize)

    function tick(now: number) {
      rafRef.current = requestAnimationFrame(tick)

      const target = targetRef.current
      const ball = ballRef.current
      const r = radiusRef.current

      if (target.x < 0) return

      if (!hasEnteredRef.current) {
        ball.x = target.x
        ball.y = target.y
        ball.vx = 0
        ball.vy = 0
        hasEnteredRef.current = true
      }

      const lastTime = lastFrameTimeRef.current ?? now
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastFrameTimeRef.current = now

      // --- Ball spring ---
      const ax = (target.x - ball.x) * SPRING_STIFFNESS - ball.vx * SPRING_DAMPING
      const ay = (target.y - ball.y) * SPRING_STIFFNESS - ball.vy * SPRING_DAMPING
      ball.vx += ax * dt
      ball.vy += ay * dt
      ball.x += ball.vx * dt
      ball.y += ball.vy * dt

      if (ballPosRef) ballPosRef.current = { x: ball.x, y: ball.y }

      // --- Eye springs ---
      // Target for each eye: direction from ball toward cursor, scaled to orbit radius,
      // then offset laterally for left/right eye
      const orbitR = r * EYE_ORBIT_FRAC
      const dx = target.x - ball.x
      const dy = target.y - ball.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      // Normalised gaze direction, clamped so max reach = orbitR
      const reach = Math.min(dist, orbitR)
      const gx = (dx / dist) * reach
      const gy = (dy / dist) * reach

      const restY = r * EYE_REST_Y_FRAC
      const sepX = r * EYE_OFFSET_X_FRAC

      const eyeTargets = [
        { x: gx - sepX, y: gy + restY },
        { x: gx + sepX, y: gy + restY },
      ]

      const eyeEls = [eye0Ref.current, eye1Ref.current]

      eyeRef.current.forEach((eye, i) => {
        const et = eyeTargets[i]!
        const ex = (et.x - eye.x) * EYE_STIFFNESS - eye.vx * EYE_DAMPING
        const ey = (et.y - eye.y) * EYE_STIFFNESS - eye.vy * EYE_DAMPING
        eye.vx += ex * dt
        eye.vy += ey * dt
        eye.x += eye.vx * dt
        eye.y += eye.vy * dt

        const el = eyeEls[i]
        if (!el) return
        const eyeR = r * EYE_RADIUS_FRAC
        // Position relative to ball centre: ball.x + eye.x, ball.y + eye.y
        el.style.width = `${eyeR * 2}px`
        el.style.height = `${eyeR * 2}px`
        el.style.transform = `translate(${ball.x + eye.x - eyeR}px, ${ball.y + eye.y - eyeR}px)`
      })

      // --- Main ball ---
      if (mainBallElRef.current) {
        mainBallElRef.current.style.width = `${r * 2}px`
        mainBallElRef.current.style.height = `${r * 2}px`
        mainBallElRef.current.style.transform = `translate(${ball.x - r}px, ${ball.y - r}px)`
      }

      // --- Trail ---
      if (now - lastTrailTimeRef.current >= TRAIL_INTERVAL_MS) {
        lastTrailTimeRef.current = now
        trailPointsRef.current = [{ x: ball.x, y: ball.y }, ...trailPointsRef.current.slice(0, TRAIL_LENGTH - 1)]
      }

      const canvas = trailCanvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw trail circles (white border, black fill) behind the ball
          ctx.globalCompositeOperation = 'source-over'
          trailPointsRef.current.forEach((point, i) => {
            // skip index 0 — that's where the ball currently sits
            if (i === 0) return
            const opacity = (1 - i / TRAIL_LENGTH) * 0.55
            const scale = 1 - i * 0.04
            const tr = r * scale
            const borderW = Math.max(2, r * 0.04)
            ctx.beginPath()
            ctx.arc(point.x, point.y, tr, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(256,256,256,${opacity})`
            ctx.fill()
            ctx.lineWidth = borderW
            // TODO: use tailwind color zinc-400
            ctx.strokeStyle = `rgba(159,159,169,${opacity})`
            ctx.stroke()
          })

          // Erase the area occupied by the main ball so it never shows through
          ctx.globalCompositeOperation = 'destination-out'
          ctx.beginPath()
          ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0,0,0,1)'
          ctx.fill()
          ctx.globalCompositeOperation = 'source-over'
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [ballPosRef])

  return (
    <>
      {/* Trail — drawn onto a canvas to avoid compositor border-radius issues */}
      <canvas ref={trailCanvasRef} className='fixed inset-0 pointer-events-none z-20' />
      {/* Main ball */}
      <div
        ref={mainBallElRef}
        className='fixed pointer-events-none z-20 rounded-full bg-white'
        style={{
          top: 0,
          left: 0,
          transform: 'translate(-9999px, -9999px)',
          border: '3px solid #9f9fa9', // TODO: use tailwind color zinc-400
          willChange: 'transform, width, height',
        }}
      />
      {/* Eyes */}
      <div
        ref={eye0Ref}
        className='fixed pointer-events-none z-20 rounded-full bg-zinc-400'
        style={{ top: 0, left: 0, transform: 'translate(-9999px, -9999px)', willChange: 'transform, width, height' }}
      />
      <div
        ref={eye1Ref}
        className='fixed pointer-events-none z-20 rounded-full bg-zinc-400'
        style={{ top: 0, left: 0, transform: 'translate(-9999px, -9999px)', willChange: 'transform, width, height' }}
      />
    </>
  )
}

// Export a getter so consumers can read the current runtime radius.
// For the obstacle size used in text layout, we expose the raw compute fn.
export const getBallRadius = computeRadius
// Keep a static fallback for SSR / initial render where window is unavailable
export const BALL_RADIUS_FALLBACK = 100
