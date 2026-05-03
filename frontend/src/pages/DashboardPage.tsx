import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  extractNestedRecord,
  getResponseMessage,
  isResponseSuccess,
} from "../auth/authStorage";
import { memberService } from "../services/member.service";
import { offersService } from "../services/offers.service";
import { logService } from "../services/logs.service";
import { bankService } from "../services/bank.service";
import { useAuth } from "../auth/useAuth";
import { useToast } from "../toast/useToast";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: "Active" | "Paused" | "Expired";
  sessionsLeft: number;
  joinedAt: string;
  lastCheckIn: string;
};

type LogEntry = {
  id: number;
  member_id: number;
  check_in_time: string;
  gym_id: number;
};

type SessionEntry = {
  id: number;
  member_name: string;
  phone: string;
  session_type: string;
  price: number;
  session_date: string;
};

type OfferOption = {
  id: string;
  name: string;
};

type Offer = {
  id: number;
  name: string;
  months: number;
  price: number;
  offer_end_date: string;
  created_at: string;
  member_count?: number;
};

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

const initialMembers: Member[] = [
  {
    id: "MBR-1001",
    name: "Omar Adel",
    email: "omar.adel@gscope.app",
    phone: "+20 101 200 3001",
    plan: "Monthly Premium",
    status: "Active",
    sessionsLeft: 10,
    joinedAt: "2026-03-03",
    lastCheckIn: "2026-04-29 08:12",
  },
  {
    id: "MBR-1002",
    name: "Mariam Samy",
    email: "mariam.samy@gscope.app",
    phone: "+20 101 200 3002",
    plan: "12 Sessions Pack",
    status: "Active",
    sessionsLeft: 4,
    joinedAt: "2026-02-18",
    lastCheckIn: "2026-04-29 10:47",
  },
  {
    id: "MBR-1003",
    name: "Youssef Tarek",
    email: "youssef.tarek@gscope.app",
    phone: "+20 101 200 3003",
    plan: "Quarterly Strength",
    status: "Paused",
    sessionsLeft: 18,
    joinedAt: "2026-01-21",
    lastCheckIn: "2026-04-22 19:03",
  },
  {
    id: "MBR-1004",
    name: "Nadine Hossam",
    email: "nadine.hossam@gscope.app",
    phone: "+20 101 200 3004",
    plan: "Monthly Standard",
    status: "Expired",
    sessionsLeft: 0,
    joinedAt: "2025-12-09",
    lastCheckIn: "2026-04-15 17:35",
  },
  {
    id: "MBR-1005",
    name: "Karim Essam",
    email: "karim.essam@gscope.app",
    phone: "+20 101 200 3005",
    plan: "8 Sessions Boxing",
    status: "Active",
    sessionsLeft: 2,
    joinedAt: "2026-04-02",
    lastCheckIn: "2026-04-29 07:55",
  },
];

const panes = [
  "subscriptions",
  "profiles",
  "logs",
  "analytics",
  "bank",
  "offers",
] as const;

type Pane = (typeof panes)[number];
const subscriptionActions = ["checkin", "create", "update"] as const;
type SubscriptionAction = (typeof subscriptionActions)[number];
const createModes = ["member", "session"] as const;
type CreateMode = (typeof createModes)[number];



