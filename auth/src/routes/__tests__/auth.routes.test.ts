import request from "supertest";
import app from "../../app";
import prisma from "../../config/db";

beforeEach(async () => {
  await prisma.platformToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function loginAndGetCookie() {
  await request(app)
    .post("/auth/register")
    .send({ email: "test@example.com", password: "password123" });

  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  return res.headers["set-cookie"];
}

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

describe("GET /auth/linkedin", () => {
  it("returns 200 with an auth url and sets a state cookie", async () => {
    const cookie = await loginAndGetCookie();

    const res = await request(app).get("/auth/linkedin").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("url");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 without a login cookie", async () => {
    const res = await request(app).get("/auth/linkedin");

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/linkedin/callback", () => {
  it("saves the token and returns 200 on a valid callback", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "the-access-token",
        expires_in: 3600,
      }),
    } as Response);

    const cookie = await loginAndGetCookie();
    const cookies = [...cookie, "state=test-state"];

    const res = await request(app)
      .get("/auth/linkedin/callback?code=some-code&state=test-state")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("status", "connected");

    const saved = await prisma.platformToken.findFirst();
    expect(saved).not.toBeNull();
    expect(saved?.accessToken).toBe("the-access-token");
    expect(saved?.refreshToken).toBeNull();
  });

  it("returns 403 when the state does not match", async () => {
    const cookie = await loginAndGetCookie();
    const cookies = [...cookie, "state=test-state"];

    const res = await request(app)
      .get("/auth/linkedin/callback?code=some-code&state=wrong-state")
      .set("Cookie", cookies);

    expect(res.status).toBe(403);
  });
});

describe("GET /auth/linkedin/status/:platform", () => {
  it("returns connected false when there is no token", async () => {
    const cookie = await loginAndGetCookie();

    const res = await request(app)
      .get("/auth/linkedin/status/LINKEDIN")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ connected: false });
  });

  it("returns connected true with expiresAt when a token exists", async () => {
    const cookie = await loginAndGetCookie();
    const user = await prisma.user.findFirstOrThrow();
    await prisma.platformToken.create({
      data: {
        userId: user.id,
        platform: "LINKEDIN",
        accessToken: "the-access-token",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const res = await request(app)
      .get("/auth/linkedin/status/LINKEDIN")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.connected).toBe(true);
    expect(res.body.data).toHaveProperty("expiresAt");
  });

  it("returns 401 without a login cookie", async () => {
    const res = await request(app).get("/auth/linkedin/status/LINKEDIN");

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/token/:platform", () => {
  it("returns the access token for a valid inter-service request", async () => {
    const user = await prisma.user.create({
      data: { email: "worker@example.com", passwordHash: "x" },
    });
    await prisma.platformToken.create({
      data: {
        userId: user.id,
        platform: "LINKEDIN",
        accessToken: "the-access-token",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const res = await request(app)
      .get("/auth/token/LINKEDIN")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET as string)
      .set("x-user-id", user.id);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken", "the-access-token");
  });

  it("returns 401 without the inter-service secret", async () => {
    const res = await request(app).get("/auth/token/LINKEDIN");

    expect(res.status).toBe(401);
  });
});
