import Nav from '@/components/dom/Nav'

export default function BlogPage() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-300'>
      <main className='max-w-2xl mx-auto px-8 pt-32 pb-24'>
        <h1 className='font-mono text-3xl text-zinc-100 mb-4'>Blog</h1>
        <p className='font-mono text-xs text-zinc-600 tracking-widest uppercase'>Coming soon</p>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Blog — John Rae' } }
}
