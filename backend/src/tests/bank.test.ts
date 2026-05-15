import request from "supertest";
import app from "../index";

describe("Bank Routes", () => {
  describe("GET /api/v1/bank", () => {
    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/v1/bank");
      expect(response.status).toBe(401);
    });
  });
});
