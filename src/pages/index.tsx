import dynamic from 'next/dynamic'
import Instructions from '@/components/dom/Instructions'
import { useAudio } from '@/hooks/useAudio'
import { useEffect, useLayoutEffect } from 'react'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('@/components/canvas/Logo'), { ssr: false })
const Synth = dynamic(() => import('@/components/dom/Synth'), { ssr: false })

// Dom components go here
export default function Page(props) {
  return (
    <div className='flex flex-col w-screen justify-center items-center'>
      <h1 className='text-lg select-none'>Its a website</h1>
      <h1 className='text-2xl select-none'>built by John Rae</h1>
      <Synth />
    </div>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
// Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={0} />

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
