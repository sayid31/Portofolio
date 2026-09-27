import { lazy, Suspense, useRef, useState, useEffect, Component } from 'react'
import { motion, useInView } from 'framer-motion'

const TerminalScene = lazy(() => import('./TerminalScene'))

class TerminalSceneErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

// ── Motion helper (same style as Hero) ───────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

function Terminal() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <TerminalSceneErrorBoundary>
        <Suspense fallback={null}>
          <TerminalScene />
        </Suspense>
      </TerminalSceneErrorBoundary>
    </div>
  )
}

// ── Activity Heatmap — Real GitHub Data ───────────────────────────────────────

const GITHUB_USERNAME = 'sayid31'
const CACHE_KEY = `github_heatmap_${GITHUB_USERNAME}`
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const WEEKS = 52
const CELL_SIZE = 12
const CELL_GAP  = 3

const CELL_COLORS = [
  'bg-fence',         // 0 — no activity
  'bg-accent/20',     // 1 — light
  'bg-accent/45',     // 2 — medium
  'bg-accent/70',     // 3 — high
  'bg-accent',        // 4 — max
]

// Map a commit count to a 0–4 level
function countToLevel(count) {
  if (count === 0) return 0
  if (count <= 2)  return 1
  if (count <= 5)  return 2
  if (count <= 10) return 3
  return 4
}

// Fetch commit activity from GitHub with localStorage cache
async function fetchGitHubActivity(username) {
  // 1. Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data)) {
        console.log('[heatmap] Using cached data')
        return data
      }
    }
  } catch {}

  // 2. Fetch fresh data from GitHub
  const start = new Date()
  start.setDate(start.getDate() - WEEKS * 7)

  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=6&type=owner&sort=pushed&direction=desc`
    )
    if (!reposRes.ok) throw new Error(`repos fetch failed: ${reposRes.status}`)
    const repos = await reposRes.json()
    if (!Array.isArray(repos)) throw new Error('unexpected response')

    const commitPromises = repos.map(async (repo) => {
      try {
        const since = start.toISOString()
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?since=${since}&per_page=100`
        )
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : []
      } catch {
        return []
      }
    })

    const allCommits = (await Promise.all(commitPromises)).flat()

    // Build date → count map
    const dateMap = {}
    allCommits.forEach((c) => {
      const dateStr = c.commit.author.date.split('T')[0]
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1
    })

    // Build heatmap array
    const data = []
    const today = new Date()
    const totalDays = WEEKS * 7
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - totalDays + 1)
    const dayOfWeek = startDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDate.setDate(startDate.getDate() + mondayOffset)

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      data.push(countToLevel(dateMap[dateStr] || 0))
    }

    // 3. Save to cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
    } catch {}

    return data
  } catch (err) {
    console.error('[heatmap] GitHub fetch failed:', err)
    return null
  }
}

// Compute month labels from today going back WEEKS weeks
function getMonthLabels(startDate) {
  const labels = []
  let lastMonth = -1

  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + w * 7)
    const m = d.getMonth()
    const y = d.getFullYear()
    if (m !== lastMonth) {
      labels.push({
        week: w,
        month: d.toLocaleString('en-GB', { month: 'short' }),
        year: y,
      })
      lastMonth = m
    }
  }
  return labels
}

// Get unique years for year labels
function getYearLabels(startDate) {
  const years = new Set()
  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + w * 7)
    years.add(d.getFullYear())
  }
  return Array.from(years)
}

function ActivityHeatmap() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [heatmapData, setHeatmapData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchGitHubActivity(GITHUB_USERNAME).then((data) => {
      if (!cancelled) {
        setHeatmapData(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  // Compute start date for month labels
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - WEEKS * 7 + 1)
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + mondayOffset)
  const monthLabels = getMonthLabels(startDate)

  // Use real data or show loading/empty state
  const data = heatmapData || Array(WEEKS * 7).fill(0)

  // Total grid width
  const gridWidth = WEEKS * (CELL_SIZE + CELL_GAP)

  return (
    <div ref={ref} className="w-full">
      <p className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">
        Development Activity
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-[10px] text-faint font-mono mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Loading contribution data…
        </div>
      )}

      {!loading && heatmapData && heatmapData.every(v => v === 0) && (
        <div className="flex items-center gap-2 text-[10px] text-faint font-mono mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-dim" />
          No recent commits found — check console for debug info
        </div>
      )}

      {/* Scrollable container */}
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: gridWidth + 30 }}>

          {/* Year labels — top row */}
          <div className="flex mb-1" style={{ paddingLeft: 20 }}>
            {getYearLabels(startDate).map((year) => (
              <span key={year} className="text-[9px] text-faint font-mono mr-4">
                {year}
              </span>
            ))}
          </div>

          {/* Month labels */}
          <div className="relative mb-1" style={{ paddingLeft: 20 }}>
            <div className="flex" style={{ gap: CELL_GAP }}>
              {Array.from({ length: WEEKS }, (_, w) => {
                const entry = monthLabels.find(m => m.week === w)
                return (
                  <div key={w} style={{ width: CELL_SIZE, flexShrink: 0 }}>
                    {entry && (
                      <span className="text-[9px] text-faint font-mono absolute" style={{ whiteSpace: 'nowrap' }}>
                        {entry.month}
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
            <div className="flex flex-col gap-[3px] mr-1" style={{ paddingTop: 14 }}>
              {['M', '', 'W', '', 'F', '', 'S'].map((d, i) => (
                <div key={i} style={{ height: CELL_SIZE, fontSize: 8 }}
                     className="text-faint font-mono leading-none flex items-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px]" style={{ paddingTop: 14 }}>
              {Array.from({ length: WEEKS }, (_, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, d) => {
                    const level = data[w * 7 + d]
                    return (
                      <motion.div
                        key={d}
                        title={`Activity level ${level}`}
                        className={`rounded-[2px] ${CELL_COLORS[level]}`}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.25,
                          delay: inView ? (w * 7 + d) * 0.002 : 0,
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
            <span className="text-[9px] text-faint font-mono">Less</span>
            {CELL_COLORS.map((c, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
            ))}
            <span className="text-[9px] text-faint font-mono">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Contact links ─────────────────────────────────────────────────────────────

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/sayid31',                       desc: 'Source code & contributions'  },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/muhamad-sayid-amannulloh', desc: 'Professional history'        },
  { label: 'Email',    href: 'mailto:muhamadsayidamanulloh@email.com',            desc: 'Primary communication'       },
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
    <section id="contact" className="relative max-w-6xl mx-auto px-6 py-24 border-t border-fence">
      {blinkStyle}

      {/* 3D particles — full section background */}
      <Terminal />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

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
              05 / Contact
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight mb-4">
              Let's build something
              <br />
              <span className="text-muted">that actually ships.</span>
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-[40ch]">
              I'm open to Backend, Full-Stack, or AI-focused roles.
              Drop me a message — I usually reply within a day.
            </p>

            <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-lg border border-fence bg-card w-fit">
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                style={{ boxShadow: '0 0 0 2.5px rgba(16,185,129,0.18)' }}
              />
              <span className="text-xs text-accent font-medium">
                Open to new opportunities
              </span>
            </div>
          </div>
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
          <div className="overflow-x-auto">
            <ActivityHeatmap />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
