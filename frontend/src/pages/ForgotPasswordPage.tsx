import { Link } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'

export function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset access without involving support."
      description="Enter the account email and send a reset code so the owner can confirm identity and set a new password."
      asideTitle="Recovery should stay secure and still feel fast."
      asideCopy="This page gives gym owners a direct route back into the system while keeping the rest of the auth flow consistent."
      footer={
        <p>
          Remembered it?{' '}
          <Link to="/signin" className="font-semibold text-white">
            Return to sign in
          </Link>
        </p>
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

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          Send reset code
        </button>

        <Link
          to="/validateOtp"
          className="block rounded-2xl border border-white/10 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/30"
        >
          I already have the OTP
        </Link>
      </form>
    </AuthShell>
  )
}
