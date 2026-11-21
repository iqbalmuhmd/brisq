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

async function registerAndGetUserId(email = "test@example.com") {
  const res = await request(app)
    .post("/auth/register")
    .send({ name: "Test User", email, password: "password123" });

  return res.body.data.userId as string;
}

describe("POST /auth/register", () => {
  it("returns 201 with userId, email and name on valid data", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("userId");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).toHaveProperty("name", "Test User");
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  it("returns 409 if email already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("An account with this email already exists.");
  });

  it("returns 400 if email is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email is required.");
  });

  it("returns 400 if email is invalid", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "not-an-email",
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Enter a valid email address.");
  });

  it("returns 400 if password is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Test User", email: "test@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password is required.");
  });

  it("returns 400 if password is shorter than 8 characters", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password must be at least 8 characters.");
  });

  it("returns 400 if name is missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Enter your name.");
  });

  it("returns 400 if name is over 50 characters", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "a".repeat(51),
        email: "test@example.com",
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name must be 50 characters or fewer.");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
  });

  it("returns 200 and sets cookie on valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.data).toEqual({
      userId: expect.any(String),
      email: "test@example.com",
      name: "Test User",
    });
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

describe("POST /auth/logout", () => {
  it("returns 200 and expires the token cookie", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out");

    const cookies = res.get("Set-Cookie") ?? [];
    const tokenCookie = cookies.find((c) => c.startsWith("token="));

    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toMatch(/^token=;/);
    expect(tokenCookie).toContain("Expires=Thu, 01 Jan 1970");
  });

  it("works even with an invalid token cookie", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", "token=garbage");

    expect(res.status).toBe(200);
  });
});

describe("GET /auth/me", () => {
  it("returns 200 with the user for valid inter-service headers", async () => {
    const userId = await registerAndGetUserId();

    const res = await request(app)
      .get("/auth/me")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      userId,
      email: "test@example.com",
      name: "Test User",
    });
  });

  it("returns 401 without the inter-service secret", async () => {
    const userId = await registerAndGetUserId();

    const res = await request(app).get("/auth/me").set("x-user-id", userId);

    expect(res.status).toBe(401);
  });

  it("returns 401 when the user does not exist", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", "user-that-does-not-exist");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("User not found");
  });
});

describe("GET /auth/linkedin", () => {
  it("returns 200 with an auth url and sets a state cookie", async () => {
    const userId = await registerAndGetUserId();

    const res = await request(app)
      .get("/auth/linkedin")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("url");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 without gateway headers", async () => {
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

    const userId = await registerAndGetUserId();

    const res = await request(app)
      .get("/auth/linkedin/callback?code=some-code&state=test-state")
      .set("Cookie", "state=test-state")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("status", "connected");

    const saved = await prisma.platformToken.findFirst();
    expect(saved).not.toBeNull();
    expect(saved?.accessToken).toBe("the-access-token");
    expect(saved?.refreshToken).toBeNull();
  });

  it("returns 403 when the state does not match", async () => {
    const userId = await registerAndGetUserId();

    const res = await request(app)
      .get("/auth/linkedin/callback?code=some-code&state=wrong-state")
      .set("Cookie", "state=test-state")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(403);
  });
});

describe("GET /auth/linkedin/status/:platform", () => {
  it("returns connected false when there is no token", async () => {
    const userId = await registerAndGetUserId();

    const res = await request(app)
      .get("/auth/linkedin/status/LINKEDIN")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ connected: false });
  });

  it("returns connected true with expiresAt when a token exists", async () => {
    const userId = await registerAndGetUserId();
    await prisma.platformToken.create({
      data: {
        userId,
        platform: "LINKEDIN",
        accessToken: "the-access-token",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const res = await request(app)
      .get("/auth/linkedin/status/LINKEDIN")
      .set("x-internal-secret", process.env.INTER_SERVICE_SECRET!)
      .set("x-user-id", userId);

    expect(res.status).toBe(200);
    expect(res.body.data.connected).toBe(true);
    expect(res.body.data).toHaveProperty("expiresAt");
  });

  it("returns 401 without gateway headers", async () => {
    const res = await request(app).get("/auth/linkedin/status/LINKEDIN");

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/token/:platform", () => {
  it("returns the access token for a valid inter-service request", async () => {
    const user = await prisma.user.create({
      data: { name: "Worker", email: "worker@example.com", passwordHash: "x" },
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
