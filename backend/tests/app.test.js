import request from "supertest";
import app from "../src/index.js";

describe("GET /", () => {
  it("returns a 200 and the health message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Askly Backend is running!");
  });
});
