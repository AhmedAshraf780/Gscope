const server = `http://localhost:6969`;
export const bankService = {
  getMoney: async () => {
    try {
      const res = await fetch(`${server}/api/v1/bank`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
