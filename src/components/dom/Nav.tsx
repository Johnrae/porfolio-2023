import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_LINKS = [
  { href: '/', label: 'home' },
  { href: '/synth', label: 'synth' },
  { href: '/resume', label: 'resume' },
]

export default function Nav() {
  const { pathname } = useRouter()

  return (
    <nav className='fixed top-0 left-0 right-0 z-30 flex items-center justify-center px-8 py-5'>
      <ul className='flex items-center gap-8 px-6 py-3 border border-black bg-white'>
        {NAV_LINKS.map(({ href, label }, i) => (
          <li key={href}>
            <Link
              href={href}
              className={[
                'font-mono text-xs tracking-widest transition-colors',
                pathname === href ? 'text-black' : 'text-zinc-400 hover:text-black',
              ].join(' ')}>
              [{i}] {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
