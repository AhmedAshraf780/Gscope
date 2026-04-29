import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getResponseMessage, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'

export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuthenticatedFromResponse } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({
    email: typeof location.state?.email === 'string' ? location.state.email : '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const response = await authService.login(form.email.trim(), form.password)
    setIsSubmitting(false)

    if (!response || !isResponseSuccess(response)) {
      toast({ title: 'Sign in failed', description: getResponseMessage(response), kind: 'error' })
      return
    }

    setAuthenticatedFromResponse(response)
    toast({ title: 'Signed in', description: 'Welcome back.', kind: 'success' })
    const from = typeof location.state?.from === 'string' ? location.state.from : '/dashboard'
    navigate(from, { replace: true })
  }

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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="owner@gscope.app"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
