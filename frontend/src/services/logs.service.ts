const server = 'http://localhost:6969';
export const logService = {
  getLogs: async (gym_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/logs`, {
        credentials: 'include',
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  createLog: async (gym_id: number, member_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/logs/${member_id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  getLogsByMemberId: async (gym_id: number, member_id: number) => {
    try {
      const res = await fetch(`${server}/api/v1/${gym_id}/logs/${member_id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  getLastCheckIn: async (gym_id: number, member_id: number) => {
    try {
      const res = await fetch(
        `${server}/api/v1/${gym_id}/logs/get-last-attendance/${member_id}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  },
};
