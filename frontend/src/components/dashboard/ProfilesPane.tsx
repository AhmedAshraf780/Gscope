import { useState, startTransition, useMemo } from "react";
import { useFormik } from "formik";
import { useToast } from "../../toast/useToast";
import { memberService } from "../../services/member.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";

type ProfileMember = {
  id: string;
  name: string;
  phone: string;
  months: string;
  amount: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type SessionEntry = {
  id: number;
  member_name: string;
  phone: string;
  session_type: string;
  price: number;
  session_date: string;
};

const getMemberActivity = (endDate: string) => {
  if (!endDate) {
    return {
      label: "Active",
      className: "bg-emerald-400/14 text-emerald-200",
    };
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return {
      label: "Active",
      className: "bg-emerald-400/14 text-emerald-200",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) {
    return {
      label: "Inactive",
      className: "bg-rose-400/14 text-rose-200",
    };
  }

  if (diffInDays <= 3) {
    return {
      label: "Expiring Soon",
      className: "bg-amber-400/14 text-amber-200",
    };
  }

  return {
    label: "Active",
    className: "bg-emerald-400/14 text-emerald-200",
  };
};

interface ProfilesPaneProps {
  members: ProfileMember[];
  sessions: SessionEntry[];
  onMemberUpdated: () => Promise<void>;
}

export function ProfilesPane({ members, sessions, onMemberUpdated }: ProfilesPaneProps) {
  const { toast } = useToast();
  const [profileTab, setProfileTab] = useState<"members" | "sessions">("members");
  const [profileFilter, setProfileFilter] = useState("");
  const [editingMember, setEditingMember] = useState<ProfileMember | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      [m.id, m.name, m.phone].some((val) =>
        String(val).toLowerCase().includes(profileFilter.toLowerCase()),
      ),
    );
  }, [members, profileFilter]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) =>
      [s.id, s.member_name, s.phone].some((val) =>
        String(val).toLowerCase().includes(profileFilter.toLowerCase()),
      ),
    );
  }, [sessions, profileFilter]);

  const openEditMember = (member: ProfileMember) => {
    setEditingMember(member);
    editForm.setValues({
      months: member.months,
      amount: member.amount,
      phone: member.phone,
      notes: member.notes || "",
      name: member.name,
      startDate: member.startDate,
      endDate: member.endDate,
    });
  };

  const closeEditMember = () => {
    setEditingMember(null);
  };

  const editForm = useFormik({
    initialValues: {
      months: "",
      amount: "",
      phone: "",
      notes: "",
      name: "",
      startDate: "",
      endDate: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.months) errors.months = "Required";
      if (!values.amount) errors.amount = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!editingMember) return;
      const id = Number(editingMember.id);
      if (Number.isNaN(id)) {
        toast({ title: "Update failed", description: "Invalid member ID.", kind: "error" });
        return;
      }

      const response = await memberService.updateMember(
        id,
        Number(values.months) || 0,
        Number(values.amount) || 0,
      );

      if (!response || !isResponseSuccess(response)) {
        toast({ title: "Update failed", description: getResponseMessage(response), kind: "error" });
      } else {
        toast({ title: "Member updated", description: "The member was updated successfully.", kind: "success" });
        await onMemberUpdated();
        closeEditMember();
      }
      setSubmitting(false);
    },
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteMember = async (member: ProfileMember) => {
    const id = Number(member.id);
    if (Number.isNaN(id)) {
      toast({ title: "Delete failed", description: "Invalid member ID.", kind: "error" });
      return;
    }

    setIsDeleting(true);
    const response = await memberService.deleteMember(id);
    setIsDeleting(false);

    if (!response || !isResponseSuccess(response)) {
      toast({ title: "Delete failed", description: getResponseMessage(response), kind: "error" });
      return;
    }

    toast({ title: "Member deleted", description: "The member was removed successfully.", kind: "success" });
    await onMemberUpdated();
    closeEditMember();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">Profiles pane</p>
          <h2 className="mt-3 font-display text-3xl text-white">Members and sessions at a glance.</h2>
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
                  profileTab === tab ? "bg-[var(--accent)] text-[#08111f]" : "text-[var(--muted)] hover:text-white",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            value={profileFilter}
            onChange={(event) => startTransition(() => setProfileFilter(event.target.value))}
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
                    {["ID", "Name", "Phone", "Active", "Months", "Amount", "Start Date", "End Date", "Notes"].map(
                      (column) => (
                        <th key={column} className="px-4 py-4 font-medium whitespace-nowrap">
                          {column}
                        </th>
                      )
                    )}
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
                            <td className="px-4 py-4 whitespace-nowrap text-white">{member.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.phone}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={["rounded-full px-3 py-1 text-xs font-medium", activity.className].join(" ")}>
                                {activity.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.months}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.amount}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.startDate}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{member.endDate}</td>
                            <td className="px-4 py-4">{member.notes || "-"}</td>
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
                  <h3 className="font-display text-xl text-white">Edit Member</h3>
                  <button type="button" onClick={closeEditMember} className="rounded-full p-2 text-[var(--muted)] hover:text-white transition">
                    ✕
                  </button>
                </div>

                <form onSubmit={editForm.handleSubmit} className="space-y-4">
                  <input
                    value={editForm.values.name}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                  />

                  <input
                    name="phone"
                    value={editForm.values.phone}
                    onChange={editForm.handleChange}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />

                  <div className="grid gap-3 lg:grid-cols-2">
                    <input
                      name="months"
                      value={editForm.values.months}
                      onChange={editForm.handleChange}
                      placeholder="Months"
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                    />
                    <input
                      name="amount"
                      value={editForm.values.amount}
                      onChange={editForm.handleChange}
                      placeholder="Amount"
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <input
                      value={editForm.values.startDate}
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                    />
                    <input
                      value={editForm.values.endDate}
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-white/50 outline-none cursor-not-allowed"
                    />
                  </div>

                  <textarea
                    name="notes"
                    value={editForm.values.notes}
                    onChange={editForm.handleChange}
                    placeholder="Notes"
                    rows={3}
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={editForm.isSubmitting}
                      className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
                    >
                      {editForm.isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(editingMember)}
                      disabled={isDeleting}
                      className="flex-1 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <article key={session.id} className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-white">{session.member_name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{session.phone}</p>
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
                <p className="mt-4 font-display text-2xl text-[var(--accent)]">${session.price}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{new Date(session.session_date).toLocaleDateString()}</p>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-[var(--muted)] py-12">No sessions recorded.</p>
          )}
        </div>
      )}
    </section>
  );
}
