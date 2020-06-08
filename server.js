const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const db = mongoose.connection;
require("dotenv").config();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); //
app.use(expressLayouts);
//use method override
app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Error / success
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

//=============
//CONTROLLERS
//=============
const usersControllers = require("./controllers/users_controllers.js");
app.use("/users", usersControllers);

const usersSessionsControllers = require("./controllers/users_sessions_controllers.js");
app.use("/users/sessions", usersSessionsControllers);

const artistsControllers = require("./controllers/artists_controllers.js");
app.use("/artists", artistsControllers);

const artistsSessionsControllers = require("./controllers/artists_sessions_controllers.js");
app.use("/artists/sessions", artistsSessionsControllers);

const productsControllers = require("./controllers/products_controllers.js");
app.use("/products", productsControllers);

//___________________
// Routes
//___________________
//localhost:3000
app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.currentUser,
  });
});

app.get("*", function (req, res) {
  res.status(404).render("errors/404.ejs", {
    user: req.session.currentUser,
  });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log("Listening on port:", PORT));
