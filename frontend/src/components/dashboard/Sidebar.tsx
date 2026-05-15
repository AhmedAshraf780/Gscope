export const panes = [
  'subscriptions',
  'profiles',
  'logs',
  'analytics',
  'bank',
  'offers',
  'expenses',
] as const

export type PaneType = (typeof panes)[number]

interface SidebarProps {
  activePane: PaneType
  setActivePane: (pane: PaneType) => void
}

export function Sidebar({ activePane, setActivePane }: SidebarProps) {
  return (
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
  )
}
