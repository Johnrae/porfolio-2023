import dynamic from 'next/dynamic'
import Instructions from '@/components/dom/Instructions'
import { useAudio } from '@/hooks/useAudio'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('@/components/canvas/Logo'), { ssr: false })

// Dom components go here
export default function Page(props) {
  const { play, isPlaying } = useAudio()
  return (
    <>
      <h1 className='text-lg'>Its a website</h1>
      <h1 className='text-2xl' onClick={play}>
        Built by John Rae
      </h1>
    </>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={0} />

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
