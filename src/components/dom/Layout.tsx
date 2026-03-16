import { useRef, forwardRef, ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'

interface LayoutProps {
  children: ReactNode
  [key: string]: any
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(({ children, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>()
  return (
    <div
      ref={mergeRefs([ref, localRef])}
      className='absolute top-0 left-0 z-10 w-screen h-screen overflow-hidden dom bg-zinc-900 text-gray-50'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
