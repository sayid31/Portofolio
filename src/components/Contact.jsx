import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Terminal ──────────────────────────────────────────────────────────────────

const SCRIPT = [
  { cmd: true,  text: 'whoami'                                         },
  { cmd: false, text: 'Muhamad Sayid · Full-Stack & IoT Engineer'      },
  { cmd: true,  text: 'cat ketersediaan.txt'                           },
  { cmd: false, text: 'Terbuka untuk peluang baru · membalas dalam 24 jam' },
  { cmd: true,  text: 'git log --oneline -3'                           },
  { cmd: false, text: 'cd0d567  feat: Three.js + Framer Motion'        },
  { cmd: false, text: '9bda695  fix: responsive layout polish'          },
  { cmd: false, text: 'bbd35a0  trigger: force deploy'                 },
]

// Cumulative reveal delays — cmd lines get a longer pause to simulate typing
const REVEAL_DELAYS = [400, 850, 1350, 1800, 2300, 2650, 2900, 3150]

function Terminal() {
  const [step, setStep] = useState(-1)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const timers = useRef([])

  useEffect(() => {
    if (!inView) return
    timers.current = REVEAL_DELAYS.map((d, i) =>
      setTimeout(() => setStep(i), d)
    )
    return () => timers.current.forEach(clearTimeout)
  }, [inView])

  return (
    <div ref={ref} className="rounded-xl border border-fence overflow-hidden bg-[#050505]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-fence bg-[#0d0d0d]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[10px] text-dim font-mono">
          sayid@portfolio — zsh
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4 font-mono text-xs space-y-1.5 min-h-[192px]">
        {SCRIPT.slice(0, step + 1).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-2"
          >
            {line.cmd
              ? <span className="text-accent select-none shrink-0 mt-px">❯</span>
              : <span className="text-dim select-none shrink-0 mt-px ml-4">→</span>
            }
            <span className={line.cmd ? 'text-ink' : 'text-dim leading-relaxed'}>
              {line.text}
            </span>
          </motion.div>
        ))}

        {/* Blinking cursor — always visible after mount */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-accent select-none">❯</span>
          <span
            className="inline-block w-1.5 h-3.5 bg-accent rounded-[1px]"
            style={{ animation: 'blink 1.1s step-end infinite' }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Activity Heatmap ──────────────────────────────────────────────────────────

// Deterministic "activity" data via Park-Miller LCG (seed = 31337)
const WEEKS = 26
const HEATMAP_DATA = (() => {
  let s = 31337
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }

  return Array.from({ length: WEEKS * 7 }, (_, idx) => {
    const day     = idx % 7                  // 0=Mon … 6=Sun
    const week    = Math.floor(idx / 7)
    const sprint  = [1, 4, 8, 12, 16, 20, 24].includes(week)
    const weekend = day >= 5

    if (weekend && r() > 0.3) return 0
    if (weekend) return r() > 0.55 ? 1 : 0
    if (sprint) {
      const v = r()
      return v < 0.05 ? 0 : v < 0.2 ? 2 : v < 0.55 ? 3 : 4
    }
    const v = r()
    return v < 0.22 ? 0 : v < 0.48 ? 1 : v < 0.74 ? 2 : v < 0.92 ? 3 : 4
  })
})()

// Compute month labels from today going back WEEKS weeks
function getMonthLabels() {
  const today = new Date()
  const labels = []
  let lastMonth = -1

  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (WEEKS - 1 - w) * 7)
    const m = d.getMonth()
    if (m !== lastMonth) {
      labels.push({ week: w, label: d.toLocaleString('en-GB', { month: 'short' }) })
      lastMonth = m
    }
  }
  return labels
}

const MONTH_LABELS = getMonthLabels()

const CELL_COLORS = [
  'bg-fence',         // 0 — empty
  'bg-accent/20',     // 1 — light
  'bg-accent/45',     // 2 — medium
  'bg-accent/70',     // 3 — high
  'bg-accent',        // 4 — max
]

