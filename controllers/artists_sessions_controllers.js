//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const Artist = require("../models/artists.js");

//============
//CONFIGURATION
//============
const artistsSessions = express.Router();

//============
//Routes
//============

artistsSessions.get("/new", (req, res) => {
  res.render("artists/sessions/new.ejs");
});

artistsSessions.post("/", (req, res) => {
  Artist.findOne({ email: req.body.email }, (err, foundArtist) => {
    if (err) {
      console.log(err);
      res.send(
        'Yikes something went wrong. <a href="artists/sessions/new">Click here</a> to try again.'
      );
    } else if (!foundArtist) {
      res.send(
        'Hmmm that user does not seem to exist. <a href="artists/sessions/new">Click here</a> to try again.'
      );
    } else {
      if (bcrypt.compareSync(req.body.password, foundArtist.password)) {
        req.session.currentUser = foundArtist;
        res.redirect("/");
      } else {
        res.send(
          'Hmmm that password does not seem to match. <a href="artists/sessions/new">Click here</a> to try again.'
        );
      }
    }
  });
});

artistsSessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = artistsSessions;
