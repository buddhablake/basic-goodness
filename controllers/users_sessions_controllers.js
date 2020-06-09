//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users.js");

//============
//CONFIGURATION
//============
const usersSessions = express.Router();

//============
//Routes
//============

usersSessions.get("/new", (req, res) => {
  res.render("users/sessions/new.ejs", {
    user: req.session.currentUser,
    dbError: req.flash("dbError"),
    usernameError: req.flash("usernameError"),
    passError: req.flash("passError"),
  });
});

usersSessions.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      console.log(err);
      req.flash(
        "dbError",
        "Something went wrong on our end. Please try logging in again."
      );
      res.redirect("/users/sessions/new");
    } else if (!foundUser) {
      req.flash(
        "usernameError",
        "The email and/or password you provided were incorrect. Please try again."
      );
      res.redirect("/users/sessions/new");
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        // console.log(req.session.currentUser.id);
        res.redirect("/");
      } else {
        req.flash(
          "passError",
          "The email and/or password you provided were incorrect. Please try again."
        );
        res.redirect("/users/sessions/new");
      }
    }
  });
});

usersSessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    console.log("it worked");
    res.redirect("/");
  });
});

module.exports = usersSessions;
