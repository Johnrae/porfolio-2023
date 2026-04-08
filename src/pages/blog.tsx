import Nav from '@/components/dom/Nav'

export default function BlogPage() {
  return (
    <div className='min-h-screen bg-white text-black font-mono pb-12'>
      <Nav />
      <main className='max-w-4xl mx-auto px-8 pt-32'>
        <div className='bg-[#f3f3f4] flex items-baseline gap-6 px-6 py-3 mb-6'>
          <span className='text-xs tracking-[0.25em] uppercase'>SECTION:</span>
          <span className='text-2xl'>Blog</span>
        </div>
        <div className='pl-10 flex flex-col gap-3'>
          <p className='text-sm leading-relaxed'>Coming soon.</p>
          <p className='text-xs text-zinc-400 tracking-widest uppercase'>No posts yet</p>
        </div>
      </main>
      <footer className='fixed bottom-0 left-0 right-0 bg-[#3dff23] flex items-center justify-between px-12 py-2 text-black text-xs tracking-wider'>
        <span>[0] I write react code</span>
        <span>[1] github.com/johnrae</span>
        <span>[2] 678-315-5015</span>
        <span>[3] john.rae23@gmail.com</span>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Blog — John Rae' } }
}
