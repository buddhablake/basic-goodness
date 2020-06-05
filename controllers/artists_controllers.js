//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const Artist = require("../models/artists.js");

const artists = express.Router();

//============
//Routes
//============
//=======
//READ
//=======
//REGISTRATION PAGE
artists.get("/new", (req, res) => {
  res.render("artists/new.ejs");
});

//=======
//CREATE
//=======
artists.post("/", (req, res) => {
  //overwrite the user password with the hashed password
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );

  //creates the new user
  Artist.create(req.body, (err, newUser) => {
    if (err) {
      res.send(err.message);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = artists;
