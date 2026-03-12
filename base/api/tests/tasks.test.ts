import { describe, it, expect } from "vitest";
import request from "supertest";
import { setupTestEnvironment, getApp } from "./setup";

describe("Tasks endpoints", () => {
  setupTestEnvironment();

  const registerAndLogin = async (
    email = "user@example.com",
    password = "password123"
  ): Promise<string> => {
    await request(getApp())
      .post("/auth/register")
      .send({ email, password });

    const res = await request(getApp())
      .post("/auth/login")
      .send({ email, password });

    return res.body.token as string;
  };

  describe("POST /tasks", () => {
    it("should create a task successfully", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test task", description: "A test task", status: "pending" });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Test task");
      expect(res.body.description).toBe("A test task");
      expect(res.body.status).toBe("pending");
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("userId");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });

    it("should create a task without description", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "No desc", status: "pending" });

      expect(res.status).toBe(201);
      expect(res.body.description).toBeNull();
    });

    it("should return 400 for missing title", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "pending" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid status", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task", status: "invalid" });

      expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
      const res = await request(getApp())
        .post("/tasks")
        .send({ title: "Task", status: "pending" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /tasks", () => {
    it("should return empty list when no tasks", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it("should return only own tasks", async () => {
      const token1 = await registerAndLogin("user1@example.com");
      const token2 = await registerAndLogin("user2@example.com");

      await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token1}`)
        .send({ title: "User1 task", status: "pending" });

      await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token2}`)
        .send({ title: "User2 task", status: "done" });

      const res = await request(getApp())
        .get("/tasks")
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("User1 task");
    });

    it("should filter by status", async () => {
      const token = await registerAndLogin();

      await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Pending task", status: "pending" });

      await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Done task", status: "done" });

      const res = await request(getApp())
        .get("/tasks?status=done")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Done task");
    });

    it("should support pagination", async () => {
      const token = await registerAndLogin();

      for (let i = 0; i < 15; i++) {
        await request(getApp())
          .post("/tasks")
          .set("Authorization", `Bearer ${token}`)
          .send({ title: `Task ${i}`, status: "pending" });
      }

      const res = await request(getApp())
        .get("/tasks?page=2&limit=5")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.limit).toBe(5);
      expect(res.body.meta.total).toBe(15);
      expect(res.body.meta.totalPages).toBe(3);
    });

    it("should return 401 without token", async () => {
      const res = await request(getApp()).get("/tasks");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a task by id", async () => {
      const token = await registerAndLogin();

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "My task", status: "pending" });

      const res = await request(getApp())
        .get(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
      expect(res.body.title).toBe("My task");
    });

    it("should return 403 when accessing another user's task", async () => {
      const token1 = await registerAndLogin("owner@example.com");
      const token2 = await registerAndLogin("other@example.com");

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token1}`)
        .send({ title: "Private task", status: "pending" });

      const res = await request(getApp())
        .get(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent task", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .get("/tasks/550e8400-e29b-41d4-a716-446655440000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 400 for invalid UUID", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .get("/tasks/not-a-uuid")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update task fields", async () => {
      const token = await registerAndLogin();

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Original", status: "pending" });

      const res = await request(getApp())
        .put(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated", status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated");
      expect(res.body.status).toBe("done");
    });

    it("should update only provided fields", async () => {
      const token = await registerAndLogin();

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Original", description: "Desc", status: "pending" });

      const res = await request(getApp())
        .put(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "done" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Original");
      expect(res.body.description).toBe("Desc");
      expect(res.body.status).toBe("done");
    });

    it("should return 400 for empty body", async () => {
      const token = await registerAndLogin();

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task", status: "pending" });

      const res = await request(getApp())
        .put(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 403 when updating another user's task", async () => {
      const token1 = await registerAndLogin("owner2@example.com");
      const token2 = await registerAndLogin("other2@example.com");

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token1}`)
        .send({ title: "Private", status: "pending" });

      const res = await request(getApp())
        .put(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({ title: "Hacked" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should soft-delete a task", async () => {
      const token = await registerAndLogin();

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "To delete", status: "pending" });

      const deleteRes = await request(getApp())
        .delete(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.status).toBe(204);

      // Should not appear in listings
      const listRes = await request(getApp())
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(listRes.body.data).toHaveLength(0);

      // Should return 404 when accessing directly
      const getRes = await request(getApp())
        .get(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });

    it("should return 403 when deleting another user's task", async () => {
      const token1 = await registerAndLogin("delowner@example.com");
      const token2 = await registerAndLogin("delother@example.com");

      const created = await request(getApp())
        .post("/tasks")
        .set("Authorization", `Bearer ${token1}`)
        .send({ title: "Not yours", status: "pending" });

      const res = await request(getApp())
        .delete(`/tasks/${created.body.id}`)
        .set("Authorization", `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 for non-existent task", async () => {
      const token = await registerAndLogin();

      const res = await request(getApp())
        .delete("/tasks/550e8400-e29b-41d4-a716-446655440000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
