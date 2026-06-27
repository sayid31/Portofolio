import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Tech group data ───────────────────────────────────────────────────────────

const GROUPS = [
  {
    domain: 'Backend & API',
    description: 'Arsitektur server, pemodelan data, dan keamanan sistem.',
    items: [
      { name: 'Node.js',       role: 'Runtime & async I/O'        },
      { name: 'Express',       role: 'Framework server HTTP'        },
      { name: 'MongoDB',       role: 'Penyimpanan dokumen & query'  },
      { name: 'PostgreSQL',    role: 'Database relasional & transaksi' },
      { name: 'JWT Auth',      role: 'Lapisan keamanan stateless'   },
      { name: 'RESTful API',   role: 'Pola desain HTTP/JSON'        },
    ],
  },
  {
    domain: 'Frontend & UI',
    description: 'Pengembangan antarmuka interaktif yang berpusat pada pengguna.',
    items: [
      { name: 'React.js',      role: 'Component UI runtime'    },
      { name: 'Vite',          role: 'Build tooling & HMR'     },
      { name: 'Tailwind CSS',  role: 'Styling utility-first'              },
      { name: 'JavaScript ES+',role: 'Runtime bahasa pemrograman'        },
    ],
  },
  {
    domain: 'Embedded & IoT',
    description: 'Pemrograman firmware, sistem kontrol, dan integrasi hardware.',
    items: [
      { name: 'Arduino Uno',   role: 'Platform mikrokontroler'      },
      { name: 'Fuzzy Logic',   role: 'Algoritma sistem kontrol'     },
      { name: 'C++ Firmware',  role: 'Eksekusi kode embedded'       },
      { name: 'Sensor I/O',    role: 'Akuisisi sinyal & ADC'        },
      { name: 'PWM Control',   role: 'Kontrol aktuator & duty-cycle' },
    ],
  },
]

// ── Skills proficiency data ───────────────────────────────────────────────────

const SKILLS = [
  { name: 'REST API Design',    pct: 88, accent: '#6366f1' },
  { name: 'React.js',           pct: 82, accent: '#10b981' },
  { name: 'Node.js / Express',  pct: 85, accent: '#6366f1' },
  { name: 'Tailwind CSS',       pct: 85, accent: '#10b981' },
  { name: 'System Architecture',pct: 80, accent: '#8b5cf6' },
  { name: 'MongoDB',            pct: 78, accent: '#6366f1' },
  { name: 'PostgreSQL',         pct: 70, accent: '#6366f1' },
  { name: 'C++ / IoT Firmware', pct: 65, accent: '#f97316' },
]

// ── SkillBar — animates width into view ──────────────────────────────────────

function SkillBar({ name, pct, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted font-medium">{name}</span>
        <span className="text-[11px] font-mono text-dim tabular-nums">{pct}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-fence overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.2 + index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  )
}

// ── GroupCard ─────────────────────────────────────────────────────────────────

function GroupCard({ domain, description, items }) {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-fence bg-card">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-ink tracking-tight mb-1">{domain}</h3>
        <p className="text-xs text-dim leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-0 flex-1">
        {items.map(({ name, role }, i) => (
          <li
            key={name}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 py-3 ${
              i < items.length - 1 ? 'border-b border-fence' : ''
            }`}
          >
            <span className="text-sm text-ink font-medium whitespace-nowrap">{name}</span>
            <span className="text-xs text-dim font-mono sm:text-right sm:shrink-0">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function TechStack() {
  return (
    <section id="stack" className="max-w-6xl mx-auto px-6 py-24 border-t border-fence">

      {/* Section header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
          03 / Kedalaman Teknis
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
          Teknologi &amp; Arsitektur
        </h2>
        <p className="mt-2 text-sm text-muted max-w-[48ch] leading-relaxed">
          Dikelompokkan berdasarkan bidang. Semua teknologi ini telah digunakan pada proyek nyata, bukan sekadar eksperimen.
        </p>
      </motion.div>

      {/* Group cards — stagger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map((g, i) => (
          <motion.div
            key={g.domain}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <GroupCard {...g} />
          </motion.div>
        ))}
      </div>

      {/* Architecture pattern strip */}
      <motion.div
        className="mt-6 flex flex-wrap items-center gap-4 px-5 py-4 rounded-xl border border-fence bg-card"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
      >
        <span className="text-[10px] text-dim font-mono uppercase tracking-widest shrink-0">
          Pola Desain
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-muted">
          {['Controller', '→', 'Service', '→', 'Repository', '→', 'Database'].map((node, i) => (
            <span key={i} className={node === '→' ? 'text-faint' : 'text-[#a3a3a3]'}>
              {node}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Skill Proficiency Bars ─────────────────────────────────────────── */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mb-6">
          <p className="text-xs text-dim font-mono uppercase tracking-widest mb-1">
            Tingkat Keahlian
          </p>
          <h3 className="text-base font-semibold text-ink">
            Area Fokus Utama
          </h3>
          <p className="text-xs text-dim mt-1 max-w-[42ch]">
            Distribusi keahlian antar disiplin ilmu — berdasarkan proyek yang telah rilis, bukan sekadar penilaian subjektif.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          {SKILLS.map((s, i) => (
            <SkillBar key={s.name} {...s} index={i} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-dim font-mono">
          {[
            { label: 'Backend',  color: '#6366f1' },
            { label: 'Frontend', color: '#10b981' },
            { label: 'System',   color: '#8b5cf6' },
            { label: 'IoT',      color: '#f97316' },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
