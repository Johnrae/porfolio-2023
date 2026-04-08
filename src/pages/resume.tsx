import Nav from '@/components/dom/Nav'

interface Principle {
  title: string
  description: string
}

interface Experience {
  period: string
  role: string
  company: string
  subtitle: string
  narrative: string
  stack: string[]
}

interface WorkshopItem {
  name: string
  description: string
}

const PRINCIPLES: Principle[] = [
  {
    title: 'Leave it better than you found it',
    description:
      'I live by the campsite rule. A confusing function I come across in a codebase, a user experience that feels clunky, a process that can be smoothed out — I will do my best to improve it. That instinct applies to everything big and small in the world around me.',
  },
  {
    title: "I'm here to help, not manage",
    description:
      "I see leadership as an opportunity to cultivate an environment where people flourish. That means clearing blockers, understanding personal goals so people can work on meaningful projects that grow their skills, and creating clear tickets with solid requirements that take the guesswork out of their day. Leading with the mindset of support rather than oversight creates an environment where people grow quickly and find more satisfaction in their work, resulting in an end product that's greater than the sum of its parts.",
  },
  {
    title: 'Whatever it takes to ship',
    description:
      "I'm just as confident jumping into Figma to retool designs as I am hopping into the backend to write SQL or update controllers. I've worn many hats over the years and at the end of the day, I love to feel like I got something across the finish line, whatever that takes.",
  },
  {
    title: 'Real change happens collectively',
    description:
      'I care deeply about civic engagement and believe that real change only happens when people collectivize and push together. I feel the most rewarded both professionally and personally when I can be helpful to others and make something better. I want to spend my days working on things that make the world a little bit better, every day.',
  },
]

const HOW_I_WORK: Principle[] = [
  {
    title: 'Business-first thinking',
    description:
      'I prioritize features that move the needle. Not everything is worth building, and knowing the difference is a skill. I think about users and business goals before I think about implementation.',
  },
  {
    title: 'Many hats, deep roots',
    description:
      "I can run a standup, review a design, write a PR, and debug a production issue in the same day. My most recent role had me acting as both lead engineer and de facto designer. I'm comfortable in that space.",
  },
  {
    title: 'Technical depth',
    description:
      "I go deep. React internals, browser rendering, audio synthesis, 3D graphics, analog electronics — when something interests me I don't stop at the surface. That curiosity shows up in how I solve problems at work.",
  },
]

const SKILLS: string[] = [
  'React',
  'TypeScript',
  'JavaScript',
  'Next.js',
  'Node.js',
  'Ruby on Rails',
  'Python',
  'React Native',
  'Redux',
  'Zustand',
  'React Query',
  'PostgreSQL',
  'REST APIs',
  'GraphQL',
  'Prismic',
  'Prisma',
  'LLM APIs',
  'AI-Powered Editors',
  'Agentic Workflows',
  'Tiptap',
  'Jest',
  'React Testing Library',
  'RSpec',
  'Cypress',
  'GitHub Actions',
  'Docker',
  'Vercel',
  'Git',
  'Tailwind CSS',
  'Figma',
  'Salesforce',
  'Team Leadership',
  'Mentoring',
  'PRDs',
  'Agile / Scrum',
  'Sprint Planning',
  'Accessibility',
]

