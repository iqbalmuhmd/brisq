import request from "supertest";
import app from "../../../app";
import prisma from "../../../config/db";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /auth/register", () => {
  it("returns 201 with userId and email on valid data", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  it("returns 409 if email already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(409);
  });

  it("returns 400 if email is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
  });

  it("returns 400 if password is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
  });
});
