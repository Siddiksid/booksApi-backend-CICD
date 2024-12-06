const request = require('supertest');
const { getAllBooks, getBookById } = require('../controllers');
const { app } = require('../index.js');
const http = require('http');
const { describe, beforeEach } = require('node:test');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllBooks: jest.fn(),
  getBookById: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe('Controller functions testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return all books', () => {
    let mockBooks = [
      {
        bookId: 1,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
      },
      {
        bookId: 2,
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
      },
      {
        bookId: 3,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
      },
    ];
    getAllBooks.mockReturnValue(mockBooks);
    let result = getAllBooks();
    expect(result.length).toBe(3);
    expect(result).toEqual(mockBooks);
  });

  it('Should return book by id', () => {
    let mockBook = {
      bookId: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
    };
    getBookById.mockReturnValue(mockBook);
    let result = getBookById(1);

    expect(result).toEqual(mockBook);
  });
});

describe('Api endpoints testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/books should return all books', async () => {
    let res = await request(server).get('/books');
    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(3);
    expect(res.body).toEqual({
      books: [
        {
          bookId: 1,
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          genre: 'Fiction',
        },
        {
          bookId: 2,
          title: '1984',
          author: 'George Orwell',
          genre: 'Dystopian',
        },
        {
          bookId: 3,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Classic',
        },
      ],
    });
  });

  it('/books/details/:id should return book by id', async () => {
    let res = await request(server).get('/books/details/1');
    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      book: {
        bookId: 1,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
      },
    });
  });
});
