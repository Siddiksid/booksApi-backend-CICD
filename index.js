const express = require('express');
const { resolve } = require('path');
const { getAllBooks, getBookById } = require('./controllers');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to Books api');
});

app.get('/books', (req, res) => {
  let books = getAllBooks();
  res.json({ books });
});

app.get('/books/details/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let book = getBookById(id);
  res.json({ book });
});

module.exports = { app };
