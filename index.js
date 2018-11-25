const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("errorhandler");

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// secret will change on production
app.use(
  session({
    secret: "my-mega-secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose
  .connect(
    process.env.DB,
    { useNewUrlParser: true }
  )
  .catch(() => process.exit(1));

//Require Users
require("./models/users");
require("./models/subscriptions");
require("./config/passport");
app.use(require("./routes"));

app.listen(8087, () => console.log("Server running on http://localhost:8087/"));
