import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/synth', label: 'Synth' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const { pathname } = useRouter()

  return (
    <nav className='fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5'>
      <ul className='flex mx-auto items-center gap-8 mix-w-min p-4 border border-zinc-600 bg-black rounded-lg'>
        <span className='font-mono text-xs text-zinc-500 tracking-widest uppercase'>John Rae</span>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={[
                'font-mono text-xs tracking-widest uppercase transition-colors',
                pathname === href ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300',
              ].join(' ')}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
