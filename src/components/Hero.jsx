import { lazy, Suspense, useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const HeroScene = lazy(() => import('./HeroScene'))

// ── Animated counter — counts from 0 → target when scrolled into view ─────────

function AnimatedCounter({ to, suffix = '', delay = 0 }) {
  const [val, setVal] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    let startTime = null
    let rafId
    const timer = setTimeout(() => {
      const tick = (t) => {
        if (!startTime) startTime = t
        const progress = Math.min((t - startTime) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setVal(Math.round(eased * to))
        if (progress < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId) }
  }, [inView, to, delay])

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  )
}

// ── Stats data — numeric entries use AnimatedCounter ──────────────────────────

const STATS = [
  { num: 3,    suffix: '+',  label: 'Systems Shipped'     },
  { num: 2,    suffix: '',   label: 'Engineering Domains'  },
  { text: 'F→F',             label: 'Firmware to Frontend' },
  { num: 100,  suffix: '%',  label: 'Auth-First Design'    },
]

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2 6.5h9M7.5 2.5l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const up = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-start pt-14 overflow-hidden">

      {/* Dot-grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0    h-40 bg-gradient-to-b  from-canvas to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t  from-canvas to-transparent" />
        <div className="absolute inset-y-0 left-0   w-28 bg-gradient-to-r  from-canvas to-transparent" />
        <div className="absolute inset-y-0 right-0  w-28 bg-gradient-to-l  from-canvas to-transparent" />
      </div>

      {/* Left emerald ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-160px', left: '-80px',
          width: '560px', height: '560px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.055) 0%, transparent 68%)',
        }}
      />

      {/* Right depth glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', right: '-120px',
          width: '640px', height: '640px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, rgba(16,185,129,0.025) 45%, transparent 70%)',
        }}
      />

      {/* Three.js scene — desktop only, lazy-loaded */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-28 w-full">

        {/* Role chip */}
        <motion.div className="mb-8" {...up(0)}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-fence bg-surface text-xs text-muted font-mono tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            Web Developer &amp; IoT Systems Engineer
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-semibold tracking-tighter text-ink leading-[1.07] mb-6 max-w-[18ch] text-balance"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.75rem)' }}
          {...up(0.1)}
        >
          Building End-to-End
          <br />
          Web Applications &amp;{' '}
          <span className="text-muted">Intelligent IoT Solutions.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-base md:text-[1.0625rem] text-muted leading-relaxed mb-10 max-w-[44ch]"
          {...up(0.2)}
        >
          I engineer comprehensive digital solutions—from designing intuitive,
          admin-focused monitoring dashboards to architecting secure Node.js APIs
          and bridging web platforms with hardware ecosystems.
        </motion.p>

        {/* CTA buttons */}
        <motion.div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-16" {...up(0.3)}>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-ink text-canvas text-sm font-medium hover:bg-white transition-colors"
          >
            View Case Studies
          </a>
          <a
            href="https://drive.google.com/file/d/19cWORvbj6cNXSzwqY2yznfVubL8bOt0Q/view?usp=sharing"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-fence-active text-muted text-sm font-medium hover:text-ink hover:border-faint transition-colors"
          >
            System Documentation
            <ArrowRight />
          </a>
        </motion.div>

        {/* Stat bar — stagger in, then counter animates */}
        <div className="grid grid-cols-2 gap-y-6 md:flex md:flex-wrap md:items-center md:divide-x md:divide-fence pt-8 border-t border-fence">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="md:px-6 md:first:pl-0 md:last:pr-0"
              {...up(0.4 + i * 0.07)}
            >
              <div className="text-xl font-semibold text-ink font-mono tracking-tight">
                {s.num != null
                  ? <AnimatedCounter to={s.num} suffix={s.suffix} delay={0.5 + i * 0.1} />
                  : s.text
                }
              </div>
              <div className="text-[11px] text-dim mt-0.5 tracking-wide uppercase">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
