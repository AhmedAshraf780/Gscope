const server = `http://localhost:6969`;
export const bankService = {
  getMoney: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/bank`, {
        method: "GET",
        credentials: 'include',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
}
