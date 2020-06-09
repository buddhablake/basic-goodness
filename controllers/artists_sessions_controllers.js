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
  res.render("artists/sessions/new.ejs", {
    user: req.session.currentUser,
  });
});

artistsSessions.get("/update", (req, res) => {
  const user = req.session.currentUser;
  if (user && user.role === "artist") {
    res.render("artists/sessions/update.ejs", {
      user: user,
    });
  } else {
    res.redirect("/");
  }
});

artistsSessions.post("/", (req, res) => {
  Artist.findOne({ email: req.body.email }, (err, foundArtist) => {
    if (err) {
      console.log(err);
      res.send(
        'Yikes something went wrong. <a href="artists/sessions/new">Click here</a> to try again.'
      );
    } else if (!foundArtist) {
      res.redirect("/artists/sessions/new", {
        errMsg: "Test",
      });
    } else {
      if (bcrypt.compareSync(req.body.password, foundArtist.password)) {
        req.session.currentUser = foundArtist;
        res.redirect("/artists/products/" + foundArtist._id);
      } else {
        res.send(
          'Hmmm that password does not seem to match. <a href="artists/sessions/new">Click here</a> to try again.'
        );
      }
    }
  });
});

artistsSessions.post("/update/:artistId", (req, res) => {
  Artist.findByIdAndUpdate(
    req.params.artistId,
    req.body,
    { new: true },
    (err, updatedArtist) => {
      if (err) {
        res.send(
          "There was an error updating your profile, please clikc the back button and try again."
        );
      } else {
        res.redirect("/artists/products/" + req.params.artistId);
      }
    }
  );
});

artistsSessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = artistsSessions;
