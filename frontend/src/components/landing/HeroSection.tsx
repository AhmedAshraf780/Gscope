import { Link } from 'react-router-dom'

const stats = [
  { value: '1 dashboard', label: 'for classes, members, coaches, and subscriptions' },
  { value: '0 chaos', label: 'when check-ins, billing, and reports finally align' },
  { value: '24/7', label: 'owner visibility into revenue, retention, and occupancy' },
]

export function HeroSection() {
  return (
    <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
      <div className="max-w-3xl">
        <div
          data-reveal="hero"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[var(--sand)]"
        >
          Free to start
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Built for modern gym owners
        </div>

        <h1
          data-reveal="hero"
          className="mt-6 max-w-4xl font-display text-5xl leading-none text-white sm:text-6xl lg:text-8xl"
        >
          The gym system that makes the front desk feel elite.
        </h1>

        <p
          data-reveal="hero"
          className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl"
        >
          Gscope gives gym owners a serious operating system: member management,
          subscriptions, classes, staff workflows, and analytics in one sharp platform with
          a free entry point and premium room to grow.
        </p>

        <div data-reveal="hero" className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(255,212,102,0.25)]"
          >
            Start free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white/6 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Explore the system
          </a>

        </div>

        <div data-reveal="hero" className="mt-12 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.value}
              className="rounded-[1.75rem] border border-[var(--line)] bg-white/6 p-5 backdrop-blur-sm"
            >
              <p className="font-display text-2xl text-white">{stat.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>

      <div data-reveal="hero" className="relative lg:justify-self-end">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,23,40,0.98),rgba(9,15,28,0.92))] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)]" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Live club view
              </p>
              <p className="mt-2 font-display text-2xl text-white">Downtown Iron Club</p>
            </div>
            <div className="rounded-full bg-emerald-400/14 px-3 py-1 text-xs font-medium text-emerald-200">
              128 active now
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-[var(--muted)]">Monthly recurring revenue</p>
              <p className="mt-3 font-display text-4xl text-white">$18.4k</p>
              <div className="mt-4 h-24 rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(55,114,255,0.22),rgba(55,114,255,0.03))] p-3">
                <div className="chart-bars flex h-full items-end gap-2">
                  <span className="h-[38%]" />
                  <span className="h-[52%]" />
                  <span className="h-[61%]" />
                  <span className="h-[58%]" />
                  <span className="h-[82%]" />
                  <span className="h-[95%]" />
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,122,69,0.16),rgba(255,122,69,0.03))] p-4">
              <p className="text-sm text-[var(--muted)]">Today&apos;s check-ins</p>
              <p className="mt-3 font-display text-4xl text-white">347</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-full bg-white/8 p-1">
                  <div className="h-2 w-[78%] rounded-full bg-[var(--accent)]" />
                </div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  <span>Peak period</span>
                  <span>6 PM - 8 PM</span>
                </div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--muted)]">Automations keeping staff ahead</p>
                  <p className="mt-2 font-display text-2xl text-white">
                    Renewals, failed payments, and class capacity alerts
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
                  Premium tier
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#0b1321] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Failed charges
                  </p>
                  <p className="mt-2 font-display text-2xl text-white">4</p>
                </div>
                <div className="rounded-2xl bg-[#0b1321] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Waitlist filled
                  </p>
                  <p className="mt-2 font-display text-2xl text-white">16 spots</p>
                </div>
                <div className="rounded-2xl bg-[#0b1321] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    At-risk members
                  </p>
                  <p className="mt-2 font-display text-2xl text-white">23</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
