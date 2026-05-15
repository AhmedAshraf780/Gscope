import request from "supertest";
import app from "../index";

describe("Logs Routes", () => {
  describe("POST /api/v1/logs/:member_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).post("/api/v1/logs/1");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/logs/:member_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/logs/1");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/logs/get-last-attendance/:member_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/logs/get-last-attendance/1");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/logs", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/logs");
      expect(response.status).toBe(401);
    });
  });
});
