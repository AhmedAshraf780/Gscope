interface BankPaneProps {
  bankMoney: number | null;
}

export function BankPane({ bankMoney }: BankPaneProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
          Bank pane
        </p>
        <h2 className="mt-3 font-display text-3xl text-white">
          Financial overview and funds.
        </h2>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            Total Balance
          </p>
          <p className="mt-6 font-display text-6xl text-emerald-400">
            ${bankMoney !== null ? bankMoney.toLocaleString() : "---"}
          </p>
          <p className="mt-4 text-sm text-[var(--sand)]">
            Available funds
          </p>
        </div>
      </div>
    </section>
  );
}
