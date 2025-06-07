import request from "supertest";
import app from "../src/index"; // เปลี่ยนตามตำแหน่งไฟล์จริง

describe("Auth API", () => {
  let accessToken: string;
  let refreshToken: string;

  const testUser = {
    username: "testuser",
    password: "password123",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("สมัครสมาชิกสำเร็จ");
  });

  it("should login and receive tokens", async () => {
    const res = await request(app).post("/auth/login").send(testUser);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should access protected route with access token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId");
  });

  it("should refresh access token with refresh token", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");

    accessToken = res.body.accessToken;
  });

  it("should logout and revoke refresh token", async () => {
    const res = await request(app).post("/auth/logout").send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("ออกจากระบบสำเร็จ");
  });

  it("should fail to refresh token after logout", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .send({ refreshToken });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("ไม่มี refresh token หรือไม่ถูกต้อง");
  });
});
