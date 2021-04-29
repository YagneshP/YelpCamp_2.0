const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./route/campgrounds');
const reviewRoutes = require('./route/reviews');
const session = require('express-session');
const flash = require('connect-flash');
mongoose
  .connect(
    "mongodb+srv://yagnesh:yelpcamp@cluster0.0s9kp.mongodb.net/firstDataBase?retryWrites=true&w=majority",
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})


app.get("/", (req, res) => {
  res.render("home");
});
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

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
