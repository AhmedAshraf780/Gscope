const server = "http://localhost:6969";

export const offersService = {
  getOffers: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/offers`, {
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
    gym_id: number,
    name: string,
    price: number,
    end_date: string,
  ) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/offers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, end_date }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAvailableOffers: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/offers/available`, {
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
