import request from "supertest";
import app from "../index";

describe("Offer Routes", () => {
  describe("GET /api/v1/offers", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/offers");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/offers", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).post("/api/v1/offers");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/offers/available", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/offers/available");
      expect(response.status).toBe(401);
    });
  });
});
