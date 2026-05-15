import { type ChangeEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'
import { useFormik } from 'formik'

const OTP_LENGTH = 6

export function ValidateOtpPage() {
  const navigate = useNavigate()
  const { pendingOtpSession, clearOtpSession, savePendingOtpSession } = useAuth()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      otp: Array.from({ length: OTP_LENGTH }, () => ''),
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!pendingOtpSession?.session) {
        toast({
          title: 'OTP validation failed',
          description: 'Missing OTP session. Please sign up again.',
          kind: 'error',
        })
        setSubmitting(false)
        return
      }

      const code = values.otp.join('')
      if (code.length !== OTP_LENGTH) {
        toast({
          title: 'OTP validation failed',
          description: 'Enter the complete 6-digit code.',
          kind: 'error',
        })
        setSubmitting(false)
        return
      }

      const response = await authService.sendOTP(pendingOtpSession.session, code)
      setSubmitting(false)

      if (!response || !isResponseSuccess(response)) {
        toast({
          title: 'OTP validation failed',
          description: getResponseMessage(response),
          kind: 'error',
        })
        return
      }

      const email = pendingOtpSession.email
      
      if ((response as any).forgotPassword) {
        savePendingOtpSession({
          email,
          session: (response as any).session,
          source: 'forgotpassword',
        })
        toast({ title: 'OTP validated', description: 'Please update your password.', kind: 'success' })
        navigate('/updatepassword', { replace: true })
        return
      }

      clearOtpSession()
      toast({ title: 'OTP validated', description: 'You can sign in now.', kind: 'success' })
      navigate('/signin', { replace: true, state: { email } })
    },
  })

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1)
    const next = [...formik.values.otp]
    next[index] = value
    formik.setFieldValue('otp', next)

    if (value && event.target.nextElementSibling instanceof HTMLInputElement) {
      event.target.nextElementSibling.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Backspace' &&
      !formik.values.otp[index] &&
      event.currentTarget.previousElementSibling instanceof HTMLInputElement
    ) {
      event.currentTarget.previousElementSibling.focus()
    }
  }

  return (
    <AuthShell
      eyebrow="OTP verification"
      title="Validate the code and continue securely."
      description="Enter the one-time password sent to the owner so the account can be verified or the password reset can continue."
      asideTitle="One short step between identity and full access."
      asideCopy="The verification page keeps the same polished visual rhythm while focusing attention on the only thing that matters: entering the code correctly."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            Need a new code?{' '}
            <Link to="/forgotpassword" className="font-semibold text-white">
              Resend from recovery
            </Link>
          </p>
          <Link to="/signin" className="font-semibold text-[var(--sand)]">
            Back to sign in
          </Link>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        <div>
          <span className="mb-2 block text-sm font-medium text-white">Verification code</span>
          {pendingOtpSession?.email ? (
            <p className="mb-4 text-sm text-[var(--muted)]">
              Enter the code sent for {pendingOtpSession.email}.
            </p>
          ) : null}
          <div className="grid grid-cols-6 gap-3">
            {formik.values.otp.map((digit, index) => (
              <input
                key={index}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-[#09111d] text-center text-xl font-semibold text-white outline-none transition focus:border-[var(--accent)]"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {formik.isSubmitting ? 'Validating...' : 'Validate OTP'}
        </button>
      </form>
    </AuthShell>
  )
}
