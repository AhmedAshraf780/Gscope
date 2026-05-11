import { Link } from 'react-router-dom'

export function CTASection() {
  return (
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
  )
}
