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
  res.render("users/sessions/new.ejs");
});

usersSessions.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.send(
        'Yikes something went wrong. <a href="/users/sessions/new">Click here</a> to try again.'
      );
    } else if (!foundUser) {
      res.send(
        'Hmmm that user does not seem to exist. <a href="/users/sessions/new">Click here</a> to try again.'
      );
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        // console.log(req.session.currentUser.id);
        res.redirect("/");
      } else {
        res.send(
          'Hmmm that password does not seem to match. <a href="/users/sessions/new">Click here</a> to try again.'
        );
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
