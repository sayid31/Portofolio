import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CASE_STUDIES } from '../../api/lib/case-studies.js'

const inView = {
  initial:    { opacity: 0, y: 28 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
}

// Resolve an image path against Vite's base URL ('' when none set)
function resolveImg(image) {
  if (!image) return ''
  return image.startsWith('/') ? `${import.meta.env.BASE_URL}${image.slice(1)}` : image
}

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

/* ─── Card 1: Restock / Stock Movement System (featured, full-width) ────── */

const MOVEMENT_TYPES = [
  { type: 'INBOUND',  desc: 'stock increases',    color: 'text-accent'     },
  { type: 'OUTBOUND', desc: 'stock decreases',    color: 'text-red-400'    },
  { type: 'RELOCATE', desc: 'location update',    color: 'text-yellow-500' },
]

function RestockCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      {/* Top */}
      <div className="space-y-4">
        {resolveImg(p.image) && (
          <img
            src={resolveImg(p.image)}
            alt={`${p.title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg"
            loading="lazy"
          />
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>{p.category}</Tag>
            <Tag variant="accent">● Auto-Alert</Tag>
          </div>
          <a href={p.live || p.github || '#'} className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
            <ArrowUpRight />
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            {p.title}
          </h2>
          <p className="text-xs text-dim font-mono mb-3">
            {p.subtitle}
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {p.description || (
              <>
                Every stock mutation is wrapped in a{' '}
                <span className="text-[#c4c4c4]">MySQL transaction</span> with row-level
                locking (<span className="text-accent font-mono">FOR UPDATE</span>) to
                prevent race conditions under high load. An immutable audit log
                captures before/after snapshots on every movement. A{' '}
                <span className="text-[#c4c4c4]">node-cron</span> job scans items below
                minimum threshold and automatically sends a summary email to the
                warehouse manager — completely eliminating manual monitoring.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-3">
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
            Low stock alert triggered when{' '}
            <span className="text-accent font-semibold">current_stock &lt; threshold</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 2: Sauber Composter (featured) ───────────────────────────────── */

const SENSORS = [
  { id: 'DS18B20',    label: 'temp',       unit: '°C',    color: 'text-accent'     },
  { id: 'SoilMoist',  label: 'moisture',   unit: '%',     color: 'text-blue-400'   },
  { id: 'pH Probe',   label: 'pH',          unit: '0–14',  color: 'text-yellow-500' },
  { id: 'MQ Gas',     label: 'gas_index',   unit: '0–100', color: 'text-red-400'    },
]

function SauberCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between" accentLine>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 0% 0%, rgba(16,185,129,0.06), transparent)',
        }}
      />

      {/* Top section with image */}
      <div className="relative space-y-5">
        {resolveImg(p.image) && (
          <img
            src={resolveImg(p.image)}
            alt={`${p.title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg"
            loading="lazy"
          />
        )}

        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="accent">{p.category}</Tag>
              <Tag variant="accent">● Live</Tag>
            </div>
            <a
              href={p.live || p.github || '#'}
              className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
              aria-label="View project"
            >
              <ArrowUpRight />
            </a>
          </div>

          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            {p.title}
          </h2>
          <p className="text-xs text-dim font-mono mb-4">
            {p.subtitle}
          </p>

          <p className="text-sm text-muted leading-relaxed max-w-lg">
            {p.description || (
              <>
                <span className="text-[#c4c4c4]">ESP32</span> reads 4 sensors in
                real-time and runs{' '}
                <span className="text-accent">Sugeno Fuzzy Inference</span> with 12
                rules to determine compost maturity level. Three actuators are
                automatically controlled — EM4 pump (once per batch), stirrer motor
                (RTC-scheduled every{' '}
                <span className="text-accent font-mono">20:30</span>), and fan (variable
                duration{' '}
                <span className="text-accent font-mono">30s / 60s / 120s</span>{' '}
                based on fuzzy output). Data is sent to{' '}
                <span className="text-[#c4c4c4]">dual backends</span> (production HTTPS
                + local exhibition HTTP) every 30 minutes, monitored via a React dashboard.
              </>
            )}
          </p>
        </div>
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
            <span className="text-ink">"Immature"</span>
            <span className="text-faint">{' ··· '}</span>
            <span className="text-accent">"Mature"</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 3: SaaS Financial BEP Calculator (featured) ─────────────────── */

function FinancialCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between" accentLine>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 100% 100%, rgba(59,130,246,0.05), transparent)',
        }}
      />

      <div className="relative space-y-5">
        {resolveImg(p.image) && (
          <img
            src={resolveImg(p.image)}
            alt={`${p.title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg"
            loading="lazy"
          />
        )}

        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="blue">{p.category}</Tag>
              <Tag variant="blue">TypeScript</Tag>
            </div>
            <a href={p.live || p.github || '#'} className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
              <ArrowUpRight />
            </a>
          </div>

          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            {p.title}
          </h2>
          <p className="text-xs text-dim font-mono mb-4">
            {p.subtitle}
          </p>

          <p className="text-sm text-muted leading-relaxed max-w-lg">
            {p.description || (
              <>
                A financial projection engine that calculates{' '}
                <span className="text-[#c4c4c4]">Break-Even Point</span> (BEP) through
                contribution margin analysis. Computation results are saved atomically via{' '}
                <span className="text-blue-400 font-mono">Prisma.$transaction()</span>{' '}
                — ensuring no data corruption on system failure. The API uses versioning ({' '}
                <span className="text-blue-400 font-mono">/api/v1/</span>) to support
                updates without breaking existing integrations.
              </>
            )}
          </p>
        </div>
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
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 4: Burger POS System (secondary) ─────────────────────────────── */

const POS_PAGES = [
  { page: 'index.html',     label: 'Customer Menu & Cart',     color: 'text-accent'     },
  { page: 'dashboard.html', label: 'Sales Dashboard',          color: 'text-blue-400'   },
  { page: 'inventory.html', label: 'Inventory Management',     color: 'text-yellow-500' },
  { page: 'orders.html',    label: 'Order Tracking',           color: 'text-faint'      },
]

function POSCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      {/* Top */}
      <div>
        {resolveImg(p.image) && (
          <img
            src={resolveImg(p.image)}
            alt={`${p.title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg mb-5"
            loading="lazy"
          />
        )}
        <div className="flex items-start justify-between mb-4">
          <Tag>{p.category}</Tag>
          <a
            href={p.github || p.live || '#'}
            target={p.github || p.live ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
          {p.title}
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          {p.subtitle}
        </p>

        <p className="text-sm text-muted leading-relaxed">
          {p.description || (
            <>
              Full-featured POS UI built with{' '}
              <span className="text-[#c4c4c4]">Vanilla JS</span> — customer ordering
              with cart, checkout modal, and payment methods. Admin side includes a{' '}
              <span className="text-[#c4c4c4]">Chart.js dashboard</span>{' '}
              (sales trends + peak hours), inventory CRUD, promos, and sales reports.
              Not yet connected to backend.
            </>
          )}
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
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 5: Inventory Management System (secondary) ───────────────────── */

function InventoryCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div>
        {resolveImg(p.image) && (
          <img
            src={resolveImg(p.image)}
            alt={`${p.title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg mb-5"
            loading="lazy"
          />
        )}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>{p.category}</Tag>
            <Tag variant="blue">Inventory</Tag>
          </div>
          <a href={p.live || p.github || '#'} className="text-faint hover:text-ink transition-colors shrink-0 ml-2" aria-label="View project">
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-base font-semibold text-ink tracking-tight mb-0.5">
          {p.title}
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          {p.subtitle}
        </p>

        <p className="text-sm text-muted leading-relaxed">
          {p.description || (
            <>
              SKU-based warehouse inventory system with{' '}
              <span className="text-[#c4c4c4]">role-based JWT authentication</span>,
              category filtering, search, and multi-location tracking. Data mutations
              are restricted to admin only.
            </>
          )}
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
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 6: Gaming Liquid Shield (secondary) ───────────────────────────── */

function GamingShieldCard({ p }) {
  return (
    <CardShell className="p-6 gap-4 justify-between min-h-[280px]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div>
        <div className="flex items-start justify-between mb-4">
          <Tag>{p.category}</Tag>
          <a
            href={p.live || p.github || '#'}
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <h2 className="text-base font-semibold text-ink tracking-tight mb-0.5">
          {p.title}
        </h2>
        <p className="text-xs text-dim font-mono mb-4">
          {p.subtitle}
        </p>

        <p className="text-sm text-muted leading-relaxed">
          {p.description || (
            <>
              Custom liquid cooling solution designed to prevent thermal
              throttling on high-performance gaming systems. Focused on hardware-level
              heat dissipation to maintain stable clock speeds.
            </>
          )}
        </p>
      </div>

      <div>
        {/* Impact metric */}
        <div className="mb-3 flex items-center gap-3 px-3.5 py-3 rounded-lg border border-fence bg-[#0a0a0a]">
          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-xs text-muted font-mono">
            Thermal throttle incidents:{' '}
            <span className="text-accent font-semibold">0%</span> under heavy workload
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 7: AI Customer Feedback Analyzer (featured) ──────────────────── */

function AIFeedbackCard({ p }) {
  return (
    <CardShell className="p-6 gap-5 justify-between" accentLine>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(139,92,246,0.06), transparent)',
        }}
      />

      <div className="relative space-y-5">
        <div className="w-full aspect-video rounded-lg border border-white/10 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🧠</div>
            <div className="text-[10px] text-dim font-mono">AI SENTIMENT ENGINE</div>
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="accent">{p.category}</Tag>
              <Tag variant="accent">● Dual Provider</Tag>
            </div>
            <a
              href={p.github || p.live || '#'}
              target={p.github || p.live ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
              aria-label="View project"
            >
              <ArrowUpRight />
            </a>
          </div>

          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            {p.title}
          </h2>
          <p className="text-xs text-dim font-mono mb-4">
            {p.subtitle}
          </p>

          <p className="text-sm text-muted leading-relaxed max-w-lg">
            {p.description || (
              <>
                Upload customer review CSVs and get instant{' '}
                <span className="text-violet-400 font-mono">AI-powered sentiment analysis</span>{' '}
                with interactive charts. Supports both{' '}
                <span className="text-[#c4c4c4]">OpenAI GPT</span> and{' '}
                <span className="text-[#c4c4c4]">Anthropic Claude</span> as analysis backends.
                Features real-time processing, pain point detection with frequency counts,
                and a responsive dashboard with Framer Motion animations.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="mb-4 p-3.5 rounded-lg border border-fence bg-[#0a0a0a] font-mono text-xs leading-6">
          <div className="text-faint mb-1 select-none">{'// sentiment_pipeline'}</div>
          <div>
            <span className="text-violet-400">CSV</span>
            <span className="text-dim"> → Multer → Parser → </span>
            <span className="text-accent">AI Provider</span>
          </div>
          <div>
            <span className="text-dim">  → </span>
            <span className="text-yellow-500">sentiment</span>
            <span className="text-dim"> + </span>
            <span className="text-red-400">pain_points</span>
            <span className="text-dim"> → Dashboard</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(p.tags || []).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.github && <GitHubButton href={p.github} />}
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Card 8: Engineering Approach (secondary) ──────────────────────────── */

const PRINCIPLES = [
  { label: 'Secure by Default',           sub: 'Auth-first API design, not an afterthought'                    },
  { label: 'Hardware ↔ Software Integration', sub: 'Cross-disciplinary fluency'                                 },
  { label: 'Measurable Results',          sub: 'Performance prioritized over mere aesthetics'                  },
]

function ApproachCard() {
  return (
    <CardShell className="p-6 gap-5 justify-between min-h-[280px]">
      <div>
        <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-4">
          Engineering Philosophy
        </div>

        <blockquote className="text-sm text-[#c4c4c4] leading-relaxed mb-6 border-l-2 border-accent/50 pl-3.5">
          "Systems that work in the real world, not just demos."
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

/* ─── Dynamic card: projects managed via /admin (MongoDB) ────────────────── */

function DynamicProjectCard({ project }) {
  const { title, subtitle, description, category, tags = [], image, github, live, featured } = project

  const imgSrc = image
    ? image.startsWith('/')
      ? `${import.meta.env.BASE_URL}${image.slice(1)}`
      : image
    : ''

  const link = live || github || '#'

  return (
    <CardShell className="p-6 gap-5 justify-between" accentLine={!!featured}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fence-active to-transparent" />

      <div className="space-y-4">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${title} preview`}
            className="w-full aspect-video object-cover border border-white/10 rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video rounded-lg border border-white/10 bg-gradient-to-br from-accent/10 via-indigo-500/5 to-transparent flex items-center justify-center">
            <span className="text-4xl">⚙️</span>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Tag variant="blue">{category}</Tag>
            {featured && <Tag variant="accent">● Featured</Tag>}
          </div>
          <a
            href={link}
            target={link !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-faint hover:text-ink transition-colors shrink-0 ml-2"
            aria-label="View project"
          >
            <ArrowUpRight />
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink tracking-tight mb-0.5">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-dim font-mono mb-3">{subtitle}</p>}
          {description && (
            <p className="text-sm text-muted leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      <div>
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
        {github && <GitHubButton href={github} />}
      </div>
    </CardShell>
  )
}

/* ─── Project data — graceful fallback when API is down ───────────────────── */

// status: 'loading' | 'ok' | 'error'
// While loading or when the API is down, case-study cards fall back to the
// CASE_STUDIES defaults so the portfolio never loses its cards.
function useProjects() {
  const [state, setState] = useState({ status: 'loading', items: [] })

  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)

    fetch('/api/projects', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        setState({ status: 'ok', items: Array.isArray(data) ? data : [] })
      })
      .catch(() => {
        setState((prev) => (prev.status === 'loading' ? { status: 'error', items: [] } : prev))
      })
      .finally(() => clearTimeout(timer))

    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [])

  return state
}

/* ─── Section export ────────────────────────────────────────────────────── */

export default function CaseStudies() {
  const { status, items } = useProjects()

  // Look up a case-study document by slug. While the API is loading or down,
  // fall back to the seeded defaults; on success a missing slug means the
  // project was deleted from the admin panel.
  const doc = (slug) =>
    status === 'ok'
      ? items.find((p) => p.slug === slug)
      : CASE_STUDIES.find((c) => c.slug === slug)

  const restock     = doc('restock')
  const sauber      = doc('sauber')
  const financial   = doc('financial')
  const aiFeedback  = doc('ai-feedback')
  const burgerPos   = doc('burger-pos')
  const inventory   = doc('inventory')
  const gamingShield = doc('gaming-shield')

  // New projects added via the admin panel (no slug) → "Latest Projects"
  const newProjects = status === 'ok' ? items.filter((p) => !p.slug) : []
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 py-24">

      {/* Section header */}
      <motion.div className="flex items-end justify-between mb-10" {...inView}>
        <div>
          <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
            02 / Featured Work
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Project Case Studies
          </h2>
        </div>
        <p className="hidden md:block text-sm text-muted max-w-[32ch] text-right leading-relaxed">
          Real projects, real constraints, real outcomes.
        </p>
      </motion.div>

      {/* ── Featured projects ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-[10px] text-dim font-mono uppercase tracking-widest mb-5">
          — Featured Projects
        </p>

        {/*
          Desktop layout (md:grid-cols-2):
            [RestockCard ────── col-span-2, full width ──────]
            [SauberCard        ] [FinancialCard              ]
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {restock && <RestockCard p={restock} />}
          {sauber && <SauberCard p={sauber} />}
          {financial && <FinancialCard p={financial} />}
          {aiFeedback && <AIFeedbackCard p={aiFeedback} />}
        </div>
      </motion.div>

      {/* ── Secondary projects ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-[10px] text-dim font-mono uppercase tracking-widest mb-5">
          — Additional Projects
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {burgerPos && <POSCard p={burgerPos} />}
          {inventory && <InventoryCard p={inventory} />}
          <div className="flex flex-col gap-4">
            {gamingShield && <GamingShieldCard p={gamingShield} />}
            <ApproachCard />
          </div>
        </div>
      </motion.div>

      {/* ── CMS-managed projects (fed by /admin) ─────────────────────────── */}
      {newProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16"
        >
          <p className="text-[10px] text-dim font-mono uppercase tracking-widest mb-5">
            — Latest Projects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newProjects.map((p) => (
              <DynamicProjectCard key={p._id} project={p} />
            ))}
          </div>
        </motion.div>
      )}

    </section>
  )
}
