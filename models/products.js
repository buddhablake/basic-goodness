const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  artist_id: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
