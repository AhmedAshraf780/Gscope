import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { extractNestedRecord } from '../auth/authStorage'
import { memberService } from '../services/member.service'
import { offersService } from '../services/offers.service'
import { useAuth } from '../auth/useAuth'

type Member = {
  id: string
  name: string
  email: string
  phone: string
  plan: string
  status: 'Active' | 'Paused' | 'Expired'
  sessionsLeft: number
  joinedAt: string
  lastCheckIn: string
}

type LogEntry = {
  id: string
  date: string
  time: string
  actor: string
  action: string
  details: string
}

type OfferOption = {
  id: string
  name: string
}

type ProfileMember = {
  id: string
  name: string
  phone: string
  months: string
  amount: string
  startDate: string
  endDate: string
  notes: string
}

const getMemberActivity = (endDate: string) => {
  if (!endDate) {
    return {
      label: 'Active',
      className: 'bg-emerald-400/14 text-emerald-200',
    }
  }

  const end = new Date(endDate)
  if (Number.isNaN(end.getTime())) {
    return {
      label: 'Active',
      className: 'bg-emerald-400/14 text-emerald-200',
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const diffInDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) {
    return {
      label: 'Inactive',
      className: 'bg-rose-400/14 text-rose-200',
    }
  }

  if (diffInDays <= 3) {
    return {
      label: 'Expiring Soon',
      className: 'bg-amber-400/14 text-amber-200',
    }
  }

  return {
    label: 'Active',
    className: 'bg-emerald-400/14 text-emerald-200',
  }
}

const initialMembers: Member[] = [
  {
    id: 'MBR-1001',
    name: 'Omar Adel',
    email: 'omar.adel@gscope.app',
    phone: '+20 101 200 3001',
    plan: 'Monthly Premium',
    status: 'Active',
    sessionsLeft: 10,
    joinedAt: '2026-03-03',
    lastCheckIn: '2026-04-29 08:12',
  },
  {
    id: 'MBR-1002',
    name: 'Mariam Samy',
    email: 'mariam.samy@gscope.app',
    phone: '+20 101 200 3002',
    plan: '12 Sessions Pack',
    status: 'Active',
    sessionsLeft: 4,
    joinedAt: '2026-02-18',
    lastCheckIn: '2026-04-29 10:47',
  },
  {
    id: 'MBR-1003',
    name: 'Youssef Tarek',
    email: 'youssef.tarek@gscope.app',
    phone: '+20 101 200 3003',
    plan: 'Quarterly Strength',
    status: 'Paused',
    sessionsLeft: 18,
    joinedAt: '2026-01-21',
    lastCheckIn: '2026-04-22 19:03',
  },
  {
    id: 'MBR-1004',
    name: 'Nadine Hossam',
    email: 'nadine.hossam@gscope.app',
    phone: '+20 101 200 3004',
    plan: 'Monthly Standard',
    status: 'Expired',
    sessionsLeft: 0,
    joinedAt: '2025-12-09',
    lastCheckIn: '2026-04-15 17:35',
  },
  {
    id: 'MBR-1005',
    name: 'Karim Essam',
    email: 'karim.essam@gscope.app',
    phone: '+20 101 200 3005',
    plan: '8 Sessions Boxing',
    status: 'Active',
    sessionsLeft: 2,
    joinedAt: '2026-04-02',
    lastCheckIn: '2026-04-29 07:55',
  },
]

const initialLogs: LogEntry[] = [
  {
    id: 'LOG-001',
    date: '2026-04-29',
    time: '08:12',
    actor: 'Front Desk',
    action: 'Check-in',
    details: 'Omar Adel entered with Monthly Premium plan.',
  },
  {
    id: 'LOG-002',
    date: '2026-04-29',
    time: '09:00',
    actor: 'Owner',
    action: 'Update Member',
    details: 'Mariam Samy sessions adjusted from 6 to 4.',
  },
  {
    id: 'LOG-003',
    date: '2026-04-29',
    time: '10:47',
    actor: 'Front Desk',
    action: 'Check-in',
    details: 'Mariam Samy checked in for HIIT class.',
  },
  {
    id: 'LOG-004',
    date: '2026-04-28',
    time: '18:20',
    actor: 'System',
    action: 'Subscription Alert',
    details: 'Nadine Hossam plan marked expired after failed renewal.',
  },
  {
    id: 'LOG-005',
    date: '2026-04-27',
    time: '14:40',
    actor: 'Owner',
    action: 'Add Session',
    details: 'Karim Essam received 8-session boxing package.',
  },
]

const panes = ['subscriptions', 'profiles', 'logs', 'analytics'] as const

type Pane = (typeof panes)[number]
const subscriptionActions = ['checkin', 'create', 'update'] as const
type SubscriptionAction = (typeof subscriptionActions)[number]
const createModes = ['member', 'session'] as const
type CreateMode = (typeof createModes)[number]

const metricCards = [
  { label: 'Active subscriptions', value: '184', delta: '+12 this month' },
  { label: 'Check-ins today', value: '347', delta: 'peak 6 PM - 8 PM' },
  { label: 'Revenue this month', value: '$18.4k', delta: '+9.2% vs last month' },
  { label: 'At-risk renewals', value: '23', delta: '7 need follow-up today' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activePane, setActivePane] = useState<Pane>('subscriptions')
  const [activeSubscriptionAction, setActiveSubscriptionAction] =
    useState<SubscriptionAction>('checkin')
  const [activeCreateMode, setActiveCreateMode] = useState<CreateMode>('member')
  const [members, setMembers] = useState(initialMembers)
  const [logs, setLogs] = useState(initialLogs)
  const [profileFilter, setProfileFilter] = useState('')
  const [logDate, setLogDate] = useState('2026-04-29')
  const [checkInId, setCheckInId] = useState('')
  const [offers, setOffers] = useState<OfferOption[]>([])
  const [offersError, setOffersError] = useState('')
  const [profileMembers, setProfileMembers] = useState<ProfileMember[]>([])
  const [profileMembersError, setProfileMembersError] = useState('')
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    offerId: '',
    numberOfMonths: '',
    amount: '',
    notes: '',
  })
  const [sessionForm, setSessionForm] = useState({
    name: '',
    phone: '',
    amount: '',
    sessionType: 'gym',
  })
  const [updateForm, setUpdateForm] = useState({
    id: '',
    offerId: '',
    numberOfMonths: '',
    amount: '',
    notes: '',
  })

  const deferredProfileFilter = useDeferredValue(profileFilter)

  const filteredMembers = useMemo(() => {
    const query = deferredProfileFilter.trim().toLowerCase()
    if (!query) {
      return profileMembers
    }

    return profileMembers.filter(
      (member) =>
        member.id.toLowerCase().includes(query) ||
        member.name.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query),
    )
  }, [deferredProfileFilter, profileMembers])

  const filteredLogs = useMemo(
    () => logs.filter((entry) => entry.date === logDate),
    [logDate, logs],
  )

  const activeCount = members.filter((member) => member.status === 'Active').length
  const expiringCount = members.filter((member) => member.status !== 'Active').length
  const totalSessionsLeft = members.reduce((sum, member) => sum + member.sessionsLeft, 0)

  useEffect(() => {
    const loadOffers = async () => {
      setOffersError('')
      const response = await offersService.getOffers()

      const records = (() => {
        if (Array.isArray(response)) {
          return response
        }

        const nested = extractNestedRecord(response)
        if (nested && Array.isArray(nested.offers)) {
          return nested.offers
        }

        if (response && typeof response === 'object' && Array.isArray((response as { offers?: unknown }).offers)) {
          return (response as { offers: unknown[] }).offers
        }

        if (response && typeof response === 'object' && Array.isArray((response as { data?: unknown }).data)) {
          return (response as { data: unknown[] }).data
        }

        return []
      })()

      const nextOffers = records
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null
          }

          const candidate = item as Record<string, unknown>
          const id = candidate.id ?? candidate._id ?? candidate.offerId ?? candidate.value
          const name = candidate.name ?? candidate.title ?? candidate.offerName ?? candidate.label

          if (typeof id !== 'string' || typeof name !== 'string') {
            return null
          }

          return { id, name }
        })
        .filter((item): item is OfferOption => item !== null)

      setOffers(nextOffers)

      if (!nextOffers.length) {
        setOffersError('No offers were returned from the backend.')
      }
    }

    void loadOffers()
  }, [])

  useEffect(() => {
    const loadMembers = async () => {
      setProfileMembersError('')
      const response = await memberService.getMembers(1)

      const records = (() => {
        if (Array.isArray(response)) {
          return response
        }

        const nested = extractNestedRecord(response)
        if (nested && Array.isArray(nested.members)) {
          return nested.members
        }

        if (
          response &&
          typeof response === 'object' &&
          Array.isArray((response as { members?: unknown }).members)
        ) {
          return (response as { members: unknown[] }).members
        }

        if (
          response &&
          typeof response === 'object' &&
          Array.isArray((response as { data?: unknown }).data)
        ) {
          return (response as { data: unknown[] }).data
        }

        return []
      })()

      const nextMembers = records
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null
          }

          const candidate = item as Record<string, unknown>
          return {
            id:
              typeof candidate.id === 'string'
                ? candidate.id
                : typeof candidate.id === 'number'
                  ? String(candidate.id)
                : typeof candidate._id === 'string'
                  ? candidate._id
                  : typeof candidate._id === 'number'
                    ? String(candidate._id)
                  : `member-${index}`,
            name: typeof candidate.name === 'string' ? candidate.name : '',
            phone: typeof candidate.phone === 'string' ? candidate.phone : '',
            months:
              typeof candidate.months === 'string'
                ? candidate.months
                : typeof candidate.months === 'number'
                  ? String(candidate.months)
                  : '',
            amount:
              typeof candidate.amount === 'string'
                ? candidate.amount
              : typeof candidate.amount === 'number'
                  ? String(candidate.amount)
                : typeof candidate.price === 'string'
                  ? candidate.price
                  : typeof candidate.price === 'number'
                    ? String(candidate.price)
                  : '',
            startDate:
              typeof candidate.start_date === 'string' ? candidate.start_date : '',
            endDate:
              typeof candidate.end_date === 'string' ? candidate.end_date : '',
            notes: typeof candidate.notes === 'string' ? candidate.notes : '',
          }
        })
        .filter((item): item is ProfileMember => item !== null)

      setProfileMembers(nextMembers)

      if (!nextMembers.length) {
        setProfileMembersError('No members were returned from the backend.')
      }
    }

    void loadMembers()
  }, [])

  const createLog = (action: string, details: string) => {
    const nextIndex = logs.length + 1
    return {
      id: `LOG-${String(nextIndex).padStart(3, '0')}`,
      date: '2026-04-29',
      time: '12:00',
      actor: 'Owner',
      action,
      details,
    }
  }

  const handleCheckIn = () => {
    const member = members.find((item) => item.id.toLowerCase() === checkInId.trim().toLowerCase())
    if (!member) {
      return
    }

    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, lastCheckIn: '2026-04-29 12:00' } : item,
      ),
    )
    setLogs((current) => [
      createLog('Check-in', `${member.name} checked in using member id ${member.id}.`),
      ...current,
    ])
    setCheckInId('')
  }

  const handleAdd = () => {
    if (activeCreateMode === 'session') {
      if (!sessionForm.name || !sessionForm.phone || !sessionForm.amount) {
        return
      }

      setLogs((current) => [
        createLog(
          'Create Session',
          `${sessionForm.name} booked a ${sessionForm.sessionType} session for ${sessionForm.amount}.`,
        ),
        ...current,
      ])
      setSessionForm({
        name: '',
        phone: '',
        amount: '',
        sessionType: 'gym',
      })
      return
    }

    if (!addForm.name || !addForm.phone) {
      return
    }

    const selectedOffer = offers.find((offer) => offer.id === addForm.offerId)
    const generatedId = `MBR-${String(members.length + 1001)}`
    const newMember: Member = {
      id: generatedId,
      name: addForm.name,
      email: addForm.email || `${addForm.name.toLowerCase().replace(/\s+/g, '.')}@gscope.app`,
      phone: addForm.phone,
      plan: selectedOffer?.name || 'Custom Offer',
      status: 'Active',
      sessionsLeft: Number(addForm.numberOfMonths) || 0,
      joinedAt: '2026-04-29',
      lastCheckIn: 'Never',
    }

    setMembers((current) => [newMember, ...current])
    setLogs((current) => [
      createLog(
        'Add Member',
        `${newMember.name} was created with offer ${newMember.plan} for ${addForm.numberOfMonths || '0'} months.`,
      ),
      ...current,
    ])
    setAddForm({
      name: '',
      email: '',
      phone: '',
      offerId: '',
      numberOfMonths: '',
      amount: '',
      notes: '',
    })
  }

  const handleUpdate = () => {
    const member = members.find((item) => item.id === updateForm.id)
    if (!member) {
      return
    }

    const selectedOffer = offers.find((offer) => offer.id === updateForm.offerId)
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id
          ? {
              ...item,
              plan: selectedOffer?.name || item.plan,
              sessionsLeft: Number(updateForm.numberOfMonths) || item.sessionsLeft,
            }
          : item,
      ),
    )
    setLogs((current) => [
      createLog(
        'Update Member',
        `${member.name} subscription updated to ${selectedOffer?.name || member.plan}.`,
      ),
      ...current,
    ])
    setUpdateForm({
      id: '',
      offerId: '',
      numberOfMonths: '',
      amount: '',
      notes: '',
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/signin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="hero-orb absolute left-[6%] top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,212,102,0.22),_rgba(255,212,102,0))] blur-3xl" />
        <div className="hero-orb absolute right-[8%] top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(55,114,255,0.22),_rgba(55,114,255,0))] blur-3xl" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[1760px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(420px,0.95fr)] xl:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[var(--sand)]">
                Owner dashboard
              </div>
              <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl xl:text-[3.35rem]">
                Run the gym from one control surface.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Manage subscriptions, profiles, logs, and analytics with the same system your front
                desk and staff rely on every day.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] xl:grid-cols-1">
              <div className="grid gap-3 sm:grid-cols-3">
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Members</p>
                  <p className="mt-3 font-display text-3xl text-white">{members.length}</p>
                  <p className="mt-1 text-sm text-[var(--sand)]">{activeCount} active now</p>
                </article>
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Watchlist
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">{expiringCount}</p>
                  <p className="mt-1 text-sm text-[var(--sand)]">paused or expired</p>
                </article>
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Sessions Left
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">{totalSessionsLeft}</p>
                  <p className="mt-1 text-sm text-[var(--sand)]">across all members</p>
                </article>
              </div>

              <div className="flex flex-wrap gap-3 xl:justify-end">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-white/30 hover:text-white"
                >
                  Sign out
                </button>
                <Link
                  to="/"
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#08111f] transition hover:-translate-y-0.5"
                >
                  View landing
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 grid gap-4 lg:grid-cols-4">
          {metricCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/6 p-4"
            >
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-2 font-display text-3xl text-white">{card.value}</p>
              <p className="mt-2 text-sm text-[var(--sand)]">{card.delta}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-[var(--line)] bg-white/5 p-3">
            <nav className="grid gap-2 xl:sticky xl:top-4">
              {panes.map((pane) => (
                <button
                  key={pane}
                  type="button"
                  onClick={() => setActivePane(pane)}
                  className={[
                    'w-full rounded-2xl px-4 py-3 text-left text-sm font-medium capitalize transition',
                    activePane === pane
                      ? 'bg-[var(--accent)] text-[#08111f]'
                      : 'bg-[#09111d] text-[var(--muted)] hover:text-white',
                  ].join(' ')}
                >
                  {pane}
                </button>
              ))}
            </nav>
          </aside>

          <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/5 p-4 sm:p-5">
            {activePane === 'subscriptions' ? (
              <section className="space-y-6">
                <div className="mx-auto w-full max-w-4xl space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {subscriptionActions.map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setActiveSubscriptionAction(action)}
                          className={[
                            'rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition',
                            activeSubscriptionAction === action
                              ? 'bg-[var(--accent)] text-[#08111f]'
                              : 'bg-white/6 text-[var(--muted)] hover:text-white',
                          ].join(' ')}
                        >
                          {action === 'checkin'
                            ? 'Check in'
                            : action === 'create'
                              ? 'Create'
                              : 'Update'}
                        </button>
                      ))}
                    </div>

                    {activeSubscriptionAction === 'checkin' ? (
                      <div className="mt-5 space-y-3">
                        <div>
                          <h3 className="font-display text-2xl text-white">Check in a member</h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            Enter a member id and record the visit instantly.
                          </p>
                        </div>
                        <input
                          value={checkInId}
                          onChange={(event) => setCheckInId(event.target.value)}
                          placeholder="MBR-1001"
                          className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                        />
                        <button
                          type="button"
                          onClick={handleCheckIn}
                          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                        >
                          Check in
                        </button>
                      </div>
                    ) : null}

                    {activeSubscriptionAction === 'create' ? (
                      <div className="mt-5 space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {createModes.map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setActiveCreateMode(mode)}
                              className={[
                                'rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition',
                                activeCreateMode === mode
                                  ? 'bg-[var(--accent)] text-[#08111f]'
                                  : 'bg-white/6 text-[var(--muted)] hover:text-white',
                              ].join(' ')}
                            >
                              {mode === 'member' ? 'Create member' : 'Create session'}
                            </button>
                          ))}
                        </div>

                        {activeCreateMode === 'member' ? (
                          <>
                            <div>
                              <h3 className="font-display text-2xl text-white">Create a member</h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Create a member subscription record with the selected offer details.
                              </p>
                            </div>
                            <input
                              value={addForm.name}
                              onChange={(event) =>
                                setAddForm((current) => ({ ...current, name: event.target.value }))
                              }
                              placeholder="Name"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <input
                              value={addForm.phone}
                              onChange={(event) =>
                                setAddForm((current) => ({ ...current, phone: event.target.value }))
                              }
                              placeholder="Phone"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <label className="block">
                              <span className="mb-2 block text-sm text-[var(--muted)]">Offers</span>
                              <select
                                value={addForm.offerId}
                                onChange={(event) =>
                                  setAddForm((current) => ({
                                    ...current,
                                    offerId: event.target.value,
                                  }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                              >
                                <option value="">Select an offer</option>
                                {offers.map((offer) => (
                                  <option key={offer.id} value={offer.id}>
                                    {offer.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                            {offersError ? <p className="text-sm text-red-300">{offersError}</p> : null}
                            <div className="grid gap-3 lg:grid-cols-2">
                              <input
                                value={addForm.numberOfMonths}
                                onChange={(event) =>
                                  setAddForm((current) => ({
                                    ...current,
                                    numberOfMonths: event.target.value,
                                  }))
                                }
                                placeholder="Number of months"
                                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                              />
                              <input
                                value={addForm.amount}
                                onChange={(event) =>
                                  setAddForm((current) => ({ ...current, amount: event.target.value }))
                                }
                                placeholder="Amount of money"
                                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                              />
                            </div>
                            <textarea
                              value={addForm.notes}
                              onChange={(event) =>
                                setAddForm((current) => ({ ...current, notes: event.target.value }))
                              }
                              placeholder="Notes"
                              rows={4}
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <button
                              type="button"
                              onClick={handleAdd}
                              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                            >
                              Create member
                            </button>
                          </>
                        ) : null}

                        {activeCreateMode === 'session' ? (
                          <>
                            <div>
                              <h3 className="font-display text-2xl text-white">Create a session</h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Record a one-off session sale with its type and amount.
                              </p>
                            </div>
                            <input
                              value={sessionForm.name}
                              onChange={(event) =>
                                setSessionForm((current) => ({ ...current, name: event.target.value }))
                              }
                              placeholder="Name"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <input
                              value={sessionForm.phone}
                              onChange={(event) =>
                                setSessionForm((current) => ({ ...current, phone: event.target.value }))
                              }
                              placeholder="Phone"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <label className="block">
                              <span className="mb-2 block text-sm text-[var(--muted)]">
                                Session type
                              </span>
                              <select
                                value={sessionForm.sessionType}
                                onChange={(event) =>
                                  setSessionForm((current) => ({
                                    ...current,
                                    sessionType: event.target.value,
                                  }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                              >
                                <option value="gym">Gym</option>
                                <option value="football">Football</option>
                                <option value="else">Else</option>
                              </select>
                            </label>
                            <input
                              value={sessionForm.amount}
                              onChange={(event) =>
                                setSessionForm((current) => ({ ...current, amount: event.target.value }))
                              }
                              placeholder="Amount"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <button
                              type="button"
                              onClick={handleAdd}
                              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                            >
                              Create session
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : null}

                    {activeSubscriptionAction === 'update' ? (
                      <div className="mt-5 space-y-3">
                        <div>
                          <h3 className="font-display text-2xl text-white">Update a member</h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            Update the selected member subscription details.
                          </p>
                        </div>
                        <input
                          value={updateForm.id}
                          onChange={(event) =>
                            setUpdateForm((current) => ({ ...current, id: event.target.value }))
                          }
                          placeholder="ID"
                          className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                        />
                        <label className="block">
                          <span className="mb-2 block text-sm text-[var(--muted)]">Offers</span>
                          <select
                            value={updateForm.offerId}
                            onChange={(event) =>
                              setUpdateForm((current) => ({
                                ...current,
                                offerId: event.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                          >
                            <option value="">Select an offer</option>
                            {offers.map((offer) => (
                              <option key={offer.id} value={offer.id}>
                                {offer.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        {offersError ? <p className="text-sm text-red-300">{offersError}</p> : null}
                        <div className="grid gap-3 lg:grid-cols-2">
                          <input
                            value={updateForm.numberOfMonths}
                            onChange={(event) =>
                              setUpdateForm((current) => ({
                                ...current,
                                numberOfMonths: event.target.value,
                              }))
                            }
                            placeholder="Number of months"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />
                          <input
                            value={updateForm.amount}
                            onChange={(event) =>
                              setUpdateForm((current) => ({ ...current, amount: event.target.value }))
                            }
                            placeholder="Amount of money"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                        >
                          Update member
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {activePane === 'profiles' ? (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                      Profiles pane
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-white">
                      Member table with database-style visibility.
                    </h2>
                  </div>
                  <input
                    value={profileFilter}
                    onChange={(event) =>
                      startTransition(() => setProfileFilter(event.target.value))
                    }
                    placeholder="Filter by id, name, or phone"
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)] lg:max-w-sm"
                  />
                </div>

                {profileMembersError ? (
                  <p className="text-sm text-red-300">{profileMembersError}</p>
                ) : null}

                <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                  <div className="max-h-[760px] overflow-auto">
                    <table className="min-w-full bg-[#09111d] text-left text-sm">
                      <thead className="sticky top-0 bg-[#101827] text-[var(--sand)]">
                        <tr>
                          {[
                            'ID',
                            'Name',
                            'Phone',
                            'Active',
                            'Months',
                            'Amount',
                            'Start Date',
                            'End Date',
                            'Notes',
                          ].map((column) => (
                            <th key={column} className="px-4 py-4 font-medium whitespace-nowrap">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="border-t border-white/8 text-[var(--muted)]">
                            {(() => {
                              const activity = getMemberActivity(member.endDate)

                              return (
                                <>
                            <td className="px-4 py-4 whitespace-nowrap text-white">{member.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.phone}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  'rounded-full px-3 py-1 text-xs font-medium',
                                  activity.className,
                                ].join(' ')}
                              >
                                {activity.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.months}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.amount}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.startDate}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.endDate}</td>
                            <td className="px-4 py-4">{member.notes || '-'}</td>
                                </>
                              )
                            })()}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ) : null}

            {activePane === 'logs' ? (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                      Logs pane
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-white">
                      Review operational logs for a specific day.
                    </h2>
                  </div>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(event) => setLogDate(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)] lg:max-w-xs"
                  />
                </div>

                <div className="space-y-4">
                  {filteredLogs.length ? (
                    filteredLogs.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-[var(--sand)]">
                              {entry.time} • {entry.actor}
                            </p>
                            <h3 className="mt-2 font-display text-2xl text-white">{entry.action}</h3>
                          </div>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                            {entry.id}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{entry.details}</p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-[#09111d] p-8 text-center text-[var(--muted)]">
                      No logs found for {logDate}.
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {activePane === 'analytics' ? (
              <section className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                    Analytics pane
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-white">
                    Revenue, retention, and traffic at a glance.
                  </h2>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                  <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-[var(--muted)]">Monthly revenue trend</p>
                        <p className="mt-2 font-display text-3xl text-white">$18.4k current</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-xs text-emerald-200">
                        +9.2%
                      </span>
                    </div>
                    <div className="mt-8 flex h-56 items-end gap-3">
                      {['36%', '42%', '48%', '55%', '62%', '73%', '88%', '81%'].map((height, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-3">
                          <div
                            className="w-full rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(255,212,102,0.95),rgba(55,114,255,0.5))]"
                            style={{ height }}
                          />
                          <span className="text-xs text-[var(--muted)]">
                            {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <div className="grid gap-5">
                    <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                      <p className="text-sm text-[var(--muted)]">Membership mix</p>
                      <div className="mt-5 space-y-4">
                        {[
                          ['Monthly', '54%'],
                          ['Session Packs', '28%'],
                          ['Quarterly / Annual', '18%'],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white">{label}</span>
                              <span className="text-[var(--muted)]">{value}</span>
                            </div>
                            <div className="mt-2 rounded-full bg-white/8 p-1">
                              <div
                                className="h-2 rounded-full bg-[var(--accent)]"
                                style={{ width: value }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                      <p className="text-sm text-[var(--muted)]">Operational notes</p>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                        <p>Peak occupancy is holding between 6 PM and 8 PM on weekdays.</p>
                        <p>Boxing packages are converting better than standard session packs.</p>
                        <p>Expired memberships need follow-up before the next billing cycle.</p>
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
