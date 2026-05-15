const server = "http://localhost:6969";

export const analysisService = {
  getBasicAnalysis: async () => {
    try {
      const res = await fetch(`${server}/api/v1/reports`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAdvancedMonthAnalysis: async (month: string, sessionType: string) => {
    try {
      const [members, revenue, sessions] = await Promise.all([
        fetch(`${server}/api/v1/reports/members/month?month=${month}`, { credentials: "include" }).then(r => r.json()),
        fetch(`${server}/api/v1/reports/revenue/month?month=${month}`, { credentials: "include" }).then(r => r.json()),
        sessionType
          ? fetch(`${server}/api/v1/reports/sessions/month/type?month=${month}&session_type=${sessionType}`, { credentials: "include" }).then(r => r.json())
          : fetch(`${server}/api/v1/reports/sessions/month?month=${month}`, { credentials: "include" }).then(r => r.json())
      ]);
      return { members, revenue, sessions };
    } catch (error) {
      console.log(error);
    }
  },

  getAdvancedDayAnalysis: async (date: string, sessionType: string) => {
    try {
      const [members, revenue, sessions] = await Promise.all([
        fetch(`${server}/api/v1/reports/members/day?date=${date}`, { credentials: "include" }).then(r => r.json()),
        fetch(`${server}/api/v1/reports/revenue/day?date=${date}`, { credentials: "include" }).then(r => r.json()),
        sessionType
          ? fetch(`${server}/api/v1/reports/sessions/day/type?date=${date}&session_type=${sessionType}`, { credentials: "include" }).then(r => r.json())
          : fetch(`${server}/api/v1/reports/sessions/day?date=${date}`, { credentials: "include" }).then(r => r.json())
      ]);
      return { members, revenue, sessions };
    } catch (error) {
      console.log(error);
    }
  },
};
