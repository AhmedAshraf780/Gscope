import { useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type ToastContextValue, type ToastInput, type ToastRecord } from './toastContext'

const TOAST_TTL_MS = 4000

const kindClasses: Record<NonNullable<ToastInput['kind']>, string> = {
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
  error: 'border-rose-400/25 bg-rose-400/10 text-rose-100',
  info: 'border-white/15 bg-[#101827] text-white',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: (input) => {
        const id = crypto.randomUUID()
        const record: ToastRecord = { id, kind: 'info', ...input }

        setToasts((current) => [...current, record])
        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }, TOAST_TTL_MS)
      },
      dismiss: (id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className={[
              'pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md',
              kindClasses[toast.kind ?? 'info'],
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-white/75">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => value.dismiss(toast.id)}
                className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
              >
                Close
              </button>
            </div>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
