const server = "http://localhost:6969";
export const logService = {
  getLogs: async () => {
    try {
      const res = await fetch(`${server}/api/v1/logs`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  createLog: async (member_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/logs/${member_id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  getLogsByMemberId: async (member_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/logs/${member_id}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  getLastCheckIn: async (member_id: number) => {
    try {
      const res = await fetch(
        `${server}/api/v1/logs/get-last-attendance/${member_id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },
};
