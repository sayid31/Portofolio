import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Work',    href: '#work'    },
    { label: 'Stack',   href: '#stack'   },
    { label: 'Contact', href: '#contact' },
  ]

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
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-ink tracking-tight shrink-0">
            Sayid_Dev31
          </span>
          <span className="text-faint font-light select-none shrink-0">/</span>
          <span className="text-xs text-dim font-mono truncate hidden sm:block">
            systems-engineer
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-muted hover:text-ink transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-fence bg-surface">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
              style={{ boxShadow: '0 0 0 2.5px rgba(16,185,129,0.18)' }}
            />
            <span className="text-xs text-accent font-medium">Available</span>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-muted transition-all duration-200 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-muted transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-muted transition-all duration-200 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-fence bg-canvas/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-ink transition-colors py-2.5 border-b border-fence last:border-0"
              >
                {label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-xs text-accent font-medium">Available for opportunities</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
