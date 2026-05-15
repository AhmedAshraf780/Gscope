import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'
import { useFormik } from 'formik'

export function UpdatePasswordPage() {
  const navigate = useNavigate()
  const { pendingOtpSession, clearOtpSession } = useAuth()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.'
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Required'
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.'
      }
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!pendingOtpSession?.session) {
        toast({
          title: 'Update failed',
          description: 'Missing session. Please start the recovery process again.',
          kind: 'error',
        })
        setSubmitting(false)
        return
      }

      const response = await authService.restorePassword(
        values.password,
        values.confirmPassword,
        pendingOtpSession.session
      )
      setSubmitting(false)

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
    },
  })

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
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">New password</span>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter new password"
            className={`w-full rounded-2xl border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-white/10'} bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]`}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="mt-1 text-sm text-red-500">{formik.errors.password}</div>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white">Confirm new password</span>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm new password"
            className={`w-full rounded-2xl border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-white/10'} bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</div>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {formik.isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthShell>
  )
}
