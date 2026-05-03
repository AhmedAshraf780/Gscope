export interface Offer {
  id: number;
  offer_end_date: string;
  member_count: number;
  price: number;
  name: string;
  gym_id: number;
}

export interface OfferDao {
  addOffer(
    gymId: number,
    name: string,
    price: number,
    end_date: string,
  ): Promise<number | null>;
  getOffers(gym_id: number): Promise<Offer[] | null>;
  getAvailableOffers(gym_id: number): Promise<Offer[] | null>;
}
