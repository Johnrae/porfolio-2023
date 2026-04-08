import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_LINKS = [
  { href: '/', label: 'home' },
  { href: '/synth', label: 'synth' },
  { href: '/resume', label: 'resume' },
]

export default function Nav() {
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey) return
      const index = parseInt(e.key, 10)
      if (index >= 0 && index < NAV_LINKS.length) {
        e.preventDefault()
        router.push(NAV_LINKS[index].href)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <nav className='fixed bottom-10 left-0 right-0 z-30 bg-[#3dff23] flex items-center justify-center px-12 py-2 font-mono text-xs text-black tracking-wider'>
      <ul className='flex items-center gap-8'>
        {NAV_LINKS.map(({ href, label }, i) => (
          <li key={href}>
            <Link
              href={href}
              className={[
                'transition-opacity',
                pathname === href ? 'opacity-100' : 'opacity-50 hover:opacity-100',
              ].join(' ')}>
              [{i}] {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
