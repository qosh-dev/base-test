import { describe, it, expect } from "vitest";
import request from "supertest";
import { setupTestEnvironment, getApp } from "./setup";

describe("Auth endpoints", () => {
  setupTestEnvironment();

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(getApp())
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe("test@example.com");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 409 for duplicate email", async () => {
      await request(getApp())
        .post("/auth/register")
        .send({ email: "dup@example.com", password: "password123" });

      const res = await request(getApp())
        .post("/auth/register")
        .send({ email: "dup@example.com", password: "password456" });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already exists");
    });

    it("should return 400 for invalid email", async () => {
      const res = await request(getApp())
        .post("/auth/register")
        .send({ email: "not-an-email", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Validation error");
      expect(res.body.errors).toBeDefined();
    });

    it("should return 400 for short password", async () => {
      const res = await request(getApp())
        .post("/auth/register")
        .send({ email: "test@example.com", password: "123" });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should return 400 for missing fields", async () => {
      const res = await request(getApp())
        .post("/auth/register")
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully and return token", async () => {
      await request(getApp())
        .post("/auth/register")
        .send({ email: "login@example.com", password: "password123" });

      const res = await request(getApp())
        .post("/auth/login")
        .send({ email: "login@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
    });

    it("should return 401 for invalid password", async () => {
      await request(getApp())
        .post("/auth/register")
        .send({ email: "login2@example.com", password: "password123" });

      const res = await request(getApp())
        .post("/auth/login")
        .send({ email: "login2@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Invalid");
    });

    it("should return 401 for non-existent user", async () => {
      const res = await request(getApp())
        .post("/auth/login")
        .send({ email: "noone@example.com", password: "password123" });

      expect(res.status).toBe(401);
    });

    it("should return 400 for invalid email format", async () => {
      const res = await request(getApp())
        .post("/auth/login")
        .send({ email: "bad-email", password: "password123" });

      expect(res.status).toBe(400);
    });
  });
});
