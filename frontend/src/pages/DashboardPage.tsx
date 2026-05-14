import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../toast/useToast";
import { extractNestedRecord } from "../auth/authStorage";

import { memberService } from "../services/member.service";
import { offersService } from "../services/offers.service";
import { logService } from "../services/logs.service";
import { bankService } from "../services/bank.service";
import { expensesService } from "../services/expenses.service";
import { analysisService } from "../services/analysis.service";

import { Sidebar, type PaneType } from "../components/dashboard/Sidebar";
import { SubscriptionsPane } from "../components/dashboard/SubscriptionsPane";
import { ProfilesPane } from "../components/dashboard/ProfilesPane";
import { LogsPane } from "../components/dashboard/LogsPane";
import { AnalyticsPane } from "../components/dashboard/AnalyticsPane";
import { BankPane } from "../components/dashboard/BankPane";
import { OffersPane } from "../components/dashboard/OffersPane";
import { ExpensesPane } from "../components/dashboard/ExpensesPane";


export function DashboardPage() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { toast } = useToast();

  const gymId = (auth?.raw as any)?.gym_id || null;

  const [activePane, setActivePane] = useState<PaneType>("subscriptions");

  // Data states
  const [profileMembers, setProfileMembers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [bankMoney, setBankMoney] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const loadProfileMembers = useCallback(async () => {
    const response = await memberService.getMembers();

    const records = (() => {
      if (Array.isArray(response)) return response;
      const nested = extractNestedRecord(response);
      if (nested && Array.isArray(nested.members)) return nested.members;
      if (response && typeof response === "object" && Array.isArray((response as any).members)) return (response as any).members;
      if (response && typeof response === "object" && Array.isArray((response as any).data)) return (response as any).data;
      return [];
    })();

    const nextMembers = records
      .map((item: any, index: number) => {
        if (!item || typeof item !== "object") return null;
        const candidate = item as Record<string, unknown>;
        return {
          id: candidate.id ?? candidate._id ?? `member-${index}`,
          name: candidate.name ?? "",
          phone: candidate.phone ?? "",
          months: candidate.months ?? "",
          amount: candidate.amount ?? candidate.price ?? "",
          startDate: candidate.start_date ?? "",
          endDate: candidate.end_date ?? "",
          notes: candidate.notes ?? "",
        };
      })
      .filter(Boolean);

    setProfileMembers(nextMembers);

    if (!nextMembers.length) {
      toast({
        title: "Members not loaded",
        description: "No members were returned from the backend.",
        kind: "error",
      });
    }
  }, [toast, gymId]);

  const loadAllOffers = useCallback(async () => {
    const response = await offersService.getOffers();
    if (response && Array.isArray(response)) {
      setAllOffers(response);
    } else if (response && typeof response === "object" && Array.isArray((response as any).offers)) {
      setAllOffers((response as any).offers);
    } else if (response && typeof response === "object" && Array.isArray((response as any).data)) {
      setAllOffers((response as any).data);
    }
  }, [gymId]);

  const loadAvailableOffers = useCallback(async () => {
    const response = await offersService.getAvailableOffers();
    if (response && Array.isArray(response)) {
      setAvailableOffers(response);
    } else if (response && typeof response === "object" && Array.isArray((response as any).offers)) {
      setAvailableOffers((response as any).offers);
    } else if (response && typeof response === "object" && Array.isArray((response as any).data)) {
      setAvailableOffers((response as any).data);
    }
  }, [gymId]);

  const loadLogs = useCallback(async () => {
    const data = await logService.getLogs();
    if (Array.isArray(data)) {
      setLogs(data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
      setLogs((data as any).data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).logs)) {
      setLogs((data as any).logs);
    }
  }, [gymId]);

  const loadBankData = useCallback(async () => {
    const data = await bankService.getMoney();
    if (data && data.money !== undefined) {
      setBankMoney(data.money);
    }
  }, [gymId]);

  const loadSessions = useCallback(async () => {
    const data = await memberService.getSessions();
    if (Array.isArray(data)) {
      setSessions(data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
      setSessions((data as any).data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).sessions)) {
      setSessions((data as any).sessions);
    }
  }, [gymId]);

  const loadExpenses = useCallback(async () => {
    const data = await expensesService.getAllExpenses();
    if (Array.isArray(data)) {
      setExpenses(data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
      setExpenses((data as any).data);
    } else if (data && typeof data === "object" && Array.isArray((data as any).expenses)) {
      setExpenses((data as any).expenses);
    }
  }, [gymId]);

  const loadAnalysis = useCallback(async () => {
    const data = await analysisService.getBasicAnalysis();
    if (data && typeof data === "object") {
      setAnalysis({
        todayrevenue: (data as any).todayrevenue ?? 0,
        mothrevenue: (data as any).mothrevenue ?? 0,
        todaysessions: (data as any).todaysessions ?? 0,
        todayMembers: (data as any).todayMembers ?? 0,
        activeMembers: (data as any).activeMembers ?? 0,
        memberslogedtoday: (data as any).memberslogedtoday ?? 0,
        membersOfTheGym: (data as any).membersOfTheGym ?? 0,
        membersExpiringSoon: (data as any).membersExpiringSoon ?? 0,
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });

  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProfileMembers();
      void loadLogs();
      void loadBankData();
      void loadAllOffers();
      void loadAvailableOffers();
      void loadSessions();
      void loadExpenses();
      void loadAnalysis();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    loadProfileMembers,
    loadLogs,
    loadBankData,
    loadAllOffers,
    loadAvailableOffers,
    loadSessions,
    loadExpenses,
    loadAnalysis,
  ]);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="hero-orb absolute left-[6%] top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,212,102,0.22),_rgba(255,212,102,0))] blur-3xl" />
        <div className="hero-orb absolute right-[8%] top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(55,114,255,0.22),_rgba(55,114,255,0))] blur-3xl" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[1760px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[var(--sand)]">
                Owner dashboard
              </div>
              <h1 className="mt-4 font-display text-3xl text-white sm:text-4xl xl:text-[3.35rem]">
                Welcome, {(auth?.raw as any)?.name || "Gym"}!
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Manage subscriptions, profiles, logs, and analytics with the same system your front desk and staff rely on every day.
              </p>
              {analysis && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Today Revenue</p>
                    <p className="mt-2 font-display text-xl text-emerald-400">${analysis.todayrevenue}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Month Revenue</p>
                    <p className="mt-2 font-display text-xl text-emerald-400">${analysis.mothrevenue}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Today Sessions</p>
                    <p className="mt-2 font-display text-xl text-white">{analysis.todaysessions}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Today Members</p>
                    <p className="mt-2 font-display text-xl text-white">{analysis.todayMembers}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Active Members</p>
                    <p className="mt-2 font-display text-xl text-emerald-400">{analysis.activeMembers}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Members Logged Today</p>
                    <p className="mt-2 font-display text-xl text-white">{analysis.memberslogedtoday}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Total Gym Members</p>
                    <p className="mt-2 font-display text-xl text-white">{analysis.membersOfTheGym}</p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#09111d] p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Expiring Soon</p>
                    <p className="mt-2 font-display text-xl text-amber-400">{analysis.membersExpiringSoon}</p>
                  </article>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 xl:justify-end xl:items-end">
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

        <section className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <Sidebar activePane={activePane} setActivePane={setActivePane} />

          <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/5 p-4 sm:p-6 lg:p-8 backdrop-blur-md">
            {activePane === "subscriptions" && (
              <SubscriptionsPane
                availableOffers={availableOffers}
                onCheckInSuccess={loadLogs}
                onMemberAdded={async () => {
                  await loadProfileMembers();
                  await loadSessions();
                }}
                onMemberUpdated={loadProfileMembers}
              />
            )}

            {activePane === "profiles" && (
              <ProfilesPane
                members={profileMembers}
                sessions={sessions}
                onMemberUpdated={loadProfileMembers}
              />
            )}

            {activePane === "logs" && (
              <LogsPane
                logs={logs}
                profileMembers={profileMembers}
                loadLogs={loadLogs}
              />
            )}

            {activePane === "analytics" && <AnalyticsPane />}

            {activePane === "bank" && <BankPane bankMoney={bankMoney} />}

            {activePane === "offers" && (
              <OffersPane
                allOffers={allOffers}
                availableOffers={availableOffers}
                loadAllOffers={loadAllOffers}
                loadAvailableOffers={loadAvailableOffers}
              />
            )}

            {activePane === "expenses" && (
              <ExpensesPane
                expenses={expenses}
                loadExpenses={loadExpenses}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