const EXPERIENCE: Experience[] = [
  {
    period: 'Jan 2021 – Present',
    role: 'Lead Software Engineer',
    company: 'Prolegis',
    subtitle: 'Congressional Data & Workflow Platform',
    narrative:
      'Led frontend engineering for a govtech platform used daily by legislative staffers across the U.S. House, Senate, and caucuses including the Congressional Progressive Caucus and Democratic Whip Office. Spearheaded the migration from legacy ERB and SCSS to React and Tailwind CSS, significantly improving developer velocity and UI consistency across a large, complex codebase. Architected features end-to-end — from database schemas and Figma wireframes to PRDs, tickets, and implementation — collaborating closely with backend engineers. Established frontend patterns, accessibility standards, and testing conventions that were adopted across the team while mentoring engineers on best practices.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Ruby on Rails', 'PostgreSQL', 'RSpec', 'GitHub Actions', 'Docker'],
  },
  {
    period: 'Jul 2025 – Apr 2026',
    role: 'Senior Software Engineer',
    company: 'Delve Deeper AI',
    subtitle: 'AI Public Affairs Intelligence · Part-Time Contract',
    narrative:
      'Architected an AI-powered document editor for public affairs professionals, building on React, Tiptap, and ProseMirror to create an intelligent, real-time editing experience. Integrated LLM APIs through a Django backend to power context-aware editor components, diving into AI development in a serious way. This role represented a focused foray into the intersection of AI tooling and complex rich-text editing — two domains that demand deep technical understanding of both browser internals and modern AI infrastructure.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Django', 'Tiptap', 'ProseMirror'],
  },
  {
    period: 'Jun 2019 – Jan 2021',
    role: 'Senior Software Engineer',
    company: 'Helium Services',
    subtitle: 'Application Development Agency',
    narrative:
      'Managed a team of four frontend developers and two designers, overseeing delivery and code quality for clients including Deloitte and Emory University. Served on the company leadership team, contributing to engineering priorities and company direction. This role sharpened both technical leadership and people management skills — running standups, planning sprints, mentoring engineers, and writing production code every day while ensuring the team shipped high-quality work on tight agency timelines.',
    stack: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Redux', 'Laravel', 'Cypress', 'Jest'],
  },
  {
    period: 'Jul 2018 – Jun 2019',
    role: 'Senior Software Engineer',
    company: 'Gerent',
    subtitle: 'Salesforce Implementation Partner',
    narrative:
      'Led a full company rebrand from concept to execution — design system, logo, marketing site, and brand materials — demonstrating the ability to span design and engineering in equal measure. Developed custom Salesforce integrations and data flows to streamline internal operations, bridging the gap between business process needs and technical implementation.',
    stack: ['React', 'Figma', 'Webflow', 'Salesforce'],
  },
  {
    period: 'Mar 2016 – Jun 2018',
    role: 'Software Engineer',
    company: 'Polar Notion',
    subtitle: 'Application Development Agency',
    narrative:
      'Built and maintained over 30 full-stack web and mobile applications using Rails, React, and React Native in a fast-paced agency environment. This formative period provided exposure to a wide variety of codebases and technology stacks, building the adaptability and architectural decision-making skills that would define the rest of my career. Mentored junior developers and contributed to project planning, scoping, and sprint coordination across concurrent client engagements.',
    stack: ['React', 'React Native', 'TypeScript', 'Ruby on Rails', 'Node.js'],
  },
  {
    period: '2015',
    role: 'Front End Program',
    company: 'The Iron Yard',
    subtitle: 'Coding Bootcamp · Fall 2015 Cohort',
    narrative:
      'Intensive coding bootcamp where it all started. Pivoted into software engineering and discovered a deep passion for building things on the web. The program provided a rigorous foundation in frontend development and the confidence to dive headfirst into the industry.',
    stack: [],
  },
]

const WORKSHOP_ITEMS: WorkshopItem[] = [
  {
    name: '1176 Compressor Clone',
    description: 'Hand-wired FET-based limiting amplifier. One of the most cloned studio compressors ever made.',
  },
  {
    name: 'Large Diaphragm Condenser Microphone',
    description: 'Built a LDC mic from a capsule kit, custom PCB, and tube power supply.',
  },
  {
    name: 'Tube Amplifier Builds',
    description: 'Point-to-point wired guitar amplifiers. Transformers, output stages, bias, the whole thing.',
  },
  {
    name: 'Guitar Pedals',
    description:
      'Clones of vintage pedals and expensive oddities, mostly done to avoid paying top dollar for simple gear.',
  },
  {
    name: 'Music Production',
    description:
      'Writing, recording, and mixing original music. All the hardware projects were done to support the passion.',
  },
]