export function DashboardPage() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { toast } = useToast();

  const gymId = (auth?.raw as any)?.gym_id || 1;

  const [activePane, setActivePane] = useState<Pane>("subscriptions");
  const [activeSubscriptionAction, setActiveSubscriptionAction] =
    useState<SubscriptionAction>("checkin");
  const [activeCreateMode, setActiveCreateMode] =
    useState<CreateMode>("member");
  const [members, setMembers] = useState(initialMembers);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [bankMoney, setBankMoney] = useState<number | null>(null);
  const [profileFilter, setProfileFilter] = useState("");
  const [logDate, setLogDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [logMemberIdFilter, setLogMemberIdFilter] = useState("");
  const [lastCheckInInfo, setLastCheckInInfo] = useState<{
    last_attendance?: string | null;
    duration_in_days?: number | null;
  } | null>(null);
  const [checkInId, setCheckInId] = useState("");
  const [offers, setOffers] = useState<OfferOption[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [profileMembers, setProfileMembers] = useState<ProfileMember[]>([]);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [profileTab, setProfileTab] = useState<"members" | "sessions">("members");
  const [editingMember, setEditingMember] = useState<ProfileMember | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    months: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({
    name: "",
    months: "",
    price: "",
    endDate: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    offerId: "",
    numberOfMonths: "",
    amount: "",
    notes: "",
  });
  const [sessionForm, setSessionForm] = useState({
    name: "",
    phone: "",
    amount: "",
    sessionType: "gym",
  });
  const [updateForm, setUpdateForm] = useState({
    id: "",
    offerId: "",
    numberOfMonths: "",
    amount: "",
    notes: "",
  });

  const deferredProfileFilter = useDeferredValue(profileFilter);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [offersMonth, setOffersMonth] = useState(currentMonth);

  const filteredOffers = useMemo(() => {
    if (!offersMonth) return allOffers;
    return allOffers.filter((offer) => {
      if (!offer.created_at) return false;
      return offer.created_at.startsWith(offersMonth);
    });
  }, [offersMonth, allOffers]);

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

  const filteredLogs = useMemo(() => {
    if (!logDate) return logs;
    return logs.filter(
      (entry) => entry.check_in_time && entry.check_in_time.startsWith(logDate),
    );
  }, [logDate, logs]);

  const activeCount = members.filter(
    (member) => member.status === "Active",
  ).length;
  const expiringCount = members.filter(
    (member) => member.status !== "Active",
  ).length;
  const totalSessionsLeft = members.reduce(
    (sum, member) => sum + member.sessionsLeft,
    0,
  );

  const loadProfileMembers = useCallback(async () => {
    const response = await memberService.getMembers();

    const records = (() => {
      if (Array.isArray(response)) {
        return response;
      }

      const nested = extractNestedRecord(response);
      if (nested && Array.isArray(nested.members)) {
        return nested.members;
      }

      if (
        response &&
        typeof response === "object" &&
        Array.isArray((response as { members?: unknown }).members)
      ) {
        return (response as { members: unknown[] }).members;
      }

      if (
        response &&
        typeof response === "object" &&
        Array.isArray((response as { data?: unknown }).data)
      ) {
        return (response as { data: unknown[] }).data;
      }

      return [];
    })();

    const nextMembers = records
      .map((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const candidate = item as Record<string, unknown>;
        return {
          id:
            typeof candidate.id === "string"
              ? candidate.id
              : typeof candidate.id === "number"
                ? String(candidate.id)
                : typeof candidate._id === "string"
                  ? candidate._id
                  : typeof candidate._id === "number"
                    ? String(candidate._id)
                    : `member-${index}`,
          name: typeof candidate.name === "string" ? candidate.name : "",
          phone: typeof candidate.phone === "string" ? candidate.phone : "",
          months:
            typeof candidate.months === "string"
              ? candidate.months
              : typeof candidate.months === "number"
                ? String(candidate.months)
                : "",
          amount:
            typeof candidate.amount === "string"
              ? candidate.amount
              : typeof candidate.amount === "number"
                ? String(candidate.amount)
                : typeof candidate.price === "string"
                  ? candidate.price
                  : typeof candidate.price === "number"
                    ? String(candidate.price)
                    : "",
          startDate:
            typeof candidate.start_date === "string"
              ? candidate.start_date
              : "",
          endDate:
            typeof candidate.end_date === "string" ? candidate.end_date : "",
          notes: typeof candidate.notes === "string" ? candidate.notes : "",
        };
      })
      .filter((item): item is ProfileMember => item !== null);

    setProfileMembers(nextMembers);

    if (!nextMembers.length) {
      toast({
        title: "Members not loaded",
        description: "No members were returned from the backend.",
        kind: "error",
      });
    }
  }, [toast, gymId]);

  useEffect(() => {
    const loadOffers = async () => {
      const response = await offersService.getOffers();

      const records = (() => {
        if (Array.isArray(response)) {
          return response;
        }

        const nested = extractNestedRecord(response);
        if (nested && Array.isArray(nested.offers)) {
          return nested.offers;
        }

        if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as { offers?: unknown }).offers)
        ) {
          return (response as { offers: unknown[] }).offers;
        }

        if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as { data?: unknown }).data)
        ) {
          return (response as { data: unknown[] }).data;
        }

        return [];
      })();

      const nextOffers = records
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const candidate = item as Record<string, unknown>;
          const id =
            candidate.id ??
            candidate._id ??
            candidate.offerId ??
            candidate.value;
          const name =
            candidate.name ??
            candidate.title ??
            candidate.offerName ??
            candidate.label;

          if (typeof id !== "string" || typeof name !== "string") {
            return null;
          }

          return { id, name };
        })
        .filter((item): item is OfferOption => item !== null);

      setOffers(nextOffers);

      if (!nextOffers.length) {
        toast({
          title: "Offers not loaded",
          description: "No offers were returned from the backend.",
          kind: "error",
        });
      }
    };

    void loadOffers();
  }, [toast, gymId]);

  const loadAllOffers = useCallback(async () => {
    const response = await offersService.getOffers();
    if (response && Array.isArray(response)) {
      setAllOffers(response);
    } else if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.offers)
    ) {
      setAllOffers(response.offers);
    } else if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.data)
    ) {
      setAllOffers(response.data);
    }
  }, [gymId]);

  const loadAvailableOffers = useCallback(async () => {
    const response = await offersService.getAvailableOffers();
    if (response && Array.isArray(response)) {
      setAvailableOffers(response);
    } else if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.offers)
    ) {
      setAvailableOffers(response.offers);
    } else if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.data)
    ) {
      setAvailableOffers(response.data);
    }
  }, [gymId]);

  const handleCreateOffer = async () => {
    if (!offerForm.name || !offerForm.months || !offerForm.price || !offerForm.endDate) {
      toast({
        title: "Offer creation failed",
        description: "Name, months, price, and end date are required.",
        kind: "error",
      });
      return;
    }

    setIsCreatingOffer(true);
    const response = await offersService.createOffer(
      offerForm.name,
      Number(offerForm.months),
      Number(offerForm.price),
      offerForm.endDate,
    );
    setIsCreatingOffer(false);

    if (response && (response.ok || response.id)) {
      toast({
        title: "Offer created",
        description: "The offer was saved successfully.",
        kind: "success",
      });
      setOfferForm({ name: "", months: "", price: "", endDate: "" });
      void loadAllOffers();
      void loadAvailableOffers();
    } else {
      toast({
        title: "Offer creation failed",
        description: response?.message || "Could not create offer.",
        kind: "error",
      });
    }
  };

  const loadLogs = useCallback(async () => {
    const data = await logService.getLogs();
    if (Array.isArray(data)) {
      setLogs(data);
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).data)
    ) {
      setLogs((data as any).data);
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).logs)
    ) {
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
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).data)
    ) {
      setSessions((data as any).data);
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).sessions)
    ) {
      setSessions((data as any).sessions);
    }
  }, [gymId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProfileMembers();
      void loadLogs();
      void loadBankData();
      void loadAllOffers();
      void loadAvailableOffers();
      void loadSessions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    loadProfileMembers,
    loadLogs,
    loadBankData,
    loadAllOffers,
    loadAvailableOffers,
    loadSessions,
  ]);

  useEffect(() => {
    if (!logMemberIdFilter) {
      setLastCheckInInfo(null);
      void loadLogs();
      return;
    }

    const timer = setTimeout(async () => {
      const memberId = Number(logMemberIdFilter.trim());
      if (isNaN(memberId) || memberId <= 0) return;

      const logsData = await logService.getLogsByMemberId(memberId);
      if (Array.isArray(logsData)) {
        setLogs(logsData);
      } else if (
        logsData &&
        typeof logsData === "object" &&
        Array.isArray((logsData as any).data)
      ) {
        setLogs((logsData as any).data);
      } else if (
        logsData &&
        typeof logsData === "object" &&
        Array.isArray((logsData as any).logs)
      ) {
        setLogs((logsData as any).logs);
      } else {
        setLogs([]);
      }

      const lastCheckIn = await logService.getLastCheckIn(memberId);
      if (lastCheckIn && !lastCheckIn.message) {
        setLastCheckInInfo(lastCheckIn);
      } else {
        setLastCheckInInfo(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [logMemberIdFilter, loadLogs, gymId]);

  const handleCheckIn = async () => {
    const memberIdNum = Number(checkInId.trim());
    if (!memberIdNum || isNaN(memberIdNum)) {
      toast({
        title: "Check-in failed",
        description: "Invalid member ID format. Please use the numeric ID.",
        kind: "error",
      });
      return;
    }

    const res = await logService.createLog(memberIdNum);
    if (res && res.message === "Log created successfully") {
      toast({
        title: "Check-in successful",
        description: `Member ${memberIdNum} checked in.`,
        kind: "success",
      });
      await loadLogs();
      setCheckInId("");
    } else {
      toast({
        title: "Check-in failed",
        description: res?.message || "Could not check in member.",
        kind: "error",
      });
    }
  };

  const handleAdd = async () => {
    if (activeCreateMode === "session") {
      if (!sessionForm.name || !sessionForm.phone || !sessionForm.amount) {
        toast({
          title: "Session creation failed",
          description: "Name, phone, and amount are required.",
          kind: "error",
        });
        return;
      }

      setIsCreating(true);
      const response = await memberService.addSession(
        sessionForm.name.trim(),
        sessionForm.phone.trim(),
        sessionForm.sessionType === "else"
          ? "swimming"
          : sessionForm.sessionType,
        Number(sessionForm.amount) || 0,
      );
      setIsCreating(false);

      if (!response || !isResponseSuccess(response)) {
        toast({
          title: "Session creation failed",
          description: getResponseMessage(response),
          kind: "error",
        });
        return;
      }
      toast({
        title: "Session created",
        description: "The session was saved successfully.",
        kind: "success",
      });
      setSessionForm({
        name: "",
        phone: "",
        amount: "",
        sessionType: "gym",
      });
      return;
    }

    if (!addForm.name || !addForm.phone) {
      toast({
        title: "Member creation failed",
        description: "Name and phone are required.",
        kind: "error",
      });
      return;
    }

    setIsCreating(true);
    const response = await memberService.addMember(
      addForm.name.trim(),
      addForm.phone.trim(),
      Number(addForm.numberOfMonths) || 0,
      Number(addForm.amount) || 0,
      addForm.notes.trim(),
      Number(addForm.offerId) || 0,
    );
    setIsCreating(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Member creation failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    const selectedOffer = offers.find((offer) => offer.id === addForm.offerId);
    const generatedId = `MBR-${String(members.length + 1001)}`;
    const newMember: Member = {
      id: generatedId,
      name: addForm.name,
      email:
        addForm.email ||
        `${addForm.name.toLowerCase().replace(/\s+/g, ".")}@gscope.app`,
      phone: addForm.phone,
      plan: selectedOffer?.name || "Custom Offer",
      status: "Active",
      sessionsLeft: Number(addForm.numberOfMonths) || 0,
      joinedAt: "2026-04-29",
      lastCheckIn: "Never",
    };

    setMembers((current) => [newMember, ...current]);
    await loadProfileMembers();
    toast({
      title: "Member created",
      description: "The member was saved successfully.",
      kind: "success",
    });
    setAddForm({
      name: "",
      email: "",
      phone: "",
      offerId: "",
      numberOfMonths: "",
      amount: "",
      notes: "",
    });
  };

  const handleUpdate = async () => {
    if (!updateForm.id || !updateForm.numberOfMonths || !updateForm.amount) {
      toast({
        title: "Member update failed",
        description: "ID, number of months, and amount are required.",
        kind: "error",
      });
      return;
    }

    const id = Number(updateForm.id);
    if (Number.isNaN(id)) {
      toast({
        title: "Member update failed",
        description: "Member ID must be a valid number.",
        kind: "error",
      });
      return;
    }

    setIsUpdating(true);
    const response = await memberService.updateMember(
      id,
      Number(updateForm.numberOfMonths) || 0,
      Number(updateForm.amount) || 0,
    );
    setIsUpdating(false);

    if (!response || !isResponseSuccess(response)) {
      toast({
        title: "Member update failed",
        description: getResponseMessage(response),
        kind: "error",
      });
      return;
    }

    const selectedOffer = offers.find(
      (offer) => offer.id === updateForm.offerId,
    );

    setMembers((current) =>
      current.map((item) =>
        item.id === updateForm.id
          ? {
              ...item,
              plan: selectedOffer?.name || item.plan,
              sessionsLeft:
                Number(updateForm.numberOfMonths) || item.sessionsLeft,
            }
          : item,
      ),
    );
    await loadProfileMembers();
    toast({
      title: "Member updated",
      description: "The member was updated successfully.",
      kind: "success",
    });
    setUpdateForm({
      id: "",
      offerId: "",
      numberOfMonths: "",
      amount: "",
      notes: "",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

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
                Welcome, {(auth?.raw as any)?.name || "Gym"}!
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Manage subscriptions, profiles, logs, and analytics with the
                same system your front desk and staff rely on every day.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] xl:grid-cols-1">
              <div className="grid gap-3 sm:grid-cols-3">
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Members
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {members.length}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sand)]">
                    {activeCount} active now
                  </p>
                </article>
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Watchlist
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {expiringCount}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sand)]">
                    paused or expired
                  </p>
                </article>
                <article className="rounded-[1.25rem] border border-white/10 bg-[#09111d] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Sessions Left
                  </p>
                  <p className="mt-3 font-display text-3xl text-white">
                    {totalSessionsLeft}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sand)]">
                    across all members
                  </p>
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



        <section className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-[var(--line)] bg-white/5 p-3">
            <nav className="grid gap-2 xl:sticky xl:top-4">
              {panes.map((pane) => (
                <button
                  key={pane}
                  type="button"
                  onClick={() => setActivePane(pane)}
                  className={[
                    "w-full rounded-2xl px-4 py-3 text-left text-sm font-medium capitalize transition",
                    activePane === pane
                      ? "bg-[var(--accent)] text-[#08111f]"
                      : "bg-[#09111d] text-[var(--muted)] hover:text-white",
                  ].join(" ")}
                >
                  {pane}
                </button>
              ))}
            </nav>
          </aside>

          <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/5 p-4 sm:p-5">
            {activePane === "subscriptions" ? (
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
                            "rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition",
                            activeSubscriptionAction === action
                              ? "bg-[var(--accent)] text-[#08111f]"
                              : "bg-white/6 text-[var(--muted)] hover:text-white",
                          ].join(" ")}
                        >
                          {action === "checkin"
                            ? "Check in"
                            : action === "create"
                              ? "Create"
                              : "Update"}
                        </button>
                      ))}
                    </div>

                    {activeSubscriptionAction === "checkin" ? (
                      <div className="mt-5 space-y-3">
                        <div>
                          <h3 className="font-display text-2xl text-white">
                            Check in a member
                          </h3>
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

                    {activeSubscriptionAction === "create" ? (
                      <div className="mt-5 space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          {createModes.map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setActiveCreateMode(mode)}
                              className={[
                                "rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition",
                                activeCreateMode === mode
                                  ? "bg-[var(--accent)] text-[#08111f]"
                                  : "bg-white/6 text-[var(--muted)] hover:text-white",
                              ].join(" ")}
                            >
                              {mode === "member"
                                ? "Create member"
                                : "Create session"}
                            </button>
                          ))}
                        </div>

                        {activeCreateMode === "member" ? (
                          <>
                            <div>
                              <h3 className="font-display text-2xl text-white">
                                Create a member
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Create a member subscription record with the
                                selected offer details.
                              </p>
                            </div>
                            <input
                              value={addForm.name}
                              onChange={(event) =>
                                setAddForm((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              placeholder="Name"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <input
                              value={addForm.phone}
                              onChange={(event) =>
                                setAddForm((current) => ({
                                  ...current,
                                  phone: event.target.value,
                                }))
                              }
                              placeholder="Phone"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <label className="block">
                              <span className="mb-2 block text-sm text-[var(--muted)]">
                                Offers
                              </span>
                              <select
                                value={addForm.offerId}
                                onChange={(event) => {
                                  const selected = availableOffers.find(
                                    (o) => String(o.id) === event.target.value,
                                  );
                                  setAddForm((current) => ({
                                    ...current,
                                    offerId: event.target.value,
                                    numberOfMonths: selected ? String(selected.months) : current.numberOfMonths,
                                    amount: selected ? String(selected.price) : current.amount,
                                  }));
                                }}
                                className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                              >
                                <option value="" className="bg-[#09111d] text-white">Select an offer</option>
                                {availableOffers.map((offer) => (
                                  <option key={offer.id} value={offer.id} className="bg-[#09111d] text-white">
                                    {offer.name}
                                  </option>
                                ))}
                              </select>
                            </label>
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
                                  setAddForm((current) => ({
                                    ...current,
                                    amount: event.target.value,
                                  }))
                                }
                                placeholder="Amount of money"
                                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                              />
                            </div>
                            <textarea
                              value={addForm.notes}
                              onChange={(event) =>
                                setAddForm((current) => ({
                                  ...current,
                                  notes: event.target.value,
                                }))
                              }
                              placeholder="Notes"
                              rows={4}
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <button
                              type="button"
                              onClick={handleAdd}
                              disabled={isCreating}
                              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                            >
                              {isCreating ? "Creating..." : "Create member"}
                            </button>
                          </>
                        ) : null}

                        {activeCreateMode === "session" ? (
                          <>
                            <div>
                              <h3 className="font-display text-2xl text-white">
                                Create a session
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                Record a one-off session sale with its type and
                                amount.
                              </p>
                            </div>
                            <input
                              value={sessionForm.name}
                              onChange={(event) =>
                                setSessionForm((current) => ({
                                  ...current,
                                  name: event.target.value,
                                }))
                              }
                              placeholder="Name"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <input
                              value={sessionForm.phone}
                              onChange={(event) =>
                                setSessionForm((current) => ({
                                  ...current,
                                  phone: event.target.value,
                                }))
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
                                  className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                                >
                                  <option value="gym" className="bg-[#09111d] text-white">Gym</option>
                                  <option value="football" className="bg-[#09111d] text-white">Football</option>
                                  <option value="else" className="bg-[#09111d] text-white">Else</option>
                              </select>
                            </label>
                            <input
                              value={sessionForm.amount}
                              onChange={(event) =>
                                setSessionForm((current) => ({
                                  ...current,
                                  amount: event.target.value,
                                }))
                              }
                              placeholder="Amount"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <button
                              type="button"
                              onClick={handleAdd}
                              disabled={isCreating}
                              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                            >
                              {isCreating ? "Creating..." : "Create session"}
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : null}

                    {activeSubscriptionAction === "update" ? (
                      <div className="mt-5 space-y-3">
                        <div>
                          <h3 className="font-display text-2xl text-white">
                            Update a member
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            Update the selected member subscription details.
                          </p>
                        </div>
                        <input
                          value={updateForm.id}
                          onChange={(event) =>
                            setUpdateForm((current) => ({
                              ...current,
                              id: event.target.value,
                            }))
                          }
                          placeholder="ID"
                          className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                        />
                        <label className="block">
                            <span className="mb-2 block text-sm text-[var(--muted)]">
                              Offers
                            </span>
                            <select
                              value={updateForm.offerId}
                              onChange={(event) => {
                                const selected = availableOffers.find(
                                  (o) => String(o.id) === event.target.value,
                                );
                                setUpdateForm((current) => ({
                                  ...current,
                                  offerId: event.target.value,
                                  numberOfMonths: selected ? String(selected.months) : current.numberOfMonths,
                                  amount: selected ? String(selected.price) : current.amount,
                                }));
                              }}
                              className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                            >
                                <option value="" className="bg-[#09111d] text-white">Select an offer</option>
                                {availableOffers.map((offer) => (
                                  <option key={offer.id} value={offer.id} className="bg-[#09111d] text-white">
                                    {offer.name}
                                  </option>
                                ))}
                          </select>
                        </label>
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
                              setUpdateForm((current) => ({
                                ...current,
                                amount: event.target.value,
                              }))
                            }
                            placeholder="Amount of money"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                        >
                          {isUpdating ? "Updating..." : "Update member"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {activePane === "profiles" ? (
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
                        startTransition(() =>
                          setProfileFilter(event.target.value),
                        )
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
                                  const activity = getMemberActivity(
                                    member.endDate,
                                  );

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
                              setEditForm((c) => ({ ...c, phone: e.target.value }))
                            }
                            placeholder="Phone"
                            className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                          />

                          <div className="grid gap-3 lg:grid-cols-2">
                            <input
                              value={editForm.months}
                              onChange={(e) =>
                                setEditForm((c) => ({ ...c, months: e.target.value }))
                              }
                              placeholder="Months"
                              className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                            />
                            <input
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm((c) => ({ ...c, amount: e.target.value }))
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
                              setEditForm((c) => ({ ...c, notes: e.target.value }))
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
            ) : null}

            {activePane === "logs" ? (
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
                      onChange={(event) =>
                        setLogMemberIdFilter(event.target.value)
                      }
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
                            ? new Date(
                                lastCheckInInfo.last_attendance,
                              ).toLocaleString()
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
                          {[
                            "Log ID",
                            "Member ID",
                            "Name",
                            "Phone",
                            "Check-in Time",
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
                        {filteredLogs.length ? (
                          filteredLogs.map((log) => {
                            const member = profileMembers.find(
                              (m) => m.id === String(log.member_id),
                            );
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
                                  {member?.name || "Unknown"}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  {member?.phone || "Unknown"}
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
            ) : null}

            {activePane === "analytics" ? (
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
                        <p className="text-sm text-[var(--muted)]">
                          Monthly revenue trend
                        </p>
                        <p className="mt-2 font-display text-3xl text-white">
                          $18.4k current
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-xs text-emerald-200">
                        +9.2%
                      </span>
                    </div>
                    <div className="mt-8 flex h-56 items-end gap-3">
                      {[
                        "36%",
                        "42%",
                        "48%",
                        "55%",
                        "62%",
                        "73%",
                        "88%",
                        "81%",
                      ].map((height, index) => (
                        <div
                          key={index}
                          className="flex flex-1 flex-col items-center gap-3"
                        >
                          <div
                            className="w-full rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(255,212,102,0.95),rgba(55,114,255,0.5))]"
                            style={{ height }}
                          />
                          <span className="text-xs text-[var(--muted)]">
                            {
                              [
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                              ][index]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <div className="grid gap-5">
                    <article className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-5">
                      <p className="text-sm text-[var(--muted)]">
                        Membership mix
                      </p>
                      <div className="mt-5 space-y-4">
                        {[
                          ["Monthly", "54%"],
                          ["Session Packs", "28%"],
                          ["Quarterly / Annual", "18%"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white">{label}</span>
                              <span className="text-[var(--muted)]">
                                {value}
                              </span>
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
                      <p className="text-sm text-[var(--muted)]">
                        Operational notes
                      </p>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                        <p>
                          Peak occupancy is holding between 6 PM and 8 PM on
                          weekdays.
                        </p>
                        <p>
                          Boxing packages are converting better than standard
                          session packs.
                        </p>
                        <p>
                          Expired memberships need follow-up before the next
                          billing cycle.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </section>
            ) : null}

            {activePane === "bank" ? (
              <section className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                    Bank pane
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-white">
                    Financial overview and funds.
                  </h2>
                </div>

                <div className="mx-auto w-full max-w-4xl space-y-4">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#09111d] p-8 text-center">
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                      Total Balance
                    </p>
                    <p className="mt-6 font-display text-6xl text-emerald-400">
                      ${bankMoney !== null ? bankMoney.toLocaleString() : "---"}
                    </p>
                    <p className="mt-4 text-sm text-[var(--sand)]">
                      Available funds
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {activePane === "offers" ? (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[var(--sand)]">
                      Offers pane
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-white">
                      Create and manage gym offers.
                    </h2>
                  </div>
                  <input
                    type="month"
                    value={offersMonth}
                    onChange={(e) => setOffersMonth(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)] lg:max-w-xs"
                  />
                </div>

                <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5 space-y-4 h-fit">
                    <h3 className="font-display text-xl text-white">
                      Create New Offer
                    </h3>
                    <div className="space-y-3">
                      <input
                        value={offerForm.name}
                        onChange={(e) =>
                          setOfferForm({ ...offerForm, name: e.target.value })
                        }
                        placeholder="Offer Name"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <input
                        type="number"
                        value={offerForm.months}
                        onChange={(e) =>
                          setOfferForm({ ...offerForm, months: e.target.value })
                        }
                        placeholder="Months"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <input
                        type="number"
                        value={offerForm.price}
                        onChange={(e) =>
                          setOfferForm({ ...offerForm, price: e.target.value })
                        }
                        placeholder="Price"
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                      />
                      <input
                        type="date"
                        value={offerForm.endDate}
                        onChange={(e) =>
                          setOfferForm({
                            ...offerForm,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                      />
                      <button
                        type="button"
                        onClick={handleCreateOffer}
                        disabled={isCreatingOffer}
                        className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f]"
                      >
                        {isCreatingOffer ? "Creating..." : "Create Offer"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5">
                      <h3 className="mb-4 font-display text-xl text-white">
                        Available Offers
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {availableOffers.length > 0 ? (
                          availableOffers.map((offer) => (
                            <div
                              key={offer.id}
                              className="rounded-2xl border border-white/5 bg-white/5 p-4"
                            >
                              <p className="text-lg font-medium text-white">
                                {offer.name}
                              </p>
                              <p className="text-2xl font-display text-[var(--accent)] mt-1">
                                ${offer.price}
                              </p>
                              <p className="text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">
                                Ends:{" "}
                                {new Date(
                                  offer.offer_end_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[var(--muted)]">
                            No available offers found.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-[#09111d] p-5">
                      <h3 className="mb-4 font-display text-xl text-white">
                        Offers History
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="text-[var(--sand)] border-b border-white/10">
                            <tr>
                              <th className="px-4 py-3 font-medium">Name</th>
                              <th className="px-4 py-3 font-medium">Price</th>
                              <th className="px-4 py-3 font-medium">Months</th>
                              <th className="px-4 py-3 font-medium">
                                Members
                              </th>
                              <th className="px-4 py-3 font-medium">
                                End Date
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Created At
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOffers.length > 0 ? (
                              filteredOffers.map((offer) => (
                                <tr
                                  key={offer.id}
                                  className="border-b border-white/5 text-[var(--muted)]"
                                >
                                  <td className="px-4 py-3 text-white">
                                    {offer.name}
                                  </td>
                                  <td className="px-4 py-3">${offer.price}</td>
                                  <td className="px-4 py-3">{offer.months}</td>
                                  <td className="px-4 py-3">
                                    {offer.member_count ?? 0}
                                  </td>
                                  <td className="px-4 py-3">
                                    {new Date(
                                      offer.offer_end_date,
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    {new Date(
                                      offer.created_at,
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="p-8 text-center text-[var(--muted)]"
                                >
                                  No offers for this month.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