function ActivityHeatmap() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref}>
      <p className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">
        Aktivitas Pengembangan
      </p>

      {/* Month labels */}
      <div className="relative mb-1" style={{ paddingLeft: 20 }}>
        <div className="flex" style={{ gap: 2 }}>
          {Array.from({ length: WEEKS }, (_, w) => {
            const monthEntry = MONTH_LABELS.find(m => m.week === w)
            return (
              <div key={w} style={{ width: 11, flexShrink: 0 }}>
                {monthEntry && (
                  <span className="text-[9px] text-faint font-mono absolute" style={{ whiteSpace: 'nowrap' }}>
                    {monthEntry.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid — columns = weeks, rows = days (Mon→Sun) */}
      <div className="flex items-start gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1" style={{ paddingTop: 14 }}>
          {['M', '', 'W', '', 'F', '', 'S'].map((d, i) => (
            <div key={i} style={{ height: 11, fontSize: 8 }}
                 className="text-faint font-mono leading-none flex items-center">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="flex gap-[2px]" style={{ paddingTop: 14 }}>
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }, (_, d) => {
                const level = HEATMAP_DATA[w * 7 + d]
                return (
                  <motion.div
                    key={d}
                    title={`Activity level ${level}`}
                    className={`rounded-[2px] ${CELL_COLORS[level]}`}
                    style={{ width: 11, height: 11 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.25,
                      delay: inView ? (w * 7 + d) * 0.003 : 0,
                      ease: 'easeOut',
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[9px] text-faint font-mono">Sedikit</span>
        {CELL_COLORS.map((c, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
        ))}
        <span className="text-[9px] text-faint font-mono">Banyak</span>
      </div>
    </div>
  )
}

// ── Contact links ─────────────────────────────────────────────────────────────

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/sayid31',                       desc: 'Kode sumber & kontribusi'  },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/muhamad-sayid-amannulloh', desc: 'Riwayat profesional'        },
  { label: 'Email',    href: 'mailto:muhamadsayidamanulloh@email.com',            desc: 'Jalur komunikasi utama'     },
]

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 10l8-8M5 2h5v5" stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Inline blink keyframe (avoids adding to index.css) ───────────────────────

const blinkStyle = (
  <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
)

// ── Main component ────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24 border-t border-fence">
      {blinkStyle}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* ── Left column: CTA + Terminal ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
              04 / Kontak
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight mb-4">
              Mari bangun sistem
              <br />
              <span className="text-muted">yang siap digunakan.</span>
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-[40ch]">
              Saya terbuka untuk posisi Backend Engineer, Full-Stack, maupun proyek IoT.
              Silakan sampaikan kebutuhan Anda, saya akan membalas dalam waktu 24 jam.
            </p>

            <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-lg border border-fence bg-card w-fit">
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                style={{ boxShadow: '0 0 0 2.5px rgba(16,185,129,0.18)' }}
              />
              <span className="text-xs text-accent font-medium">
                Terbuka untuk peluang baru
              </span>
            </div>
          </div>

          {/* Terminal */}
          <Terminal />
        </motion.div>

        {/* ── Right column: Links + Heatmap ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
        >
          {/* Contact links */}
          <div className="space-y-2">
            {LINKS.map(({ label, href, desc }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center justify-between px-4 py-4 rounded-xl border border-fence bg-card hover:border-fence-active hover:bg-[#111111] transition-all duration-200"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div>
                  <div className="text-sm font-medium text-ink">{label}</div>
                  <div className="text-xs text-dim mt-0.5">{desc}</div>
                </div>
                <span className="text-faint group-hover:text-muted transition-colors">
                  <ExternalIcon />
                </span>
              </motion.a>
            ))}
          </div>

          {/* Activity heatmap */}
          <div className="p-4 rounded-xl border border-fence bg-card overflow-x-auto">
            <ActivityHeatmap />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
