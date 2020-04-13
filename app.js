const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const Campground = require("./models/campground");
const passport   = require('passport');
const LocalStrategy = require("passport-local");
const methodOverride= require("method-override");
const Comment    = require("./models/comment");
const User       = require("./models/user");
const seedDB     = require("./seeds");
const flash      = require("connect-flash");

const campgroundRoutes = require("./routes/campgrounds.js");
const commentRoutes = require("./routes/comments.js");
const indexRoutes = require("./routes/index.js");


// CONFIG
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://ichan:tongyaya1@ds255930.mlab.com:55930/yelpclone-ichanrivera");
//
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//passport Config
app.use(require("express-session")({
  secret: "I am the best",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error   = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT || 5000, () => console.log('YelpClone Server is now Live'))
