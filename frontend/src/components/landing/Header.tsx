import { Link } from 'react-router-dom'

export function Header() {
  return (
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
  )
}
