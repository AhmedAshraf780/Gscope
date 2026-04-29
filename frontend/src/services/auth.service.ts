const server = `http://localhost:6969`;
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${server}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  signup: async (email: string, password: string, phone: string, name: string) => {
    try {
      const res = await fetch(`${server}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          phone,
          name,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  sendOTP: async (session: string, otp: string) => {
    try {
      const res = await fetch(`${server}/api/v1/auth/validateotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session,
          otp,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  forgetPassword: async (email: string) => {
    try {
      const res = await fetch(`${server}/api/v1/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
