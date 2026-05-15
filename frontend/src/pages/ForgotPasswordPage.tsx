import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, getResponseSession, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'
import { useFormik } from 'formik'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { savePendingOtpSession, clearOtpSession } = useAuth()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      clearOtpSession()

      const response = await authService.forgetPassword(values.email.trim())
      setSubmitting(false)

      if (!response || !isResponseSuccess(response)) {
        toast({
          title: 'Reset request failed',
          description: getResponseMessage(response),
          kind: 'error',
        })
        return
      }

      const session = getResponseSession(response)
      if (!session) {
        toast({
          title: 'Reset request failed',
          description: 'Reset request succeeded but no OTP session was returned.',
          kind: 'error',
        })
        return
      }

      savePendingOtpSession({
        session,
        email: values.email.trim(),
        source: 'forgotpassword',
      })
      toast({ title: 'OTP sent', description: 'Use the code to continue recovery.', kind: 'success' })
      navigate('/validateOtp', { replace: true })
    },
  })

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
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Email</span>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="owner@gscope.app"
            className={`w-full rounded-2xl border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-white/10'} bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="mt-1 text-sm text-red-500">{String(formik.errors.email)}</div>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {formik.isSubmitting ? 'Sending...' : 'Send reset code'}
        </button>
      </form>
    </AuthShell>
  )
}
