import request from "supertest";
import app from "../index";

describe("Company Routes", () => {
  describe("GET /api/v1/companies", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/companies");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/companies/:company_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/companies/1");
      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/v1/companies/:company_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).put("/api/v1/companies/1");
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/v1/companies/:company_id", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).delete("/api/v1/companies/1");
      expect(response.status).toBe(401);
    });
  });
});
