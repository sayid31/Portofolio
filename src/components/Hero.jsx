const STATS = [
  { value: '3+',       label: 'Systems Shipped'      },
  { value: '2',        label: 'Engineering Domains'  },
  { value: 'F → F',   label: 'Firmware to Frontend' },
  { value: '100%',     label: 'Auth-First Design'    },
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
          top: '-160px',
          left: '-80px',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.055) 0%, transparent 68%)',
        }}
      />

      {/* Right-side depth glow — fills the empty space with subtle warmth */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          right: '-120px',
          width: '640px',
          height: '640px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, rgba(16,185,129,0.025) 45%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-28 w-full">

        {/* Role chip */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-fence bg-surface text-xs text-muted font-mono tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            Web Developer &amp; IoT Systems Engineer
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold tracking-tighter text-ink leading-[1.07] mb-6 max-w-[18ch] text-balance"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.75rem)' }}
        >
          Building End-to-End
          <br />
          Web Applications &amp;{' '}
          <span className="text-muted">
            Intelligent IoT Solutions.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base md:text-[1.0625rem] text-muted leading-relaxed mb-10 max-w-[44ch]">
          I engineer comprehensive digital solutions—from designing intuitive, admin-focused monitoring dashboards to architecting secure Node.js APIs and bridging web platforms with hardware ecosystems.
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-16">
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
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 gap-y-6 md:flex md:flex-wrap md:items-center md:divide-x md:divide-fence pt-8 border-t border-fence">
          {STATS.map((s) => (
            <div key={s.label} className="md:px-6 md:first:pl-0 md:last:pr-0">
              <div className="text-xl font-semibold text-ink font-mono tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] text-dim mt-0.5 tracking-wide uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
