import { Link } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'

export function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in and get straight to gym operations."
      description="Access your dashboard, staff workflows, class schedules, and billing controls without friction."
      asideTitle="Your club data, member flow, and subscriptions stay one login away."
      asideCopy="Sign in is intentionally clean so returning owners and staff can move quickly from authentication into actual work."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            Need an account?{' '}
            <Link to="/signup" className="font-semibold text-white">
              Start free
            </Link>
          </p>
          <Link to="/forgotpassword" className="font-semibold text-[var(--sand)]">
            Forgot password?
          </Link>
        </div>
      }
    >
      <form className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Email</span>
          <input
            type="email"
            placeholder="owner@gscope.app"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          Sign in
        </button>

        <Link
          to="/dashboard"
          className="block rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/30"
        >
          Open demo dashboard
        </Link>
      </form>
    </AuthShell>
  )
}
