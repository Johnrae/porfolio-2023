import dynamic from 'next/dynamic'
import Scene from '@/components/canvas/Scene'

const Blob = dynamic(() => import('@/components/canvas/Blob'), { ssr: false })

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Synth = dynamic(() => import('@/components/dom/Synth'), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='fixed top-0 left-0 z-0 w-screen h-screen'>
        <div className='flex flex-col items-center justify-center w-screen'>
          <h1 className='text-lg select-none'>It&apos;s a website</h1>
        </div>
      </div>
      <div className={'w-screen h-screen fixed z-10 top-0 left-0'}>
        <Synth />
        <Scene>
          <Blob />
        </Scene>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
