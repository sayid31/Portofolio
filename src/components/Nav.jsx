import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/90 backdrop-blur-md border-b border-fence'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-ink tracking-tight">
            Sayid_Dev31
          </span>
          <span className="text-faint font-light select-none">/</span>
          <span className="text-xs text-dim font-mono">systems-engineer</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: 'Work',    href: '#work'    },
            { label: 'Stack',   href: '#stack'   },
            { label: 'Contact', href: '#contact' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-muted hover:text-ink transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-fence bg-surface">
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
            style={{ boxShadow: '0 0 0 2.5px rgba(16,185,129,0.18)' }}
          />
          <span className="text-xs text-accent font-medium">Available</span>
        </div>
      </nav>
    </header>
  )
}
