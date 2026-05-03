export interface Offer {
  id?: number;
  offer_end_date: string;
  created_at?: string;
  months: number;
  member_count?: number;
  price: number;
  name: string;
  gym_id: number;
}

export interface OfferDao {
  addOffer(gymId: number, offer: Offer): Promise<number | null>;
  getOffers(gym_id: number): Promise<Offer[] | null>;
  getAvailableOffers(gym_id: number): Promise<Offer[] | null>;
  updateOfferCount(offer_id: number): Promise<boolean>;
}
