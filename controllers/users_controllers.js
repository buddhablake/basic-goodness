//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users.js");

const users = express.Router();

//test route
users.get("/new", (req, res) => {
  res.render("users/new.ejs", {
    user: req.session.currentUser,
  });
});

users.post("/", (req, res) => {
  //overwrite the user password with the hashed password
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );

  //creates the new user
  User.create(req.body, (err, newUser) => {
    if (err) {
      res.send(err.message);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = users;
