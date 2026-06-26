const GROUPS = [
  {
    domain: 'Backend & API',
    description: 'Server-side architecture, data modelling, and security.',
    items: [
      { name: 'Node.js',       role: 'Runtime & async I/O'       },
      { name: 'Express',       role: 'HTTP server framework'      },
      { name: 'MongoDB',       role: 'Document store & queries'   },
      { name: 'JWT Auth',      role: 'Stateless security layer'   },
      { name: 'RESTful API',   role: 'HTTP/JSON design patterns'  },
    ],
  },
  {
    domain: 'Frontend & UI',
    description: 'Component-driven interfaces built for real users.',
    items: [
      { name: 'React.js',      role: 'Component UI runtime'       },
      { name: 'Vite',          role: 'Build tooling & HMR'        },
      { name: 'Tailwind CSS',  role: 'Utility-first styling'      },
      { name: 'JavaScript ES+',role: 'Language runtime'           },
    ],
  },
  {
    domain: 'Embedded & IoT',
    description: 'Firmware, control systems, and hardware-software bridges.',
    items: [
      { name: 'Arduino Uno',   role: 'Microcontroller platform'   },
      { name: 'Fuzzy Logic',   role: 'Control system algorithm'   },
      { name: 'C++ Firmware',  role: 'Embedded code execution'    },
      { name: 'Sensor I/O',    role: 'Signal acquisition & ADC'   },
      { name: 'PWM Control',   role: 'Actuator duty-cycle driving' },
    ],
  },
]

function GroupCard({ domain, description, items }) {
  return (
    <div className="flex flex-col p-6 rounded-xl border border-fence bg-card">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-ink tracking-tight mb-1">
          {domain}
        </h3>
        <p className="text-xs text-dim leading-relaxed">{description}</p>
      </div>

      <ul className="space-y-0 flex-1">
        {items.map(({ name, role }, i) => (
          <li
            key={name}
            className={`flex items-start justify-between gap-4 py-3 ${
              i < items.length - 1 ? 'border-b border-fence' : ''
            }`}
          >
            <span className="text-sm text-ink font-medium">{name}</span>
            <span className="text-xs text-dim font-mono text-right shrink-0 mt-0.5">
              {role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TechStack() {
  return (
    <section id="stack" className="max-w-6xl mx-auto px-6 py-24 border-t border-fence">

      {/* Section header */}
      <div className="mb-10">
        <p className="text-xs text-dim font-mono uppercase tracking-widest mb-2">
          03 / Technical Depth
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">
          Stack &amp; Architecture
        </h2>
        <p className="mt-2 text-sm text-muted max-w-[48ch] leading-relaxed">
          Grouped by domain. Every item is production-tested, not aspirational.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map((g) => (
          <GroupCard key={g.domain} {...g} />
        ))}
      </div>

      {/* Bottom strip — architecture philosophy line */}
      <div className="mt-6 flex flex-wrap items-center gap-4 px-5 py-4 rounded-xl border border-fence bg-card">
        <span className="text-[10px] text-dim font-mono uppercase tracking-widest shrink-0">
          Design Pattern
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-muted">
          {[
            'Controller', '→', 'Service', '→', 'Repository', '→', 'Database',
          ].map((node, i) => (
            <span
              key={i}
              className={node === '→' ? 'text-faint' : 'text-[#a3a3a3]'}
            >
              {node}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
