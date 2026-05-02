const server = "http://localhost:6969";

export const offersService = {
  getOffers: async () => {
    try {
      const res = await fetch(`${server}/api/v1/offers`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  createOffer: async (
    name: string,
    months: number,
    price: number,
    end_date: string,
  ) => {
    try {
      const res = await fetch(`${server}/api/v1/offers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, months, end_date }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAvailableOffers: async () => {
    try {
      const res = await fetch(`${server}/api/v1/offers/available`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
