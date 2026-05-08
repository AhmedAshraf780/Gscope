import { startTransition, useMemo, useDeferredValue, useState } from "react";
import type { ProfileMember, SessionEntry } from "./types";
import { getMemberActivity } from "./utils";
import { memberService } from "../../services/member.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";
import { useToast } from "../../toast/useToast";

interface ProfilesPaneProps {
  profileMembers: ProfileMember[];
  sessions: SessionEntry[];
  loadProfileMembers: () => Promise<void>;
}

export function ProfilesPane({
  profileMembers,
  sessions,
  loadProfileMembers,
}: ProfilesPaneProps) {
  const { toast } = useToast();
  const [profileFilter, setProfileFilter] = useState("");
  const [profileTab, setProfileTab] = useState<"members" | "sessions">(
    "members",
  );
  const [editingMember, setEditingMember] = useState<ProfileMember | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    months: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const deferredProfileFilter = useDeferredValue(profileFilter);

  const filteredMembers = useMemo(() => {
    const query = deferredProfileFilter.trim().toLowerCase();
    if (!query) {
      return profileMembers;
    }

    return profileMembers.filter(
      (member) =>
        member.id.toLowerCase().includes(query) ||
        member.name.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query),
    );
  }, [deferredProfileFilter, profileMembers]);

  const filteredSessions = useMemo(() => {
    const query = deferredProfileFilter.trim().toLowerCase();
    if (!query) {
      return sessions;
    }

    return sessions.filter(
      (s) =>
        String(s.id).includes(query) ||
        s.member_name.toLowerCase().includes(query) ||
        s.phone.toLowerCase().includes(query),
    );
  }, [deferredProfileFilter, sessions]);

  const openEditMember = (member: ProfileMember) => {
    setEditingMember(member);
    setEditForm({
      months: member.months,
      amount: member.amount,
      phone: member.phone,
      notes: member.notes,
      name: member.name,
      startDate: member.startDate,
      endDate: member.endDate,
    });
  };

  const closeEditMember = () => {
    setEditingMember(null);
  };

  const handleUpdateInline = async () => {
    if (!editingMember) return;
    const id = Number(editingMember.id);
    if (Number.isNaN(id)) {
      toast({
        title: "Update failed",
        description: "Invalid member ID.",
        kind: "error",
      });
      return;
    }

    setIsUpdating(true);
    const response = await memberService.updateMember(
      id,
      Number(editForm.months) || 0,
      Number(editForm.amount) || 0,
    );
    setIsUpdating(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Update failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    toast({
      title: "Member updated",
      description: "The member was updated successfully.",
      kind: "success",
    });
    await loadProfileMembers();
    setEditingMember(null);
  };

  const handleDeleteMember = async (member: ProfileMember) => {
    const id = Number(member.id);
    if (Number.isNaN(id)) {
      toast({
        title: "Delete failed",
        description: "Invalid member ID.",
        kind: "error",
      });
      return;
    }

    setIsDeleting(true);
    const response = await memberService.deleteMember(id);
    setIsDeleting(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Delete failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    toast({
      title: "Member deleted",
      description: "The member was removed successfully.",
      kind: "success",
    });
    await loadProfileMembers();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
            Profiles pane
          </p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Members and sessions at a glance.
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex rounded-2xl border border-white/10 bg-[#09111d] p-1 gap-1">
            {(["members", "sessions"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setProfileTab(tab)}
                className={[
                  "rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition whitespace-nowrap",
                  profileTab === tab
                    ? "bg-[var(--accent)] text-[#08111f]"
                    : "text-[var(--muted)] hover:text-white",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
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
      </div>

      {profileTab === "members" ? (
        <>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="max-h-[760px] overflow-auto">
              <table className="min-w-full bg-[#09111d] text-left text-sm">
                <thead className="sticky top-0 bg-[#101827] text-[var(--sand)]">
                  <tr>
                    {[
                      "ID",
                      "Name",
                      "Phone",
                      "Active",
                      "Months",
                      "Amount",
                      "Start Date",
                      "End Date",
                      "Notes",
                    ].map((column) => (
                      <th
                        key={column}
                        className="px-4 py-4 font-medium whitespace-nowrap"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => openEditMember(member)}
                      className="border-t border-white/8 text-[var(--muted)] cursor-pointer hover:bg-white/4 transition"
                    >
                      {(() => {
                        const activity = getMemberActivity(member.endDate);

                        return (
                          <>
                            <td className="px-4 py-4 whitespace-nowrap text-white">
                              {member.id}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.phone}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={[
                                  "rounded-full px-3 py-1 text-xs font-medium",
                                  activity.className,
                                ].join(" ")}
                              >
                                {activity.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.months}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.amount}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.startDate}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {member.endDate}
                            </td>
                            <td className="px-4 py-4">
                              {member.notes || "-"}
                            </td>
                          </>
                        );
                      })()}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#0d1929] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-white">
                    Edit Member
                  </h3>
                  <button
                    type="button"
                    onClick={closeEditMember}
                    className="rounded-full p-2 text-[var(--muted)] hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>

                <input
                  value={editForm.name}
                  disabled
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                />

                <input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((c) => ({
                      ...c,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Phone"
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                />

                <div className="grid gap-3 lg:grid-cols-2">
                  <input
                    value={editForm.months}
                    onChange={(e) =>
                      setEditForm((c) => ({
                        ...c,
                        months: e.target.value,
                      }))
                    }
                    placeholder="Months"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  <input
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm((c) => ({
                        ...c,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="Amount"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <input
                    value={editForm.startDate}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                  />
                  <input
                    value={editForm.endDate}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                  />
                </div>

                <textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((c) => ({
                      ...c,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Notes"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleUpdateInline}
                    disabled={isUpdating}
                    className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(editingMember)}
                    disabled={isDeleting}
                    className="flex-1 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300 hover:bg-rose-500/20 transition"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-white">
                      {session.member_name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {session.phone}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium",
                      session.session_type === "gym"
                        ? "bg-emerald-400/14 text-emerald-200"
                        : session.session_type === "football"
                          ? "bg-blue-400/14 text-blue-200"
                          : "bg-amber-400/14 text-amber-200",
                    ].join(" ")}
                  >
                    {session.session_type}
                  </span>
                </div>
                <p className="mt-4 font-display text-2xl text-[var(--accent)]">
                  ${session.price}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {new Date(session.session_date).toLocaleDateString()}
                </p>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-[var(--muted)] py-12">
              No sessions recorded.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
