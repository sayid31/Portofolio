const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/sayid31',
    desc: 'Source code & contributions',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/muhamad-sayid-amannulloh',
    desc: 'Professional history',
  },
  {
    label: 'Email',
    href: 'mailto:muhamadsayidamanulloh@email.com',
    desc: 'Direct line — preferred',
  },
]

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 10l8-8M5 2h5v5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto px-6 py-24 border-t border-fence"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Left — call to action */}
        <div>
          <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
            04 / Reach Out
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight mb-4">
            Let's build something
            <br />
            <span className="text-muted">that actually ships.</span>
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-[40ch]">
            Open to backend engineering roles, IoT consulting, and full-stack
            contracts. I respond to well-scoped briefs within 24 hours.
          </p>

          <div className="mt-8 flex items-center gap-2 px-4 py-3 rounded-lg border border-fence bg-card w-fit">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
              style={{ boxShadow: '0 0 0 2.5px rgba(16,185,129,0.18)' }}
            />
            <span className="text-xs text-accent font-medium">
              Available for new opportunities
            </span>
          </div>
        </div>

        {/* Right — link list */}
        <div className="space-y-2">
          {LINKS.map(({ label, href, desc }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center justify-between px-4 py-4 rounded-xl border border-fence bg-card hover:border-fence-active hover:bg-[#111111] transition-all duration-200"
            >
              <div>
                <div className="text-sm font-medium text-ink">{label}</div>
                <div className="text-xs text-dim mt-0.5">{desc}</div>
              </div>
              <span className="text-faint group-hover:text-muted transition-colors">
                <ExternalIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
