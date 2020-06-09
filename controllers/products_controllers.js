//============
//DEPENDENCIES
//============
const express = require("express");
const Product = require("../models/products.js");
const Artist = require("../models/artists.js");
//============
//CONFIGURATION
//============

const products = express.Router();

//============
//MIDDLEWARE
//============

const isArtist = (req, res, next) => {
  if (
    req.session.currentUser &&
    (req.session.currentUser.role === "artist" ||
      req.session.currentUser.role === "admin")
  ) {
    next();
  } else {
    res.status(404).render("errors/404.ejs", {
      user: req.session.currentUser,
    });
  }
};

//============
//Routes
//============

//=============
//READ
//=============
//New product form
products.get("/new", isArtist, (req, res) => {
  res.render("products/new.ejs", {
    user: req.session.currentUser,
  });
});

products.get("/edit/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) {
      res.send("There was an error, please go back and try again.");
    } else {
      res.render("products/edit.ejs", {
        product: product,
        user: req.session.currentUser,
      });
    }
  });
});

//Collections Indexes
products.get("/:collection", (req, res) => {
  Product.find({ category: req.params.collection }, (err, products) => {
    if (err) {
      res.send(err.message);
    } else {
      res.render("products/collection-index.ejs", {
        products: products,
        collectionTitle: req.params.collection.toUpperCase(),
        user: req.session.currentUser,
      });
    }
  });
});

// product show page
products.get("/:artistId/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) {
      res.send(err.message);
    } else {
      Artist.findOne({ _id: req.params.artistId }, (err, artist) => {
        if (err) {
          res.send(err.message);
        } else {
          res.render("products/show.ejs", {
            product: product,
            artist: artist,
            user: req.session.currentUser,
            success: req.flash("success"),
          });
        }
      });
    }
  });
});

//=============
//CREATE
//============
//Creates new product
products.post("/", (req, res) => {
  req.body.artist_id = req.session.currentUser._id;

  Product.create(req.body, (err, newProduct) => {
    if (err) {
      res.send(err.message);
    } else {
      req.flash("success", "New product successfully added.");
      res.redirect("/products/" + newProduct.artist_id + "/" + newProduct._id);
    }
  });
});

//=============
//EDIT/UPDATE
//============
products.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedProduct) => {
      if (err) {
        res.send("There was an error, please go back and try again.");
      } else {
        res.redirect(
          "/products/" + updatedProduct.artist_id + "/" + req.params.id
        );
      }
    }
  );
});

//=============
//DELETE
//============
products.delete("/delete/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, deletedProduct) => {
    if (err) {
      res.send(
        "Something went wrong on our end. Please click the back button and try your request again."
      );
    } else {
      req.flash("deleted", "Product successfully deleted.");
      res.redirect("/artists/products/" + deletedProduct.artist_id);
    }
  });
});

module.exports = products;
