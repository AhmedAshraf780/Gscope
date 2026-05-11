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

export function PricingSection() {
  return (
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
  )
}
