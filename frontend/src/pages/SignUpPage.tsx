import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getResponseMessage, getResponseSession, isResponseSuccess } from '../auth/authStorage'
import { useAuth } from '../auth/useAuth'
import { AuthShell } from '../components/AuthShell'
import { authService } from '../services/auth.service'
import { useToast } from '../toast/useToast'

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
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    clearOtpSession()

    const response = await authService.signup(
      form.email.trim(),
      form.password,
      form.phone.trim(),
      form.name.trim(),
    )

    setIsSubmitting(false)

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
      email: form.email.trim(),
      source: 'signup',
    })
    toast({ title: 'OTP sent', description: 'Enter the code to continue.', kind: 'success' })
    navigate('/validateOtp', { replace: true })
  }

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
      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.id} className="block">
            <span className="mb-2 block text-sm font-medium text-white">{field.label}</span>
            <input
              name={field.id}
              type={field.type}
              value={form[field.id as keyof typeof form]}
              onChange={(event) =>
                setForm((current) => ({ ...current, [field.id]: event.target.value }))
              }
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
