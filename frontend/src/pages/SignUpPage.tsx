import { Link } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'

const fields = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Mazen Hassan' },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+20 100 123 4567' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'owner@gscope.app' },
  { id: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password' },
]

export function SignUpPage() {
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
      <form className="space-y-4">
        {fields.map((field) => (
          <label key={field.id} className="block">
            <span className="mb-2 block text-sm font-medium text-white">{field.label}</span>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--accent)]"
            />
          </label>
        ))}

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          Create account
        </button>
      </form>
    </AuthShell>
  )
}
