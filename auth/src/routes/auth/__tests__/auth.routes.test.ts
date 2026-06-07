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
    expect(res.body.data).toHaveProperty("userId");
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

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });
  });

  it("returns 200 and sets cookie on valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 on wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  it("returns 401 on unknown email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "unknown@example.com", password: "password123" });

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/verify", () => {
  it("returns 401 with no cookie", async () => {
    const res = await request(app).get("/auth/verify");

    expect(res.status).toBe(401);
  });

  it("returns 200 with userId and email after login", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const cookie = loginRes.headers["set-cookie"];

    const res = await request(app).get("/auth/verify").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("userId");
    expect(res.body.data).toHaveProperty("email");
  });
});
