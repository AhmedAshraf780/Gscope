import { useState } from "react";
import type { Offer, OfferOption, Member } from "./types";
import { memberService } from "../../services/member.service";
import { logService } from "../../services/logs.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";
import { useToast } from "../../toast/useToast";

const subscriptionActions = ["checkin", "create", "update"] as const;
type SubscriptionAction = (typeof subscriptionActions)[number];
const createModes = ["member", "session"] as const;
type CreateMode = (typeof createModes)[number];

interface SubscriptionsPaneProps {
  offers: OfferOption[];
  availableOffers: Offer[];
  members: Member[];
  setMembers: (fn: (current: Member[]) => Member[]) => void;
  loadProfileMembers: () => Promise<void>;
}

export function SubscriptionsPane({
  offers,
  availableOffers,
  members,
  setMembers,
  loadProfileMembers,
}: SubscriptionsPaneProps) {
  const { toast } = useToast();
  const [activeSubscriptionAction, setActiveSubscriptionAction] =
    useState<SubscriptionAction>("checkin");
  const [activeCreateMode, setActiveCreateMode] = useState<CreateMode>("member");
  const [checkInId, setCheckInId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

  return (
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
                    {mode === "member" ? "Create member" : "Create session"}
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
                      Create a member subscription record with the selected
                      offer details.
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
                          numberOfMonths: selected
                            ? String(selected.months)
                            : current.numberOfMonths,
                          amount: selected
                            ? String(selected.price)
                            : current.amount,
                        }));
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    >
                      <option
                        value=""
                        className="bg-[#09111d] text-white"
                      >
                        Select an offer
                      </option>
                      {availableOffers.map((offer) => (
                        <option
                          key={offer.id}
                          value={offer.id}
                          className="bg-[#09111d] text-white"
                        >
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
                      Record a one-off session sale with its type and amount.
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
                      <option
                        value="gym"
                        className="bg-[#09111d] text-white"
                      >
                        Gym
                      </option>
                      <option
                        value="football"
                        className="bg-[#09111d] text-white"
                      >
                        Football
                      </option>
                      <option
                        value="else"
                        className="bg-[#09111d] text-white"
                      >
                        Else
                      </option>
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
                      numberOfMonths: selected
                        ? String(selected.months)
                        : current.numberOfMonths,
                      amount: selected
                        ? String(selected.price)
                        : current.amount,
                    }));
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                >
                  <option
                    value=""
                    className="bg-[#09111d] text-white"
                  >
                    Select an offer
                  </option>
                  {availableOffers.map((offer) => (
                    <option
                      key={offer.id}
                      value={offer.id}
                      className="bg-[#09111d] text-white"
                    >
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
  );
}
