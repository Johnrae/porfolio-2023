import { useRef, ReactNode, Ref } from 'react'
import { mergeRefs } from 'react-merge-refs'

interface LayoutProps {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  [key: string]: unknown
}

export default function Layout({ children, ref: forwardedRef, ...props }: LayoutProps) {
  const localRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={mergeRefs([forwardedRef ?? null, localRef])}
      className='absolute top-0 left-0 z-10 w-screen h-screen overflow-hidden dom bg-zinc-900 text-gray-50'>
      {children}
    </div>
  )
}
