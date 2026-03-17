import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app, resetStore } from "../src/app.js";

beforeEach(() => {
  resetStore();
});

describe("POST /todos", () => {
  it("creates a todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Buy milk" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, title: "Buy milk", completed: false });
  });

  it("creates a completed todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Done task", completed: true });
    expect(res.status).toBe(201);
    expect(res.body.completed).toBe(true);
  });

  it("rejects empty title", async () => {
    const res = await request(app).post("/todos").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("rejects missing title", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.status).toBe(400);
  });

  it("rejects title exceeding 200 chars", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "x".repeat(201) });
    expect(res.status).toBe(400);
  });
});

describe("GET /todos", () => {
  it("returns empty array initially", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all todos", async () => {
    await request(app).post("/todos").send({ title: "A" });
    await request(app).post("/todos").send({ title: "B" });
    const res = await request(app).get("/todos");
    expect(res.body).toHaveLength(2);
  });
});

describe("GET /todos/:id", () => {
  it("returns a single todo", async () => {
    await request(app).post("/todos").send({ title: "Test" });
    const res = await request(app).get("/todos/1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Test");
  });

  it("returns 404 for nonexistent todo", async () => {
    const res = await request(app).get("/todos/999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/todos/abc");
    expect(res.status).toBe(400);
  });
});

describe("PUT /todos/:id", () => {
  it("updates a todo title", async () => {
    await request(app).post("/todos").send({ title: "Old" });
    const res = await request(app)
      .put("/todos/1")
      .send({ title: "New" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New");
    expect(res.body.completed).toBe(false);
  });

  it("updates completed status", async () => {
    await request(app).post("/todos").send({ title: "Task" });
    const res = await request(app)
      .put("/todos/1")
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.title).toBe("Task");
  });

  it("returns 404 for nonexistent todo", async () => {
    const res = await request(app)
      .put("/todos/999")
      .send({ title: "Nope" });
    expect(res.status).toBe(404);
  });

  it("rejects empty title", async () => {
    await request(app).post("/todos").send({ title: "Task" });
    const res = await request(app)
      .put("/todos/1")
      .send({ title: "" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app)
      .put("/todos/abc")
      .send({ title: "X" });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /todos/:id", () => {
  it("deletes a todo", async () => {
    await request(app).post("/todos").send({ title: "To delete" });
    const res = await request(app).delete("/todos/1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("To delete");

    const list = await request(app).get("/todos");
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for nonexistent todo", async () => {
    const res = await request(app).delete("/todos/999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).delete("/todos/abc");
    expect(res.status).toBe(400);
  });
});
