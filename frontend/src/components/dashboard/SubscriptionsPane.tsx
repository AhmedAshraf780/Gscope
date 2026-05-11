import { useState } from "react";
import { useFormik } from "formik";
import { useToast } from "../../toast/useToast";
import { logService } from "../../services/logs.service";
import { memberService } from "../../services/member.service";
import { isResponseSuccess, getResponseMessage } from "../../auth/authStorage";

type Offer = {
  id: number;
  name: string;
  months: number;
  price: number;
  offer_end_date: string;
  created_at: string;
  member_count?: number;
};

const subscriptionActions = ["checkin", "create", "update"] as const;
const createModes = ["member", "session"] as const;

interface SubscriptionsPaneProps {
  availableOffers: Offer[];
  onCheckInSuccess: () => Promise<void>;
  onMemberAdded: () => Promise<void>;
  onMemberUpdated: () => Promise<void>;
}

export function SubscriptionsPane({ availableOffers, onCheckInSuccess, onMemberAdded, onMemberUpdated }: SubscriptionsPaneProps) {
  const { toast } = useToast();
  const [activeSubscriptionAction, setActiveSubscriptionAction] = useState<typeof subscriptionActions[number]>("checkin");
  const [activeCreateMode, setActiveCreateMode] = useState<typeof createModes[number]>("member");

  const checkInForm = useFormik({
    initialValues: { checkInId: "" },
    validate: (values) => {
      const errors: any = {};
      if (!values.checkInId) errors.checkInId = "Required";
      else if (isNaN(Number(values.checkInId.trim()))) errors.checkInId = "Must be a valid numeric ID";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const memberIdNum = Number(values.checkInId.trim());
      const res = await logService.createLog(memberIdNum);
      if (res && res.message === "Log created successfully") {
        toast({ title: "Check-in successful", description: `Member ${memberIdNum} checked in.`, kind: "success" });
        await onCheckInSuccess();
        resetForm();
      } else {
        toast({ title: "Check-in failed", description: res?.message || "Could not check in member.", kind: "error" });
      }
      setSubmitting(false);
    },
  });

  const memberForm = useFormik({
    initialValues: { name: "", phone: "", offerId: "", numberOfMonths: "", amount: "", notes: "" },
    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = "Required";
      if (!values.phone) errors.phone = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const response = await memberService.addMember(
        values.name.trim(),
        values.phone.trim(),
        Number(values.numberOfMonths) || 0,
        Number(values.amount) || 0,
        values.notes.trim(),
        Number(values.offerId) || 0,
      );

      if (!response || !isResponseSuccess(response)) {
        toast({ title: "Member creation failed", description: getResponseMessage(response), kind: "error" });
      } else {
        await onMemberAdded();
        toast({ title: "Member created", description: "The member was saved successfully.", kind: "success" });
        resetForm();
      }
      setSubmitting(false);
    },
  });

  const handleOfferChange = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const offerId = event.target.value;
    setFieldValue("offerId", offerId);
    const selected = availableOffers.find((o) => String(o.id) === offerId);
    if (selected) {
      setFieldValue("numberOfMonths", String(selected.months));
      setFieldValue("amount", String(selected.price));
    }
  };

  const sessionForm = useFormik({
    initialValues: { name: "", phone: "", sessionType: "gym", amount: "" },
    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = "Required";
      if (!values.phone) errors.phone = "Required";
      if (!values.amount) errors.amount = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const response = await memberService.addSession(
        values.name.trim(),
        values.phone.trim(),
        values.sessionType === "else" ? "swimming" : values.sessionType,
        Number(values.amount) || 0,
      );

      if (!response || !isResponseSuccess(response)) {
        toast({ title: "Session creation failed", description: getResponseMessage(response), kind: "error" });
      } else {
        await onMemberAdded();
        toast({ title: "Session created", description: "The session was saved successfully.", kind: "success" });
        resetForm();
      }
      setSubmitting(false);
    },
  });

  const updateForm = useFormik({
    initialValues: { id: "", offerId: "", numberOfMonths: "", amount: "" },
    validate: (values) => {
      const errors: any = {};
      if (!values.id) errors.id = "Required";
      else if (isNaN(Number(values.id))) errors.id = "Must be a valid number";
      if (!values.numberOfMonths) errors.numberOfMonths = "Required";
      if (!values.amount) errors.amount = "Required";
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const response = await memberService.updateMember(
        Number(values.id),
        Number(values.numberOfMonths) || 0,
        Number(values.amount) || 0,
      );

      if (!response || !isResponseSuccess(response)) {
        toast({ title: "Member update failed", description: getResponseMessage(response), kind: "error" });
      } else {
        await onMemberUpdated();
        toast({ title: "Member updated", description: "The member was updated successfully.", kind: "success" });
        resetForm();
      }
      setSubmitting(false);
    },
  });

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
                {action === "checkin" ? "Check in" : action === "create" ? "Create" : "Update"}
              </button>
            ))}
          </div>

          {activeSubscriptionAction === "checkin" ? (
            <form onSubmit={checkInForm.handleSubmit} className="mt-5 space-y-3">
              <div>
                <h3 className="font-display text-2xl text-white">Check in a member</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Enter a member id and record the visit instantly.</p>
              </div>
              <input
                name="checkInId"
                value={checkInForm.values.checkInId}
                onChange={checkInForm.handleChange}
                placeholder="MBR-1001"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />
              {checkInForm.errors.checkInId && checkInForm.touched.checkInId && (
                <p className="text-xs text-red-400 mt-1">{String(checkInForm.errors.checkInId)}</p>
              )}
              <button
                type="submit"
                disabled={checkInForm.isSubmitting}
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
              >
                {checkInForm.isSubmitting ? "Checking in..." : "Check in"}
              </button>
            </form>
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
                <form onSubmit={memberForm.handleSubmit} className="space-y-3">
                  <div>
                    <h3 className="font-display text-2xl text-white">Create a member</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Create a member subscription record with the selected offer details.</p>
                  </div>
                  <input
                    name="name"
                    value={memberForm.values.name}
                    onChange={memberForm.handleChange}
                    placeholder="Name"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  {memberForm.errors.name && memberForm.touched.name && <p className="text-xs text-red-400 mt-1">{String(memberForm.errors.name)}</p>}
                  
                  <input
                    name="phone"
                    value={memberForm.values.phone}
                    onChange={memberForm.handleChange}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  {memberForm.errors.phone && memberForm.touched.phone && <p className="text-xs text-red-400 mt-1">{String(memberForm.errors.phone)}</p>}

                  <label className="block">
                    <span className="mb-2 block text-sm text-[var(--muted)]">Offers</span>
                    <select
                      name="offerId"
                      value={memberForm.values.offerId}
                      onChange={(e) => handleOfferChange(e, memberForm.setFieldValue)}
                      className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    >
                      <option value="" className="bg-[#09111d] text-white">Select an offer</option>
                      {availableOffers.map((offer) => (
                        <option key={offer.id} value={offer.id} className="bg-[#09111d] text-white">{offer.name}</option>
                      ))}
                    </select>
                  </label>
                  
                  <div className="grid gap-3 lg:grid-cols-2">
                    <input
                      name="numberOfMonths"
                      value={memberForm.values.numberOfMonths}
                      onChange={memberForm.handleChange}
                      placeholder="Number of months"
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                    />
                    <input
                      name="amount"
                      value={memberForm.values.amount}
                      onChange={memberForm.handleChange}
                      placeholder="Amount of money"
                      className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                    />
                  </div>
                  <textarea
                    name="notes"
                    value={memberForm.values.notes}
                    onChange={memberForm.handleChange}
                    placeholder="Notes"
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    disabled={memberForm.isSubmitting}
                    className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
                  >
                    {memberForm.isSubmitting ? "Creating..." : "Create member"}
                  </button>
                </form>
              ) : null}

              {activeCreateMode === "session" ? (
                <form onSubmit={sessionForm.handleSubmit} className="space-y-3">
                  <div>
                    <h3 className="font-display text-2xl text-white">Create a session</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Record a one-off session sale with its type and amount.</p>
                  </div>
                  <input
                    name="name"
                    value={sessionForm.values.name}
                    onChange={sessionForm.handleChange}
                    placeholder="Name"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  {sessionForm.errors.name && sessionForm.touched.name && <p className="text-xs text-red-400 mt-1">{String(sessionForm.errors.name)}</p>}
                  
                  <input
                    name="phone"
                    value={sessionForm.values.phone}
                    onChange={sessionForm.handleChange}
                    placeholder="Phone"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  {sessionForm.errors.phone && sessionForm.touched.phone && <p className="text-xs text-red-400 mt-1">{String(sessionForm.errors.phone)}</p>}
                  
                  <label className="block">
                    <span className="mb-2 block text-sm text-[var(--muted)]">Session type</span>
                    <select
                      name="sessionType"
                      value={sessionForm.values.sessionType}
                      onChange={sessionForm.handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                    >
                      <option value="gym" className="bg-[#09111d] text-white">Gym</option>
                      <option value="football" className="bg-[#09111d] text-white">Football</option>
                      <option value="else" className="bg-[#09111d] text-white">Else</option>
                    </select>
                  </label>
                  
                  <input
                    name="amount"
                    value={sessionForm.values.amount}
                    onChange={sessionForm.handleChange}
                    placeholder="Amount"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                  />
                  {sessionForm.errors.amount && sessionForm.touched.amount && <p className="text-xs text-red-400 mt-1">{String(sessionForm.errors.amount)}</p>}
                  
                  <button
                    type="submit"
                    disabled={sessionForm.isSubmitting}
                    className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
                  >
                    {sessionForm.isSubmitting ? "Creating..." : "Create session"}
                  </button>
                </form>
              ) : null}
            </div>
          ) : null}

          {activeSubscriptionAction === "update" ? (
            <form onSubmit={updateForm.handleSubmit} className="mt-5 space-y-3">
              <div>
                <h3 className="font-display text-2xl text-white">Update a member</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Update the selected member subscription details.</p>
              </div>
              <input
                name="id"
                value={updateForm.values.id}
                onChange={updateForm.handleChange}
                placeholder="ID"
                className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
              />
              {updateForm.errors.id && updateForm.touched.id && <p className="text-xs text-red-400 mt-1">{String(updateForm.errors.id)}</p>}
              
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--muted)]">Offers</span>
                <select
                  name="offerId"
                  value={updateForm.values.offerId}
                  onChange={(e) => handleOfferChange(e, updateForm.setFieldValue)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09111d] px-4 py-3 text-white outline-none focus:border-[var(--accent)]"
                >
                  <option value="" className="bg-[#09111d] text-white">Select an offer</option>
                  {availableOffers.map((offer) => (
                    <option key={offer.id} value={offer.id} className="bg-[#09111d] text-white">{offer.name}</option>
                  ))}
                </select>
              </label>
              
              <div className="grid gap-3 lg:grid-cols-2">
                <input
                  name="numberOfMonths"
                  value={updateForm.values.numberOfMonths}
                  onChange={updateForm.handleChange}
                  placeholder="Number of months"
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                />
                <input
                  name="amount"
                  value={updateForm.values.amount}
                  onChange={updateForm.handleChange}
                  placeholder="Amount of money"
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]"
                />
              </div>
              
              <button
                type="submit"
                disabled={updateForm.isSubmitting}
                className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#08111f] disabled:opacity-50"
              >
                {updateForm.isSubmitting ? "Updating..." : "Update member"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
