import { useState, useMemo } from "react";
import type { Offer } from "./types";
import { offersService } from "../../services/offers.service";
import { useToast } from "../../toast/useToast";

interface OffersPaneProps {
  allOffers: Offer[];
  availableOffers: Offer[];
  loadAllOffers: () => Promise<void>;
  loadAvailableOffers: () => Promise<void>;
}

export function OffersPane({
  allOffers,
  availableOffers,
  loadAllOffers,
  loadAvailableOffers,
}: OffersPaneProps) {
  const { toast } = useToast();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [offersMonth, setOffersMonth] = useState(currentMonth);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({
    name: "",
    months: "",
    price: "",
    endDate: "",
  });

  const filteredOffers = useMemo(() => {
    if (!offersMonth) return allOffers;
    return allOffers.filter((offer) => {
      if (!offer.created_at) return false;
      return offer.created_at.startsWith(offersMonth);
    });
  }, [offersMonth, allOffers]);

  const handleCreateOffer = async () => {
    if (
      !offerForm.name ||
      !offerForm.months ||
      !offerForm.price ||
      !offerForm.endDate
    ) {
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

    if (response && response.offerId) {
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

  return (
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
          <h3 className="font-display text-xl text-white">Create New Offer</h3>
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
                      {new Date(offer.offer_end_date).toLocaleDateString()}
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
                    <th className="px-4 py-3 font-medium">Members</th>
                    <th className="px-4 py-3 font-medium">End Date</th>
                    <th className="px-4 py-3 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.length > 0 ? (
                    filteredOffers.map((offer) => (
                      <tr
                        key={offer.id}
                        className="border-b border-white/5 text-[var(--muted)]"
                      >
                        <td className="px-4 py-3 text-white">{offer.name}</td>
                        <td className="px-4 py-3">${offer.price}</td>
                        <td className="px-4 py-3">{offer.months}</td>
                        <td className="px-4 py-3">
                          {offer.member_count ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(offer.offer_end_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(offer.created_at).toLocaleDateString()}
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
  );
}
