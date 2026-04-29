import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, getResponseSession, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { savePendingOtpSession, clearOtpSession } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    clearOtpSession()

    const response = await authService.forgetPassword(email.trim())
    setIsSubmitting(false)

    if (!response || !isResponseSuccess(response)) {
      setError(getResponseMessage(response))
      return
    }

    const session = getResponseSession(response)
    if (!session) {
      setError('Reset request succeeded but no OTP session was returned.')
      return
    }

    savePendingOtpSession({
      session,
      email: email.trim(),
      source: 'forgotpassword',
    })
    navigate('/validateOtp', { replace: true })
  }

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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@gscope.app"
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
          />
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {isSubmitting ? 'Sending...' : 'Send reset code'}
        </button>
      </form>
    </AuthShell>
  )
}
