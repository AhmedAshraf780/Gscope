import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, getResponseSession, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'
import { useFormik } from 'formik'

const fields = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Mazen Hassan' },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+20 100 123 4567' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'owner@gscope.app' },
  { id: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password' },
]

export function SignUpPage() {
  const navigate = useNavigate()
  const { savePendingOtpSession, clearOtpSession } = useAuth()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Required'
      if (!values.phone) errors.phone = 'Required'
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      if (!values.password) errors.password = 'Required'
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      clearOtpSession()

      const response = await authService.signup(
        values.email.trim(),
        values.password,
        values.phone.trim(),
        values.name.trim(),
      )

      setSubmitting(false)

      if (!response || !isResponseSuccess(response)) {
        toast({ title: 'Signup failed', description: getResponseMessage(response), kind: 'error' })
        return
      }

      const session = getResponseSession(response)
      if (!session) {
        toast({
          title: 'Signup failed',
          description: 'Signup succeeded but no OTP session was returned.',
          kind: 'error',
        })
        return
      }

      savePendingOtpSession({
        session,
        email: values.email.trim(),
        source: 'signup',
      })
      toast({ title: 'OTP sent', description: 'Enter the code to continue.', kind: 'success' })
      navigate('/validateOtp', { replace: true })
    },
  })

  return (
    <AuthShell
      eyebrow="Create account"
      title="Open your gym workspace in minutes."
      description="Create the owner account, verify access, and start configuring members, classes, and subscriptions from one place."
      asideTitle="The first account should feel premium, not procedural."
      asideCopy="Gscope is designed for gym owners who want a polished operation from day one. The account flow stays lean while leaving room for serious growth."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-white">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <label key={field.id} className="block">
            <span className="mb-2 block text-sm font-medium text-white">{field.label}</span>
            <input
              name={field.id}
              type={field.type}
              value={formik.values[field.id as keyof typeof formik.values]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={field.placeholder}
              className={`w-full rounded-2xl border ${formik.touched[field.id as keyof typeof formik.touched] && formik.errors[field.id as keyof typeof formik.errors] ? 'border-red-500' : 'border-white/10'} bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]`}
            />
            {formik.touched[field.id as keyof typeof formik.touched] && formik.errors[field.id as keyof typeof formik.errors] ? (
              <div className="mt-1 text-sm text-red-500">{formik.errors[field.id as keyof typeof formik.errors]}</div>
            ) : null}
          </label>
        ))}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {formik.isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
