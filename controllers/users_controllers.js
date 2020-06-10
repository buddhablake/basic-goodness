//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users.js");

const users = express.Router();

//USER REGISTRATION ROUTE
users.get("/new", (req, res) => {
  res.render("users/new.ejs", {
    user: req.session.currentUser,
    emailNotUnique: req.flash("emailNotUnique"),
  });
});

//CREATE USER ROUTE
users.post("/", (req, res) => {
  //overwrite the user password with the hashed password
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );

  //creates the new user
  User.create(req.body, (err, newUser) => {
    if (err) {
      req.flash(
        "emailNotUnique",
        "That email is already in use. Please try a new one or log in with your existing account. "
      );
      res.redirect("/users/new");
    } else {
      req.flash(
        "newUserSuccess",
        "Your account was successfully created. You may log in below."
      );
      res.redirect("/users/sessions/new");
    }
  });
});

module.exports = users;
