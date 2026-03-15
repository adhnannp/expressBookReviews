const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching book by ISBN"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

public_users.get('/books', function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  return res.status(200).json(matchingBooks);
});

public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  return res.status(200).json(matchingBooks);
});

module.exports.general = public_users;
