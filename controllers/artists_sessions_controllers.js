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
    dbError: req.flash("dbError"),
    usernameError: req.flash("usernameError"),
    passError: req.flash("passError"),
    newUserSuccess: req.flash("newUserSuccess"),
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
      req.flash(
        "dbError",
        "Something went wrong on our end. Please try logging in again."
      );
      res.redirect("/artists/sessions/new");
    } else if (!foundArtist) {
      req.flash(
        "usernameError",
        "The email and/or password you provided were incorrect. Please try again."
      );
      res.redirect("/artists/sessions/new");
    } else {
      if (bcrypt.compareSync(req.body.password, foundArtist.password)) {
        req.session.currentUser = foundArtist;
        res.redirect("/artists/products/" + foundArtist._id);
      } else {
        req.flash(
          "passError",
          "The email and/or password you provided were incorrect. Please try again."
        );
        res.redirect("/artists/sessions/new");
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
