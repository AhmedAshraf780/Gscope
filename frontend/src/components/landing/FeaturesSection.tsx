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

export function FeaturesSection() {
  return (
    <>
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
    </>
  )
}
