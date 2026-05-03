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
};
