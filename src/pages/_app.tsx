import { useRef } from 'react'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import Header from '@/config'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function App({ Component, pageProps = { title: 'index' } }: AppProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      <Header title={pageProps.title} />
      <Layout ref={ref}>
        <Component {...pageProps} />
        {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
         * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
         * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
        {(Component as unknown as { canvas?: (props: unknown) => React.ReactNode })?.canvas && (
          <Scene className='pointer-events-none' eventSource={ref as React.RefObject<HTMLElement>} eventPrefix='client'>
            {(Component as unknown as { canvas: (props: unknown) => React.ReactNode }).canvas(pageProps)}
          </Scene>
        )}
      </Layout>
    </>
  )
}
