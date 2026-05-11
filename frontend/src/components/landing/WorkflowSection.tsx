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

export function WorkflowSection() {
  return (
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
  )
}
