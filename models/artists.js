const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    required: true,
  },

  biography: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  role: {
    type: String,
    default: "artist",
  },
});

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
