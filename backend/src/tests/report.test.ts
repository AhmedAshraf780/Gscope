import request from "supertest";
import app from "../index";

describe("Report Routes", () => {
  describe("GET /api/v1/reports", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/reports");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/reports/day", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/reports/day");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/reports/month", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/reports/month");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/reports/sessions/day/type", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/reports/sessions/day/type");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/reports/sessions/month/type", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/reports/sessions/month/type");
      expect(response.status).toBe(401);
    });
  });
});
