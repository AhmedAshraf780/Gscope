import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'

export function UpdatePasswordPage() {
  const navigate = useNavigate()
  const { pendingOtpSession, clearOtpSession } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!pendingOtpSession?.session) {
      toast({
        title: 'Update failed',
        description: 'Missing session. Please start the recovery process again.',
        kind: 'error',
      })
      return
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: 'Validation failed',
        description: 'Passwords do not match.',
        kind: 'error',
      })
      return
    }

    if (form.password.length < 6) {
      toast({
        title: 'Validation failed',
        description: 'Password must be at least 6 characters long.',
        kind: 'error',
      })
      return
    }

    setIsSubmitting(true)
    const response = await authService.restorePassword(
      form.password,
      form.confirmPassword,
      pendingOtpSession.session
    )
    setIsSubmitting(false)

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: 'Update failed',
        description: getResponseMessage(response),
        kind: 'error',
      })
      return
    }

    clearOtpSession()
    toast({
      title: 'Password updated',
      description: 'Your password has been successfully updated. You can sign in now.',
      kind: 'success',
    })
    navigate('/signin', { replace: true, state: { email: pendingOtpSession.email } })
  }

  return (
    <AuthShell
      eyebrow="Update password"
      title="Secure your account with a new password."
      description="Enter a strong new password to regain access to your dashboard."
      asideTitle="Almost there."
      asideCopy="Once updated, you'll be redirected back to the sign in page to access your account."
      footer={
        <p>
          Remembered it?{' '}
          <Link to="/signin" className="font-semibold text-[var(--sand)]">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">New password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter new password"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Confirm new password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            placeholder="Confirm new password"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthShell>
  )
}
