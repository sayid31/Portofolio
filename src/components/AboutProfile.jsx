import { motion } from 'framer-motion'

// ── Icons ─────────────────────────────────────────────────────────────────────

function GitHubIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function FacebookIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href:  'https://github.com/sayid31',
    Icon:  GitHubIcon,
  },
  {
    label: 'LinkedIn',
    href:  'https://linkedin.com/in/muhamad-sayid-amannulloh',
    Icon:  LinkedInIcon,
  },
  {
    label: 'Email',
    href:  'mailto:muhamadsayidamanulloh@email.com',
    Icon:  EmailIcon,
  },
  {
    label: 'Facebook',
    href:  'https://www.facebook.com/share/1JfKmMheAU/',
    Icon:  FacebookIcon,
  },
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/sayidamanllh_31?utm_source=qr&igsh=MXZscWE4NTFsenMybQ==',
    Icon:  InstagramIcon,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function AboutProfile() {
  return (
    <section id="profile" className="max-w-6xl mx-auto px-6 py-24 border-t border-fence">

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
      >
        <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
          04 / Profil
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
          Tentang Saya
        </h2>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-xl border border-fence bg-card overflow-hidden hover:border-fence-active transition-colors duration-300"
      >
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Ambient green glow behind image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 45% 70% at 0% 50%, rgba(16,185,129,0.06), transparent)',
          }}
        />

        <div className="relative flex flex-col md:flex-row gap-8 p-6 md:p-8 items-start">

          {/* ── Profile image ───────────────────────────────────────────── */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}images/profile.webp`}
                alt="Muhamad Sayid Amanulloh"
                loading="lazy"
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border border-fence-active"
              />
              {/* Availability indicator */}
              <span
                className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-accent border-2 border-card"
                title="Terbuka untuk peluang baru"
              />
            </div>
          </div>

          {/* ── Bio content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Name & title */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-ink tracking-tight">
                Muhamad Sayid Amanulloh
              </h3>
              <p className="text-xs text-accent font-mono mt-1">
                Web Developer &amp; IoT Engineer
              </p>
            </div>

            {/* Short bio */}
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-[62ch]">
              Engineer berlatar belakang{' '}
              <span className="text-[#c4c4c4]">Rekayasa Sistem Komputer</span> yang
              terbiasa mengelola pengembangan dari level firmware hingga API produksi.
              Saya mengambil ownership penuh atas setiap keputusan teknis—dari perancangan
              arsitektur, pola transaksi database, hingga strategi deployment yang
              memastikan sistem tetap andal di kondisi nyata.{' '}
              Domain utama saya mencakup{' '}
              <span className="text-accent font-mono">embedded IoT</span>{' '}
              (ESP32, real-time control logic) dan Full-Stack web{' '}
              (<span className="text-[#c4c4c4]">Node.js</span>, REST API, React)—dengan
              penekanan kuat pada keandalan sistem, keamanan data, dan hasil yang terukur
              secara bisnis.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-fence bg-[#161616] text-dim hover:text-ink hover:border-fence-active transition-colors duration-200 font-mono text-xs font-medium"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.3 + i * 0.07,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Icon />
                  {label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
