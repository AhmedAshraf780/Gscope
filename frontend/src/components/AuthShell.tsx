import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  asideTitle: string
  asideCopy: string
  children: ReactNode
  footer: ReactNode
}

const asideMetrics = [
  { value: '92%', label: 'faster setup for new gym staff' },
  { value: '3 views', label: 'to manage members, classes, and payments' },
  { value: '1 system', label: 'for free plans and premium expansion' },
]

export function AuthShell({
  eyebrow,
  title,
  description,
  asideTitle,
  asideCopy,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--ink)]">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="hero-orb absolute left-[10%] top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,212,102,0.32),_rgba(255,212,102,0))] blur-3xl" />
        <div className="hero-orb absolute bottom-16 right-[10%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(55,114,255,0.3),_rgba(55,114,255,0))] blur-3xl" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/6 px-5 py-3 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,_#ff7a45,_#3772ff)] font-display text-sm font-bold text-white">
              GS
            </div>
            <div>
              <p className="font-display text-lg tracking-[0.18em] text-white">GSCOPE</p>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Gym Ops Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/signin"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-[var(--muted)] transition hover:border-white/30 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-[#08111f] transition hover:-translate-y-0.5"
            >
              Start free
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-12">
          <section className="rounded-[2.25rem] border border-[var(--line)] bg-white/[0.04] p-8 backdrop-blur-md sm:p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--sand)]">{eyebrow}</p>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">{description}</p>

            <div className="mt-8 space-y-4">{children}</div>

            <div className="mt-8 text-sm text-[var(--muted)]">{footer}</div>
          </section>

          <aside className="rounded-[2.25rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 sm:p-10">
            <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--sand)]">
              Owner-ready workflow
            </div>

            <h2 className="mt-6 max-w-lg font-display text-4xl leading-tight text-white">
              {asideTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">{asideCopy}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {asideMetrics.map((metric) => (
                <article
                  key={metric.value}
                  className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5"
                >
                  <p className="font-display text-3xl text-white">{metric.value}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{metric.label}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-[#08111f] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Gym launch checklist
              </p>
              <div className="mt-5 space-y-4">
                {['Create the owner account', 'Verify access with OTP', 'Invite staff and open the gym'].map(
                  (item, index) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-white/8 text-xs">
                        0{index + 1}
                      </div>
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
