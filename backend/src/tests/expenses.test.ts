import request from "supertest";
import app from "../index";

describe("Expenses Routes", () => {
  describe("GET /api/v1/expenses", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/expenses");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/v1/expenses", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).post("/api/v1/expenses");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/expenses/:id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/expenses/1");
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/v1/expenses/:id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).put("/api/v1/expenses/1");
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/v1/expenses/:id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).delete("/api/v1/expenses/1");
      expect(response.status).toBe(401);
    });
  });
  
  describe("GET /api/v1/expenses/total", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/expenses/total");
      expect(response.status).toBe(401);
    });
  });
});
