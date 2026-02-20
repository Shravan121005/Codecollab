//check mic check 123

const request = require("supertest");
const app = require("../app.js"); // your express app

describe("Health Check API", () => {
  it("should return status 200 and { status: 'ok' }", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});