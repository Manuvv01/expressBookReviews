const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user =>
    user.username === username &&
    user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
    // 1. Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
  // 2. Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid login. Check username and password"
    });
  }

  // 3. Generate JWT token
  let accessToken = jwt.sign(
    { data: username },
    "access",               // secret key (lab usually uses "access")
    { expiresIn: "1h" }
  );

  // 4. Store session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // 1. Check review provided
  if (!review) {
    return res.status(400).json({
      message: "Review is required"
    });
  }

  // 2. Get username from session
  const username = req.session.authorization.username;

  // 3. Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // 4. Add or Update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // 1. Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // 2. Check if this user has a review
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "No review found for this user"
    });
  }

  // 3. Delete only this user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
