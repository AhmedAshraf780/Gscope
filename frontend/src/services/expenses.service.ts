const server = "http://localhost:6969/api/v1/expenses";

export const expensesService = {
  getAllExpenses: async () => {
    try {
      const response = await fetch(server, {
        credentials: "include",
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  addExpense: async (
    title: string,
    amount: number,
    date: string,
    category: string,
    notes: string,
  ) => {
    try {
      const response = await fetch(server, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount,
          date,
          category,
          notes,
        }),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  updateExpense: async (
    id: string,
    title: string,
    amount: number,
    date: string,
    category: string,
    notes: string,
  ) => {
    try {
      const response = await fetch(`${server}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount,
          date,
          category,
          notes,
        }),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  deleteExpense: async (id: string) => {
    try {
      const response = await fetch(`${server}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },
};
