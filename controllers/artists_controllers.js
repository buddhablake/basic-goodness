//============
//DEPENDENCIES
//============
const bcrypt = require("bcrypt");
const express = require("express");
const Artist = require("../models/artists.js");
const Product = require("../models/products.js");
const artists = express.Router();

//============
//Routes
//============
//=======
//READ
//=======
//REGISTRATION PAGE
artists.get("/new", (req, res) => {
  res.render("artists/new.ejs", {
    user: req.session.currentUser,
  });
});

artists.get("/products/:artistId", (req, res) => {
  Product.find({ artist_id: req.params.artistId }, (err, products) => {
    if (err) {
      res.send(
        "Oh no. Something didn't go as expected. That's ok, it happens. Just go back and try again."
      );
    } else {
      Artist.findOne({ _id: req.params.artistId }, (err, artist) => {
        if (err) {
          res.send(
            "Oh no. Something didn't go as expected. That's ok, it happens. Just go back and try again."
          );
        } else {
          console.log(req.session.currentUser);
          res.render("products/artist-index.ejs", {
            products: products,
            artist: artist,
            user: req.session.currentUser,
          });
        }
      });
    }
  });
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
      res.redirect("/artists/sessions/new");
    }
  });
});

module.exports = artists;
