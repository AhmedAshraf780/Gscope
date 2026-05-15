import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { LogEntry, ProfileMember } from "./types";
import { logService } from "../../services/logs.service";

interface LogsPaneProps {
  logs: LogEntry[];
  profileMembers: ProfileMember[];
}

type LogsData = {
  data?: LogEntry[];
  logs?: LogEntry[];
};

export function LogsPane({ logs, profileMembers }: LogsPaneProps) {
  const [logDate, setLogDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [logMemberIdFilter, setLogMemberIdFilter] = useState("");
  const [lastCheckInInfo, setLastCheckInInfo] = useState<{
    last_attendance?: string | null;
    duration_in_days?: number | null;
  } | null>(null);
  const [memberLogs, setMemberLogs] = useState<LogEntry[] | null>(null);
  const prevMemberIdRef = useRef("");

  const fetchMemberLogs = useCallback(async (memberId: number) => {
    const logsData = await logService.getLogsByMemberId(memberId);
    if (Array.isArray(logsData)) {
      return logsData;
    } else if (
      logsData &&
      typeof logsData === "object" &&
      Array.isArray((logsData as LogsData).data)
    ) {
      return (logsData as LogsData).data;
    } else if (
      logsData &&
      typeof logsData === "object" &&
      Array.isArray((logsData as LogsData).logs)
    ) {
      return (logsData as LogsData).logs;
    }
    return [];
  }, []);

  const filteredLogs = useMemo(() => {
    if (memberLogs !== null) {
      return memberLogs;
    }

    if (!logDate) return logs;
    return logs.filter(
      (entry) => entry.check_in_time && entry.check_in_time.startsWith(logDate),
    );
  }, [logDate, logs, memberLogs]);

  useEffect(() => {
    const currentMemberId = logMemberIdFilter.trim();

    if (!currentMemberId) {
      prevMemberIdRef.current = "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastCheckInInfo(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMemberLogs(null);
      return;
    }

    if (prevMemberIdRef.current === currentMemberId) {
      return;
    }

    prevMemberIdRef.current = currentMemberId;

    const timer = setTimeout(async () => {
      const memberId = Number(currentMemberId);
      if (isNaN(memberId) || memberId <= 0) return;

      const fetchedLogs = await fetchMemberLogs(memberId);
      setMemberLogs(fetchedLogs ?? []);

      const lastCheckIn = await logService.getLastCheckIn(memberId);
      if (lastCheckIn && !lastCheckIn.message) {
        setLastCheckInInfo(lastCheckIn);
      } else {
        setLastCheckInInfo(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [logMemberIdFilter, fetchMemberLogs]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
            Logs pane
          </p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Review operational logs by day or member.
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Filter by Member ID"
            value={logMemberIdFilter}
            onChange={(event) => setLogMemberIdFilter(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)] lg:max-w-[180px]"
          />
          <input
            type="date"
            value={logDate}
            onChange={(event) => setLogDate(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)] lg:max-w-[160px]"
          />
        </div>
      </div>

      {lastCheckInInfo && (
        <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Last check-in for Member {logMemberIdFilter}
              </p>
              <p className="mt-2 font-display text-xl text-white">
                {lastCheckInInfo.last_attendance
                  ? new Date(lastCheckInInfo.last_attendance).toLocaleString()
                  : "No check-ins found"}
              </p>
            </div>
            {lastCheckInInfo.duration_in_days !== undefined &&
              lastCheckInInfo.duration_in_days !== null && (
                <span className="rounded-full bg-blue-400/14 px-3 py-1 text-xs text-blue-200">
                  {lastCheckInInfo.duration_in_days === 0
                    ? "Today"
                    : `${lastCheckInInfo.duration_in_days} days ago`}
                </span>
              )}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 mt-4">
        <div className="max-h-[760px] overflow-auto">
          <table className="min-w-full bg-[#09111d] text-left text-sm">
            <thead className="sticky top-0 bg-[#101827] text-[var(--sand)]">
              <tr>
                {["Log ID", "Member ID", "Name", "Phone", "Check-in Time"].map(
                  (column) => (
                    <th
                      key={column}
                      className="px-4 py-4 font-medium whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length ? (
                filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="border-t border-white/8 text-[var(--muted)]"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {log.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {log.member_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {log?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {log?.phone || "Unknown"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(log.check_in_time).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-[var(--muted)]"
                  >
                    No logs found for {logDate}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
