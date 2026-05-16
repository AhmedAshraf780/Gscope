import { useEffect, useState } from "react";
import { analysisService } from "../../services/analysis.service";

export function AnalyticsPane() {
  const [activeTab, setActiveTab] = useState<"month" | "day">("month");

  const [monthInput, setMonthInput] = useState(() =>
    new Date().toISOString().slice(0, 7),
  ); // YYYY-MM
  const [monthSessionType, setMonthSessionType] = useState("");

  const [dayInput, setDayInput] = useState(() =>
    new Date().toISOString().slice(0, 10),
  ); // YYYY-MM-DD
  const [daySessionType, setDaySessionType] = useState("");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (activeTab === "month") {
          if (monthInput.length === 7) {
            const res = await analysisService.getAdvancedMonthAnalysis(
              monthInput,
              monthSessionType,
            );
            setData(res);
          }
        } else {
          if (dayInput.length === 10) {
            const res = await analysisService.getAdvancedDayAnalysis(
              dayInput,
              daySessionType,
            );
            setData(res);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab, monthInput, monthSessionType, dayInput, daySessionType]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
          Advanced Analytics
        </p>
        <h2 className="mt-3 font-display text-3xl text-white">
          Deep dive into your gym's performance.
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* LEFT SIDE: CARDS */}
        <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-1 content-start">
          <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6 transition hover:border-white/20">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
              Total Revenue
            </p>
            <p className="mt-3 font-display text-4xl text-emerald-400">
              ${data?.revenue?.totalRevenue ?? 0}
            </p>
            <div className="mt-4 flex gap-4 text-xs text-[var(--muted)]">
              <span>Members: ${data?.revenue?.membersRevenue ?? 0}</span>
              <span>Sessions: ${data?.revenue?.sessionsRevenue ?? 0}</span>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6 transition hover:border-white/20">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
              Total Members
            </p>
            <p className="mt-3 font-display text-4xl text-white">
              {data?.members?.total ?? 0}
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6 transition hover:border-white/20">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
              Total Sessions
            </p>
            <p className="mt-3 font-display text-4xl text-white">
              {data?.sessions?.total ?? 0}
            </p>
            {activeTab === "month" && monthSessionType && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                Type: {monthSessionType}
              </p>
            )}
            {activeTab === "day" && daySessionType && (
              <p className="mt-2 text-xs text-[var(--muted)]">
                Type: {daySessionType}
              </p>
            )}
          </article>
        </div>

        {/* RIGHT SIDE: CONTROLS */}
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md self-start">
          <div className="flex gap-2 rounded-full border border-white/10 bg-[#09111d] p-1">
            <button
              onClick={() => setActiveTab("month")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                activeTab === "month"
                  ? "bg-[var(--accent)] text-[#08111f] shadow-[0_0_15px_rgba(255,212,102,0.3)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setActiveTab("day")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                activeTab === "day"
                  ? "bg-[var(--accent)] text-[#08111f] shadow-[0_0_15px_rgba(255,212,102,0.3)]"
                  : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Day
            </button>
          </div>

          <div className="mt-8 space-y-5">
            {activeTab === "month" ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Select Month
                  </span>
                  <input
                    type="month"
                    value={monthInput}
                    onChange={(e) => setMonthInput(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Session Type
                  </span>
                  <select
                    value={monthSessionType}
                    onChange={(e) => setMonthSessionType(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="">All Types</option>
                    <option value="gym">Gym</option>
                    <option value="football">Football</option>
                    <option value="else">Else</option>
                  </select>
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Select Date
                  </span>
                  <input
                    type="date"
                    value={dayInput}
                    onChange={(e) => setDayInput(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Session Type
                  </span>
                  <select
                    value={daySessionType}
                    onChange={(e) => setDaySessionType(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-4 text-white outline-none transition focus:border-[var(--accent)]"
                  >
                    <option value="">All Types</option>
                    <option value="gym">Gym</option>
                    <option value="football">Football</option>
                    <option value="else">Else</option>
                  </select>
                </label>
              </>
            )}

            {loading && (
              <div className="flex justify-center py-4">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {data?.revenue?.members?.length > 0 && (
        <section className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6">
          <h3 className="mb-4 font-display text-xl text-white">
            Members Revenue Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--sand)]">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Months</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium">End Date</th>
                </tr>
              </thead>
              <tbody>
                {data.revenue.members.map((m: any) => (
                  <tr
                    key={m.id}
                    className="border-t border-white/8 text-[var(--muted)]"
                  >
                    <td className="px-4 py-3 text-white">{m.id}</td>
                    <td className="px-4 py-3">{m.name}</td>
                    <td className="px-4 py-3">{m.phone}</td>
                    <td className="px-4 py-3">{m.months}</td>
                    <td className="px-4 py-3 text-emerald-400">
                      ${m.price}
                    </td>
                    <td className="px-4 py-3">{m.start_date}</td>
                    <td className="px-4 py-3">{m.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data?.revenue?.sessions?.length > 0 && (
        <section className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-6">
          <h3 className="mb-4 font-display text-xl text-white">
            Sessions Revenue Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--sand)]">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.revenue.sessions.map((s: any) => (
                  <tr
                    key={s.id}
                    className="border-t border-white/8 text-[var(--muted)]"
                  >
                    <td className="px-4 py-3 text-white">{s.id}</td>
                    <td className="px-4 py-3">{s.member_name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          s.session_type === "gym"
                            ? "bg-emerald-400/14 text-emerald-200"
                            : s.session_type === "football"
                              ? "bg-blue-400/14 text-blue-200"
                              : "bg-amber-400/14 text-amber-200"
                        }`}
                      >
                        {s.session_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-emerald-400">
                      ${s.price}
                    </td>
                    <td className="px-4 py-3">{s.session_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
}
