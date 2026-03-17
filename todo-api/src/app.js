const express = require("express");
const { z } = require("zod");

const app = express();
app.use(express.json());

// In-memory store
let todos = [];
let nextId = 1;

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  completed: z.boolean().optional().default(false),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  completed: z.boolean().optional(),
});

// Helper to reset state (for testing)
function resetStore() {
  todos = [];
  nextId = 1;
}

// GET /todos - List all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// GET /todos/:id - Get a single todo
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  res.json(todo);
});

// POST /todos - Create a new todo
app.post("/todos", (req, res) => {
  const result = createTodoSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message) });
  }

  const todo = { id: nextId++, ...result.data };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT /todos/:id - Update a todo
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const result = updateTodoSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message) });
  }

  todos[index] = { ...todos[index], ...result.data };
  res.json(todos[index]);
});

// DELETE /todos/:id - Delete a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

module.exports = { app, resetStore };
