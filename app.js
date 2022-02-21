'use strict'
const { fetch } = require('undici');
const express = require('express');
const app = express();
let todos = [
  { id: 1, title: 'clean my room', completed: false },
  { id: 2, title: 'write paper', completed: true }
];

app.use(express.json())
app.get('/api/todos', (req, res) => {
  if (!req.query.completed) res.json(todos);

  const completed = req.query.completed === 'true';
  res.json(todos.filter(todo => todo.completed === completed));
});

let id = 2;

app.post('/api/todos', (req, res, next) => {
  const { title } = req.body;
  if (typeof title !== 'string' || !title) {
    const err = new Error('title is required');
    err.statusCode = 400;
    return next(err);
  }

  const todo = { id: id += 1, title, completed: false };
  todos.push(todo);

  res.status(201).json(todo);

});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ error: err.message });
});


app.listen(3000);
