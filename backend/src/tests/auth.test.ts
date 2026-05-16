import request from "supertest";
import app from "../index";

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/signin", () => {
    it("should return 401 when missing credentials", async () => {
      const response = await request(app).post("/api/v1/auth/signin").send({});
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/auth/signup", () => {
    it("should return 401 when missing credentials", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({});
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/forgotpassword", () => {
    it("should return 401 when missing email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/forgotpassword")
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/restorepassword", () => {
    it("should return 401 when missing credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/restorepassword")
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/validateotp", () => {
    it("should return 401 when session not found", async () => {
      const response = await request(app)
        .post("/api/v1/auth/validateotp")
        .send({ session: "invalid", otp: "123456" });
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/auth/resendotp", () => {
    it("should return 200 with invalid session message", async () => {
      const response = await request(app)
        .post("/api/v1/auth/resendotp")
        .send({ session: "invalid" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Invalid session");
    });
  });
});