function SectionHeader({
  label,
  value,
  rightLabel,
  rightValue,
}: {
  label: string
  value: string
  rightLabel?: string
  rightValue?: string
}) {
  return (
    <div className='bg-[#f3f3f4] flex items-baseline gap-6 px-6 py-3 w-full'>
      <div className='flex items-baseline gap-4 flex-1'>
        <span className='text-sm tracking-[0.18em] uppercase shrink-0'>{label}</span>
        <span className='text-xl'>{value}</span>
      </div>
      {rightLabel && rightValue && (
        <div className='flex items-baseline gap-3'>
          <span className='text-sm tracking-[0.18em] uppercase shrink-0'>{rightLabel}</span>
          <span className='text-xl text-right'>{rightValue}</span>
        </div>
      )}
    </div>
  )
}

export default function ResumePage() {
  return (
    <div className='min-h-screen bg-white text-black font-mono overflow-y-auto'>
      <Nav />
      <main className='max-w-4xl mx-auto px-8 pt-32 pb-24'>
        {/* Summary */}
        <section className='mb-16'>
          <div className='flex flex-col items-center gap-2 mb-8 text-center'>
            <h1 className='text-2xl'>John Rae</h1>
            <p className='text-sm'>Lead / Staff Engineer · Full Stack · Frontend · Atlanta, GA</p>
          </div>
          <p className='text-sm text-zinc-600 leading-relaxed'>
            Senior engineer with 10+ years building complex, production-grade web applications. Proven track record
            leading teams, architecting systems end-to-end, and shipping AI-powered features. Deep expertise in React,
            TypeScript, and Next.js with backend experience in Rails, Django, and Node. Comfortable spanning product,
            design, and engineering to deliver high-impact technology.
          </p>
        </section>

        {/* Principles */}
        <section className='mb-16'>
          <SectionHeader label='SECTION:' value='Principles' />
          <div className='pl-10 mt-4 space-y-6'>
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className=''>
                <h3 className='text-sm font-bold mb-1'>{principle.title}</h3>
                <p className='text-sm text-zinc-600 leading-relaxed'>{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How I work */}
        <section className='mb-16'>
          <SectionHeader label='SECTION:' value='How I Work' />
          <div className='pl-10 mt-4 space-y-6'>
            {HOW_I_WORK.map((item) => (
              <div key={item.title}>
                <h3 className='text-sm font-bold mb-1'>{item.title}</h3>
                <p className='text-sm text-zinc-600 leading-relaxed'>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className='mb-16'>
          <SectionHeader label='SECTION:' value='Skills' />
          <div className='pl-10 mt-4 flex flex-wrap gap-2'>
            {SKILLS.map((skill) => (
              <span key={skill} className='text-xs border border-zinc-300 px-3 py-1.5'>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className='mb-16'>
          <div className='flex flex-col gap-12'>
            {EXPERIENCE.map((entry) => (
              <div key={entry.company} className='flex flex-col gap-4'>
                <SectionHeader label='COMPANY:' value={entry.company} rightLabel='ROLE:' rightValue={entry.role} />
                <div className='pl-10 flex flex-col gap-3 text-sm'>
                  <p className='leading-tight'>{entry.period}</p>
                  <p className='text-xs text-zinc-500 italic'>{entry.subtitle}</p>
                  <p className='text-zinc-600 leading-relaxed'>{entry.narrative}</p>
                  {entry.stack.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                      {entry.stack.map((tech) => (
                        <span key={tech} className='text-[10px] border border-zinc-300 px-2 py-0.5'>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Workshop */}
        <section className='mb-16'>
          <SectionHeader label='SECTION:' value='Electronics Projects' />
          <div className='pl-10 space-y-6 pt-10'>
            {WORKSHOP_ITEMS.map((item) => (
              <div key={item.name} className='border-l-2 border-zinc-300 pl-6'>
                <h3 className='text-sm font-bold mb-1'>{item.name}</h3>
                <p className='text-sm text-zinc-600 leading-relaxed'>{item.description}</p>
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
