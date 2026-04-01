import Nav from '@/components/dom/Nav'

interface TimelineEntry {
  period: string
  role: string
  company: string
  description: string
}

const TIMELINE: TimelineEntry[] = [
  {
    period: 'Present',
    role: 'Lead Engineer',
    company: 'Prolegis',
    description:
      'Functioning as lead engineer and de facto designer. Responsible for frontend architecture, design systems, and fullstack feature development.',
  },
  {
    period: '—',
    role: 'Senior Frontend Engineer / Lead',
    company: 'Previous roles',
    description:
      'Ten years of leading frontend teams across corporate environments. Running standups, planning projects, mentoring engineers, and writing production code every day.',
  },
  {
    period: '2015',
    role: 'Student',
    company: 'The Iron Yard',
    description: 'Intensive coding bootcamp where it all started. Pivoted into software from a background in business.',
  },
]

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js / React Three Fiber', 'Web Audio API'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Ruby on Rails', 'REST APIs', 'PostgreSQL'],
  },
  {
    category: 'Tooling & Process',
    items: ['Git', 'CI/CD', 'Agile / Scrum', 'Figma', 'Design systems'],
  },
]

const WORKSHOP_ITEMS = [
  {
    name: '1176 Compressor Clone',
    description: 'Hand-wired FET-based limiting amplifier. One of the most cloned studio compressors ever made.',
  },
  {
    name: 'Large Diaphragm Condenser Microphone',
    description: 'Built a LDC mic from a capsule kit, custom PCB, and tube power supply. It records.',
  },
  {
    name: 'Tube Amplifier Builds',
    description: 'Point-to-point wired guitar amplifiers. Transformers, output stages, bias, the whole thing.',
  },
  {
    name: 'Music Production',
    description:
      "Writing, recording, and mixing original music. The hardware exists because the software wasn't enough.",
  },
]

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-300 overflow-y-auto'>
      <main className='max-w-2xl mx-auto px-8 pt-32 pb-24'>
        {/* Hero */}
        <section className='mb-20'>
          <h1 className='font-mono text-3xl text-zinc-100 mb-4'>John Rae</h1>
          <p className='font-mono text-sm text-zinc-500 tracking-widest uppercase mb-8'>Lead Engineer · Atlanta, GA</p>
          <p className='text-zinc-400 leading-relaxed'>
            Ten years building React applications and leading frontend teams in corporate environments. I wear a lot of
            hats — engineering lead, occasional designer, project planner, IC — and I go deep on technical skills while
            staying rooted in what actually matters: shipping things that work for users and move the needle for the
            business.
          </p>
        </section>

        {/* Philosophy */}
        <section className='mb-20'>
          <h2 className='font-mono text-xs text-zinc-600 tracking-widest uppercase mb-8'>How I work</h2>
          <div className='space-y-6'>
            <div>
              <h3 className='font-mono text-sm text-zinc-200 mb-2'>Business-first thinking</h3>
              <p className='text-zinc-500 text-sm leading-relaxed'>
                I prioritize features that move the needle. Not everything is worth building, and knowing the difference
                is a skill. I think about users and business goals before I think about implementation.
              </p>
            </div>
            <div>
              <h3 className='font-mono text-sm text-zinc-200 mb-2'>Many hats, deep roots</h3>
              <p className='text-zinc-500 text-sm leading-relaxed'>
                I can run a standup, review a design, write a PR, and debug a production issue in the same day. My most
                recent role had me acting as both lead engineer and de facto designer. I'm comfortable in that space.
              </p>
            </div>
            <div>
              <h3 className='font-mono text-sm text-zinc-200 mb-2'>Technical depth</h3>
              <p className='text-zinc-500 text-sm leading-relaxed'>
                I go deep. React internals, browser rendering, audio synthesis, 3D graphics, analog electronics — when
                something interests me I don't stop at the surface. That curiosity shows up in how I solve problems at
                work.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className='mb-20'>
          <h2 className='font-mono text-xs text-zinc-600 tracking-widest uppercase mb-8'>Career</h2>
          <div className='space-y-10'>
            {TIMELINE.map((entry, i) => (
              <div key={i} className='grid grid-cols-[80px_1fr] gap-6'>
                <span className='font-mono text-xs text-zinc-600 pt-1'>{entry.period}</span>
                <div>
                  <p className='font-mono text-sm text-zinc-100 mb-1'>{entry.role}</p>
                  <p className='font-mono text-xs text-zinc-600 mb-3 tracking-wide'>{entry.company}</p>
                  <p className='text-zinc-500 text-sm leading-relaxed'>{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className='mb-20'>
          <h2 className='font-mono text-xs text-zinc-600 tracking-widest uppercase mb-8'>Skills</h2>
          <div className='space-y-8'>
            {SKILLS.map((group) => (
              <div key={group.category}>
                <h3 className='font-mono text-xs text-zinc-500 tracking-widest uppercase mb-3'>{group.category}</h3>
                <div className='flex flex-wrap gap-2'>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className='font-mono text-xs text-zinc-400 border border-zinc-800 rounded px-3 py-1.5'>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workshop */}
        <section className='mb-20'>
          <h2 className='font-mono text-xs text-zinc-600 tracking-widest uppercase mb-2'>The Workshop</h2>
          <p className='text-zinc-600 text-sm mb-8 leading-relaxed'>
            Software wasn't deep enough. So I started building hardware.
          </p>
          <div className='space-y-8'>
            {WORKSHOP_ITEMS.map((item) => (
              <div key={item.name} className='border-l border-zinc-800 pl-6'>
                <h3 className='font-mono text-sm text-zinc-200 mb-2'>{item.name}</h3>
                <p className='text-zinc-500 text-sm leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { title: 'About — John Rae' } }
}
