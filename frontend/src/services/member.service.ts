const server = "http://localhost:6969";

export const memberService = {
  getMembers: async () => {
    try {
      const res = await fetch(`${server}/api/v1/members`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  addMember: async (
    name: string,
    phone: string,
    months: number,
    amount: number,
    notes: string,
    offer_id: number = 0,
  ) => {
    try {
      const res = await fetch(`${server}/api/v1/members`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          months,
          price: amount,
          notes,
          offer_id,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  updateMember: async (id: number, months: number, amount: number) => {
    try {
      const res = await fetch(`${server}/api/v1/members/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          months,
          price: amount,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  addSession: async (
    member_name: string,
    phone: string,
    session_type: string,
    price: number,
  ) => {
    try {
      const res = await fetch(`${server}/api/v1/sessions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_name,
          phone,
          session_type,
          price,
          session_date: new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getSessions: async () => {
    try {
      const res = await fetch(`${server}/api/v1/members/sessions`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteMember: async (id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/members/${id}`, {
        method: "DELETE",
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
