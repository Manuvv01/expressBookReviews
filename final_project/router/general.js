const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // 1. Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // 2. Check if username already exists
    if (isValid(username)) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }
  
    // 3. Register new user
    users.push({
      username: username,
      password: password
    });
  
    return res.status(201).json({
      message: "User successfully registered"
    });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get("http://localhost:5000/");
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving book list"
      });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {

    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {

    const authorName = req.params.author;
  
    try {
      const response = await axios.get(`http://localhost:5000/author/${authorName}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(404).json({
        message: "No books found for this author"
      });
    }
  
  });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {

    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(404).json({
        message: "No books found for this title"
      });
    }
  
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    //Write your code here
    const isbn = req.params.isbn;

    const allBooks = Object.values(books); 
    
    const filteredBooks = allBooks.filter(book => book.isbn === isbn);
  
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No ISBN Found" });
    }
  
});

module.exports.general = public_users;
