import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import '../App.css'

const stats = [
  { value: '1 dashboard', label: 'for classes, members, coaches, and subscriptions' },
  { value: '0 chaos', label: 'when check-ins, billing, and reports finally align' },
  { value: '24/7', label: 'owner visibility into revenue, retention, and occupancy' },
]

const features = [
  {
    title: 'Front desk that moves fast',
    copy:
      'Handle walk-ins, barcode check-ins, expired plans, and failed renewals without slowing the line.',
  },
  {
    title: 'Membership billing that behaves',
    copy:
      'Run free plans, paid tiers, renewals, add-ons, and overdue follow-up from one operational flow.',
  },
  {
    title: 'Coaches see what matters',
    copy:
      'Schedules, attendance, class capacity, and member context stay visible without back-and-forth.',
  },
  {
    title: 'Owners get real reporting',
    copy:
      'Track MRR, churn signals, busiest slots, membership mix, and branch performance in plain numbers.',
  },
]

const workflow = [
  {
    step: '01',
    title: 'Launch free',
    copy: 'Start with the core gym system and run daily operations without paying upfront.',
  },
  {
    step: '02',
    title: 'Turn on growth tools',
    copy:
      'Upgrade when you need smarter automations, branch controls, premium analytics, and more staff roles.',
  },
  {
    step: '03',
    title: 'Operate like a chain',
    copy:
      'Use one system across locations with consistency in check-ins, billing, classes, and reporting.',
  },
]

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For gyms that need structure now.',
    highlight: false,
    points: ['Member management', 'Class scheduling', 'Basic check-ins', 'Essential reporting'],
  },
  {
    name: 'Scale',
    price: '$49',
    description: 'For owners buying back time.',
    highlight: true,
    points: ['Advanced billing flows', 'Automation and alerts', 'Staff permissions', 'Deeper analytics'],
  },
  {
    name: 'Multi-Branch',
    price: 'Custom',
    description: 'For operators building a serious network.',
    highlight: false,
    points: ['Branch rollups', 'Cross-location visibility', 'Priority support', 'Custom onboarding'],
  },
]

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-reveal="hero"]', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      })

      gsap.from('[data-reveal="section"]', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.35,
      })

      gsap.to('[data-float="slow"]', {
        y: -18,
        x: 12,
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      })

      gsap.to('[data-float="pulse"]', {
        scale: 1.06,
        opacity: 0.88,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.18,
      })
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <main className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div
            data-float="pulse"
            className="hero-orb absolute left-[8%] top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,212,102,0.55),_rgba(255,212,102,0))] blur-2xl"
          />
          <div
            data-float="slow"
            className="hero-orb absolute right-[8%] top-28 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(55,114,255,0.32),_rgba(55,114,255,0))] blur-2xl"
          />
          <div
            data-float="pulse"
            className="hero-orb absolute bottom-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,122,69,0.24),_rgba(255,122,69,0))] blur-2xl"
          />
          <div className="grid-overlay absolute inset-0" />
        </div>

        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <header
            data-reveal="hero"
            className="flex items-center justify-between rounded-full border border-white/10 bg-white/6 px-5 py-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,_#ff7a45,_#3772ff)] font-display text-sm font-bold text-white">
                GS
              </div>
              <div>
                <p className="font-display text-lg tracking-[0.18em] text-white">GSCOPE</p>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Gym Ops Platform
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
              <a href="#features" className="transition hover:text-white">
                Features
              </a>
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a href="#pricing" className="transition hover:text-white">
                Pricing
              </a>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/dashboard"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-white/30 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/signin"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-white/30 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#08111f] transition hover:-translate-y-0.5"
              >
                Start free
              </Link>
            </div>
          </header>

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
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[#09111d] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-white/30 hover:text-white"
                >
                  View dashboard
                </Link>
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
        </section>

        <section className="border-y border-[var(--line)] bg-white/[0.03]">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-6 text-sm uppercase tracking-[0.24em] text-[var(--muted)] sm:px-8 lg:px-10">
            <span data-reveal="section">made for boutique gyms</span>
            <span data-reveal="section">built for multi-branch operators</span>
            <span data-reveal="section">free core + premium expansion</span>
            <span data-reveal="section">ops, billing, analytics</span>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p
              data-reveal="section"
              className="text-sm uppercase tracking-[0.28em] text-[var(--sand)]"
            >
              Why Gscope
            </p>
            <h2
              data-reveal="section"
              className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl"
            >
              Your gym stops feeling patched together.
            </h2>
            <p data-reveal="section" className="mt-5 text-lg leading-8 text-[var(--muted)]">
              Owners should not need five tools and a spreadsheet just to understand attendance,
              plans, staff workload, and revenue. Gscope turns that mess into one deliberate
              system.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {features.map((feature, index) => (
              <article
                data-reveal="section"
                key={feature.title}
                className="group relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-7 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="absolute right-6 top-5 font-display text-6xl text-white/6">
                  0{index + 1}
                </div>
                <h3 className="max-w-sm font-display text-3xl text-white">{feature.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
          <div className="rounded-[2.25rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 sm:p-10">
            <div className="max-w-2xl">
              <p
                data-reveal="section"
                className="text-sm uppercase tracking-[0.28em] text-[var(--sand)]"
              >
                Growth path
              </p>
              <h2
                data-reveal="section"
                className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl"
              >
                Start free. Upgrade only when the gym needs more firepower.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {workflow.map((item) => (
                <article
                  data-reveal="section"
                  key={item.step}
                  className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6"
                >
                  <p className="text-sm uppercase tracking-[0.26em] text-[var(--accent)]">
                    {item.step}
                  </p>
                  <h3 className="mt-5 font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[var(--muted)]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p
              data-reveal="section"
              className="text-sm uppercase tracking-[0.28em] text-[var(--sand)]"
            >
              Pricing
            </p>
            <h2
              data-reveal="section"
              className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl"
            >
              Flexible enough for an independent club, sharp enough for a growing brand.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                data-reveal="section"
                key={tier.name}
                className={[
                  'rounded-[2rem] border p-7',
                  tier.highlight
                    ? 'border-[var(--accent)] bg-[linear-gradient(180deg,rgba(255,212,102,0.14),rgba(255,255,255,0.05))] shadow-[0_24px_80px_rgba(255,212,102,0.12)]'
                    : 'border-[var(--line)] bg-white/[0.04]',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl text-white">{tier.name}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {tier.description}
                    </p>
                  </div>
                  {tier.highlight ? (
                    <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#08111f]">
                      Popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-8 font-display text-5xl text-white">{tier.price}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  {tier.price === 'Custom' ? 'tailored rollout' : 'per month'}
                </p>

                <div className="mt-8 space-y-3">
                  {tier.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {point}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
          <div
            data-reveal="section"
            className="overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,122,69,0.18),rgba(55,114,255,0.2),rgba(255,212,102,0.14))] p-[1px]"
          >
            <div className="rounded-[2.45rem] bg-[#08111f] px-8 py-10 sm:px-10 sm:py-12">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--sand)]">
                Ready to run a cleaner gym?
              </p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                    Give owners a system they can trust from the first check-in to the monthly
                    revenue report.
                  </h2>
                </div>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
                >
                  Start your free account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
