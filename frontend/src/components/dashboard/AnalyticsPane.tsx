export function AnalyticsPane() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
          Analytics pane
        </p>
        <h2 className="mt-3 font-display text-3xl text-white">
          Revenue, retention, and traffic at a glance.
        </h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Monthly revenue trend
              </p>
              <p className="mt-2 font-display text-3xl text-white">
                $18.4k current
              </p>
            </div>
            <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-xs text-emerald-200">
              +9.2%
            </span>
          </div>
          <div className="mt-8 flex h-56 items-end gap-3">
            {[
              "36%",
              "42%",
              "48%",
              "55%",
              "62%",
              "73%",
              "88%",
              "81%",
            ].map((height, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div
                  className="w-full rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(255,212,102,0.95),rgba(55,114,255,0.5))]"
                  style={{ height }}
                />
                <span className="text-xs text-[var(--muted)]">
                  {
                    [
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                    ][index]
                  }
                </span>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
            <p className="text-sm text-[var(--muted)]">
              Membership mix
            </p>
            <div className="mt-5 space-y-4">
              {[
                ["Monthly", "54%"],
                ["Session Packs", "28%"],
                ["Quarterly / Annual", "18%"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{label}</span>
                    <span className="text-[var(--muted)]">
                      {value}
                    </span>
                  </div>
                  <div className="mt-2 rounded-full bg-white/8 p-1">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: value as string }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
            <p className="text-sm text-[var(--muted)]">
              Operational notes
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                Peak occupancy is holding between 6 PM and 8 PM on
                weekdays.
              </p>
              <p>
                Boxing packages are converting better than standard
                session packs.
              </p>
              <p>
                Expired memberships need follow-up before the next
                billing cycle.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
