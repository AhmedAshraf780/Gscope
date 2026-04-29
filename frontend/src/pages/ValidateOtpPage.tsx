import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'

const OTP_LENGTH = 6

export function ValidateOtpPage() {
  const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ''))

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = value
    setOtp(next)

    if (value && event.target.nextElementSibling instanceof HTMLInputElement) {
      event.target.nextElementSibling.focus()
    }
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
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
      <form className="space-y-6">
        <div>
          <span className="mb-2 block text-sm font-medium text-white">Verification code</span>
          <div className="grid grid-cols-6 gap-3">
            {otp.map((digit, index) => (
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
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] transition hover:-translate-y-0.5"
        >
          Validate OTP
        </button>
      </form>
    </AuthShell>
  )
}
