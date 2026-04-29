import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [members, setMembers] = useState(initialMembers)
  const [logs, setLogs] = useState(initialLogs)
  const [profileFilter, setProfileFilter] = useState('')
  const [logDate, setLogDate] = useState('2026-04-29')
  const [checkInId, setCheckInId] = useState('')
  const [addType, setAddType] = useState<'member' | 'session'>('member')
  const [addForm, setAddForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    plan: '',
    sessions: '8',
  })
  const [updateForm, setUpdateForm] = useState({
    id: '',
    plan: '',
    status: 'Active',
    sessionsLeft: '0',
  })

  const deferredProfileFilter = useDeferredValue(profileFilter)

  const filteredMembers = useMemo(() => {
    const query = deferredProfileFilter.trim().toLowerCase()
    if (!query) {
      return members
    }

    return members.filter(
      (member) =>
        member.id.toLowerCase().includes(query) || member.name.toLowerCase().includes(query),
    )
  }, [deferredProfileFilter, members])

  const filteredLogs = useMemo(
    () => logs.filter((entry) => entry.date === logDate),
    [logDate, logs],
  )

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
    if (addType === 'member') {
      if (!addForm.id || !addForm.name) {
        return
      }

      const newMember: Member = {
        id: addForm.id,
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        plan: addForm.plan || 'Monthly Standard',
        status: 'Active',
        sessionsLeft: Number(addForm.sessions) || 0,
        joinedAt: '2026-04-29',
        lastCheckIn: 'Never',
      }

      setMembers((current) => [newMember, ...current])
      setLogs((current) => [
        createLog('Add Member', `${newMember.name} was created with id ${newMember.id}.`),
        ...current,
      ])
    } else {
      const member = members.find((item) => item.id === addForm.id)
      if (!member) {
        return
      }

      const increment = Number(addForm.sessions) || 0
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id ? { ...item, sessionsLeft: item.sessionsLeft + increment } : item,
        ),
      )
      setLogs((current) => [
        createLog('Add Session', `${increment} sessions added to ${member.name} (${member.id}).`),
        ...current,
      ])
    }

    setAddForm({ id: '', name: '', email: '', phone: '', plan: '', sessions: '8' })
  }

  const handleUpdate = () => {
    const member = members.find((item) => item.id === updateForm.id)
    if (!member) {
      return
    }

    setMembers((current) =>
      current.map((item) =>
        item.id === member.id
          ? {
              ...item,
              plan: updateForm.plan || item.plan,
              status: updateForm.status as Member['status'],
              sessionsLeft: Number(updateForm.sessionsLeft),
            }
          : item,
      ),
    )
    setLogs((current) => [
      createLog(
        'Update Member',
        `${member.name} updated to ${updateForm.status} with ${updateForm.sessionsLeft} sessions left.`,
      ),
      ...current,
    ])
    setUpdateForm({ id: '', plan: '', status: 'Active', sessionsLeft: '0' })
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

      <div className="relative mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <header className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[var(--sand)]">
                Owner dashboard
              </div>
              <h1 className="mt-5 font-display text-4xl text-white sm:text-5xl">
                Run the gym from one control surface.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Manage subscriptions, profiles, logs, and analytics with the same system your front
                desk and staff rely on every day.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-4">
          {metricCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.75rem] border border-[var(--line)] bg-white/6 p-5"
            >
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-3 font-display text-4xl text-white">{card.value}</p>
              <p className="mt-2 text-sm text-[var(--sand)]">{card.delta}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-[var(--line)] bg-white/5 p-4">
            <nav className="space-y-2">
              {panes.map((pane) => (
                <button
                  key={pane}
                  type="button"
                  onClick={() => setActivePane(pane)}
                  className={[
                    'w-full rounded-2xl px-4 py-4 text-left text-sm font-medium capitalize transition',
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

          <div className="rounded-[2rem] border border-[var(--line)] bg-white/5 p-5 sm:p-6">
            {activePane === 'subscriptions' ? (
              <section className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                    Subscriptions pane
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-white">
                    Check in, add, and update members from one place.
                  </h2>
                </div>

                <div className="grid gap-5 xl:grid-cols-3">
                  <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                    <h3 className="font-display text-2xl text-white">Check in a member</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      Enter a member id and record the check-in instantly.
                    </p>
                    <div className="mt-5 space-y-3">
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
                  </article>

                  <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl text-white">Add Member / Session</h3>
                      <select
                        value={addType}
                        onChange={(event) =>
                          setAddType(event.target.value as 'member' | 'session')
                        }
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none"
                      >
                        <option value="member">Member</option>
                        <option value="session">Session</option>
                      </select>
                    </div>
                    <div className="mt-5 space-y-3">
                      <input
                        value={addForm.id}
                        onChange={(event) =>
                          setAddForm((current) => ({ ...current, id: event.target.value }))
                        }
                        placeholder="Member id"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      {addType === 'member' ? (
                        <>
                          <input
                            value={addForm.name}
                            onChange={(event) =>
                              setAddForm((current) => ({ ...current, name: event.target.value }))
                            }
                            placeholder="Member name"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />
                          <input
                            value={addForm.email}
                            onChange={(event) =>
                              setAddForm((current) => ({ ...current, email: event.target.value }))
                            }
                            placeholder="Email"
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
                          <input
                            value={addForm.plan}
                            onChange={(event) =>
                              setAddForm((current) => ({ ...current, plan: event.target.value }))
                            }
                            placeholder="Plan"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />
                        </>
                      ) : null}
                      <input
                        value={addForm.sessions}
                        onChange={(event) =>
                          setAddForm((current) => ({ ...current, sessions: event.target.value }))
                        }
                        placeholder="Sessions"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                      >
                        {addType === 'member' ? 'Add member' : 'Add session'}
                      </button>
                    </div>
                  </article>

                  <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                    <h3 className="font-display text-2xl text-white">Update Member</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      Update plan, status, or sessions left for an existing member.
                    </p>
                    <div className="mt-5 space-y-3">
                      <input
                        value={updateForm.id}
                        onChange={(event) =>
                          setUpdateForm((current) => ({ ...current, id: event.target.value }))
                        }
                        placeholder="MBR-1002"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <input
                        value={updateForm.plan}
                        onChange={(event) =>
                          setUpdateForm((current) => ({ ...current, plan: event.target.value }))
                        }
                        placeholder="Updated plan"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <select
                        value={updateForm.status}
                        onChange={(event) =>
                          setUpdateForm((current) => ({ ...current, status: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Expired">Expired</option>
                      </select>
                      <input
                        value={updateForm.sessionsLeft}
                        onChange={(event) =>
                          setUpdateForm((current) => ({
                            ...current,
                            sessionsLeft: event.target.value,
                          }))
                        }
                        placeholder="Sessions left"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                      >
                        Update member
                      </button>
                    </div>
                  </article>
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
                    placeholder="Filter by id or name"
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)] lg:max-w-sm"
                  />
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#09111d] text-left text-sm">
                      <thead className="bg-white/6 text-[var(--sand)]">
                        <tr>
                          {[
                            'ID',
                            'Name',
                            'Email',
                            'Phone',
                            'Plan',
                            'Status',
                            'Sessions Left',
                            'Joined At',
                            'Last Check-in',
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
                            <td className="px-4 py-4 whitespace-nowrap text-white">{member.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.email}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.phone}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.plan}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  'rounded-full px-3 py-1 text-xs font-medium',
                                  member.status === 'Active'
                                    ? 'bg-emerald-400/14 text-emerald-200'
                                    : member.status === 'Paused'
                                      ? 'bg-amber-400/14 text-amber-200'
                                      : 'bg-rose-400/14 text-rose-200',
                                ].join(' ')}
                              >
                                {member.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.sessionsLeft}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.joinedAt}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.lastCheckIn}</td>
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
