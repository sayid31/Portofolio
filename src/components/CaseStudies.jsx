/* ─── Shared primitives ──────────────────────────────────────────────────── */

function Tag({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-[#161616] text-dim border-fence',
    accent:  'bg-accent-tint text-accent border-accent-border',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

function ArrowUpRight({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  )
}

function GitHubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function GitHubButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-fence bg-[#161616] text-dim hover:text-ink hover:border-fence-active transition-colors duration-200 font-mono text-[10px] font-medium"
    >
      <GitHubIcon className="w-3 h-3" />
      View Code
    </a>
  )
}

function CardShell({ children, className = '', accentLine = false }) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border border-fence bg-card overflow-hidden
        hover:border-fence-active transition-colors duration-300 ${className}`}
    >
      {accentLine && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      )}
      {children}
    </div>
  )
}

/* ─── Card 1: Sauber Composter (featured, 2-col wide) ──────────────────── */

const SENSORS = [
  { id: 'DS18B20',    label: 'suhu',        unit: '°C',    color: 'text-accent'     },
  { id: 'SoilMoist',  label: 'kelembaban',  unit: '%',     color: 'text-blue-400'   },
  { id: 'pH Probe',   label: 'pH',          unit: '0–14',  color: 'text-yellow-500' },
  { id: 'MQ Gas',     label: 'gas_index',   unit: '0–100', color: 'text-red-400'    },
]

function SauberCard() {
  return (
    <CardShell className="md:col-span-2 p-6 gap-5 justify-between min-h-[300px]" accentLine>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 0% 0%, rgba(16,185,129,0.06), transparent)',
        }}
      />

      {/* Top section */}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag variant="accent">IoT &amp; Embedded</Tag>
            <Tag variant="accent">● Live</Tag>
          </div>
          <a
            href="#"
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
          Sauber Organic Composter
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          IoT sistem kompos otomatis berbasis Fuzzy Logic
        </p>

        <p className="text-sm text-muted leading-relaxed max-w-lg">
          <span className="text-[#c4c4c4]">ESP32</span> membaca 4 sensor secara
          real-time dan menjalankan{' '}
          <span className="text-accent">Sugeno Fuzzy Inference</span> dengan 12
          rule untuk menentukan tingkat kematangan kompos. Tiga aktuator
          dikontrol otomatis — pompa EM4 (sekali saat batch baru), motor pengaduk
          (terjadwal RTC setiap{' '}
          <span className="text-accent font-mono">20:30</span>), dan kipas (durasi
          variabel{' '}
          <span className="text-accent font-mono">30s / 60s / 120s</span>{' '}
          berdasarkan output fuzzy). Data dikirim ke{' '}
          <span className="text-[#c4c4c4]">dual backend</span> (HTTPS produksi +
          HTTP lokal pameran) setiap 30 menit, dipantau lewat dashboard React.
        </p>
      </div>

      {/* Bottom section */}
      <div className="relative">
        <div className="mb-4 grid grid-cols-2 gap-x-4 p-3.5 rounded-lg border border-fence bg-[#0a0a0a] font-mono text-xs leading-6">
          <div className="text-faint col-span-2 mb-1 select-none">{'// sensor_inputs → fuzzy_output'}</div>
          {SENSORS.map(({ id, label, unit, color }) => (
            <div key={id}>
              <span className={`${color} font-semibold`}>{id}</span>
              <span className="text-dim">{' → '}</span>
              <span className="text-ink">{label}</span>
              <span className="text-faint">{' // ' + unit}</span>
            </div>
          ))}
          <div className="col-span-2 mt-1 pt-1 border-t border-fence">
            <span className="text-accent">Sugeno</span>
            <span className="text-dim">{' z∈[20,100] → '}</span>
            <span className="text-ink">"Belum Matang"</span>
            <span className="text-faint">{' ··· '}</span>
            <span className="text-accent">"Matang"</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ESP32', 'Fuzzy Sugeno', 'C++', 'React', 'Node.js', 'RTC DS3231'].map(
            (t) => <Tag key={t}>{t}</Tag>,
          )}
          <GitHubButton href="https://github.com/sayid31/sauber-composter" />
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 2: Burger POS System (tall, right column) ───────────────────── */

const POS_PAGES = [
  { page: 'index.html',     label: 'Customer Menu & Cart',  color: 'text-accent'     },
  { page: 'dashboard.html', label: 'Sales Dashboard',       color: 'text-blue-400'   },
  { page: 'inventory.html', label: 'Inventory Management',  color: 'text-yellow-500' },
  { page: 'orders.html',    label: 'Order Tracking',        color: 'text-faint'      },
]

function POSCard() {
  return (
    <CardShell className="p-6 gap-5 justify-between min-h-[300px]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      {/* Top */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <Tag>Frontend</Tag>
          <a
            href="https://github.com/sayid31/burger-pos-system"
            target="_blank"
            rel="noopener noreferrer"
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
          Burger POS System
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          Frontend point-of-sale &amp; admin dashboard
        </p>

        <p className="text-sm text-muted leading-relaxed">
          Full-featured POS UI built in{' '}
          <span className="text-[#c4c4c4]">Vanilla JS</span> — customer ordering
          with cart, checkout modal, and payment method selection. Admin side
          covers a <span className="text-[#c4c4c4]">Chart.js dashboard</span>{' '}
          (sales trend + peak hours), inventory CRUD, promo, and sales reporting.
          No backend yet.
        </p>

        {/* Page manifest */}
        <div className="mt-5 space-y-1.5">
          {POS_PAGES.map(({ page, label, color }) => (
            <div
              key={page}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-fence font-mono text-xs"
            >
              <span className={`${color} font-semibold w-[100px] shrink-0 truncate`}>
                {page}
              </span>
              <span className="text-dim">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div>
        <div className="mb-3 px-3.5 py-3 rounded-lg border border-fence bg-[#0a0a0a]">
          <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-1">
            UI Pattern
          </div>
          <div className="text-xs text-muted font-mono">
            Vanilla JS → DOM manipulation → LocalState → UI re-render
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['HTML', 'CSS', 'Vanilla JS', 'Chart.js', 'Swiper.js'].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          <GitHubButton href="https://github.com/sayid31/burger-pos-system" />
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 3: Gaming Liquid Shield ─────────────────────────────────────── */

function GamingShieldCard() {
  return (
    <CardShell className="p-6 gap-4 justify-between min-h-[280px]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div>
        <div className="flex items-start justify-between mb-4">
          <Tag>Hardware Innovation</Tag>
          <a
            href="#"
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-base font-semibold text-ink tracking-tight mb-0.5">
          Gaming Liquid Shield
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          Thermal engineering &amp; mechanical design
        </p>

        <p className="text-sm text-muted leading-relaxed">
          Custom-engineered liquid cooling solution designed to eliminate thermal
          throttling in high-performance gaming systems. Addresses heat
          dissipation at the hardware layer, sustaining peak clock speeds under
          sustained computational load.
        </p>
      </div>

      <div>
        {/* Impact metric */}
        <div className="mb-3 flex items-center gap-3 px-3.5 py-3 rounded-lg border border-fence bg-[#0a0a0a]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-xs text-muted font-mono">
            Thermal throttle events:{' '}
            <span className="text-accent font-semibold">0%</span> under sustained load
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['Thermal Engineering', 'Hardware Design', 'Mechanical CAD'].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 4: Inventory Management System ──────────────────────────────── */

function InventoryCard() {
  return (
    <CardShell className="p-6 gap-5 justify-between min-h-[280px]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>Full-Stack</Tag>
            <Tag variant="blue">Inventory</Tag>
          </div>
          <a href="#" className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-base font-semibold text-ink tracking-tight mb-0.5">
          Inventory Management System
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          Warehouse item tracking &amp; control
        </p>

        <p className="text-sm text-muted leading-relaxed">
          SKU-based warehouse inventory with{' '}
          <span className="text-[#c4c4c4]">role-based JWT auth</span>, category
          filtering, search, and multi-location tracking. Admin-gated mutations
          with paginated item queries.
        </p>
      </div>

      <div>
        <div className="mb-3 p-3 rounded-lg border border-fence bg-[#0a0a0a] font-mono text-xs leading-5">
          <div className="text-faint mb-1 select-none">{'// item record'}</div>
          <div><span className="text-blue-400">sku</span><span className="text-dim">      = </span><span className="text-accent">"WH-001-A"</span></div>
          <div><span className="text-blue-400">stock</span><span className="text-dim">    = </span><span className="text-ink">142</span><span className="text-dim"> / threshold: </span><span className="text-yellow-500">50</span></div>
          <div><span className="text-blue-400">location</span><span className="text-dim"> = </span><span className="text-accent">"Zone A-3"</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['Node.js', 'Express', 'MySQL', 'React', 'JWT'].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          <GitHubButton href="https://github.com/sayid31/inventory-supply-chain-" />
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 6: SaaS Financial BEP Calculator ────────────────────────────── */

function FinancialCard() {
  return (
    <CardShell className="p-6 gap-5 justify-between min-h-[280px]" accentLine>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 100% 100%, rgba(59,130,246,0.05), transparent)',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag variant="blue">Financial SaaS</Tag>
            <Tag variant="blue">TypeScript</Tag>
          </div>
          <a href="#" className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
          SaaS Break-Even Point Calculator
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          AI-powered financial forecasting API
        </p>

        <p className="text-sm text-muted leading-relaxed max-w-lg">
          Full financial projection engine computing{' '}
          <span className="text-[#c4c4c4]">Break-Even Point</span> via
          contribution margin analysis. Results persist atomically via{' '}
          <span className="text-blue-400 font-mono">Prisma.$transaction()</span>{' '}
          — no orphaned records on failure. Versioned API{' '}
          <span className="text-blue-400 font-mono">/api/v1/</span> for
          non-breaking evolution.
        </p>
      </div>

      <div className="relative">
        <div className="mb-4 p-3.5 rounded-lg border border-fence bg-[#0a0a0a] font-mono text-xs leading-6">
          <div className="text-faint mb-1 select-none">{'// bep_formula.ts'}</div>
          <div>
            <span className="text-blue-400">CM </span>
            <span className="text-dim"> = price - varCost</span>
          </div>
          <div>
            <span className="text-blue-400">BEP</span>
            <span className="text-dim"> = fixedCosts / CM</span>
          </div>
          <div>
            <span className="text-blue-400">REV</span>
            <span className="text-dim"> = BEP × price</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'REST'].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          <GitHubButton href="https://github.com/sayid31/System_Financial" />
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 7: Restock / Stock Movement System ───────────────────────────── */

const MOVEMENT_TYPES = [
  { type: 'INBOUND',  desc: 'stock increases',   color: 'text-accent'     },
  { type: 'OUTBOUND', desc: 'stock decreases',    color: 'text-red-400'    },
  { type: 'RELOCATE', desc: 'location updates',   color: 'text-yellow-500' },
]

function RestockCard() {
  return (
    <CardShell className="md:col-span-2 p-6 gap-5 min-h-[240px]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: description */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag>Supply Chain</Tag>
              <Tag variant="accent">● Auto-Alert</Tag>
            </div>
            <a href="#" className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
              <ArrowUpRight />
            </a>
          </div>

          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            Restock &amp; Stock Movement System
          </h2>
          <p className="text-xs text-dim font-mono mb-4">
            Atomic audit trail with automated low-stock alerts
          </p>

          <p className="text-sm text-muted leading-relaxed">
            Every stock mutation is wrapped in a{' '}
            <span className="text-[#c4c4c4]">MySQL transaction</span> with row-level
            locking (<span className="text-accent font-mono">FOR UPDATE</span>) to
            prevent race conditions under concurrent load. Immutable audit log
            captures before/after snapshots on every movement. A{' '}
            <span className="text-[#c4c4c4]">node-cron job</span> scans for
            sub-threshold items and fires a summary email to the warehouse manager
            — zero manual monitoring required.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {['Node.js', 'MySQL', 'node-cron', 'Nodemailer', 'Express'].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            <GitHubButton href="https://github.com/sayid31/Restock_Engine" />
          </div>
        </div>

        {/* Right: movement types + alert metric */}
        <div className="flex flex-col gap-3 justify-center">
          <div className="space-y-1.5">
            {MOVEMENT_TYPES.map(({ type, desc, color }) => (
              <div
                key={type}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-fence font-mono text-xs"
              >
                <span className={`${color} font-semibold w-[68px] shrink-0`}>{type}</span>
                <span className="text-faint">→</span>
                <span className="text-dim">{desc}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-fence bg-[#0a0a0a]">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse" />
            <span className="text-xs text-muted font-mono">
              Low-stock alert fires when{' '}
              <span className="text-accent font-semibold">current_stock &lt; threshold</span>
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 4: Engineering Approach ─────────────────────────────────────── */

const PRINCIPLES = [
  { label: 'Secure by default', sub: 'Auth-first API design, no bolt-ons' },
  { label: 'Hardware ↔ Software', sub: 'Cross-domain integration fluency' },
  { label: 'Measurable outcomes', sub: 'Performance over aesthetic decisions' },
]

function ApproachCard() {
  return (
    <CardShell className="p-6 gap-5 justify-between min-h-[280px]">
      <div>
        <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-4">
          Engineering Philosophy
        </div>

        <blockquote className="text-sm text-[#c4c4c4] leading-relaxed mb-6 border-l-2 border-accent/50 pl-3.5">
          "Systems that work under real-world conditions, not just in demos."
        </blockquote>

        <ul className="space-y-3.5">
          {PRINCIPLES.map(({ label, sub }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
              <div>
                <div className="text-xs text-ink font-medium">{label}</div>
                <div className="text-xs text-dim mt-0.5">{sub}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-fence">
        <p className="text-xs text-dim">
          Muhamad Sayid Amanulloh &mdash; Bali, Indonesia
        </p>
      </div>
    </CardShell>
  )
}

/* ─── Section export ────────────────────────────────────────────────────── */

export default function CaseStudies() {
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 py-24">

      {/* Section header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
            02 / Featured Work
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Engineering Case Studies
          </h2>
        </div>
        <p className="hidden md:block text-sm text-muted max-w-[32ch] text-right leading-relaxed">
          Each project is framed around the problem it solves and
          the measurable outcome it delivers.
        </p>
      </div>

      {/* Bento grid
          Desktop: 3-col, 2-row
            [Sauber  ←col-span-2→] [POS  ↑]
            [Gaming ] [Approach  ] [POS  ↓]
          Mobile: single column stacked
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SauberCard />
        <POSCard />
        <GamingShieldCard />
        <ApproachCard />
        <InventoryCard />
        <RestockCard />
        <FinancialCard />
      </div>
    </section>
  )
}
