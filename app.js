if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}



const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./route/campgrounds');
const userRoutes = require('./route/users');
const reviewRoutes = require('./route/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const User = require("./model/user");
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');

const db_url = process.env.MONGO_URI
mongoose
  .connect(db_url,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("successful connection to database");
  })
  .catch((err) => {
    console.log(`Database connection err: ${err}`);
  });

app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
  replaceWith: '_'
}))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
		mongoUrl:db_url,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
	store,
	name:'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
			httpOnly: true,
			// secure:true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
"	https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.min.js",
];
const styleSrcUrls = [
	"https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js",
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
	'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css'
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
			directives: {
					defaultSrc: [],
					connectSrc: ["'self'", ...connectSrcUrls],
					scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
					styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
					workerSrc: ["'self'", "blob:"],
					objectSrc: [],
					imgSrc: [
							"'self'",
							"blob:",
							"data:",
							"https://res.cloudinary.com/dx8eexwdm/", 
							"https://images.unsplash.com/",
					],
					fontSrc: ["'self'", ...fontSrcUrls],
			},
	})
);

//passport config
app.use(passport.initialize());
app.use(passport.session());

//use Local stategy
passport.use(new LocalStrategy(User.authenticate())) // passportLocalMongoose provide authenticate() to User model 
//using passport get the user from seesion
passport.serializeUser(User.serializeUser())   //passportLocalMongoose give the serializeUser method to User model
passport.deserializeUser(User.deserializeUser()) 
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	next();
})
app.get("/", (req, res) => {
  res.render("home");
});
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes )
//NOT Found PAGE
app.all('*',(req,res,next)=>{
	next(new ExpressError('Page not found',404))
})
app.use((err,req,res,next)=>{
	const {statusCode = 500} = err
	if(!err.message) err.message = 'Something went wrong!'
	res.status(statusCode).render('error',{err})
})

//Listening server
app.listen(3000, () => {
  console.log("Server listening on Port 3000");
});
